import Image from "next/image";
import Link from "next/link";

import { LeafIcon } from "@/components/icons";
import { collections } from "@/lib/catalog";

export function CategoryPills() {
  return (
    <nav aria-label="Shop by type" className="container-page pt-8 md:pt-10">
      <ul className="-mx-gutter flex gap-2.5 overflow-x-auto px-gutter pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:justify-center lg:px-0">
        {collections.map((c) => (
          <li key={c.slug} className="shrink-0">
            <Link href={`/collections/${c.slug}`} className="btn-soft btn-sm gap-2">
              <LeafIcon className="size-4 text-matcha" />
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function FeaturedCollections() {
  // Lead tile + four; teaware has its own row further down the page.
  const [lead, ...rest] = collections.filter((c) => c.slug !== "teaware");

  return (
    <section className="container-page section">
      <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-3">
          <p className="eyebrow">Where to begin</p>
          <h2>Featured collections</h2>
        </div>
        <Link href="/shop" className="link-arrow">
          Browse all tea <span aria-hidden>→</span>
        </Link>
      </div>

      {/* Bento: lead collection spans two rows on large screens. */}
      <ul className="grid grid-cols-2 gap-grid lg:grid-cols-4 lg:grid-rows-2">
        <li className="col-span-2 lg:row-span-2">
          <CollectionTile collection={lead} large />
        </li>
        {rest.map((c) => (
          <li key={c.slug}>
            <CollectionTile collection={c} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function CollectionTile({
  collection,
  large = false,
}: {
  collection: (typeof collections)[number];
  large?: boolean;
}) {
  return (
    <Link
      href={`/collections/${collection.slug}`}
      className={`group relative isolate flex h-full overflow-hidden rounded-card bg-mist ${
        large ? "aspect-4/3 lg:aspect-auto" : "aspect-square"
      }`}
    >
      <Image
        src={collection.image.src}
        alt={collection.image.alt}
        fill
        sizes={large ? "(min-width: 64rem) 50vw, 100vw" : "(min-width: 64rem) 25vw, 50vw"}
        className="-z-20 object-cover transition-transform duration-700 ease-out-soft group-hover:scale-105"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-ink/70 via-ink/10 to-transparent" />
      <div className="mt-auto flex w-full items-end justify-between gap-3 p-4 text-cream sm:p-6">
        <div className="flex flex-col gap-1">
          <h3 className={`text-cream ${large ? "text-display-lg" : "text-display-sm"}`}>
            {collection.name}{" "}
            <span lang="zh-Hans" className="text-[0.6em] text-cream/70">
              {collection.nameZh}
            </span>
          </h3>
          <p className={`text-cream/80 ${large ? "text-base" : "hidden text-sm sm:block"}`}>
            {collection.blurb}
          </p>
        </div>
        <span
          aria-hidden
          className="hidden size-10 shrink-0 place-items-center rounded-full border border-cream/40 transition-colors group-hover:bg-cream group-hover:text-ink sm:grid"
        >
          →
        </span>
      </div>
    </Link>
  );
}
