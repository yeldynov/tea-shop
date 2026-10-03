import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { CART_COOKIE } from "@/lib/cart";
import { getOrderForUser, syncOrderFromCheckoutSession } from "@/lib/orders";
import { requireUser } from "@/lib/session";

// Stripe redirects here after payment. The session id in the URL is only a
// pointer: the status comes from Stripe's API, and the webhook does the same
// sync in case the customer never arrives.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const { user } = await requireUser(url.pathname + url.search);
  const sessionId = url.searchParams.get("session_id");
  if (!sessionId?.startsWith("cs_")) notFound();

  const orderId = await syncOrderFromCheckoutSession(sessionId).catch(() => undefined);
  const order = orderId ? await getOrderForUser(orderId, user.id) : undefined;
  if (!order) notFound();

  // Checkout finished (paid, or a delayed method still processing): the bag is now this order.
  (await cookies()).delete(CART_COOKIE);
  redirect(`/account/orders/${order.id}`);
}
