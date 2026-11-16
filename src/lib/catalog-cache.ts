import { revalidateTag } from "next/cache";

/** Cache tag for one product page's data (see `getProduct`). */
export const productTag = (slug: string) => `product-${slug}`;

/**
 * Call after anything that changes what `getProduct(slug)` returns: product or
 * collection edits and every stock write (admin, checkout reservation, release).
 * Expires immediately so the next visitor never sees a stale stock badge.
 * Works in Server Actions and Route Handlers.
 */
export function invalidateProducts(slugs: string[]) {
  for (const slug of new Set(slugs)) revalidateTag(productTag(slug), { expire: 0 });
}
