// Loads the sample catalog into the database. Safe to re-run: rows are upserted
// by slug, and stock is reset to the seed values.
import { config } from "dotenv";
import { sql } from "drizzle-orm";

import { db } from "@/db";
import { categories, products, productStock } from "@/db/schema";
import { seedCategories, seedProducts } from "@/db/seed-data";

// `db` connects on first query, so this runs in time.
config({ path: [".env.local", ".env"], quiet: true });

const excluded = (column: string) => sql.raw(`excluded.${column}`);

async function main() {
  const categoryRows = await db
    .insert(categories)
    .values(
      seedCategories.map((c, i) => ({
        slug: c.slug,
        name: c.name,
        nameZh: c.nameZh,
        blurb: c.blurb,
        imageUrl: c.image.src,
        imageAlt: c.image.alt,
        sortOrder: i,
      })),
    )
    .onConflictDoUpdate({
      target: categories.slug,
      set: {
        name: excluded("name"),
        nameZh: excluded("name_zh"),
        blurb: excluded("blurb"),
        imageUrl: excluded("image_url"),
        imageAlt: excluded("image_alt"),
        sortOrder: excluded("sort_order"),
        updatedAt: new Date(),
      },
    })
    .returning({ id: categories.id, slug: categories.slug });
  const categoryIds = new Map(categoryRows.map((c) => [c.slug, c.id]));

  const productRows = await db
    .insert(products)
    .values(
      seedProducts.map((p) => {
        const categoryId = categoryIds.get(p.category);
        if (categoryId === undefined) throw new Error(`Unknown category: ${p.category}`);
        return {
          slug: p.slug,
          categoryId,
          name: p.name,
          nameZh: p.nameZh,
          origin: p.origin,
          description: p.description,
          notes: p.notes,
          priceCents: p.priceCents,
          unit: p.unit,
          badge: p.badge,
          details: p.details,
          brew: p.brew,
          imageUrl: p.image.src,
          imageAlt: p.image.alt,
          gallery: p.gallery ?? [],
        };
      }),
    )
    .onConflictDoUpdate({
      target: products.slug,
      set: {
        categoryId: excluded("category_id"),
        name: excluded("name"),
        nameZh: excluded("name_zh"),
        origin: excluded("origin"),
        description: excluded("description"),
        notes: excluded("notes"),
        priceCents: excluded("price_cents"),
        unit: excluded("unit"),
        badge: excluded("badge"),
        details: excluded("details"),
        brew: excluded("brew"),
        imageUrl: excluded("image_url"),
        imageAlt: excluded("image_alt"),
        gallery: excluded("gallery"),
        updatedAt: new Date(),
      },
    })
    .returning({ id: products.id, slug: products.slug });
  const productIds = new Map(productRows.map((p) => [p.slug, p.id]));

  await db
    .insert(productStock)
    .values(
      seedProducts.map((p) => ({
        productId: productIds.get(p.slug)!,
        quantity: p.stock,
        restockNote: p.restock,
      })),
    )
    .onConflictDoUpdate({
      target: productStock.productId,
      set: {
        quantity: excluded("quantity"),
        restockNote: excluded("restock_note"),
        updatedAt: new Date(),
      },
    });

  console.log(`Seeded ${categoryRows.length} categories and ${productRows.length} products.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
