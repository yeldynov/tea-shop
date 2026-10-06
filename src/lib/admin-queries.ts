// Reads for the admin area. Unlike `catalog-queries.ts` these return raw rows:
// the forms need ids and unmapped columns. Pages must call requireAdmin() first.
import { asc, count, desc, eq, getTableColumns } from "drizzle-orm";

import { db } from "@/db";
import { categories, contacts, orders, products, user } from "@/db/schema";

/** Every product with its collection name and stock, alphabetically. */
export async function getAdminProducts() {
  return db.query.products.findMany({
    columns: { id: true, slug: true, name: true, priceCents: true, imageUrl: true },
    with: {
      category: { columns: { name: true } },
      stock: { columns: { quantity: true, restockNote: true } },
    },
    orderBy: asc(products.name),
  });
}

export async function getAdminProduct(id: number) {
  return db.query.products.findFirst({
    where: eq(products.id, id),
    with: { stock: true },
  });
}

export async function getAdminCategories() {
  return db
    .select({ ...getTableColumns(categories), productCount: count(products.id) })
    .from(categories)
    .leftJoin(products, eq(products.categoryId, categories.id))
    .groupBy(categories.id)
    .orderBy(asc(categories.sortOrder), asc(categories.id));
}

export async function getAdminCategory(id: number) {
  const [row] = await db
    .select({ ...getTableColumns(categories), productCount: count(products.id) })
    .from(categories)
    .leftJoin(products, eq(products.categoryId, categories.id))
    .where(eq(categories.id, id))
    .groupBy(categories.id);
  return row;
}

// ponytail: loads every order; add pagination once the list gets long.
export async function getAllOrders() {
  return db.query.orders.findMany({
    orderBy: desc(orders.createdAt),
    with: {
      items: { columns: { quantity: true } },
      user: { columns: { email: true, name: true } },
    },
  });
}

// ponytail: loads every contact; add pagination/search once the list gets long.
/** Every known email, newest first, with the account name for registered users. */
export async function getAllContacts() {
  return db
    .select({ ...getTableColumns(contacts), name: user.name })
    .from(contacts)
    .leftJoin(user, eq(user.id, contacts.userId))
    .orderBy(desc(contacts.createdAt));
}

/** Parses a route `[id]` into a positive integer id, or undefined. */
export function parseId(value: string) {
  return /^\d{1,9}$/.test(value) && Number(value) > 0 ? Number(value) : undefined;
}
