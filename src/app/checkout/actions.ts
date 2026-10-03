"use server";

import { randomUUID } from "node:crypto";

import { eq, inArray, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { orderItems, orders, productStock } from "@/db/schema";
import { getCart } from "@/lib/cart-queries";
import { cancelPendingOrder, getPendingOrders, releaseOrder } from "@/lib/orders";
import { requireUser } from "@/lib/session";
import { getStripe } from "@/lib/stripe";

// Stripe's minimum. Abandoned checkouts hold stock this long, then the
// `checkout.session.expired` webhook returns it.
const SESSION_MINUTES = 30;
// Tags our sessions in the Dashboard; Stripe asks for an 8-letter suffix.
const INTEGRATION_ID = "tea-shop-checkout-qhzmbtrw";

/**
 * Takes no input: the cart comes from the cookie and every price from the
 * database. The browser can't influence what gets charged.
 */
export async function startCheckout() {
  const { user } = await requireUser("/cart");

  // A previous checkout the customer walked away from (e.g. with the back
  // button) still holds stock; give it back before reserving again.
  for (const order of await getPendingOrders(user.id)) await cancelPendingOrder(order);

  const { lines, subtotalCents } = await getCart();
  if (lines.length === 0) redirect("/cart");
  // The bag page already explains clamped or sold-out lines; make the customer see them.
  if (lines.some((line) => line.quantity === 0 || line.quantity !== line.requested)) {
    redirect("/cart?error=stock");
  }

  // Order, items and stock reservation in one transaction. product_stock's
  // CHECK (quantity >= 0) rejects the whole batch if anything sold out meanwhile.
  const orderId = randomUUID();
  const ids = lines.map((line) => line.product.id);
  const decrement = sql.join(
    // Casts: the HTTP driver sends parameters untyped, and `integer - text` doesn't exist.
    lines.map((line) => sql`when ${line.product.id}::int then ${line.quantity}::int`),
    sql` `,
  );
  let reserved: { productId: number }[];
  try {
    [, , reserved] = await db.batch([
      db.insert(orders).values({ id: orderId, userId: user.id, subtotalCents }),
      db.insert(orderItems).values(
        lines.map((line) => ({
          orderId,
          productId: line.product.id,
          name: line.product.name,
          unitPriceCents: line.unitPriceCents,
          quantity: line.quantity,
        })),
      ),
      db
        .update(productStock)
        .set({
          quantity: sql`${productStock.quantity} - (case ${productStock.productId} ${decrement} end)`,
        })
        .where(inArray(productStock.productId, ids))
        .returning({ productId: productStock.productId }),
    ]);
  } catch (error) {
    if (isCheckViolation(error)) redirect("/cart?error=stock");
    throw error;
  }
  // A product with no stock row at all can't be decremented; treat it as sold out.
  if (reserved.length !== lines.length) {
    await releaseOrder(orderId, "expired");
    redirect("/cart?error=stock");
  }

  const origin = await siteOrigin();
  let sessionUrl: string;
  try {
    const session = await getStripe().checkout.sessions.create(
      {
        mode: "payment",
        line_items: lines.map((line) => ({
          quantity: line.quantity,
          price_data: {
            currency: "usd",
            unit_amount: line.unitPriceCents,
            product_data: {
              name: line.product.name,
              description: line.product.unit,
              images: [line.product.image.src],
            },
          },
        })),
        client_reference_id: orderId,
        metadata: { orderId },
        payment_intent_data: { metadata: { orderId } },
        customer_email: user.email,
        shipping_address_collection: { allowed_countries: ["US"] },
        expires_at: Math.floor(Date.now() / 1000) + SESSION_MINUTES * 60,
        integration_identifier: INTEGRATION_ID,
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/checkout/cancel?order=${orderId}`,
      },
      { idempotencyKey: `checkout-${orderId}` },
    );
    await db
      .update(orders)
      .set({ stripeCheckoutSessionId: session.id })
      .where(eq(orders.id, orderId));
    sessionUrl = session.url!;
  } catch (error) {
    console.error("[checkout] could not create Stripe session", error);
    await releaseOrder(orderId, "expired");
    redirect("/cart?error=checkout");
  }
  redirect(sessionUrl);
}

/** Postgres `check_violation`, possibly wrapped by Drizzle. */
function isCheckViolation(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  if ("code" in error && error.code === "23514") return true;
  return "cause" in error && isCheckViolation(error.cause);
}

/** Absolute origin for Stripe's redirect URLs, from the request itself. */
async function siteOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
