"use server";

import { and, eq } from "drizzle-orm";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { categories, products, productStock } from "@/db/schema";
import {
  type FieldErrors,
  parseCategoryForm,
  parseProductForm,
  parseStockForm,
} from "@/lib/admin-forms";
import { parseId } from "@/lib/admin-queries";
import { requireAdmin } from "@/lib/session";

// Every action starts with requireAdmin(): server actions are public POST
// endpoints, so the page that rendered the form proves nothing.

export type AdminFormState = {
  tone: "error" | "success";
  message: string;
  errors?: FieldErrors;
} | null;

const invalid = (errors: FieldErrors): AdminFormState => ({
  tone: "error",
  message: "Check the highlighted fields.",
  errors,
});

/** Postgres error code, possibly wrapped by Drizzle. */
function pgCode(error: unknown): string | undefined {
  if (!error || typeof error !== "object") return undefined;
  if ("code" in error && typeof error.code === "string") return error.code;
  return "cause" in error ? pgCode(error.cause) : undefined;
}
const UNIQUE_VIOLATION = "23505";
const FOREIGN_KEY_VIOLATION = "23503";
// What ON DELETE RESTRICT raises (not 23503).
const RESTRICT_VIOLATION = "23001";

export async function createProduct(_: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await requireAdmin();
  const parsed = parseProductForm(formData, { create: true });
  if (!parsed.ok) return invalid(parsed.errors);
  const { slug, stock, values } = parsed.data;

  let id: number;
  try {
    [{ id }] = await db
      .insert(products)
      .values({ ...values, slug: slug! })
      .returning({ id: products.id });
  } catch (error) {
    if (pgCode(error) === UNIQUE_VIOLATION) return invalid({ slug: "Another product uses this slug." });
    if (pgCode(error) === FOREIGN_KEY_VIOLATION) return invalid({ categoryId: "Choose a collection." });
    throw error;
  }
  // Separate statement (the product id comes from the insert above). If it
  // fails, the product simply shows as sold out until stock is set.
  await db.insert(productStock).values({ productId: id, quantity: stock! });
  redirect(`/admin/products/${id}`);
}

export async function updateProduct(_: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await requireAdmin();
  const id = parseId(String(formData.get("id")));
  const parsed = parseProductForm(formData, { create: false });
  if (!id) return { tone: "error", message: "This product no longer exists." };
  if (!parsed.ok) return invalid(parsed.errors);

  // Slug and stock are never updated here: cart cookies and URLs key on the
  // slug, and stock has its own guarded action.
  try {
    const updated = await db
      .update(products)
      .set(parsed.data.values)
      .where(eq(products.id, id))
      .returning({ id: products.id });
    if (updated.length === 0) return { tone: "error", message: "This product no longer exists." };
  } catch (error) {
    if (pgCode(error) === FOREIGN_KEY_VIOLATION) return invalid({ categoryId: "Choose a collection." });
    throw error;
  }
  refresh();
  return { tone: "success", message: "Product saved." };
}

export async function createCategory(_: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await requireAdmin();
  const parsed = parseCategoryForm(formData, { create: true });
  if (!parsed.ok) return invalid(parsed.errors);

  let id: number;
  try {
    [{ id }] = await db
      .insert(categories)
      .values({ ...parsed.data.values, slug: parsed.data.slug! })
      .returning({ id: categories.id });
  } catch (error) {
    if (pgCode(error) === UNIQUE_VIOLATION) return invalid({ slug: "Another collection uses this slug." });
    throw error;
  }
  redirect(`/admin/collections/${id}`);
}

export async function updateCategory(_: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await requireAdmin();
  const id = parseId(String(formData.get("id")));
  const parsed = parseCategoryForm(formData, { create: false });
  if (!id) return { tone: "error", message: "This collection no longer exists." };
  if (!parsed.ok) return invalid(parsed.errors);

  const updated = await db
    .update(categories)
    .set(parsed.data.values)
    .where(eq(categories.id, id))
    .returning({ id: categories.id });
  if (updated.length === 0) return { tone: "error", message: "This collection no longer exists." };
  refresh();
  return { tone: "success", message: "Collection saved." };
}

export async function deleteCategory(_: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await requireAdmin();
  const id = parseId(String(formData.get("id")));
  if (id) {
    try {
      await db.delete(categories).where(eq(categories.id, id));
    } catch (error) {
      // products.category_id is ON DELETE RESTRICT.
      if (pgCode(error) === RESTRICT_VIOLATION) {
        return { tone: "error", message: "Move or remove this collection’s products first." };
      }
      throw error;
    }
  }
  redirect("/admin/collections");
}

/**
 * Sets a product's stock, but only if it still equals what the admin saw.
 * Checkouts reserve and release stock concurrently; a blind write would undo
 * those changes and oversell.
 */
export async function updateStock(_: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await requireAdmin();
  const parsed = parseStockForm(formData);
  if (!parsed.ok) return invalid(parsed.errors);
  const { productId, quantity, expectedQuantity, restockNote } = parsed.data;

  let changed: unknown[];
  try {
    changed =
      expectedQuantity === null
        ? // No stock row yet. If one appeared meanwhile, the insert does nothing.
          await db
            .insert(productStock)
            .values({ productId, quantity, restockNote })
            .onConflictDoNothing()
            .returning({ productId: productStock.productId })
        : await db
            .update(productStock)
            .set({ quantity, restockNote })
            .where(
              and(
                eq(productStock.productId, productId),
                eq(productStock.quantity, expectedQuantity),
              ),
            )
            .returning({ productId: productStock.productId });
  } catch (error) {
    if (pgCode(error) === FOREIGN_KEY_VIOLATION) {
      return { tone: "error", message: "This product no longer exists." };
    }
    throw error;
  }
  refresh();
  return changed.length === 0
    ? {
        tone: "error",
        message: "Stock changed since you loaded this page (a checkout reserved or released some). Check the new quantity and try again.",
      }
    : { tone: "success", message: `Stock set to ${quantity}.` };
}
