import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CollectionTile } from "@/components/home/featured-collections";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { getCategories, getCategory, getProductsByCategory } from "@/lib/catalog-queries";

// Rendered per request so stock is always current; unknown slugs 404 below.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const collection = await getCategory((await params).slug);
  if (!collection) return {};

  return {
    title: collection.name,
    description: collection.blurb,
    openGraph: {
      title: collection.name,
      description: collection.blurb,
      images: [collection.image.src],
    },
  };
}

export default async function CollectionPage({ params }: PageProps<"/collections/[slug]">) {
  const { slug } = await params;
  const collection = await getCategory(slug);
  if (!collection) notFound();

  const [products, collections] = await Promise.all([
    getProductsByCategory(slug),
    getCategories(),
  ]);
  const others = collections.filter((c) => c.slug !== slug);

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
            {collection.name}
          </li>
        </ol>
      </nav>

      <header className="split mb-10 md:mb-14">
        <div className="flex flex-col gap-4">
          <p className="eyebrow">
            Collection{" "}
            <span lang="zh-Hans" className="text-ink-faint not-italic">
              · {collection.nameZh}
            </span>
          </p>
          <h1>{collection.name}</h1>
          <p className="lead max-w-xl">{collection.blurb}</p>
          <p className="label text-ink-faint">
            {products.length} {products.length === 1 ? "item" : "items"}
          </p>
        </div>
        <div className="relative aspect-4/3 overflow-hidden rounded-card bg-mist">
          <Image
            src={collection.image.src}
            alt={collection.image.alt}
            fill
            preload
            sizes="(min-width: 64rem) 40vw, 100vw"
            className="object-cover"
          />
        </div>
      </header>

      {products.length > 0 ? (
        <ul className="grid-products">
          {products.map((product) => (
            <li key={product.slug}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-start gap-5 border-t pt-10">
          <p className="lead">Nothing in this collection just yet.</p>
          <Link href="/shop" className="btn-primary">
            Shop all tea
          </Link>
        </div>
      )}

      {others.length > 0 && (
        <section className="pt-section">
          <SectionHeading
            eyebrow="Keep exploring"
            title="Other collections"
            href="/shop"
            cta="Shop all tea"
          />
          {/* Swipe row on small screens, one row across on desktop. */}
          <ul className="rail -mx-gutter px-gutter scroll-px-gutter [--rail-item:68%] sm:[--rail-item:42%] lg:mx-0 lg:px-0 lg:[--rail-item:1fr]">
            {others.map((c) => (
              <li key={c.slug}>
                <CollectionTile collection={c} compact />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
