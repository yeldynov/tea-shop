import type { Metadata } from "next";
import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { getNewArrivals } from "@/lib/catalog-queries";

// Rendered per request so the newest products and their stock are always current.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New arrivals",
  description: "The latest teas and teaware to reach the shop, newest first.",
};

export default async function NewArrivalsPage() {
  const arrivals = await getNewArrivals();

  return (
    <div className="container-page pt-6 pb-section lg:pt-8">
      <nav aria-label="Breadcrumb" className="mb-6 lg:mb-8">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-faint">
          <li>
            <Link href="/" className="link-quiet">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-ink">
            New arrivals
          </li>
        </ol>
      </nav>

      <header className="mb-10 flex flex-col gap-4 md:mb-14">
        <p className="eyebrow">
          Just landed <span lang="zh-Hans" className="text-ink-faint not-italic">· 新到</span>
        </p>
        <h1>New arrivals</h1>
        <p className="lead max-w-2xl">
          The latest teas and teaware to reach the shop, newest first. Small lots go quickly.
        </p>
      </header>

      {arrivals.length > 0 ? (
        <ul className="grid-products">
          {arrivals.map((product) => (
            <li key={product.slug}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-start gap-5 border-t pt-10">
          <p className="lead">Nothing new on the shelf just yet.</p>
          <Link href="/shop" className="btn-primary">
            Shop all tea
          </Link>
        </div>
      )}
    </div>
  );
}
