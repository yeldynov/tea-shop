// Form parsing for the admin area. Pure (no DB) so `admin-forms.check.ts` can
// assert it. Every admin action parses its FormData through one of these before
// touching the database; the browser's own validation is only a convenience.
import { productBadge } from "@/db/schema";

export type FieldErrors = Record<string, string>;
export type Parsed<T> = { ok: true; data: T } | { ok: false; errors: FieldErrors };

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// Same allowlist as next.config.ts; anything else would make next/image throw.
const IMAGE_PREFIX = "https://images.unsplash.com/photo-";
const MAX_STOCK = 100_000;

/** "18", "18.5" or "18.50" dollars → integer cents, without going through floats. */
export function parsePriceCents(value: string): number | undefined {
  const match = /^(\d{1,6})(?:\.(\d{1,2}))?$/.exec(value.trim().replace(/^\$/, ""));
  if (!match) return undefined;
  return Number(match[1]) * 100 + Number((match[2] ?? "").padEnd(2, "0"));
}

export function centsToDollars(cents: number) {
  return (cents / 100).toFixed(2);
}

function isImageUrl(value: string) {
  return value.startsWith(IMAGE_PREFIX) && URL.canParse(value);
}

function lines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Reads trimmed strings and records errors as it goes. */
function reader(formData: FormData) {
  const errors: FieldErrors = {};
  const raw = (name: string) => {
    const value = formData.get(name);
    return typeof value === "string" ? value.trim() : "";
  };
  return {
    errors,
    text(name: string, label: string, max: number, { optional = false } = {}) {
      const value = raw(name);
      if (!value && !optional) errors[name] = `Enter ${label}.`;
      else if (value.length > max) errors[name] = `Use ${max} characters or fewer.`;
      return value;
    },
    slug(name: string) {
      const value = raw(name);
      if (!SLUG.test(value) || value.length > 80) {
        errors[name] = "Use lowercase letters, numbers and single hyphens, e.g. da-hong-pao.";
      }
      return value;
    },
    int(name: string, label: string, min: number, max: number) {
      const value = raw(name);
      const n = Number(value);
      if (!/^-?\d+$/.test(value) || n < min || n > max) {
        errors[name] = `Enter ${label} between ${min} and ${max}.`;
      }
      return n;
    },
    image(name: string) {
      const value = raw(name);
      if (!isImageUrl(value)) errors[name] = `Use an Unsplash image URL (${IMAGE_PREFIX}…).`;
      return value;
    },
    raw,
  };
}

function done<T>(errors: FieldErrors, data: T): Parsed<T> {
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}

export function parseProductForm(formData: FormData, { create }: { create: boolean }) {
  const f = reader(formData);
  const slug = create ? f.slug("slug") : undefined;
  const name = f.text("name", "a name", 120);
  const nameZh = f.text("nameZh", "a Chinese name", 40, { optional: true });
  const categoryId = f.int("categoryId", "a collection", 1, 2 ** 31 - 1);
  if (f.errors.categoryId) f.errors.categoryId = "Choose a collection.";
  const origin = f.text("origin", "an origin", 120);
  const description = f.text("description", "a description", 2000);
  const unit = f.text("unit", "a unit, e.g. 50 g", 40);

  const priceCents = parsePriceCents(f.raw("price"));
  if (priceCents === undefined) f.errors.price = "Enter a price in dollars, e.g. 18.50.";

  const badgeValue = f.raw("badge");
  const badge = badgeValue
    ? productBadge.enumValues.find((value) => value === badgeValue)
    : null;
  if (badge === undefined) f.errors.badge = "Choose a badge from the list.";

  const notes = f
    .raw("notes")
    .split(",")
    .map((note) => note.trim())
    .filter(Boolean);
  if (notes.length > 8 || notes.some((note) => note.length > 40)) {
    f.errors.notes = "Use up to 8 notes of 40 characters or fewer.";
  }

  const details = lines(f.raw("details")).map((line) => {
    const at = line.indexOf(":");
    if (at < 0) return { term: "", detail: "" };
    return { term: line.slice(0, at).trim(), detail: line.slice(at + 1).trim() };
  });
  if (details.length > 12 || details.some((d) => !d.term || !d.detail)) {
    f.errors.details = "Write up to 12 lines like “Harvest: Spring 2024”.";
  }

  const brewFields = ["leaf", "water", "time", "infusions"] as const;
  const brewValues = brewFields.map((key) => f.text(`brew-${key}`, key, 40, { optional: true }));
  const brew = brewValues.every(Boolean)
    ? { leaf: brewValues[0], water: brewValues[1], time: brewValues[2], infusions: brewValues[3] }
    : null;
  if (!brew && brewValues.some(Boolean)) f.errors.brew = "Fill in all four brewing fields, or none.";

  const imageUrl = f.image("imageUrl");
  const imageAlt = f.text("imageAlt", "image alt text", 200);

  const gallery = lines(f.raw("gallery")).map((line) => {
    const [src = "", ...alt] = line.split("|");
    return { src: src.trim(), alt: alt.join("|").trim() };
  });
  if (gallery.length > 8 || gallery.some((g) => !isImageUrl(g.src) || !g.alt || g.alt.length > 200)) {
    f.errors.gallery = "Write up to 8 lines like “https://images.unsplash.com/photo-… | Alt text”.";
  }

  const stock = create ? f.int("stock", "a quantity", 0, MAX_STOCK) : undefined;

  return done(f.errors, {
    slug,
    stock,
    values: {
      name,
      nameZh: nameZh || null,
      categoryId,
      origin,
      description,
      notes,
      priceCents: priceCents ?? 0,
      unit,
      badge: badge ?? null,
      details,
      brew,
      imageUrl,
      imageAlt,
      gallery,
    },
  });
}

export function parseCategoryForm(formData: FormData, { create }: { create: boolean }) {
  const f = reader(formData);
  const slug = create ? f.slug("slug") : undefined;
  const values = {
    name: f.text("name", "a name", 80),
    nameZh: f.text("nameZh", "a Chinese name", 40),
    blurb: f.text("blurb", "a blurb", 400),
    imageUrl: f.image("imageUrl"),
    imageAlt: f.text("imageAlt", "image alt text", 200),
    sortOrder: f.int("sortOrder", "a position", 0, 1000),
  };
  return done(f.errors, { slug, values });
}

export function parseStockForm(formData: FormData) {
  const f = reader(formData);
  const productId = f.int("productId", "a product", 1, 2 ** 31 - 1);
  const quantity = f.int("quantity", "a quantity", 0, MAX_STOCK);
  // Empty when the product has no stock row yet.
  const expected = f.raw("expectedQuantity");
  const expectedQuantity = expected === "" ? null : Number(expected);
  if (expectedQuantity !== null && !Number.isInteger(expectedQuantity)) {
    f.errors.quantity = "Reload the page and try again.";
  }
  const restockNote = f.text("restockNote", "a note", 200, { optional: true });
  return done(f.errors, { productId, quantity, expectedQuantity, restockNote: restockNote || null });
}
