import Image from "next/image";
import Link from "next/link";

import { removeFromCart } from "@/app/cart/actions";
import { BagIcon } from "@/components/icons";
import { getCart } from "@/lib/cart-queries";
import { formatPrice } from "@/lib/catalog";

/**
 * Header bag icon with a hover/focus mini-cart, built like `UserMenu`:
 * server-rendered from the cart cookie, CSS-only :hover/:focus-within. Below
 * `sm` the icon is just a link to /cart.
 */
export async function CartMenu() {
  // Same clamped lines and count as the bag page; no query while the bag is empty.
  const { lines, itemCount, subtotalCents } = await getCart();

  return (
    <div className="group relative -mr-2.5">
      <Link
        href="/cart"
        className="btn-icon relative"
        aria-label={`Bag, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
      >
        <BagIcon />
        {itemCount > 0 && (
          <span
            aria-hidden
            className="absolute top-1.5 right-1 grid size-4 place-items-center rounded-full bg-matcha text-[0.625rem] leading-none text-cream"
          >
            {itemCount}
          </span>
        )}
      </Link>

      {/* pt-2 bridges the gap so the card stays open while the pointer moves onto it. */}
      <div className="invisible absolute top-full right-0 z-50 hidden w-96 pt-2 opacity-0 transition-[opacity,visibility] delay-100 duration-150 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:delay-0 group-hover:visible group-hover:opacity-100 group-hover:delay-0 sm:block">
        <div className="card p-4 shadow-lift">
          {lines.length === 0 ? (
            <div className="flex flex-col gap-4 p-1">
              <div className="flex flex-col gap-1">
                <p className="font-display text-display-sm text-ink">Your bag is empty</p>
                <p className="text-sm text-ink-soft">Find a tea to start your next session.</p>
              </div>
              <Link href="/shop" className="btn-primary btn-sm">
                Browse the shop
              </Link>
            </div>
          ) : (
            <>
              <p className="flex items-baseline justify-between px-1 pb-3">
                <span className="font-display text-xl text-ink">Your bag</span>
                <span className="text-sm text-ink-faint">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
              </p>
              <hr className="divider" />
              <ul className="flex max-h-80 flex-col overflow-y-auto">
                {lines.map(({ product, quantity, lineTotalCents }) => (
                  <li key={product.slug} className="flex gap-3 border-b px-1 py-3 last:border-b-0">
                    <Link
                      href={`/products/${product.slug}`}
                      className="media w-14 shrink-0"
                      tabIndex={-1}
                      aria-hidden
                    >
                      <Image
                        src={product.image.src}
                        alt=""
                        fill
                        sizes="3.5rem"
                        className={quantity === 0 ? "opacity-60 grayscale-40" : undefined}
                      />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <Link
                          href={`/products/${product.slug}`}
                          className="truncate text-sm font-medium text-ink"
                        >
                          {product.name}
                        </Link>
                        <span className="price shrink-0 text-sm text-ink">
                          {quantity === 0 ? "—" : formatPrice(lineTotalCents)}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between gap-3 text-sm text-ink-faint">
                        <span>
                          {quantity === 0
                            ? "Sold out"
                            : `${quantity} × ${formatPrice(product.priceCents)}`}
                        </span>
                        <form action={removeFromCart}>
                          <input type="hidden" name="slug" value={product.slug} />
                          <button type="submit" className="link-quiet text-xs">
                            Remove<span className="sr-only"> {product.name}</span>
                          </button>
                        </form>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <hr className="divider" />
              <div className="flex flex-col gap-3 px-1 pt-3">
                <p className="flex items-baseline justify-between">
                  <span className="text-ink-soft">Subtotal</span>
                  <span className="price text-lg text-ink">{formatPrice(subtotalCents)}</span>
                </p>
                <Link href="/cart" className="btn-primary btn-sm">
                  View bag
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
