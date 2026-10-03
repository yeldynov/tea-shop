import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { OrderSummary } from "@/components/order-summary";
import { getOrderForUser, orderStatusLabels } from "@/lib/orders";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Order", robots: { index: false } };

const statusText = {
  pending: "We’re waiting for Stripe to confirm your payment. This usually takes a few seconds.",
  paid: "Thank you! Your order is confirmed and will ship within 2 working days.",
  failed: "Your payment didn’t go through, so nothing was charged.",
  expired: "This checkout was cancelled or timed out. Nothing was charged.",
} as const;

const placedOn = new Intl.DateTimeFormat("en-US", { dateStyle: "long" });

export default async function OrderPage({ params }: PageProps<"/account/orders/[id]">) {
  const { id } = await params;
  const { user } = await requireUser(`/account/orders/${id}`);
  // Malformed ids would make Postgres reject the uuid comparison.
  const order = /^[0-9a-f-]{36}$/.test(id) ? await getOrderForUser(id, user.id) : undefined;
  if (!order) notFound();

  return (
    <>
      <header className="flex flex-col gap-3">
        <p className="eyebrow">Order · {placedOn.format(order.createdAt)}</p>
        <h1>{orderStatusLabels[order.status]}</h1>
        <p className="lead">{statusText[order.status]}</p>
        {order.status === "pending" && (
          <Link href={`/account/orders/${order.id}`} className="link-arrow self-start text-sm">
            Refresh status <span aria-hidden>→</span>
          </Link>
        )}
      </header>

      <OrderSummary order={order} />

      <Link href="/account/orders" className="link-arrow self-start">
        <span aria-hidden>←</span> All orders
      </Link>
    </>
  );
}
