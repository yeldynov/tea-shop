// Journal articles: static editorial content, kept in code rather than the database.
// The gongfu brewing guide has its own page at /journal/brewing.

import Link from "next/link";
import type { ReactNode } from "react";

import { photos, unsplash, type Photo } from "@/lib/catalog";

export type Article = {
  slug: string;
  title: string;
  kicker: string;
  readTime: string;
  /** ISO date. */
  published: string;
  excerpt: string;
  image: Photo;
  body: ReactNode;
};

const dateFormat = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(iso: string) {
  return dateFormat.format(new Date(iso));
}

/** Newest first. */
export const articles: Article[] = [
  {
    slug: "sheng-or-shou",
    title: "Sheng or shou? A first guide to pu’er",
    kicker: "Pu’er primer",
    readTime: "7 min read",
    published: "2026-09-22",
    excerpt:
      "Same leaf, same mountains, two very different teas. How raw and ripe pu’er are made, how they taste, and which to start with.",
    image: unsplash(
      "1683714548668-e03fedfa5a89",
      "A pu'er tea cake in a printed wrapper beside a clay teapot",
    ),
    body: (
      <>
        <p>
          Every pu’er starts the same way: large-leaf tea from Yunnan, picked, wilted, briefly
          pan-fired to stop most of the leaf’s enzymes, then rolled and dried in the sun. This is{" "}
          <em>maocha</em>, the rough tea that becomes both kinds of pu’er. What happens next splits
          the family in two.
        </p>

        <h2>Sheng: raw, and slow</h2>
        <p>
          <span lang="zh-Hans">生茶</span> sheng is maocha pressed into a cake and left alone. Young,
          it’s bright and bitter-sweet, closer to a green tea with a backbone: apricot, cut grass,
          a long sweet aftertaste the Chinese call <em>huigan</em>. Over years in a humid room it
          slowly darkens, the bitterness turns to depth, and notes of dried fruit, camphor and old
          wood appear. That transformation is why people buy sheng in cakes and wait.
        </p>

        <h2>Shou: ripe, and ready</h2>
        <p>
          <span lang="zh-Hans">熟茶</span> shou was invented in the 1970s to imitate aged sheng in
          weeks rather than decades. The maocha is piled, dampened and turned for around two months
          (<em>wo dui</em>, wet piling), a controlled fermentation that leaves the leaf dark and the
          tea smooth, earthy and sweet, with notes of cocoa, dates and forest floor. It’s ready to
          drink the day it’s pressed, though a few years of rest softens the piling taste.
        </p>

        <blockquote>
          Sheng is a tea you follow through time. Shou is a tea you come home to.
        </blockquote>

        <h2>Which first?</h2>
        <ul>
          <li>
            If you like black tea or coffee, start with shou. It’s forgiving: hot water, generous
            leaf, and it rarely turns bitter.
          </li>
          <li>
            If you like green tea or oolong, try a young sheng, and then an aged one beside it to
            taste what the years do.
          </li>
          <li>Either way, brew it gongfu-style: a lot of leaf, short steeps, many rounds.</li>
        </ul>
        <p>
          Our <Link href="/collections/puer">pu’er collection</Link> has both, and the{" "}
          <Link href="/journal/brewing">gongfu guide</Link> has leaf and timing for each.
        </p>
      </>
    ),
  },
  {
    slug: "reading-the-roast",
    title: "Reading the roast in Wuyi rock oolong",
    kicker: "Oolong",
    readTime: "6 min read",
    published: "2026-09-08",
    excerpt:
      "Charcoal, time and patience: why yancha is roasted, how to tell a light roast from a heavy one, and why a fresh roast needs to rest.",
    image: photos.clayPotPour,
    body: (
      <>
        <p>
          Wuyi <em>yancha</em>, rock tea, grows in pockets of soil between cliffs in northern
          Fujian. The minerality people talk about, <em>yan yun</em> or “rock rhyme”, comes from
          there. The fire comes from the maker. After shaping, the leaf is roasted over banked
          charcoal, sometimes several times across months, and that roast decides much of what ends
          up in the cup.
        </p>

        <h2>Light, medium, heavy</h2>
        <ul>
          <li>
            <strong>Light roast</strong> keeps the leaf greenish-brown and the cup golden: orchid,
            stone fruit, a cooling finish. Lovely fresh, less stable with age.
          </li>
          <li>
            <strong>Medium roast</strong> is where most classic Da Hong Pao sits: amber cup, toasted
            nuts, dark honey, minerals on the tongue.
          </li>
          <li>
            <strong>Heavy roast</strong> turns the leaf almost black: coffee, cocoa, burnt sugar.
            Good for keeping, and the base of most aged yancha.
          </li>
        </ul>

        <h2>Let it rest</h2>
        <p>
          Roasting leaves a sharp, smoky edge the Chinese call <em>huoqi</em>, “fire energy”. It
          fades over three to twelve months, and the tea rounds out as it does. We hold new roasts
          back until they’ve settled, and you can taste the difference by brewing the same tea in
          spring and again in autumn.
        </p>

        <blockquote>A good roast should feel warm, never burnt. If it scratches, wait.</blockquote>

        <h2>Brewing it</h2>
        <p>
          Use water straight off the boil and a preheated clay pot or gaiwan. Rock oolong opens best
          with 6–7 g per 100 ml and short, fast pours. Leave the lid off the empty pot for a moment
          between rounds and smell it: the aroma in the warm leaves tells you more about the roast
          than the cup does.
        </p>
      </>
    ),
  },
  {
    slug: "seasoning-yixing",
    title: "Seasoning your first Yixing teapot",
    kicker: "Teaware",
    readTime: "5 min read",
    published: "2026-08-19",
    excerpt:
      "A clay pot remembers every tea you brew in it. How to choose one, wake it up, and look after it for decades.",
    image: unsplash(
      "1685819039497-199e732ba7f3",
      "Clay teapots and cups on a tea table as tea is poured",
    ),
    body: (
      <>
        <p>
          Yixing pots are made from <em>zisha</em>, “purple sand” clay from Jiangsu. They’re left
          unglazed, so the clay stays slightly porous: it softens the water, holds heat, and over
          years takes on a little of every tea brewed in it. That’s why tea people keep one pot for
          one kind of tea.
        </p>

        <h2>Choose its tea first</h2>
        <p>
          Before seasoning, decide what the pot is for. Dense, high-fired clay suits aromatic teas
          like oolong; looser, thicker-walled pots suit pu’er and dark tea. A small pot, 100–150 ml,
          is the most useful for gongfu brewing.
        </p>

        <h2>Waking it up</h2>
        <ol>
          <li>Rinse inside and out with hot water. Never use soap or detergent, now or ever.</li>
          <li>
            Soak it in a clean pan of water and bring that slowly to a simmer, so the clay never
            meets a sudden temperature change. Simmer for 20 minutes.
          </li>
          <li>
            Add a handful of the tea you’ve chosen for the pot and simmer for another 20 minutes,
            then let everything cool together.
          </li>
          <li>Rinse, dry with the lid off, and brew your first real session.</li>
        </ol>

        <h2>Living with it</h2>
        <p>
          After each session, empty the leaves, rinse with hot water and leave the lid off until
          dry. Pour leftover tea over the outside now and then and wipe it with a soft cloth. The
          slow shine that builds up, the <em>patina</em>, is the pot’s own record of your tea.
        </p>
        <p>
          Browse our <Link href="/collections/teaware">teaware</Link> for pots matched to oolong and
          pu’er.
        </p>
      </>
    ),
  },
  {
    slug: "water-for-tea",
    title: "Water is the mother of tea",
    kicker: "Brewing",
    readTime: "4 min read",
    published: "2026-07-30",
    excerpt:
      "Ninety-nine percent of your cup is water. A few easy changes that make more difference than a better tea.",
    image: photos.warmVessels,
    body: (
      <>
        <p>
          A Ming dynasty writer put it plainly: “Tea’s nature is revealed through water. An
          eight-point tea in ten-point water becomes a ten-point tea; ten-point tea in eight-point
          water is only eight.” He was right, and it costs very little to act on.
        </p>

        <h2>Soft, but not empty</h2>
        <p>
          Hard tap water mutes aroma and leaves a film on the cup; distilled water tastes flat
          because there’s nothing to carry the flavour. What you want is soft water with a little
          mineral content. A simple carbon filter jug fixes most tap water. Low-mineral bottled
          spring water is better still for a special tea.
        </p>

        <h2>Fresh, and boiled once</h2>
        <ul>
          <li>Fill the kettle fresh each session. Water boiled again and again goes flat.</li>
          <li>
            Bring it just to a rolling boil, then cool it to the temperature the tea wants. For
            oolong and pu’er that means hardly at all.
          </li>
          <li>Pour from a little height for dense teas, gently down the side for delicate ones.</li>
        </ul>

        <blockquote>Try one tea with two waters, side by side. You won’t need convincing.</blockquote>

        <p>
          Temperatures for every kind of tea are in our{" "}
          <Link href="/journal/brewing">gongfu brewing guide</Link>.
        </p>
      </>
    ),
  },
  {
    slug: "spring-on-the-mountain",
    title: "Spring picking on the tea mountain",
    kicker: "From the farms",
    readTime: "4 min read",
    published: "2026-04-14",
    excerpt:
      "Two weeks in Yunnan during the first flush: early mornings, old trees, and why spring leaf is worth the wait.",
    image: unsplash(
      "1743401497688-5c3ab9b7447a",
      "A flowering tree among terraced tea bushes",
    ),
    body: (
      <>
        <p>
          The first flush on the old-tree gardens of Yunnan begins in late March, when the nights
          are still cold and the buds come slowly. That slowness is the point: leaf that grows
          through cool weather builds up sugars and aromatics that summer leaf never has.
        </p>

        <h2>The day starts early</h2>
        <p>
          Pickers are on the slopes by six, taking a bud and two leaves by hand. By mid-afternoon
          the baskets come down to the family’s workshop, where the leaf is spread to wilt on
          bamboo trays, wok-fired in the evening, rolled by hand and laid out to dry in the next
          morning’s sun.
        </p>

        <h2>Old trees, small lots</h2>
        <p>
          Some of the trees we buy from are a few hundred years old and taller than the houses
          beside them. They give little, so a farm’s whole spring picking from its oldest trees
          might be thirty kilos. We taste each day’s maocha in the workshop, gongfu-style, and
          choose the days we want to press.
        </p>

        <blockquote>
          “The tree decides how much. We only decide whether we were careful.”
        </blockquote>

        <p>
          Spring teas reach the shop from early summer, in our{" "}
          <Link href="/new-arrivals">new arrivals</Link>. Read more about{" "}
          <Link href="/about/sourcing">how we source</Link>.
        </p>
      </>
    ),
  },
];

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}
