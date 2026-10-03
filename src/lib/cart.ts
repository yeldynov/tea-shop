// Cart rules shared by the cart actions, `cart-queries.ts` and the UI. No Next
// imports so `cart.check.ts` can run under tsx.
//
// The cart is an httpOnly cookie holding only `{ slug: quantity }`. Prices and
// stock are never stored; they're read from the database on every render and
// every action, so a tampered cookie can only ask for things.

export const CART_COOKIE = "cart";
export const MAX_LINES = 50;
/** Per-line cap on top of stock; matches the product page quantity select. */
export const MAX_PER_LINE = 10;

export type CartItems = Map<string, number>;

/** Anything malformed is dropped, so a bad cookie reads as an empty cart. */
export function parseCart(raw: string | undefined): CartItems {
  const items: CartItems = new Map();
  if (!raw) return items;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return items;
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) return items;
  for (const [slug, qty] of Object.entries(data)) {
    if (items.size >= MAX_LINES) break;
    if (slug && Number.isInteger(qty) && qty > 0) items.set(slug, Math.min(qty, MAX_PER_LINE));
  }
  return items;
}

export function serializeCart(items: CartItems) {
  return JSON.stringify(Object.fromEntries(items));
}

/** Most of one product a customer can have in their bag right now. */
export function maxQuantity(stock: number) {
  return Math.max(0, Math.min(stock, MAX_PER_LINE));
}

export function clampQuantity(qty: number, stock: number) {
  return Math.max(0, Math.min(qty, maxQuantity(stock)));
}

export function cartTotals(lines: { quantity: number; unitPriceCents: number }[]) {
  return lines.reduce(
    (totals, line) => ({
      subtotalCents: totals.subtotalCents + line.quantity * line.unitPriceCents,
      itemCount: totals.itemCount + line.quantity,
    }),
    { subtotalCents: 0, itemCount: 0 },
  );
}
