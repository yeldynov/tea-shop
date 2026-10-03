import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { centsToDollars } from "@/lib/admin-forms";
import { getAdminCategories, getAdminProduct, parseId } from "@/lib/admin-queries";
import { requireAdmin } from "@/lib/session";

import { StockForm } from "../../stock/stock-form";
import { ProductForm } from "../product-form";

export const metadata: Metadata = { title: "Edit product · Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: PageProps<"/admin/products/[id]">) {
  const { id } = await params;
  await requireAdmin(`/admin/products/${id}`);
  const productId = parseId(id);
  const [product, categories] = await Promise.all([
    productId ? getAdminProduct(productId) : undefined,
    getAdminCategories(),
  ]);
  if (!product) notFound();

  const values = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    nameZh: product.nameZh ?? "",
    categoryId: product.categoryId,
    origin: product.origin,
    description: product.description,
    notes: product.notes.join(", "),
    price: centsToDollars(product.priceCents),
    unit: product.unit,
    badge: product.badge ?? "",
    details: product.details.map((d) => `${d.term}: ${d.detail}`).join("\n"),
    brew: product.brew ?? { leaf: "", water: "", time: "", infusions: "" },
    imageUrl: product.imageUrl,
    imageAlt: product.imageAlt,
    gallery: product.gallery.map((g) => `${g.src} | ${g.alt}`).join("\n"),
  };

  return (
    <>
      <header className="flex flex-col gap-3">
        <Link href="/admin/products" className="link-arrow self-start text-sm">
          <span aria-hidden>←</span> Products
        </Link>
        <h1>{product.name}</h1>
        <Link href={`/products/${product.slug}`} className="link self-start text-sm">
          View in shop
        </Link>
      </header>

      <section aria-labelledby="stock" className="panel flex flex-col gap-4">
        <h2 id="stock" className="text-display-sm">
          Stock
        </h2>
        <StockForm
          productId={product.id}
          quantity={product.stock?.quantity ?? null}
          restockNote={product.stock?.restockNote ?? null}
        />
      </section>

      <ProductForm product={values} categories={categories} />
    </>
  );
}
