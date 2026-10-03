// Self-check for admin form parsing: `pnpm tsx src/lib/admin-forms.check.ts`.
import assert from "node:assert/strict";

import { parseCategoryForm, parsePriceCents, parseProductForm, parseStockForm } from "./admin-forms";

const img = "https://images.unsplash.com/photo-1600974712780-9dc8659e89f7?w=2400";
const form = (fields: Record<string, string>) => {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
};

assert.equal(parsePriceCents("18"), 1800);
assert.equal(parsePriceCents("18.5"), 1850);
assert.equal(parsePriceCents("$18.05"), 1805);
assert.equal(parsePriceCents("0.07"), 7);
assert.equal(parsePriceCents("18.505"), undefined);
assert.equal(parsePriceCents("-1"), undefined);
assert.equal(parsePriceCents("1e3"), undefined);
assert.equal(parsePriceCents(""), undefined);

const product = {
  slug: "da-hong-pao",
  name: "Da Hong Pao",
  categoryId: "2",
  origin: "Wuyi, Fujian",
  description: "Roasted rock oolong.",
  price: "32.00",
  unit: "50 g",
  badge: "",
  notes: "Roasted, Stone fruit ,, Mineral",
  details: "Harvest: Spring 2024\n\nRoast: Medium: charcoal",
  "brew-leaf": "",
  "brew-water": "",
  "brew-time": "",
  "brew-infusions": "",
  imageUrl: img,
  imageAlt: "Dark oolong leaves",
  gallery: `${img} | Tea | poured`,
  stock: "12",
};

const ok = parseProductForm(form(product), { create: true });
assert.ok(ok.ok);
assert.equal(ok.data.slug, "da-hong-pao");
assert.equal(ok.data.stock, 12);
assert.equal(ok.data.values.priceCents, 3200);
assert.equal(ok.data.values.badge, null);
assert.equal(ok.data.values.nameZh, null);
assert.equal(ok.data.values.brew, null);
assert.deepEqual(ok.data.values.notes, ["Roasted", "Stone fruit", "Mineral"]);
assert.deepEqual(ok.data.values.details, [
  { term: "Harvest", detail: "Spring 2024" },
  { term: "Roast", detail: "Medium: charcoal" },
]);
assert.deepEqual(ok.data.values.gallery, [{ src: img, alt: "Tea | poured" }]);

// Editing ignores slug and stock even when posted.
const edit = parseProductForm(form({ ...product, slug: "BAD SLUG", stock: "-4" }), { create: false });
assert.ok(edit.ok);
assert.equal(edit.data.slug, undefined);
assert.equal(edit.data.stock, undefined);

const bad = parseProductForm(
  form({
    ...product,
    slug: "Da Hong Pao",
    name: "",
    categoryId: "abc",
    price: "12.345",
    badge: "Sale",
    details: "no colon here",
    "brew-leaf": "7 g",
    imageUrl: "https://evil.example.com/photo-1.jpg",
    gallery: "https://images.unsplash.com/photo-1",
    stock: "1.5",
  }),
  { create: true },
);
assert.ok(!bad.ok);
assert.deepEqual(Object.keys(bad.errors).sort(), [
  "badge",
  "brew",
  "categoryId",
  "details",
  "gallery",
  "imageUrl",
  "name",
  "price",
  "slug",
  "stock",
]);

const brewed = parseProductForm(
  form({ ...product, "brew-leaf": "7 g", "brew-water": "100 °C", "brew-time": "5 s", "brew-infusions": "8+" }),
  { create: true },
);
assert.ok(brewed.ok);
assert.deepEqual(brewed.data.values.brew, { leaf: "7 g", water: "100 °C", time: "5 s", infusions: "8+" });

const category = {
  slug: "white-tea",
  name: "White tea",
  nameZh: "白茶",
  blurb: "Gentle, sun-withered leaves.",
  imageUrl: img,
  imageAlt: "Silvery white tea buds",
  sortOrder: "3",
};
const cat = parseCategoryForm(form(category), { create: true });
assert.ok(cat.ok);
assert.equal(cat.data.values.sortOrder, 3);
assert.ok(!parseCategoryForm(form({ ...category, sortOrder: "-1" }), { create: false }).ok);

const stock = parseStockForm(form({ productId: "4", quantity: "0", expectedQuantity: "", restockNote: "" }));
assert.ok(stock.ok);
assert.deepEqual(stock.data, { productId: 4, quantity: 0, expectedQuantity: null, restockNote: null });
assert.ok(!parseStockForm(form({ productId: "4", quantity: "-1", expectedQuantity: "3" })).ok);
assert.ok(!parseStockForm(form({ productId: "4", quantity: "2", expectedQuantity: "x" })).ok);

console.log("admin-forms: all checks passed");
