import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { LeafIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product/gallery";
import { SectionHeading } from "@/components/section-heading";
import { StockStatus } from "@/components/stock-status";
import { TastingNotes } from "@/components/tasting-notes";
import {
  collectionOf,
  formatPrice,
  getProduct,
  products,
  relatedProducts,
  stockState,
  type Product,
} from "@/lib/catalog";

// Only the slugs in the catalog exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};

  const description = product.description.split(". ")[0] + ".";
  return {
    title: product.name,
    description,
    openGraph: { title: product.name, description, images: [product.image.src] },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const product = getProduct((await params).slug);
  if (!product) notFound();

  const collection = collectionOf(product);
  const images = [product.image, ...(product.gallery ?? [])];
  const related = relatedProducts(product);

  return (
    <>
      <div className="container-page pt-6 pb-section-sm lg:pt-8">
        <nav aria-label="Breadcrumb" className="mb-6 lg:mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-faint">
            <li>
              <Link href="/" className="link-quiet">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href={`/collections/${collection.slug}`} className="link-quiet">
                {collection.name}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-ink">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 xl:gap-20">
          <ProductGallery images={images} name={product.name} />

          <div className="flex flex-col gap-8 lg:sticky lg:top-28 lg:self-start">
            <ProductSummary product={product} />
            <PurchaseForm product={product} />
            <ProductFacts product={product} />
          </div>
        </div>
      </div>

      {product.brew && <BrewingBand brew={product.brew} />}

      <section className="container-page section">
        <SectionHeading
          eyebrow="Pour next"
          title="You may also like"
          href={`/collections/${collection.slug}`}
          cta={`More ${collection.name.toLowerCase()}`}
        />
        <ul className="grid-products">
          {related.map((item) => (
            <li key={item.slug}>
              <ProductCard product={item} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function ProductSummary({ product }: { product: Product }) {
  const collection = collectionOf(product);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <p className="flex items-baseline gap-3 text-ink-faint">
          <Link href={`/collections/${collection.slug}`} className="label link-quiet">
            {collection.name}
          </Link>
          {product.nameZh && (
            <span lang="zh-Hans" className="font-display text-lg">
              {product.nameZh}
            </span>
          )}
        </p>
        <h1 className="text-display-lg">{product.name}</h1>
        <p className="flex items-center gap-2 text-ink-soft">
          <LeafIcon className="size-4 text-matcha" />
          {product.origin}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="flex items-baseline gap-2">
          <span className="price text-3xl text-ink">{formatPrice(product.price)}</span>
          <span className="text-ink-faint">/ {product.unit}</span>
        </p>
        <StockStatus product={product} detailed />
      </div>

      <p className="text-lg leading-relaxed">{product.description}</p>
      <TastingNotes notes={product.notes} label={product.brew ? "Tasting notes" : "Features"} />
    </div>
  );
}

// Cart isn't wired up yet: the form renders the right states but doesn't submit.
function PurchaseForm({ product }: { product: Product }) {
  const soldOut = stockState(product) === "sold-out";
  const maxQuantity = Math.min(product.stock, 10);

  return (
    <div className="flex flex-col gap-4 border-y py-6">
      {soldOut ? (
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" className="btn-primary btn-lg flex-1" disabled>
            Sold out
          </button>
          <button type="button" className="btn-outline btn-lg flex-1">
            Notify me when it’s back
          </button>
        </div>
      ) : (
        <form className="flex gap-3">
          <label htmlFor="quantity" className="sr-only">
            Quantity
          </label>
          <select
            id="quantity"
            name="quantity"
            defaultValue={1}
            className="input w-24! shrink-0 cursor-pointer rounded-pill! px-5!"
          >
            {Array.from({ length: maxQuantity }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <button type="button" className="btn-primary btn-lg flex-1">
            Add to bag · {formatPrice(product.price)}
          </button>
        </form>
      )}

      <ul className="grid gap-2 text-sm text-ink-soft sm:grid-cols-2">
        <li>Free shipping on orders over $60</li>
        <li>A tasting sample in every order</li>
      </ul>
    </div>
  );
}

function ProductFacts({ product }: { product: Product }) {
  const facts = [{ term: "Origin", detail: product.origin }, ...product.details];

  return (
    <div className="flex flex-col">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 pb-6">
        {facts.map((fact) => (
          <div key={fact.term} className="flex flex-col gap-1">
            <dt className="label text-ink-faint">{fact.term}</dt>
            <dd className="text-ink">{fact.detail}</dd>
          </div>
        ))}
      </dl>

      {product.brew && (
        <Disclosure title="How to brew">
          <p>
            Use {product.brew.leaf} of leaf in a 100 ml gaiwan or clay pot with water at{" "}
            {product.brew.water}. Rinse once and pour it off, then steep for{" "}
            {product.brew.time}, adding a few seconds each round. Expect {product.brew.infusions}{" "}
            infusions. For a mug, use a third of the leaf and steep 3–4 minutes.
          </p>
        </Disclosure>
      )}
      <Disclosure title={product.brew ? "Storage" : "Care"}>
        <p>
          {product.brew
            ? product.collection === "puer"
              ? "Keep pu’er away from light and strong smells, with a little airflow and steady humidity. Cakes can be stored for years and will keep developing."
              : "Store airtight, away from light, heat and strong smells. Best enjoyed within a year of opening."
            : "Rinse with hot water after each session and let it air-dry with the lid off. Avoid soap on unglazed clay — it absorbs flavour."}
        </p>
      </Disclosure>
      <Disclosure title="Shipping & returns">
        <p>
          Orders ship within 2 working days in recyclable packaging. Unopened tea and unused
          teaware can be returned within 30 days.
        </p>
      </Disclosure>
    </div>
  );
}

function Disclosure({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group border-t last:border-b">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-xl text-ink [&::-webkit-details-marker]:hidden">
        {title}
        <span
          aria-hidden
          className="grid size-8 place-items-center rounded-full border text-xl leading-none font-light transition-transform duration-300 group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="pb-5 text-ink-soft">{children}</div>
    </details>
  );
}

function BrewingBand({ brew }: { brew: NonNullable<Product["brew"]> }) {
  const params = [
    { label: "Leaf", value: brew.leaf, hint: "per 100 ml" },
    { label: "Water", value: brew.water, hint: "freshly boiled, then rested" },
    { label: "Steep", value: brew.time, hint: "a little longer each round" },
    { label: "Infusions", value: brew.infusions, hint: "from one session" },
  ];

  return (
    <section className="container-wide">
      <div className="panel bg-matcha-pale">
        <div className="mx-auto flex max-w-(--container-page) flex-col gap-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-3">
              <p className="eyebrow">
                Gongfu cha <span lang="zh-Hans">· 功夫茶</span>
              </p>
              <h2 className="text-display-md">Brew it gongfu-style</h2>
            </div>
            <Link href="/journal/brewing" className="link-arrow">
              Full brewing guide <span aria-hidden>→</span>
            </Link>
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
            {params.map((p) => (
              <div key={p.label} className="flex flex-col gap-2 border-t border-matcha/25 pt-5">
                <dt className="label text-matcha-deep">{p.label}</dt>
                <dd className="font-display text-display-md text-ink">{p.value}</dd>
                <dd className="text-sm text-ink-soft">{p.hint}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
