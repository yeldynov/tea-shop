import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { clearCart, removeFromCart } from "@/app/cart/actions";
import { CartLineQuantity } from "@/app/cart/cart-line-quantity";
import { getCart, type CartLine } from "@/lib/cart-queries";
import { formatPrice } from "@/lib/catalog";

// Per request: the cart comes from the cookie, prices and stock from the database.
export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Your bag" };

export default async function CartPage() {
  const { lines, subtotalCents, itemCount } = await getCart();

  return (
    <div className="container-page section-sm">
      <header className="mb-8 flex flex-col gap-3 lg:mb-12">
        <p className="eyebrow">
          Your bag <span lang="zh-Hans" className="text-ink-faint not-italic">· 购物袋</span>
        </p>
        <h1>{itemCount > 0 ? `${itemCount} ${itemCount === 1 ? "item" : "items"}` : "Your bag"}</h1>
      </header>

      {lines.length === 0 ? (
        <div className="flex flex-col items-start gap-5">
          <p className="lead">Your bag is empty.</p>
          <Link href="/shop" className="btn-primary">
            Browse the shop
          </Link>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-16">
          <div className="flex flex-col gap-4">
            <ul className="flex flex-col border-t">
              {lines.map((line) => (
                <CartLineItem key={line.product.slug} line={line} />
              ))}
            </ul>
            <form action={clearCart} className="self-end">
              <button type="submit" className="link-quiet text-sm">
                Clear bag
              </button>
            </form>
          </div>

          <aside className="card flex flex-col gap-5 self-start p-6">
            <h2 className="font-display text-display-sm">Summary</h2>
            <dl className="flex items-baseline justify-between gap-4">
              <dt className="text-ink-soft">Subtotal</dt>
              <dd className="price text-2xl text-ink">{formatPrice(subtotalCents)}</dd>
            </dl>
            <p className="text-sm text-ink-faint">Shipping and taxes are calculated at checkout.</p>
            <button type="button" className="btn-primary btn-lg" disabled>
              Checkout coming soon
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}

function CartLineItem({ line }: { line: CartLine }) {
  const { product, quantity, requested } = line;
  const href = `/products/${product.slug}`;
  const unavailable = quantity === 0;

  return (
    <li className="flex gap-4 border-b py-6 sm:gap-6">
      <Link href={href} className="media w-24 shrink-0 sm:w-28">
        <Image
          src={product.image.src}
          alt={product.image.alt}
          fill
          sizes="7rem"
          className={unavailable ? "opacity-60 grayscale-40" : undefined}
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
          <div className="flex min-w-0 flex-col gap-1">
            <Link href={href} className="font-display text-xl text-ink">
              {product.name}
            </Link>
            <p className="text-sm text-ink-faint">
              {product.nameZh && (
                <span lang="zh-Hans" className="mr-2">
                  {product.nameZh}
                </span>
              )}
              {formatPrice(line.unitPriceCents)} / {product.unit}
            </p>
          </div>
          <p className="price text-lg text-ink">
            {unavailable ? "—" : formatPrice(line.lineTotalCents)}
          </p>
        </div>

        {unavailable ? (
          <p className="text-sm text-ink-soft">
            Sold out{product.restock ? ` · ${product.restock}` : ""}. Not included in your total.
          </p>
        ) : (
          quantity < requested && (
            <p role="status" className="text-sm text-hojicha">
              Only {quantity} available, so your quantity was reduced from {requested}.
            </p>
          )
        )}

        <div className="flex items-start gap-5">
          {!unavailable && (
            <CartLineQuantity
              slug={product.slug}
              name={product.name}
              quantity={quantity}
              stock={product.stock}
            />
          )}
          <form action={removeFromCart} className="py-2">
            <input type="hidden" name="slug" value={product.slug} />
            <button type="submit" className="link-quiet text-sm">
              Remove<span className="sr-only"> {product.name}</span>
            </button>
          </form>
        </div>
      </div>
    </li>
  );
}
