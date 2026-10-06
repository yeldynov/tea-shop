import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ArticleCard } from "@/components/article-card";
import { photos } from "@/lib/catalog";
import { articles } from "@/lib/journal";

export const metadata: Metadata = {
  title: "Journal",
  description: "Brewing guides, notes from the farms we buy from, and a primer or two on pu’er and oolong.",
};

export default function JournalPage() {
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
            Journal
          </li>
        </ol>
      </nav>

      <header className="mb-10 flex flex-col gap-4 md:mb-14">
        <p className="eyebrow">
          Notes from the tea table <span lang="zh-Hans" className="text-ink-faint not-italic">· 茶记</span>
        </p>
        <h1>The Journal</h1>
        <p className="lead max-w-2xl">
          Brewing guides, stories from the farms we buy from, and a primer or two for anyone
          starting out with pu’er and oolong.
        </p>
      </header>

      {/* The brewing guide is a standing page, so it leads rather than sitting in the dated list. */}
      <article className="group relative mb-section-sm grid overflow-hidden rounded-card bg-matcha-pale lg:grid-cols-2">
        <div className="relative aspect-4/3 lg:aspect-auto lg:min-h-96">
          <Image
            src={photos.gongfuPour.src}
            alt={photos.gongfuPour.alt}
            fill
            preload
            sizes="(min-width: 64rem) 40vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-104"
          />
        </div>
        <div className="flex flex-col justify-center gap-4 p-6 sm:p-10 lg:p-14">
          <span className="badge self-start">Guide</span>
          <h2 className="text-display-md">
            <Link href="/journal/brewing" className="after:absolute after:inset-0">
              Gongfu brewing, step by step
            </Link>
          </h2>
          <p>
            The vessels, the water, the timings: everything you need to brew pu’er, oolong and
            black tea the way it’s brewed where it’s grown.
          </p>
          <span className="link-arrow mt-2">
            Read the guide <span aria-hidden>→</span>
          </span>
        </div>
      </article>

      <ul className="grid-cards gap-y-12">
        {articles.map((article) => (
          <li key={article.slug}>
            <ArticleCard article={article} excerpt />
          </li>
        ))}
      </ul>
    </div>
  );
}
