import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { promises } from "@/components/home/editorial";
import { photos, unsplash } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Our sourcing",
  description:
    "We buy directly from small farms in Yunnan and Fujian, taste every lot gongfu-style, and age our pu’er in our own cellar.",
};

const principles = [
  {
    title: "Directly from the farm",
    body: "No auctions, no brokers. We buy from families we know by name, most of them for years, and go back each spring to taste and choose in person.",
  },
  {
    title: "Tasted before it’s listed",
    body: "Every lot is brewed gongfu-style, side by side with the last harvest. If it isn’t better, or at least as good, it doesn’t come home with us.",
  },
  {
    title: "Paid for what it’s worth",
    body: "We agree prices before the harvest and pay on pickup, not on sale. Small farms can’t wait for a shop’s cash flow.",
  },
  {
    title: "Rested, not rushed",
    body: "Pu’er goes to our cellar to age at a steady humidity; roasted oolong waits until its fire has settled. We sell tea when it’s ready.",
  },
];

const regions = [
  {
    name: "Yunnan",
    zh: "云南",
    teas: "Pu’er, Dian hong black tea",
    body: "In the southwest, on the border with Laos and Myanmar, old tea trees grow among the forest on the Menghai and Lincang mountains. Our sheng and shou pu’er come from family workshops here, pressed from single-mountain maocha we choose by the day, and so do the golden-tipped Dian hong black teas.",
    image: unsplash("1683714548668-e03fedfa5a89", "A pu'er tea cake in a printed wrapper beside a clay teapot"),
    links: [
      { label: "Pu’er", href: "/collections/puer" },
      { label: "Black tea", href: "/collections/black-tea" },
    ],
  },
  {
    name: "Fujian",
    zh: "福建",
    teas: "Rock oolong, Tieguanyin, white tea",
    body: "On the southeast coast, three valleys and three styles. Rock oolong from the cliffs of the Wuyi mountains, charcoal-roasted by hand; Tieguanyin from Anxi, rolled tight and orchid-sweet; and Bai Mu Dan white tea from Fuding, simply withered and dried in the sun.",
    image: photos.clayPotPour,
    links: [
      { label: "Oolong", href: "/collections/oolong" },
      { label: "White tea", href: "/collections/white-tea" },
    ],
  },
];

const year = [
  { season: "Spring", months: "Mar – May", body: "First flush. We’re in Yunnan and Fujian, tasting maocha and choosing lots." },
  { season: "Summer", months: "Jun – Aug", body: "Spring teas arrive. Rock oolong is roasted, then rests." },
  { season: "Autumn", months: "Sep – Nov", body: "Autumn oolong picking. Last year’s roasts are ready to drink." },
  { season: "Winter", months: "Dec – Feb", body: "The farms rest. We taste through the cellar and plan next spring." },
];

export default function SourcingPage() {
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
              Our sourcing
            </li>
          </ol>
        </nav>
      </div>

      <section className="container-wide">
        <div className="relative isolate flex min-h-[28rem] items-end overflow-hidden rounded-card px-6 py-12 md:min-h-[36rem] md:rounded-panel md:px-14 md:py-16">
          <Image
            src={photos.teaPickers.src}
            alt={photos.teaPickers.alt}
            fill
            preload
            sizes="100vw"
            className="-z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-linear-to-t from-ink/70 via-ink/25 to-transparent" />
          <div className="flex max-w-3xl flex-col gap-4 text-cream">
            <p className="eyebrow text-cream/80">
              Our sourcing <span lang="zh-Hans">· 茶源</span>
            </p>
            <h1 className="heading-hero text-cream">From the people who grow it</h1>
          </div>
        </div>
      </section>

      <section className="container-page section">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <p className="font-display text-display-md leading-snug text-ink italic">
            “A good pu’er keeps changing for decades. We buy from people who think in decades too.”
          </p>
          <div className="flex flex-col gap-5 text-lg">
            <p>
              We’re a small shop, and we buy like one. Instead of a catalogue of a hundred teas from
              a wholesaler, we keep a short list from a handful of farms in Yunnan and Fujian, the
              two provinces whose teas we love most.
            </p>
            <p>
              Most of the families we work with pick, process and press their own leaf. We visit
              every spring, taste with them, and buy the days we like best. That means small lots,
              teas that sell out, and a shelf that changes with the seasons. We think that’s how tea
              should be.
            </p>
          </div>
        </div>

        <dl className="mt-12 grid gap-8 sm:grid-cols-3 md:mt-16">
          {promises.map((p) => (
            <div key={p.label} className="flex flex-col gap-2 border-t pt-6">
              <dt className="order-2 max-w-60 text-ink-soft">{p.label}</dt>
              <dd className="order-1 font-display text-display-lg text-matcha">{p.figure}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-cream section">
        <div className="container-page">
          <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center gap-4 text-center md:mb-16">
            <p className="eyebrow">What we hold to</p>
            <h2>Four promises</h2>
          </div>
          <ol className="grid gap-grid sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((p, i) => (
              <li key={p.title} className="card flex flex-col gap-3 bg-paper p-6">
                <span className="font-display text-display-md text-matcha italic" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-display-sm">{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-page section flex flex-col gap-section-sm">
        <div className="flex flex-col gap-3">
          <p className="eyebrow">Where it comes from</p>
          <h2>Two provinces, five valleys</h2>
        </div>
        {regions.map((r, i) => (
          <article key={r.name} className="split">
            <div className={`media aspect-4/3 rounded-card ${i % 2 ? "lg:order-2" : ""}`}>
              <Image src={r.image.src} alt={r.image.alt} fill sizes="(min-width: 64rem) 45vw, 100vw" />
            </div>
            <div className="flex flex-col gap-4">
              <p className="label text-ink-faint">{r.teas}</p>
              <h3 className="text-display-lg">
                {r.name}{" "}
                <span lang="zh-Hans" className="text-ink-faint">
                  {r.zh}
                </span>
              </h3>
              <p className="max-w-xl text-lg">{r.body}</p>
              <ul className="mt-2 flex flex-wrap gap-2.5">
                {r.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="btn-soft btn-sm">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>

      <section className="container-wide pb-section">
        <div className="panel bg-yuzu">
          <div className="mx-auto flex max-w-(--container-page) flex-col gap-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col gap-3">
                <p className="eyebrow">The tea year</p>
                <h2 className="text-display-md">Why the shelf changes</h2>
              </div>
              <Link href="/new-arrivals" className="link-arrow">
                See what’s new <span aria-hidden>→</span>
              </Link>
            </div>
            <ol className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {year.map((s) => (
                <li key={s.season} className="flex flex-col gap-2 border-t border-ink/20 pt-5">
                  <p className="label text-ink-soft">{s.months}</p>
                  <h3 className="text-display-sm">{s.season}</h3>
                  <p className="text-ink-soft">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="container-page mt-section-sm flex flex-col items-center gap-5 text-center">
          <h2 className="text-display-md">Taste the difference</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/shop" className="btn-primary">
              Shop all tea
            </Link>
            <Link href="/journal/spring-on-the-mountain" className="btn-outline">
              Read: spring on the mountain
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
