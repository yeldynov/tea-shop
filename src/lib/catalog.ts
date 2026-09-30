// Catalog types and helpers. Products and categories live in the database
// (see `catalog-queries.ts`); editorial content below is still static.

export type Photo = {
  src: string;
  alt: string;
};

export type Category = {
  slug: string;
  name: string;
  nameZh: string;
  blurb: string;
  image: Photo;
};

export type Product = {
  slug: string;
  name: string;
  nameZh?: string;
  category: Category;
  origin: string;
  notes: string[];
  /** In cents. */
  priceCents: number;
  unit: string;
  badge?: "New" | "Limited" | "Bestseller";
  /** Units available; 0 means sold out. */
  stock: number;
  /** Shown when sold out, e.g. when the next harvest arrives. */
  restock?: string;
  description: string;
  details: { term: string; detail: string }[];
  /** Gongfu brewing parameters; teas only. */
  brew?: { leaf: string; water: string; time: string; infusions: string };
  image: Photo;
  /** Extra imagery after the main image on the product page. */
  gallery?: Photo[];
};

export type Article = {
  slug: string;
  title: string;
  kicker: string;
  readTime: string;
  image: Photo;
};

export function unsplash(id: string, alt: string): Photo {
  return {
    src: `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=2400&q=80`,
    alt,
  };
}

export const photos = {
  heroMountain: unsplash("1626173842682-f5a3e20d4b9c", "A forested mountain wrapped in drifting mist"),
  teaPickers: unsplash(
    "1743401462369-44e568d93027",
    "Pickers harvesting tea across a lush green hillside",
  ),
  clayPotPour: unsplash(
    "1571505463102-48bae91c6028",
    "Dark tea poured from a clay teapot into a glass pitcher by candlelight",
  ),
  warmVessels: unsplash(
    "1629440408433-a9e951bfbcd8",
    "Hot water poured from a kettle into a small clay cup",
  ),
  gaiwanLid: unsplash(
    "1649868592193-f1474cb13be9",
    "A hand lifting the lid of a blue porcelain gaiwan",
  ),
  gongfuPour: unsplash(
    "1531969179221-3946e6b5a5e7",
    "Steaming tea poured over a row of small white cups",
  ),
} satisfies Record<string, Photo>;

export type StockState = "in-stock" | "low-stock" | "sold-out";

export const LOW_STOCK_THRESHOLD = 5;

export function stockState(product: Product): StockState {
  if (product.stock <= 0) return "sold-out";
  if (product.stock <= LOW_STOCK_THRESHOLD) return "low-stock";
  return "in-stock";
}

/** Homepage picks; bestsellers should come from order data once it exists. */
export const merchandising = {
  bestsellers: ["da-hong-pao", "gong-ting-shou-puer", "dian-hong", "tieguanyin"],
  spotlight: "da-hong-pao",
  newArrival: "menghai-sheng-cake-2015",
};

export const articles: Article[] = [
  {
    slug: "sheng-or-shou",
    title: "Sheng or shou? A first guide to pu’er",
    kicker: "Pu’er primer",
    readTime: "7 min read",
    image: unsplash(
      "1683714548668-e03fedfa5a89",
      "A pu'er tea cake in a printed wrapper beside a clay teapot",
    ),
  },
  {
    slug: "seasoning-yixing",
    title: "Seasoning your first Yixing teapot",
    kicker: "Teaware",
    readTime: "5 min read",
    image: unsplash(
      "1685819039497-199e732ba7f3",
      "Clay teapots and cups on a tea table as tea is poured",
    ),
  },
  {
    slug: "spring-on-the-mountain",
    title: "Spring picking on the tea mountain",
    kicker: "From the farms",
    readTime: "4 min read",
    image: unsplash(
      "1743401497688-5c3ab9b7447a",
      "A flowering tree among terraced tea bushes",
    ),
  },
];

const priceFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatPrice(cents: number) {
  return priceFormat.format(cents / 100);
}
