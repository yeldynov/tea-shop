// @vitest-environment node
import { serializeCart, clampQuantity, cartTotals, MAX_LINES, parseCart } from "@/lib/cart";
import { describe, expect, it } from "vitest";

describe("parseCart", () => {
  it("returns an empty cart when there is no cookie", () => {
    expect(parseCart(undefined).size).toBe(0);
  });

  it("returns an empty cart for invalid JSON", () => {
    expect(parseCart("not json").size).toBe(0);
  });

  it("returns an empty cart when the JSON is an array", () => {
    expect(parseCart("[1,2]").size).toBe(0);
  });

  it("returns an empty cart when the JSON is null", () => {
    expect(parseCart("null").size).toBe(0);
  });

  it.each([
    { qty: 2, expected: 2 },
    { qty: 999, expected: 10 },
  ])("keeps $qty as $expected", ({ qty, expected }) => {
    expect(parseCart(JSON.stringify({ a: qty })).get("a")).toBe(expected);
  });

  it.each([
    { label: "negative", qty: -1 },
    { label: "fractional", qty: 1.5 },
    { label: "string", qty: "3" },
    { label: "zero", qty: 0 },
  ])("drops $label quantity", ({ qty }) => {
    expect(parseCart(JSON.stringify({ a: qty })).has("a")).toBe(false);
  });

  it("stops at MAX_LINES distinct products", () => {
    const many = Object.fromEntries(Array.from({ length: 80 }, (_, i) => [`p${i}`, 1]));

    expect(parseCart(JSON.stringify(many)).size).toBe(MAX_LINES);
  });

  it("round-trips through serializeCart", () => {
    expect(parseCart(serializeCart(new Map([["x", 3]])))).toEqual(new Map([["x", 3]]));
  });
});

describe("clampQuantity", () => {
  it.each([
    { rule: "sold out gives 0", qty: 3, stock: 0, expected: 0 },
    { rule: "quantity within stock is kept", qty: 3, stock: 3, expected: 3 },
    { rule: "quantity above stock is capped at stock", qty: 5, stock: 3, expected: 3 },
    { rule: "plenty of stock is capped at 10 per line", qty: 50, stock: 100, expected: 10 },
    { rule: "negative quantity gives 0", qty: -2, stock: 5, expected: 0 },
  ])("$rule ($qty of $stock → $expected)", ({ qty, stock, expected }) => {
    expect(clampQuantity(qty, stock)).toBe(expected);
  });
});

describe("cartTotals", () => {
  it("adds up the subtotal in cents and the item count across lines", () => {
    expect(
      cartTotals([
        { quantity: 2, unitPriceCents: 1850 },
        { quantity: 1, unitPriceCents: 4200 },
      ]),
    ).toEqual({ subtotalCents: 7900, itemCount: 3 });
  });

  it("returns zeros for an empty cart", () => {
    expect(cartTotals([])).toEqual({ subtotalCents: 0, itemCount: 0 });
  });
});
