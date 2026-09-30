// Drizzle table definitions live here.
// Generate the Better Auth tables with `npm run auth:generate`, then re-export them from this file.
import { relations, sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const categories = pgTable("categories", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  nameZh: text("name_zh").notNull(),
  blurb: text("blurb").notNull(),
  imageUrl: text("image_url").notNull(),
  imageAlt: text("image_alt").notNull(),
  /** Display order; the first category leads the homepage collections grid. */
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});

export const productBadge = pgEnum("product_badge", ["New", "Limited", "Bestseller"]);

export const products = pgTable(
  "products",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    slug: text("slug").notNull().unique(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    nameZh: text("name_zh"),
    origin: text("origin").notNull(),
    description: text("description").notNull(),
    notes: text("notes").array().notNull().default(sql`'{}'::text[]`),
    priceCents: integer("price_cents").notNull(),
    unit: text("unit").notNull(),
    badge: productBadge("badge"),
    details: jsonb("details").$type<{ term: string; detail: string }[]>().notNull().default([]),
    /** Gongfu brewing parameters; teas only. */
    brew: jsonb("brew").$type<{ leaf: string; water: string; time: string; infusions: string }>(),
    imageUrl: text("image_url").notNull(),
    imageAlt: text("image_alt").notNull(),
    gallery: jsonb("gallery").$type<{ src: string; alt: string }[]>().notNull().default([]),
    ...timestamps,
  },
  (t) => [
    index("products_category_id_idx").on(t.categoryId),
    check("products_price_cents_nonnegative", sql`${t.priceCents} >= 0`),
  ],
);

// Kept apart from `products` because it changes often (and orders will decrement it later).
export const productStock = pgTable(
  "product_stock",
  {
    productId: integer("product_id")
      .primaryKey()
      .references(() => products.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(0),
    /** Shown when sold out, e.g. when the next harvest arrives. */
    restockNote: text("restock_note"),
    updatedAt: timestamps.updatedAt,
  },
  (t) => [check("product_stock_quantity_nonnegative", sql`${t.quantity} >= 0`)],
);

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  stock: one(productStock),
}));

export const productStockRelations = relations(productStock, ({ one }) => ({
  product: one(products, { fields: [productStock.productId], references: [products.id] }),
}));
