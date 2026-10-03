import { redirect } from "next/navigation";

import { cancelPendingOrder, getOrderForUser } from "@/lib/orders";
import { requireUser } from "@/lib/session";

// Stripe's "back" link, and the cancel link on /cart. Expires the session and
// returns the stock right away instead of waiting for it to time out. The cart
// cookie is untouched, so the bag is as the customer left it.
export async function GET(request: Request) {
  const { user } = await requireUser("/cart");
  const orderId = new URL(request.url).searchParams.get("order") ?? "";
  const order = /^[0-9a-f-]{36}$/.test(orderId) ? await getOrderForUser(orderId, user.id) : undefined;
  if (order) await cancelPendingOrder(order);
  redirect("/cart");
}
