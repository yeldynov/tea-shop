import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Disclosure } from "@/components/disclosure";
import { photos } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Gongfu brewing guide",
  description:
    "How to brew Chinese tea gongfu-style: the vessels, the water, step-by-step method and a brewing chart for every kind of tea.",
};

const tools = [
  {
    name: "Gaiwan or small teapot",
    zh: "盖碗",
    body: "100–150 ml. A porcelain gaiwan suits every tea; a clay pot rewards the one tea you love most.",
  },
  {
    name: "Fair cup",
    zh: "公道杯",
    body: "A small pitcher. Decant every infusion into it so each cup gets the same strength.",
  },
  {
    name: "Tasting cups",
    zh: "品茗杯",
    body: "Thimble-sized, a few sips each. Small cups keep the tea hot and the attention on it.",
  },
  {
    name: "Kettle and scale",
    zh: "水壶",
    body: "Fresh, soft water at the right heat, and a pocket scale until you can judge leaf by eye.",
  },
];

const steps = [
  {
    title: "Warm the vessels",
    body: "Pour boiling water through the gaiwan, fair cup and cups, then discard it. Cold porcelain steals heat from the first, most aromatic infusions.",
    image: photos.warmVessels,
  },
  {
    title: "Weigh in the leaf",
    body: "Far more than for a mug: 5–7 g per 100 ml. Drop it into the warm, empty gaiwan, put the lid on and shake gently, then lift the lid and smell the dry leaf waking up.",
    image: photos.gaiwanLid,
  },
  {
    title: "Rinse",
    body: "Cover the leaf with hot water and pour it straight off. This opens rolled oolong and pressed pu’er so the first real infusion isn’t thin. Green and white teas can skip it.",
    image: photos.clayPotPour,
  },
  {
    title: "Pour short, pour often",
    body: "Fill, wait a few seconds, then decant completely into the fair cup and pour for everyone. Leave no water on the leaf between rounds, or it stews.",
    image: photos.gongfuPour,
  },
];

const chart = [
  { tea: "Green", leaf: "4 g", water: "80–85°C", first: "10 s", rounds: "3–4", href: "/collections/green-tea" },
  { tea: "White", leaf: "5 g", water: "90°C", first: "15 s", rounds: "6–8", href: "/collections/white-tea" },
  { tea: "Rolled oolong", leaf: "6 g", water: "95°C", first: "15 s", rounds: "6–8", href: "/collections/oolong" },
  { tea: "Rock oolong", leaf: "7 g", water: "100°C", first: "5 s", rounds: "7–9", href: "/collections/oolong" },
  { tea: "Black tea", leaf: "5 g", water: "90–95°C", first: "8 s", rounds: "5–6", href: "/collections/black-tea" },
  { tea: "Sheng pu’er", leaf: "7 g", water: "95°C", first: "5 s", rounds: "10+", href: "/collections/puer" },
  { tea: "Shou pu’er", leaf: "7 g", water: "100°C", first: "8 s", rounds: "10+", href: "/collections/puer" },
];

const fixes = [
  {
    q: "The tea is bitter or harsh",
    a: "Shorten the steep first, then lower the water a few degrees. Bitterness usually means the leaf sat in water too long, not that there was too much of it.",
  },
  {
    q: "The tea is thin and watery",
    a: "Use more leaf rather than longer steeps. Gongfu tastes full because of the leaf-to-water ratio; stretching the time only pulls out tannins.",
  },
  {
    q: "It was good, then suddenly flat",
    a: "The leaf is tiring. Add 5–10 seconds per round from about the fourth infusion, and more as the session goes on. When even a long steep tastes faint, you’ve had it all.",
  },
  {
    q: "I don’t have a gaiwan",
    a: "Any small teapot with a strainer works, or a mug with a fine sieve: keep the ratio and pour the tea off completely each time.",
  },
];

export default function BrewingGuidePage() {
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
            <li>
              <Link href="/journal" className="link-quiet">
                Journal
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-ink">
              Gongfu brewing
            </li>
          </ol>
        </nav>

        <header className="split">
          <div className="flex flex-col gap-4">
            <p className="eyebrow">
              Gongfu cha{" "}
              <span lang="zh-Hans" className="text-ink-faint not-italic">
                · 功夫茶
              </span>
            </p>
            <h1>Gongfu brewing</h1>
            <p className="lead max-w-xl">
              Gongfu means “done with skill and time”. A lot of leaf in a small vessel, many short
              infusions, each one tasting a little different from the last. It’s how tea is brewed
              where it’s grown, and it’s easier than it looks.
            </p>
          </div>
          <div className="media aspect-4/3 rounded-card">
            <Image
              src={photos.gaiwanLid.src}
              alt={photos.gaiwanLid.alt}
              fill
              preload
              sizes="(min-width: 64rem) 40vw, 100vw"
            />
          </div>
        </header>
      </div>

      <section className="container-page section">
        <div className="mb-10 flex flex-col gap-3 md:mb-14">
          <p className="eyebrow">Before you start</p>
          <h2>What you’ll need</h2>
        </div>
        <ul className="grid gap-grid sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => (
            <li key={tool.name} className="card flex flex-col gap-3 p-6">
              <span lang="zh-Hans" className="font-display text-display-md text-matcha">
                {tool.zh}
              </span>
              <h3 className="text-display-sm">{tool.name}</h3>
              <p>{tool.body}</p>
            </li>
          ))}
        </ul>
        <Link href="/collections/teaware" className="link-arrow mt-8">
          Shop teaware <span aria-hidden>→</span>
        </Link>
      </section>

      <section className="bg-cream section">
        <div className="container-page">
          <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center gap-4 text-center md:mb-16">
            <p className="eyebrow">The method</p>
            <h2>One session, four steps</h2>
          </div>

          <ol className="grid gap-10 md:grid-cols-2 md:gap-x-grid md:gap-y-16 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="grid grid-cols-[6.5rem_1fr] items-start gap-5 md:flex md:flex-col md:items-stretch"
              >
                <div className="media">
                  <Image
                    src={step.image.src}
                    alt={step.image.alt}
                    fill
                    sizes="(min-width: 64rem) 22vw, (min-width: 48rem) 45vw, 7rem"
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
        </div>
      </section>

      <section className="container-wide section">
        <div className="panel bg-matcha-pale">
          <div className="mx-auto flex max-w-(--container-page) flex-col gap-10">
            <div className="flex flex-col gap-3">
              <p className="eyebrow">Per 100 ml of water</p>
              <h2 className="text-display-md">Brewing chart</h2>
              <p className="max-w-2xl">
                A starting point, not a rule. Add 3–5 seconds each round, and trust your tongue over
                the timer. Every tea in the shop lists its own parameters too.
              </p>
            </div>

            <div className="-mx-2 overflow-x-auto px-2">
              <table className="w-full min-w-[36rem] text-left">
                <thead>
                  <tr className="border-b border-matcha/25">
                    <th scope="col" className="label pb-3 text-matcha-deep">
                      Tea
                    </th>
                    <th scope="col" className="label pb-3 text-matcha-deep">
                      Leaf
                    </th>
                    <th scope="col" className="label pb-3 text-matcha-deep">
                      Water
                    </th>
                    <th scope="col" className="label pb-3 text-matcha-deep">
                      First steep
                    </th>
                    <th scope="col" className="label pb-3 text-matcha-deep">
                      Infusions
                    </th>
                  </tr>
                </thead>
                <tbody className="price">
                  {chart.map((row) => (
                    <tr key={row.tea} className="border-b border-matcha/25 last:border-0">
                      <th scope="row" className="py-4 pr-4 font-display text-xl font-normal text-ink">
                        <Link href={row.href} className="link-quiet">
                          {row.tea}
                        </Link>
                      </th>
                      <td className="py-4 pr-4">{row.leaf}</td>
                      <td className="py-4 pr-4">{row.water}</td>
                      <td className="py-4 pr-4">{row.first}</td>
                      <td className="py-4">{row.rounds}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page pb-section">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="flex flex-col gap-3">
            <p className="eyebrow">When it goes wrong</p>
            <h2>Adjusting the cup</h2>
            <p className="mt-2 max-w-md">
              Every tea, kettle and palate is a little different. Change one thing at a time.
            </p>
          </div>
          <div>
            {fixes.map((fix) => (
              <Disclosure key={fix.q} title={fix.q}>
                <p>{fix.a}</p>
              </Disclosure>
            ))}
          </div>
        </div>

        <div className="mt-section-sm flex flex-col items-center gap-5 border-t pt-section-sm text-center">
          <p className="eyebrow">Ready to pour?</p>
          <h2 className="text-display-md">Start with a tea that forgives</h2>
          <p className="max-w-xl">
            Shou pu’er and rock oolong are hard to over-brew: good places to learn the rhythm.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Link href="/collections/puer" className="btn-primary">
              Shop pu’er
            </Link>
            <Link href="/collections/oolong" className="btn-outline">
              Shop oolong
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
