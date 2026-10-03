import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getAdminCategory, parseId } from "@/lib/admin-queries";
import { requireAdmin } from "@/lib/session";

import { CategoryForm, DeleteCategoryForm } from "../category-form";

export const metadata: Metadata = { title: "Edit collection · Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function EditCollectionPage({ params }: PageProps<"/admin/collections/[id]">) {
  const { id } = await params;
  await requireAdmin(`/admin/collections/${id}`);
  const categoryId = parseId(id);
  const category = categoryId ? await getAdminCategory(categoryId) : undefined;
  if (!category) notFound();

  return (
    <>
      <header className="flex flex-col gap-3">
        <Link href="/admin/collections" className="link-arrow self-start text-sm">
          <span aria-hidden>←</span> Collections
        </Link>
        <h1>{category.name}</h1>
        <Link href={`/collections/${category.slug}`} className="link self-start text-sm">
          View in shop
        </Link>
      </header>

      <section className="card p-6 sm:p-8">
        <CategoryForm category={category} />
      </section>

      <section aria-labelledby="delete-collection" className="flex flex-col gap-3">
        <h2 id="delete-collection" className="label text-ink-faint">
          Delete
        </h2>
        {category.productCount === 0 ? (
          <DeleteCategoryForm id={category.id} />
        ) : (
          <p className="text-sm text-ink-soft">
            This collection has {category.productCount}{" "}
            {category.productCount === 1 ? "product" : "products"}. Move them to another collection
            before deleting it.
          </p>
        )}
      </section>
    </>
  );
}
