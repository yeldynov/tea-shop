import Image from "next/image";
import Link from "next/link";

import { StockStatus } from "@/components/stock-status";
import { formatPrice, stockState, type Product } from "@/lib/catalog";

const badgeClass = {
  New: "badge-soft",
  Limited: "badge-yuzu",
  Bestseller: "badge",
} as const;

export function ProductCard({
  product,
  sizes = "(min-width: 64rem) 22vw, 46vw",
}: {
  product: Product;
  sizes?: string;
}) {
  const state = stockState(product);

  return (
    <article className="group relative flex flex-col gap-4">
      <div className="media-zoom">
        <Image
          src={product.image.src}
          alt={product.image.alt}
          fill
          sizes={sizes}
          className={state === "sold-out" ? "opacity-60 grayscale-40" : undefined}
        />
        {state === "sold-out" ? (
          <span className="label absolute top-3 left-3 rounded-pill bg-cream px-3 py-1.5 text-[0.6875rem] leading-none text-ink-soft">
            Sold out
          </span>
        ) : (
          product.badge && (
            <span className={`${badgeClass[product.badge]} absolute top-3 left-3`}>
              {product.badge}
            </span>
          )
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="flex items-baseline justify-between gap-2 text-ink-faint">
          <span className="label">{product.category.name}</span>
          {product.nameZh && (
            <span lang="zh-Hans" className="font-display text-sm">
              {product.nameZh}
            </span>
          )}
        </p>
        {/* Name and price stack in the narrow 2-up phone grid, sit side by side above it. */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
          <h3 className="font-display text-xl leading-tight sm:text-display-sm">
            {/* Stretched link: the whole card is clickable. */}
            <Link href={`/products/${product.slug}`} className="after:absolute after:inset-0">
              {product.name}
            </Link>
          </h3>
          <p className="price shrink-0 text-[0.9375rem] text-ink">{formatPrice(product.priceCents)}</p>
        </div>
        <p className="text-sm text-ink-soft">
          {product.notes.join(" · ")}
          <span className="text-ink-faint"> — {product.unit}</span>
        </p>
        {/* Cards stay quiet when in stock; only flag scarcity. */}
        {state !== "in-stock" && <StockStatus product={product} className="text-xs" />}
      </div>
    </article>
  );
}
