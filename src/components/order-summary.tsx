import Image from "next/image";
import Link from "next/link";

import type { orders } from "@/db/schema";
import { formatPrice } from "@/lib/catalog";

type Order = typeof orders.$inferSelect & {
  items: {
    productId: number;
    name: string;
    quantity: number;
    unitPriceCents: number;
    product: { slug: string; imageUrl: string };
  }[];
};

/** Badge classes per order status, shared by the customer and admin order lists. */
export const orderStatusBadge = {
  pending: "badge-yuzu",
  paid: "badge-soft",
  failed: "badge bg-sakura text-ink",
  expired: "badge bg-mist text-ink-soft",
} as const;

/** Line items, total and shipping address of one order. */
export function OrderSummary({ order }: { order: Order }) {
  const address = order.shippingAddress;

  return (
    <>
      <section aria-labelledby="order-items" className="card p-6 sm:p-8">
        <h2 id="order-items" className="mb-4 text-display-sm">
          Items
        </h2>
        <ul className="flex flex-col">
          {order.items.map((item) => (
            <li key={item.productId} className="flex items-center gap-4 border-b py-4 last:border-b-0">
              <Link href={`/products/${item.product.slug}`} className="media w-14 shrink-0">
                <Image src={item.product.imageUrl} alt="" fill sizes="3.5rem" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <Link href={`/products/${item.product.slug}`} className="truncate text-ink">
                  {item.name}
                </Link>
                <span className="text-sm text-ink-faint">
                  {item.quantity} × {formatPrice(item.unitPriceCents)}
                </span>
              </div>
              <span className="price text-ink">
                {formatPrice(item.quantity * item.unitPriceCents)}
              </span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 flex items-baseline justify-between border-t pt-4">
          <dt className="text-ink-soft">{order.status === "paid" ? "Total paid" : "Total"}</dt>
          <dd className="price text-2xl text-ink">
            {formatPrice(order.amountTotalCents ?? order.subtotalCents)}
          </dd>
        </dl>
      </section>

      {address && (
        <section aria-labelledby="order-shipping" className="flex flex-col gap-2">
          <h2 id="order-shipping" className="label text-ink-faint">
            Shipping to
          </h2>
          <address className="text-ink not-italic">
            {[
              address.name,
              address.address.line1,
              address.address.line2,
              [address.address.city, address.address.state, address.address.postal_code]
                .filter(Boolean)
                .join(", "),
            ]
              .filter(Boolean)
              .map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
          </address>
        </section>
      )}
    </>
  );
}
