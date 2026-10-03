import type { Metadata } from "next";
import Link from "next/link";

import { getAdminProducts } from "@/lib/admin-queries";
import { requireAdmin } from "@/lib/session";

import { StockForm } from "./stock-form";
import { StockLabel } from "./stock-label";

export const metadata: Metadata = { title: "Stock · Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminStockPage() {
  await requireAdmin("/admin/stock");
  // Lowest stock first, so what needs restocking is at the top.
  const products = (await getAdminProducts()).sort(
    (a, b) => (a.stock?.quantity ?? 0) - (b.stock?.quantity ?? 0),
  );

  return (
    <>
      <header className="flex flex-col gap-3">
        <p className="eyebrow">Admin</p>
        <h1>Stock</h1>
        <p className="text-ink-soft">
          Pending checkouts already hold their items, so these are the quantities still for sale.
        </p>
      </header>

      <ul className="card flex flex-col">
        {products.map((p) => (
          <li key={p.id} className="flex flex-col gap-3 border-b p-4 last:border-b-0 sm:px-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <Link href={`/admin/products/${p.id}`} className="link-quiet text-ink">
                {p.name}
              </Link>
              <StockLabel quantity={p.stock?.quantity ?? 0} />
            </div>
            <StockForm
              productId={p.id}
              quantity={p.stock?.quantity ?? null}
              restockNote={p.stock?.restockNote ?? null}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
