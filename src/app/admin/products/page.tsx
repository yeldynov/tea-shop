import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { formatPrice } from "@/lib/catalog";
import { getAdminProducts } from "@/lib/admin-queries";
import { requireAdmin } from "@/lib/session";

import { StockLabel } from "../stock/stock-label";

export const metadata: Metadata = { title: "Products · Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await requireAdmin("/admin/products");
  const products = await getAdminProducts();

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-3">
          <p className="eyebrow">Admin</p>
          <h1>Products</h1>
        </div>
        <Link href="/admin/products/new" className="btn-primary btn-sm">
          New product
        </Link>
      </header>

      <ul className="card flex flex-col">
        {products.map((p) => (
          <li key={p.id} className="border-b last:border-b-0">
            <Link
              href={`/admin/products/${p.id}`}
              className="flex items-center gap-4 p-4 transition-colors hover:bg-paper sm:px-6"
            >
              <span className="media w-12 shrink-0">
                <Image src={p.imageUrl} alt="" fill sizes="3rem" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="truncate text-ink">{p.name}</span>
                <span className="text-sm text-ink-faint">{p.category.name}</span>
              </span>
              <span className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-6">
                <StockLabel quantity={p.stock?.quantity ?? 0} />
                <span className="price w-20 text-right text-ink">{formatPrice(p.priceCents)}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
