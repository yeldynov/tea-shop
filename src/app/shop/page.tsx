import type { Metadata } from "next";
import Link from "next/link";

import { CategoryPills } from "@/components/home/featured-collections";
import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/catalog-queries";

// Rendered per request so stock is always current.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop all",
  description: "Every tea and piece of teaware in the shop, from pu’er to gaiwans.",
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <>
      <div className="container-page pt-6 lg:pt-8">
        <nav aria-label="Breadcrumb" className="mb-6 lg:mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-faint">
            <li>
              <Link href="/" className="link-quiet">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-ink">
              Shop all
            </li>
          </ol>
        </nav>

        <header className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <p className="eyebrow">
            The whole shelf <span lang="zh-Hans" className="text-ink-faint not-italic">· 全部</span>
          </p>
          <h1>Shop all</h1>
          <p className="lead">
            Every tea and piece of teaware we carry, bought directly from the families who make
            them.
          </p>
          <p className="label text-ink-faint">
            {products.length} {products.length === 1 ? "item" : "items"}
          </p>
        </header>
      </div>

      {/* Jump to a single collection. */}
      <CategoryPills />

      <div className="container-page pt-10 pb-section md:pt-14">
        {products.length > 0 ? (
          <ul className="grid-products">
            {products.map((product) => (
              <li key={product.slug}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="lead border-t pt-10">Nothing on the shelf just yet.</p>
        )}
      </div>
    </>
  );
}
