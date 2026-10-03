import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";

import { CategoryPills } from "@/components/home/featured-collections";
import { SearchIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { searchProducts } from "@/lib/catalog-queries";

// Results read the catalog on every request.
export const dynamic = "force-dynamic";

function readQuery(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.trim().slice(0, 100) ?? "";
}

export async function generateMetadata({ searchParams }: PageProps<"/search">): Promise<Metadata> {
  const q = readQuery((await searchParams).q);
  return {
    title: q ? `Search: ${q}` : "Search",
    robots: { index: false },
  };
}

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const q = readQuery((await searchParams).q);
  const results = q ? await searchProducts(q) : [];

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
              Search
            </li>
          </ol>
        </nav>

        <header className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <p className="eyebrow">
              Find your tea <span lang="zh-Hans" className="text-ink-faint not-italic">· 搜索</span>
            </p>
            <h1>Search</h1>
          </div>

          {/* GET form: works without JS, navigates client-side with it. */}
          <Form action="/search" role="search" className="flex w-full gap-3">
            <label htmlFor="search-q" className="sr-only">
              Search products
            </label>
            <div className="relative flex-1">
              <SearchIcon
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-ink-faint"
              />
              {/* Keyed so the field resets to the URL's query after navigating. */}
              <input
                key={q}
                id="search-q"
                name="q"
                type="search"
                defaultValue={q}
                placeholder="Try “pu’er”, “roasted” or “gaiwan”"
                autoFocus={!q}
                autoComplete="off"
                maxLength={100}
                className="input rounded-pill! pl-13!"
              />
            </div>
            <button type="submit" className="btn-primary shrink-0">
              Search
            </button>
          </Form>

          {q && (
            <p className="label text-ink-faint" aria-live="polite">
              {results.length} {results.length === 1 ? "result" : "results"} for “{q}”
            </p>
          )}
        </header>
      </div>

      {results.length > 0 ? (
        <div className="container-page pt-10 pb-section md:pt-14">
          <ul className="grid-products">
            {results.map((product) => (
              <li key={product.slug}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="pb-section">
          <p className="container-page pt-10 text-center text-ink-soft md:pt-14">
            {q
              ? "Nothing matched. Try a different word, or browse a collection:"
              : "Search by name, origin or tasting note, or browse a collection:"}
          </p>
          <CategoryPills />
        </div>
      )}
    </>
  );
}
