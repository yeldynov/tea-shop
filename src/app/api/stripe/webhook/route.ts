import type Stripe from "stripe";

import { releaseOrder, syncOrderFromCheckoutSession } from "@/lib/orders";
import { getStripe } from "@/lib/stripe";

// Stripe → order status. Signature-verified; every handler is idempotent, so
// retries and duplicate deliveries are harmless. Errors return 500 so Stripe
// retries; events we don't use (or for sessions that aren't ours) return 200.
export async function POST(request: Request) {
  const body = await request.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      request.headers.get("stripe-signature") ?? "",
      process.env.STRIPE_WEBHOOK_SECRET ?? "",
    );
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
      await syncOrderFromCheckoutSession(event.data.object.id);
      break;
    case "checkout.session.async_payment_failed":
    case "checkout.session.expired": {
      const orderId = event.data.object.metadata?.orderId;
      if (orderId) {
        await releaseOrder(
          orderId,
          event.type === "checkout.session.expired" ? "expired" : "failed",
        );
      }
      break;
    }
  }
  return new Response(null, { status: 200 });
}
