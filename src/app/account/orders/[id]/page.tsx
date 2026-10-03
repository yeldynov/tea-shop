import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatPrice } from "@/lib/catalog";
import { getOrderForUser } from "@/lib/orders";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Order", robots: { index: false } };

const statusCopy = {
  pending: {
    label: "Confirming payment",
    text: "We’re waiting for Stripe to confirm your payment. This usually takes a few seconds.",
  },
  paid: { label: "Paid", text: "Thank you! Your order is confirmed and will ship within 2 working days." },
  failed: { label: "Payment failed", text: "Your payment didn’t go through, so nothing was charged." },
  expired: { label: "Cancelled", text: "This checkout was cancelled or timed out. Nothing was charged." },
} as const;

const placedOn = new Intl.DateTimeFormat("en-US", { dateStyle: "long" });

export default async function OrderPage({ params }: PageProps<"/account/orders/[id]">) {
  const { id } = await params;
  const { user } = await requireUser(`/account/orders/${id}`);
  // Malformed ids would make Postgres reject the uuid comparison.
  const order = /^[0-9a-f-]{36}$/.test(id) ? await getOrderForUser(id, user.id) : undefined;
  if (!order) notFound();

  const status = statusCopy[order.status];
  const address = order.shippingAddress;

  return (
    <>
      <header className="flex flex-col gap-3">
        <p className="eyebrow">Order · {placedOn.format(order.createdAt)}</p>
        <h1>{status.label}</h1>
        <p className="lead">{status.text}</p>
        {order.status === "pending" && (
          <Link href={`/account/orders/${order.id}`} className="link-arrow self-start text-sm">
            Refresh status <span aria-hidden>→</span>
          </Link>
        )}
      </header>

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

      <Link href="/shop" className="link-arrow self-start">
        Continue shopping <span aria-hidden>→</span>
      </Link>
    </>
  );
}
