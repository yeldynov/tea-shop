import type { Metadata } from "next";
import Link from "next/link";

import { formatPrice } from "@/lib/catalog";
import { getOrdersForUser, orderStatusLabels } from "@/lib/orders";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Orders", robots: { index: false } };

const statusBadge = {
  pending: "badge-yuzu",
  paid: "badge-soft",
  failed: "badge bg-sakura text-ink",
  expired: "badge bg-mist text-ink-soft",
} as const;

const placedOn = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

export default async function OrdersPage() {
  const { user } = await requireUser("/account/orders");
  const orders = await getOrdersForUser(user.id);

  return (
    <>
      <header className="flex flex-col gap-3">
        <p className="eyebrow">Your account</p>
        <h1>Orders</h1>
      </header>

      {orders.length === 0 ? (
        <section className="panel flex flex-col items-start gap-4">
          <p className="text-ink-soft">You haven’t placed any orders yet.</p>
          <Link href="/shop" className="btn-ink btn-sm">
            Start shopping
          </Link>
        </section>
      ) : (
        <ul className="card flex flex-col">
          {orders.map((order) => {
            const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
            return (
              <li key={order.id} className="border-b last:border-b-0">
                <Link
                  href={`/account/orders/${order.id}`}
                  className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 p-5 transition-colors hover:bg-paper sm:px-8"
                >
                  <div className="flex min-w-0 flex-col gap-1">
                    <time dateTime={order.createdAt.toISOString()} className="text-ink">
                      {placedOn.format(order.createdAt)}
                    </time>
                    <span className="text-sm text-ink-faint">
                      #{order.id.slice(0, 8).toUpperCase()} · {itemCount}{" "}
                      {itemCount === 1 ? "item" : "items"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span className={statusBadge[order.status]}>{orderStatusLabels[order.status]}</span>
                    <span className="price text-ink">
                      {formatPrice(order.amountTotalCents ?? order.subtotalCents)}
                    </span>
                    <span aria-hidden className="text-ink-faint">
                      →
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
