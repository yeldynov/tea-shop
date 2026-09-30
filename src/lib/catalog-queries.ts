// Catalog reads for server components. Each query is wrapped in React `cache()`
// so repeated calls within one request (e.g. generateMetadata + page) hit the
// database once.
import { asc, desc, eq, inArray, sql } from "drizzle-orm";
import { cache } from "react";

import { db } from "@/db";
import { categories, products } from "@/db/schema";
import type { Category, Product } from "@/lib/catalog";

type CategoryRow = typeof categories.$inferSelect;

function toCategory(row: CategoryRow): Category {
  return {
    slug: row.slug,
    name: row.name,
    nameZh: row.nameZh,
    blurb: row.blurb,
    image: { src: row.imageUrl, alt: row.imageAlt },
  };
}

const withRelations = { category: true, stock: true } as const;

type ProductRow = typeof products.$inferSelect & {
  category: CategoryRow;
  stock: { quantity: number; restockNote: string | null } | null;
};

function toProduct(row: ProductRow): Product {
  return {
    slug: row.slug,
    name: row.name,
    nameZh: row.nameZh ?? undefined,
    category: toCategory(row.category),
    origin: row.origin,
    notes: row.notes,
    priceCents: row.priceCents,
    unit: row.unit,
    badge: row.badge ?? undefined,
    // No stock row means nothing to sell.
    stock: row.stock?.quantity ?? 0,
    restock: row.stock?.restockNote ?? undefined,
    description: row.description,
    details: row.details,
    brew: row.brew ?? undefined,
    image: { src: row.imageUrl, alt: row.imageAlt },
    gallery: row.gallery,
  };
}

export const getCategories = cache(async () => {
  const rows = await db.query.categories.findMany({
    orderBy: [asc(categories.sortOrder), asc(categories.id)],
  });
  return rows.map(toCategory);
});

export const getProduct = cache(async (slug: string) => {
  const row = await db.query.products.findFirst({
    where: eq(products.slug, slug),
    with: withRelations,
  });
  return row ? toProduct(row) : undefined;
});

/** In the order given; unknown slugs are skipped. */
export const getProductsBySlugs = cache(async (slugs: string[]) => {
  if (slugs.length === 0) return [];
  const rows = await db.query.products.findMany({
    where: inArray(products.slug, slugs),
    with: withRelations,
  });
  const bySlug = new Map(rows.map((row) => [row.slug, toProduct(row)]));
  return slugs.flatMap((slug) => bySlug.get(slug) ?? []);
});

export const getProductsByCategory = cache(async (categorySlug: string) => {
  const rows = await db.query.products.findMany({
    where: inArray(
      products.categoryId,
      db.select({ id: categories.id }).from(categories).where(eq(categories.slug, categorySlug)),
    ),
    orderBy: asc(products.id),
    with: withRelations,
  });
  return rows.map(toProduct);
});

/** Same category first, then everything else, never the product itself. */
export const getRelatedProducts = cache(async (product: Product, count = 4) => {
  const categoryId = db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.slug, product.category.slug));
  const rows = await db.query.products.findMany({
    where: (p, { ne }) => ne(p.slug, product.slug),
    orderBy: (p) => [desc(sql`${p.categoryId} = (${categoryId})`), asc(p.id)],
    limit: count,
    with: withRelations,
  });
  return rows.map(toProduct);
});
