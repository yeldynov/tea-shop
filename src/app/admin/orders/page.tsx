import type { Metadata } from "next";
import Link from "next/link";

import { orderStatusBadge } from "@/components/order-summary";
import { getAllOrders } from "@/lib/admin-queries";
import { formatPrice } from "@/lib/catalog";
import { orderStatusLabels } from "@/lib/orders";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Orders · Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

const placedAt = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" });

export default async function AdminOrdersPage() {
  await requireAdmin("/admin/orders");
  const orders = await getAllOrders();

  return (
    <>
      <header className="flex flex-col gap-3">
        <p className="eyebrow">Admin</p>
        <h1>Orders</h1>
      </header>

      {orders.length === 0 ? (
        <p className="panel text-ink-soft">No orders yet.</p>
      ) : (
        <ul className="card flex flex-col">
          {orders.map((order) => {
            const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
            return (
              <li key={order.id} className="border-b last:border-b-0">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 p-4 transition-colors hover:bg-paper sm:px-6"
                >
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="truncate text-ink">{order.email ?? order.user.email}</span>
                    <span className="text-sm text-ink-faint">
                      <time dateTime={order.createdAt.toISOString()}>
                        {placedAt.format(order.createdAt)}
                      </time>{" "}
                      · #{order.id.slice(0, 8).toUpperCase()} · {itemCount}{" "}
                      {itemCount === 1 ? "item" : "items"}
                    </span>
                  </span>
                  <span className="flex items-center gap-4">
                    <span className={orderStatusBadge[order.status]}>
                      {orderStatusLabels[order.status]}
                    </span>
                    <span className="price w-20 text-right text-ink">
                      {formatPrice(order.amountTotalCents ?? order.subtotalCents)}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
