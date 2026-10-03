// Cart reads for server components. The cookie supplies slugs and quantities;
// products, prices and stock always come from the catalog.
import { cookies } from "next/headers";
import { cache } from "react";

import { CART_COOKIE, cartTotals, clampQuantity, parseCart } from "@/lib/cart";
import type { Product } from "@/lib/catalog";
import { getProductsBySlugs } from "@/lib/catalog-queries";

/** Raw cookie contents; actions read and rewrite this. */
export const readCart = cache(async () => parseCart((await cookies()).get(CART_COOKIE)?.value));

export type CartLine = {
  product: Product;
  /** Quantity being bought: the requested quantity clamped to current stock. */
  quantity: number;
  /** What the cookie asked for; differs from `quantity` when stock dropped. */
  requested: number;
  unitPriceCents: number;
  lineTotalCents: number;
};

export const getCart = cache(async () => {
  const items = await readCart();
  const products = await getProductsBySlugs([...items.keys()]);

  // Products that no longer exist are skipped; sold-out ones stay listed with
  // quantity 0 so the customer can see and remove them.
  const lines: CartLine[] = products.map((product) => {
    const requested = items.get(product.slug)!;
    const quantity = clampQuantity(requested, product.stock);
    return {
      product,
      quantity,
      requested,
      unitPriceCents: product.priceCents,
      lineTotalCents: quantity * product.priceCents,
    };
  });

  return { lines, ...cartTotals(lines) };
});
