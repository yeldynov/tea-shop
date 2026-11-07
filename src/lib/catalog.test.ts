// @vitest-environment node
import { describe, expect, it } from "vitest";
import { formatPrice, LOW_STOCK_THRESHOLD, stockState } from "./catalog";

describe("stockState", () => {
  it.each([
    {
      rule: "negative stock counts as sold out",
      stock: -1,
      expected: "sold-out",
    },
    { rule: "zero is sold out", stock: 0, expected: "sold-out" },
    {
      rule: "one is the first low-stock value",
      stock: 1,
      expected: "low-stock",
    },
    {
      rule: "the threshold itself is still low",
      stock: LOW_STOCK_THRESHOLD,
      expected: "low-stock",
    },
    {
      rule: "one above the threshold is in stock",
      stock: LOW_STOCK_THRESHOLD + 1,
      expected: "in-stock",
    },
  ])("$stock → $expected ($rule)", ({ stock, expected }) => {
    expect(stockState({ stock })).toBe(expected);
  });
});

describe("formatPrice", () => {
  it.each([
    {
      rule: "cents become dollars with two decimals",
      cents: 1850,
      expected: "$18.50",
    },
    { rule: "zero still shows two decimals", cents: 0, expected: "$0.00" },
    {
      rule: "thousands get a comma separator",
      cents: 123456,
      expected: "$1,234.56",
    },
  ])("$cents → $expected ($rule)", ({ cents, expected }) => {
    expect(formatPrice(cents)).toBe(expected);
  });
});
