import Image from "next/image";
import Link from "next/link";

import { ArticleCard } from "@/components/article-card";
import { NewsletterForm } from "@/components/home/newsletter-form";
import { photos } from "@/lib/catalog";
import { articles } from "@/lib/journal";

export const promises = [
  { figure: "18", label: "small farms in Yunnan and Fujian we buy from directly" },
  { figure: "15 yrs", label: "the oldest pu’er resting in our cellar" },
  { figure: "100%", label: "of teas tasted gongfu-style before they’re listed" },
];

export function GardenStory() {
  return (
    <section className="section">
      <div className="container-wide">
        <div className="relative isolate flex min-h-[32rem] items-center justify-center overflow-hidden rounded-card px-6 py-20 text-center md:min-h-[40rem] md:rounded-panel">
          <Image
            src={photos.teaPickers.src}
            alt={photos.teaPickers.alt}
            fill
            sizes="100vw"
            className="-z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-ink/45" />
          <div className="flex max-w-3xl flex-col items-center gap-6 text-cream">
            <p className="eyebrow text-cream/80">From the tea mountains</p>
            <p className="font-display text-display-lg leading-[1.1] font-light text-balance text-cream italic">
              “A good pu’er keeps changing for decades. We buy from people who think in decades too.”
            </p>
            <Link href="/about/sourcing" className="btn-glass mt-2">
              How we source
            </Link>
          </div>
        </div>
      </div>

      <dl className="container-page mt-12 grid gap-8 sm:grid-cols-3 md:mt-16">
        {promises.map((p) => (
          <div key={p.label} className="flex flex-col gap-2 border-t pt-6">
            <dt className="order-2 max-w-60 text-ink-soft">{p.label}</dt>
            <dd className="order-1 font-display text-display-lg text-matcha">{p.figure}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

const steps = [
  {
    title: "Warm the vessels",
    body: "Pour boiling water over the gaiwan or clay pot and cups, so every infusion stays hot.",
    image: photos.warmVessels,
  },
  {
    title: "Awaken the leaves",
    body: "A quick rinse, poured straight off, opens tightly rolled oolong and pressed pu’er.",
    image: photos.gaiwanLid,
  },
  {
    title: "Pour short, pour often",
    body: "Plenty of leaf, five-second steeps, a little longer each round — good tea gives eight or more.",
    image: photos.gongfuPour,
  },
];

export function BrewingRitual() {
  return (
    <section className="bg-cream section">
      <div className="container-page">
        <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center gap-4 text-center md:mb-16">
          <p className="eyebrow">
            Gongfu cha <span lang="zh-Hans">· 功夫茶</span>
          </p>
          <h2>Brewing with patience, in three steps</h2>
        </div>

        <ol className="grid gap-10 md:grid-cols-3 md:gap-grid">
          {steps.map((step, i) => (
            // Compact thumbnail + text on phones; image-led column from md up.
            <li
              key={step.title}
              className="grid grid-cols-[6.5rem_1fr] items-start gap-5 md:flex md:flex-col md:items-stretch"
            >
              <div className="media">
                <Image
                  src={step.image.src}
                  alt={step.image.alt}
                  fill
                  sizes="(min-width: 48rem) 30vw, 7rem"
                />
              </div>
              <div className="flex gap-4">
                <span className="font-display text-display-md text-matcha italic" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-2 pt-1.5">
                  <h3 className="text-display-sm">{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex justify-center md:mt-16">
          <Link href="/journal/brewing" className="btn-outline">
            Read the brewing guides
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Journal() {
  return (
    <section className="container-page section">
      <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-3">
          <p className="eyebrow">Notes from the tea table</p>
          <h2>The Journal</h2>
        </div>
        <Link href="/journal" className="link-arrow">
          All stories <span aria-hidden>→</span>
        </Link>
      </div>

      <ul className="grid-cards">
        {articles.slice(0, 3).map((article) => (
          <li key={article.slug}>
            <ArticleCard article={article} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Newsletter() {
  return (
    <section className="container-wide pb-section">
      <div className="panel bg-sakura">
        <div className="mx-auto flex max-w-(--container-page) flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-xl flex-col gap-3">
            <p className="eyebrow">Letters, not spam</p>
            <h2 className="text-display-md">New harvests and rare cakes, first</h2>
            <p>
              A short note when spring teas arrive or an aged cake leaves the cellar, with brewing
              notes and early access for subscribers.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
