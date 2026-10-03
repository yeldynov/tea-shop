// Catalog reads for server components. Each query is wrapped in React `cache()`
// so repeated calls within one request (e.g. generateMetadata + page) hit the
// database once.
import { asc, desc, eq, inArray, sql, type SQL } from "drizzle-orm";
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
    id: row.id,
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

export const getCategory = cache(async (slug: string) => {
  const row = await db.query.categories.findFirst({ where: eq(categories.slug, slug) });
  return row ? toCategory(row) : undefined;
});

export const getProduct = cache(async (slug: string) => {
  const row = await db.query.products.findFirst({
    where: eq(products.slug, slug),
    with: withRelations,
  });
  return row ? toProduct(row) : undefined;
});

/** Every product, grouped by collection in display order. */
export const getProducts = cache(async () => {
  // Raw names: the relational query rewrites column refs to the products alias.
  const rows = await db.query.products.findMany({
    orderBy: (p) => [
      asc(sql`(select c.sort_order from categories c where c.id = ${p.categoryId})`),
      asc(p.id),
    ],
    with: withRelations,
  });
  return rows.map(toProduct);
});

/**
 * Case-insensitive search: every word must appear in the name, Chinese name,
 * origin, notes, description or collection name. Ordered like `getProducts`.
 */
export const searchProducts = cache(async (query: string) => {
  // Apostrophes are ignored on both sides so "puer" and "pu'er" find "Pu’er".
  const terms = query
    .replace(/['’]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 8);
  if (terms.length === 0) return [];
  const matches = (text: SQL, pattern: string) =>
    sql`translate(${text}, ${"'’"}, '') ilike ${pattern}`;

  const rows = await db.query.products.findMany({
    where: (p, { and, or }) =>
      and(
        ...terms.map((term) => {
          const pattern = `%${term.replace(/[\\%_]/g, "\\$&")}%`;
          return or(
            matches(sql`${p.name}`, pattern),
            matches(sql`${p.nameZh}`, pattern),
            matches(sql`${p.origin}`, pattern),
            matches(sql`${p.description}`, pattern),
            matches(sql`array_to_string(${p.notes}, ' ')`, pattern),
            // Raw names: the relational query rewrites column refs to the products alias.
            sql`exists (select 1 from categories c where c.id = ${p.categoryId} and (${matches(sql`c.name`, pattern)} or c.name_zh ilike ${pattern}))`,
          );
        }),
      ),
    orderBy: (p) => [
      asc(sql`(select c.sort_order from categories c where c.id = ${p.categoryId})`),
      asc(p.id),
    ],
    with: withRelations,
  });
  return rows.map(toProduct);
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

/** Most recently added first; id breaks ties between rows inserted together. */
export const getNewArrivals = cache(async (count = 8) => {
  const rows = await db.query.products.findMany({
    orderBy: [desc(products.createdAt), desc(products.id)],
    limit: count,
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
