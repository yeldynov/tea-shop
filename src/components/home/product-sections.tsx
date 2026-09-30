import Image from "next/image";
import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { TastingNotes } from "@/components/tasting-notes";
import { formatPrice, merchandising, photos } from "@/lib/catalog";
import { getProduct, getProductsByCategory, getProductsBySlugs } from "@/lib/catalog-queries";

export async function Bestsellers() {
  const bestsellers = await getProductsBySlugs(merchandising.bestsellers);
  if (bestsellers.length === 0) return null;

  return (
    <section className="container-page pb-section">
      <SectionHeading
        eyebrow="Most poured this month"
        title="Bestsellers"
        href="/shop?sort=popular"
        cta="Shop bestsellers"
      />
      <ul className="grid-products">
        {bestsellers.map((product) => (
          <li key={product.slug}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export async function ProductSpotlight() {
  const spotlight = await getProduct(merchandising.spotlight);
  if (!spotlight) return null;

  const spotlightSpecs = [
    { term: "Origin", detail: spotlight.origin },
    { term: "Harvest", detail: "Spring 2024, charcoal roasted" },
    { term: "Water", detail: "100 °C · 100 ml gaiwan" },
    { term: "Leaf", detail: "7 g · 8+ infusions" },
  ];

  return (
    <section className="container-wide">
      <div className="panel bg-matcha-pale">
        <div className="split mx-auto max-w-(--container-page)">
          {/* Layered imagery: lifestyle shot with the product inset. */}
          <div className="relative pb-10 sm:pr-16 lg:pb-14">
            <div className="relative aspect-4/5 overflow-hidden rounded-card bg-mist sm:aspect-5/4 lg:aspect-4/5">
              <Image
                src={photos.clayPotPour.src}
                alt={photos.clayPotPour.alt}
                fill
                sizes="(min-width: 64rem) 40vw, 90vw"
                className="object-cover"
              />
            </div>
            <div className="absolute right-0 bottom-0 w-2/5 max-w-56 rotate-3 overflow-hidden rounded-lg border-4 border-matcha-pale shadow-lift sm:w-1/3">
              <div className="relative aspect-square bg-mist">
                <Image
                  src={spotlight.image.src}
                  alt={spotlight.image.alt}
                  fill
                  sizes="14rem"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:py-8">
            <div className="flex flex-col gap-4">
              <p className="eyebrow">
                In focus <span lang="zh-Hans" className="text-ink-faint not-italic">· {spotlight.nameZh}</span>
              </p>
              <h2>
                <Link href={`/products/${spotlight.slug}`}>{spotlight.name}</Link>
              </h2>
              <p className="lead">
                The “Big Red Robe” of the Wuyi cliffs, grown in mineral-rich rock soil and roasted
                slowly over charcoal. Deep and warming, with the stony finish known as{" "}
                <em>yan yun</em> — rock rhyme — that keeps unfolding cup after cup.
              </p>
            </div>

            <TastingNotes notes={spotlight.notes} />

            <dl className="grid grid-cols-2 gap-x-6 border-y border-matcha/20 py-5">
              {spotlightSpecs.map((spec) => (
                <div key={spec.term} className="flex flex-col gap-1 py-2">
                  <dt className="label text-ink-faint">{spec.term}</dt>
                  <dd className="text-ink">{spec.detail}</dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <p className="flex items-baseline gap-2">
                <span className="price text-2xl text-ink">{formatPrice(spotlight.priceCents)}</span>
                <span className="text-sm text-ink-faint">/ {spotlight.unit}</span>
              </p>
              {/* Cart isn't wired up yet. */}
              <button type="button" className="btn-primary btn-lg">
                Add to bag
              </button>
              <Link href="/journal/brewing" className="link-arrow">
                Gongfu brewing guide <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export async function TeawareRow() {
  const teaware = await getProductsByCategory("teaware");
  if (teaware.length === 0) return null;

  return (
    <section className="section">
      <div className="container-page">
        <SectionHeading
          eyebrow="Tools for gongfu cha"
          title="Teaware"
          href="/collections/teaware"
          cta="Shop teaware"
        />
      </div>
      {/* Swipe row on small screens, four across on desktop. */}
      <div className="container-page">
        <ul className="rail -mx-gutter px-gutter scroll-px-gutter [--rail-item:68%] sm:[--rail-item:42%] lg:mx-0 lg:px-0 lg:[--rail-item:1fr]">
          {teaware.map((product) => (
            <li key={product.slug}>
              <ProductCard
                product={product}
                sizes="(min-width: 64rem) 22vw, (min-width: 40rem) 40vw, 68vw"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
