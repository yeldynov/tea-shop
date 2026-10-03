import type { Metadata } from "next";
import Link from "next/link";

import { getAdminCategories } from "@/lib/admin-queries";
import { requireAdmin } from "@/lib/session";

import { CategoryForm } from "./category-form";

export const metadata: Metadata = { title: "Collections · Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminCollectionsPage() {
  await requireAdmin("/admin/collections");
  const categories = await getAdminCategories();

  return (
    <>
      <header className="flex flex-col gap-3">
        <p className="eyebrow">Admin</p>
        <h1>Collections</h1>
      </header>

      <ul className="card flex flex-col">
        {categories.map((c) => (
          <li key={c.id} className="border-b last:border-b-0">
            <Link
              href={`/admin/collections/${c.id}`}
              className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-paper sm:px-6"
            >
              <span className="flex min-w-0 flex-col gap-1">
                <span className="text-ink">
                  {c.name}{" "}
                  <span lang="zh-Hans" className="text-ink-faint">
                    {c.nameZh}
                  </span>
                </span>
                <span className="text-sm text-ink-faint">/collections/{c.slug}</span>
              </span>
              <span className="shrink-0 text-sm text-ink-soft">
                {c.productCount} {c.productCount === 1 ? "product" : "products"}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <section aria-labelledby="new-collection" className="card flex flex-col gap-5 p-6 sm:p-8">
        <h2 id="new-collection" className="text-display-sm">
          New collection
        </h2>
        <CategoryForm />
      </section>
    </>
  );
}
