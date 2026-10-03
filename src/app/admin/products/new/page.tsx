import type { Metadata } from "next";
import Link from "next/link";

import { getAdminCategories } from "@/lib/admin-queries";
import { requireAdmin } from "@/lib/session";

import { ProductForm } from "../product-form";

export const metadata: Metadata = { title: "New product · Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  await requireAdmin("/admin/products/new");
  const categories = await getAdminCategories();

  return (
    <>
      <header className="flex flex-col gap-3">
        <Link href="/admin/products" className="link-arrow self-start text-sm">
          <span aria-hidden>←</span> Products
        </Link>
        <h1>New product</h1>
      </header>
      <ProductForm categories={categories} />
    </>
  );
}
