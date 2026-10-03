import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { OrderSummary, orderStatusBadge } from "@/components/order-summary";
import { getOrder, orderStatusLabels } from "@/lib/orders";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Order · Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

const dateTime = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeStyle: "short" });

export default async function AdminOrderPage({ params }: PageProps<"/admin/orders/[id]">) {
  const { id } = await params;
  await requireAdmin(`/admin/orders/${id}`);
  // Malformed ids would make Postgres reject the uuid comparison.
  const order = /^[0-9a-f-]{36}$/.test(id) ? await getOrder(id) : undefined;
  if (!order) notFound();

  const facts = [
    { term: "Customer", detail: `${order.user.name} · ${order.user.email}` },
    { term: "Receipt email", detail: order.email ?? "—" },
    { term: "Placed", detail: dateTime.format(order.createdAt) },
    { term: "Paid", detail: order.paidAt ? dateTime.format(order.paidAt) : "—" },
    { term: "Order id", detail: order.id },
    { term: "Stripe payment", detail: order.stripePaymentIntentId ?? "—" },
  ];

  return (
    <>
      <header className="flex flex-col gap-3">
        <Link href="/admin/orders" className="link-arrow self-start text-sm">
          <span aria-hidden>←</span> Orders
        </Link>
        <h1>Order #{order.id.slice(0, 8).toUpperCase()}</h1>
        <span className={`${orderStatusBadge[order.status]} self-start`}>
          {orderStatusLabels[order.status]}
        </span>
      </header>

      <dl className="card grid gap-x-8 gap-y-5 p-6 sm:grid-cols-2 sm:p-8">
        {facts.map(({ term, detail }) => (
          <div key={term} className="flex min-w-0 flex-col gap-1">
            <dt className="label text-ink-faint">{term}</dt>
            <dd className="break-words text-ink">{detail}</dd>
          </div>
        ))}
      </dl>

      <OrderSummary order={order} />
    </>
  );
}
