// The original sample catalog, loaded into the database by `pnpm db:seed`.
import { unsplash, type Category, type Product } from "@/lib/catalog";

export type SeedProduct = Omit<Product, "id" | "category"> & {
  /** Category slug. */
  category: string;
};

/** In display order. */
export const seedCategories: Category[] = [
  {
    slug: "puer",
    name: "Pu’er",
    nameZh: "普洱",
    blurb: "Pressed cakes and aged leaf from Yunnan, deepening year by year.",
    image: unsplash(
      "1689067468083-2e5f44e43f40",
      "Cups of amber tea and a bowl of dark leaves on a carved wooden tray",
    ),
  },
  {
    slug: "oolong",
    name: "Oolong",
    nameZh: "乌龙",
    blurb: "Wuyi rock teas and Anxi rolled leaf.",
    image: unsplash(
      "1558160074-4d7d8bdf4256",
      "A glass cup of amber oolong beside a clay teapot",
    ),
  },
  {
    slug: "black-tea",
    name: "Black Tea",
    nameZh: "红茶",
    blurb: "Hong cha: honeyed, malty, golden-tipped.",
    image: unsplash(
      "1627764611688-2d07255e995e",
      "Twisted black tea leaves spilling from a red and white tin",
    ),
  },
  {
    slug: "green-tea",
    name: "Green Tea",
    nameZh: "绿茶",
    blurb: "Spring-picked Longjing and Biluochun.",
    image: unsplash(
      "1641997825980-cbaf406765db",
      "Flat green tea leaves in a bowl beside a teapot and two cups",
    ),
  },
  {
    slug: "white-tea",
    name: "White Tea",
    nameZh: "白茶",
    blurb: "Sun-withered buds and leaves from Fuding.",
    image: unsplash("1788963704659-ddbef83daecc", "Loose white tea leaves in shades of silver and amber"),
  },
  {
    slug: "teaware",
    name: "Teaware",
    nameZh: "茶具",
    blurb: "Yixing clay, gaiwans and gongfu sets.",
    image: unsplash("1765808270869-855ab9b7f5c4", "Clay teapots displayed on shelves"),
  },
];

export const seedProducts: SeedProduct[] = [
  {
    slug: "da-hong-pao",
    name: "Da Hong Pao",
    nameZh: "大红袍",
    category: "oolong",
    origin: "Wuyi Shan, Fujian",
    notes: ["Dark cherry", "Cocoa", "Mineral"],
    priceCents: 3600,
    unit: "50 g",
    badge: "Bestseller",
    stock: 24,
    description:
      "The “Big Red Robe” of the Wuyi cliffs. Grown in mineral-rich rock soil, then roasted slowly over charcoal in several passes. Deep and warming, with the stony finish known as yan yun — rock rhyme — that keeps unfolding cup after cup.",
    details: [
      { term: "Harvest", detail: "Spring 2024" },
      { term: "Processing", detail: "Medium charcoal roast" },
      { term: "Caffeine", detail: "Medium" },
    ],
    brew: { leaf: "7 g", water: "100 °C", time: "5–10 s", infusions: "8+" },
    image: unsplash("1600974712780-9dc8659e89f7", "Dark, twisted rock oolong leaves"),
    gallery: [
      unsplash("1571505463102-48bae91c6028", "Dark tea poured from a clay teapot into a glass pitcher"),
      unsplash("1558160074-4d7d8bdf4256", "A glass cup of amber oolong beside a clay teapot"),
    ],
  },
  {
    slug: "gong-ting-shou-puer",
    name: "Gong Ting Shou Pu’er",
    nameZh: "宫廷熟普",
    category: "puer",
    origin: "Menghai, Yunnan",
    notes: ["Forest floor", "Dates", "Velvet"],
    priceCents: 2800,
    unit: "100 g",
    stock: 40,
    description:
      "“Palace grade” ripe pu’er, made only from the smallest buds. Smooth and syrupy with no roughness, it pours an inky red-brown and tastes of dates, damp earth and dark chocolate. A forgiving tea for beginners and a daily comfort for everyone else.",
    details: [
      { term: "Harvest", detail: "2019, loose leaf" },
      { term: "Processing", detail: "Wo dui fermented" },
      { term: "Caffeine", detail: "Medium" },
    ],
    brew: { leaf: "6 g", water: "100 °C", time: "8–15 s", infusions: "10+" },
    image: unsplash("1733138187329-1663b79464b3", "Fine, dark ripe pu'er leaves"),
    gallery: [
      unsplash("1689067468083-2e5f44e43f40", "Cups of amber tea and a bowl of dark leaves on a carved tray"),
      unsplash("1685819039497-199e732ba7f3", "Clay teapots and cups on a tea table as tea is poured"),
    ],
  },
  {
    slug: "dian-hong",
    name: "Golden Dian Hong",
    nameZh: "滇红",
    category: "black-tea",
    origin: "Fengqing, Yunnan",
    notes: ["Honey", "Sweet potato", "Malt"],
    priceCents: 2200,
    unit: "50 g",
    stock: 18,
    description:
      "Downy golden buds from old-growth Yunnan bushes. Rich and rounded, with baked sweet potato, honey and a gentle cocoa finish — no bitterness, even when brewed strong. Lovely gongfu-style, generous in a mug.",
    details: [
      { term: "Harvest", detail: "Spring 2024" },
      { term: "Processing", detail: "Fully oxidised" },
      { term: "Caffeine", detail: "Medium–high" },
    ],
    brew: { leaf: "5 g", water: "90–95 °C", time: "10–15 s", infusions: "6+" },
    image: unsplash("1604697976842-d36fa5a1b2ed", "Golden-tipped Yunnan black tea leaves"),
    gallery: [
      unsplash("1601230469955-ca57578ba056", "Tea poured from a dark teapot into a white cup"),
      unsplash("1627764611688-2d07255e995e", "Twisted black tea leaves spilling from a tin"),
    ],
  },
  {
    slug: "tieguanyin",
    name: "Tieguanyin",
    nameZh: "铁观音",
    category: "oolong",
    origin: "Anxi, Fujian",
    notes: ["Orchid", "Lilac", "Cream"],
    priceCents: 2600,
    unit: "50 g",
    badge: "New",
    stock: 4,
    description:
      "The “Iron Goddess of Mercy”, rolled into tight jade pearls that unfurl into whole leaves in the pot. A lightly oxidised, floral style: orchid and lilac up front, a creamy body and a sweet, lingering throat.",
    details: [
      { term: "Harvest", detail: "Autumn 2024" },
      { term: "Processing", detail: "Light oxidation, unroasted" },
      { term: "Caffeine", detail: "Medium" },
    ],
    brew: { leaf: "7 g", water: "95 °C", time: "15–20 s", infusions: "7+" },
    image: unsplash("1674141833226-9a28eb5935b4", "Tightly rolled green oolong leaves"),
    gallery: [
      unsplash("1674749232554-2ac15ced3954", "A clay teapot and two cups of amber tea on a tray"),
    ],
  },
  {
    slug: "menghai-sheng-cake-2015",
    name: "2015 Menghai Sheng Cake",
    nameZh: "勐海生饼",
    category: "puer",
    origin: "Menghai, Yunnan",
    notes: ["Apricot", "Camphor", "Long finish"],
    priceCents: 8500,
    unit: "357 g cake",
    badge: "Limited",
    stock: 3,
    description:
      "A stone-pressed raw pu’er cake, stored for nine years in dry Kunming conditions. The early bitterness has softened into apricot and honey, with a hint of camphor and a finish that stays for minutes. Drink it now or keep it — it will keep changing.",
    details: [
      { term: "Harvest", detail: "Spring 2015" },
      { term: "Processing", detail: "Sun-dried, stone-pressed" },
      { term: "Storage", detail: "Dry Kunming, 9 years" },
    ],
    brew: { leaf: "6 g", water: "95–100 °C", time: "5–10 s", infusions: "12+" },
    image: unsplash("1683714548668-e03fedfa5a89", "A pu'er tea cake in a printed wrapper beside a clay teapot"),
    gallery: [
      unsplash("1689067468083-2e5f44e43f40", "Cups of amber tea and a bowl of dark leaves on a carved tray"),
    ],
  },
  {
    slug: "bai-mu-dan",
    name: "Bai Mu Dan",
    nameZh: "白牡丹",
    category: "white-tea",
    origin: "Fuding, Fujian",
    notes: ["Hay", "Melon", "Honeysuckle"],
    priceCents: 2400,
    unit: "50 g",
    badge: "New",
    stock: 30,
    description:
      "“White Peony”: one silver bud and two young leaves, simply withered in the sun and air. Soft and sweet, with fresh hay, ripe melon and honeysuckle. Very gentle — hard to over-brew, and good cold-brewed in summer.",
    details: [
      { term: "Harvest", detail: "Spring 2024" },
      { term: "Processing", detail: "Withered, dried" },
      { term: "Caffeine", detail: "Low–medium" },
    ],
    brew: { leaf: "5 g", water: "85–90 °C", time: "20–30 s", infusions: "6+" },
    image: unsplash("1788963704659-ddbef83daecc", "Loose white tea leaves in shades of silver and amber"),
    gallery: [
      unsplash("1763824371971-cf1b3a1f859c", "A white gaiwan and cups on a dark background"),
    ],
  },
  {
    slug: "xihu-longjing",
    name: "Xi Hu Longjing",
    nameZh: "西湖龙井",
    category: "green-tea",
    origin: "West Lake, Zhejiang",
    notes: ["Chestnut", "Snap pea", "Butter"],
    priceCents: 3200,
    unit: "50 g",
    stock: 0,
    restock: "Next harvest arrives in April",
    description:
      "“Dragon Well” from the hills around West Lake, pan-fired by hand into flat, sword-shaped leaves. Toasty chestnut and fresh snap pea over a buttery, rounded body. Brew in glass or a gaiwan, a little cooler than you think.",
    details: [
      { term: "Harvest", detail: "Before Qingming, 2024" },
      { term: "Processing", detail: "Hand pan-fired" },
      { term: "Caffeine", detail: "Medium" },
    ],
    brew: { leaf: "4 g", water: "80 °C", time: "30–45 s", infusions: "3–4" },
    image: unsplash("1760074057731-83e375873eb5", "Flat, sword-shaped dried green tea leaves"),
    gallery: [
      unsplash("1641997825980-cbaf406765db", "Green tea leaves in a bowl beside a teapot and two cups"),
    ],
  },
  {
    slug: "yixing-teapot",
    name: "Yixing Zisha Teapot",
    nameZh: "紫砂壶",
    category: "teaware",
    origin: "Yixing, Jiangsu",
    notes: ["120 ml", "Purple clay"],
    priceCents: 12000,
    unit: "Each",
    stock: 2,
    description:
      "Hand-built from zisha purple clay, which stays unglazed so it slowly seasons with the tea you brew. A classic, compact shape for gongfu brewing, with a fast, clean pour. Dedicate it to one family of tea — rock oolong or shou pu’er are ideal.",
    details: [
      { term: "Capacity", detail: "120 ml" },
      { term: "Material", detail: "Zisha purple clay" },
      { term: "Care", detail: "Rinse with hot water only" },
    ],
    image: unsplash("1532136868905-8094ef8ef5f2", "A small clay teapot and cup on a wooden bench"),
    gallery: [
      unsplash("1765808270869-855ab9b7f5c4", "Clay teapots displayed on shelves"),
      unsplash("1685819039497-199e732ba7f3", "Clay teapots and cups on a tea table"),
    ],
  },
  {
    slug: "red-glaze-gaiwan",
    name: "Red Glaze Gaiwan",
    nameZh: "盖碗",
    category: "teaware",
    origin: "Jingdezhen, Jiangxi",
    notes: ["110 ml", "Porcelain"],
    priceCents: 3800,
    unit: "Each",
    badge: "New",
    stock: 12,
    description:
      "A lidded bowl in Jingdezhen porcelain with a deep red glaze. Porcelain doesn’t hold flavour, so one gaiwan can brew every tea you own — the most versatile tool on a gongfu table.",
    details: [
      { term: "Capacity", detail: "110 ml" },
      { term: "Material", detail: "Glazed porcelain" },
      { term: "Care", detail: "Dishwasher safe" },
    ],
    image: unsplash("1782385224830-b801d8369a6b", "A red-glazed gaiwan with lid and saucer"),
    gallery: [
      unsplash("1649868592193-f1474cb13be9", "A hand lifting the lid of a porcelain gaiwan"),
    ],
  },
  {
    slug: "celadon-gaiwan",
    name: "Celadon Gaiwan",
    nameZh: "青瓷盖碗",
    category: "teaware",
    origin: "Longquan, Zhejiang",
    notes: ["120 ml", "Celadon glaze"],
    priceCents: 4200,
    unit: "Each",
    stock: 9,
    description:
      "A pale jade celadon glaze from Longquan kilns, thick and soft to the touch. It shows off the colour of green and white teas beautifully and is just as happy with oolong.",
    details: [
      { term: "Capacity", detail: "120 ml" },
      { term: "Material", detail: "Celadon-glazed porcelain" },
      { term: "Care", detail: "Hand wash recommended" },
    ],
    image: unsplash("1546852199-2d8e8c4aaada", "A pale green lidded gaiwan holding tea leaves"),
  },
  {
    slug: "gongfu-set",
    name: "Gongfu Tray Set",
    nameZh: "功夫茶具",
    category: "teaware",
    origin: "Pot, two cups & tray",
    notes: ["Clay", "Bamboo tray"],
    priceCents: 6400,
    unit: "Set",
    stock: 7,
    description:
      "Everything for a first gongfu session: a small clay pot, two cups and a slatted bamboo tray that catches every overflow. Compact enough for a desk or a picnic.",
    details: [
      { term: "Includes", detail: "Teapot, 2 cups, tray" },
      { term: "Material", detail: "Clay, bamboo" },
      { term: "Care", detail: "Dry the tray after use" },
    ],
    image: unsplash("1674749232554-2ac15ced3954", "A clay teapot and two cups of amber tea on a tray"),
    gallery: [
      unsplash("1629440408433-a9e951bfbcd8", "Hot water poured from a kettle into a small clay cup"),
    ],
  },
];
