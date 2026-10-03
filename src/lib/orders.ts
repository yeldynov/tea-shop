// Order lifecycle. Every status change is one conditional statement
// (`... where status = 'pending'`), so webhook retries, duplicate events and the
// success page racing the webhook can't apply a change twice.
//
//   pending ──Stripe says paid──────────────▶ paid
//   pending ──async payment failed──────────▶ failed   (stock returned)
//   pending ──session expired / cancelled───▶ expired  (stock returned)
import { and, desc, eq, sql } from "drizzle-orm";
import type Stripe from "stripe";

import { db } from "@/db";
import { orders } from "@/db/schema";
import { getStripe } from "@/lib/stripe";

type OrderRow = typeof orders.$inferSelect;

export async function getOrderForUser(orderId: string, userId: string) {
  return db.query.orders.findFirst({
    where: and(eq(orders.id, orderId), eq(orders.userId, userId)),
    with: { items: { with: { product: { columns: { slug: true, imageUrl: true } } } } },
  });
}

export async function getPendingOrders(userId: string) {
  return db.query.orders.findMany({
    where: and(eq(orders.userId, userId), eq(orders.status, "pending")),
    orderBy: desc(orders.createdAt),
  });
}

/** Moves a pending order to `failed`/`expired` and returns its reserved stock, at most once. */
export async function releaseOrder(orderId: string, status: "failed" | "expired") {
  await db.execute(sql`
    with released as (
      update orders set status = ${status}, updated_at = now()
      where id = ${orderId} and status = 'pending'
      returning id
    )
    update product_stock s
    set quantity = s.quantity + i.quantity, updated_at = now()
    from order_items i
    join released r on r.id = i.order_id
    where s.product_id = i.product_id
  `);
}

/**
 * Expires the order's Stripe session (so it can no longer be paid) and returns
 * its stock. If Stripe says the session already completed, nothing changes:
 * the customer paid, and the webhook or success page will record it.
 */
export async function cancelPendingOrder(order: OrderRow) {
  if (order.status !== "pending") return;
  if (order.stripeCheckoutSessionId) {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions
      .expire(order.stripeCheckoutSessionId)
      .catch(() => stripe.checkout.sessions.retrieve(order.stripeCheckoutSessionId!));
    if (session.status !== "expired") return;
  }
  await releaseOrder(order.id, "expired");
}

/**
 * The only way an order becomes paid. Reads the session from the Stripe API
 * (never from the browser) and is safe to call any number of times, from the
 * webhook and the success page alike. Returns the order id, if any.
 */
export async function syncOrderFromCheckoutSession(sessionId: string) {
  const session = await getStripe().checkout.sessions.retrieve(sessionId);
  const orderId = session.metadata?.orderId;
  if (!orderId) return undefined;

  if (session.payment_status === "paid" || session.payment_status === "no_payment_required") {
    await markPaid(orderId, session);
  }
  // "unpaid" after completion means a delayed method (e.g. bank debit): the order
  // stays pending with stock held until async_payment_succeeded/failed arrives.
  return orderId;
}

async function markPaid(orderId: string, session: Stripe.Checkout.Session) {
  const order = await db.query.orders.findFirst({ where: eq(orders.id, orderId) });
  if (!order || order.status !== "pending") return;

  // We built the session from our own prices, so anything else means tampering
  // or a bug. Leave it pending and investigate rather than fulfil it.
  if (session.amount_total !== order.subtotalCents || session.currency !== order.currency) {
    console.error(
      `[orders] amount mismatch for ${orderId}: Stripe ${session.amount_total} ${session.currency}, ` +
        `order ${order.subtotalCents} ${order.currency}`,
    );
    return;
  }

  const shipping = session.collected_information?.shipping_details;
  await db
    .update(orders)
    .set({
      status: "paid",
      paidAt: new Date(),
      amountTotalCents: session.amount_total,
      email: session.customer_details?.email ?? null,
      shippingAddress: shipping ? { name: shipping.name, address: shipping.address } : null,
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : (session.payment_intent?.id ?? null),
    })
    .where(and(eq(orders.id, orderId), eq(orders.status, "pending")));
}
