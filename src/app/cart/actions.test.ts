// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { cookies } from "next/headers";
import { getProduct } from "@/lib/catalog-queries";
import { readCart } from "@/lib/cart-queries";
import { MAX_LINES } from "@/lib/cart";
import type { Product } from "@/lib/catalog";
import { addToCart } from "./actions";

vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("@/lib/catalog-queries", () => ({ getProduct: vi.fn() }));
vi.mock("@/lib/cart-queries", () => ({ readCart: vi.fn() }));

type Mock = ReturnType<typeof vi.fn>;
let store: { get: Mock; set: Mock; delete: Mock };

beforeEach(() => {
  vi.resetAllMocks();
  store = { get: vi.fn(), set: vi.fn(), delete: vi.fn() };
  vi.mocked(cookies).mockResolvedValue(store as never);
});

function product(slug: string, stock: number) {
  return { slug, stock } as Product;
}

function form(slug: string | null, quantity: string | null) {
  const fd = new FormData();
  if (slug !== null) fd.set("slug", slug);
  if (quantity !== null) fd.set("quantity", quantity);
  return fd;
}

/** Arrange both inputs: the product's stock (undefined = not found) and the bag. */
function given(stock: number | undefined, bag: Record<string, number> = {}, slug = "dian-hong") {
  vi.mocked(getProduct).mockResolvedValue(stock === undefined ? undefined : product(slug, stock));
  vi.mocked(readCart).mockResolvedValue(new Map(Object.entries(bag)));
}

describe("addToCart", () => {
  describe("input validation", () => {
    it.each([
      ["missing slug", null, "1"],
      ["quantity 0", "dian-hong", "0"],
      ["fractional quantity", "dian-hong", "1.5"],
      ["non-numeric quantity", "dian-hong", "abc"],
      ["missing quantity", "dian-hong", null],
      ["slug over 200 chars", "x".repeat(201), "1"],
    ])("rejects %s", async (_, slug, quantity) => {
      const result = await addToCart(null, form(slug, quantity));

      expect(result).toEqual({ tone: "error", message: "Choose a quantity to add." });
      expect(getProduct).not.toHaveBeenCalled();
    });
  });

  it("rejects an unknown product without reading the bag", async () => {
    given(undefined);

    const result = await addToCart(null, form("dian-hong", "1"));

    expect(result).toMatchObject({ tone: "error" });
    expect(result?.message).toContain("no longer available");
    expect(readCart).not.toHaveBeenCalled();
    expect(store.set).not.toHaveBeenCalled();
  });

  it("rejects a sold-out product and leaves the cookie alone", async () => {
    given(0, { sencha: 1 });

    const result = await addToCart(null, form("dian-hong", "1"));

    expect(result).toEqual({ tone: "error", message: "Sold out." });
    expect(store.set).not.toHaveBeenCalled();
    expect(store.delete).not.toHaveBeenCalled();
  });

  describe("stock limits", () => {
    it("clamps to stock and says so", async () => {
      given(3, { "dian-hong": 2 });

      const result = await addToCart(null, form("dian-hong", "2"));

      expect(result).toEqual({
        tone: "error",
        message: "Only 3 available, so your bag now has 3.",
      });
      expect(store.set).toHaveBeenCalledWith("cart", '{"dian-hong":3}', expect.anything());
    });

    it.each([
      ["stock", 3, 3],
      ["the per-line cap of 10", 50, 10],
    ])("refuses when the bag already holds the max (%s)", async (_, stock, inBag) => {
      given(stock, { "dian-hong": inBag });

      const result = await addToCart(null, form("dian-hong", "1"));

      expect(result).toEqual({
        tone: "error",
        message: `You already have the most available (${inBag}).`,
      });
      expect(store.set).not.toHaveBeenCalled();
    });
  });

  describe("bag size", () => {
    const fullBag = Object.fromEntries(
      Array.from({ length: MAX_LINES }, (_, i) => [`tea-${i}`, 1]),
    );

    it("refuses a new line when the bag is full", async () => {
      given(5, fullBag);

      const result = await addToCart(null, form("dian-hong", "1"));

      expect(result).toEqual({
        tone: "error",
        message: "Your bag is full. Remove something first.",
      });
      expect(store.set).not.toHaveBeenCalled();
    });

    it("still tops up a line that is already in a full bag", async () => {
      given(5, fullBag, "tea-0");

      const result = await addToCart(null, form("tea-0", "1"));

      expect(result).toMatchObject({ tone: "success" });
      expect(store.set).toHaveBeenCalledOnce();
    });
  });

  describe("success", () => {
    it("adds to an empty bag and writes an httpOnly cookie", async () => {
      given(5);

      const result = await addToCart(null, form("dian-hong", "2"));

      expect(result).toEqual({ tone: "success", message: "Added to your bag. You have 2." });
      expect(store.set).toHaveBeenCalledWith(
        "cart",
        '{"dian-hong":2}',
        expect.objectContaining({ httpOnly: true, sameSite: "lax", path: "/" }),
      );
    });

    it("keeps the other lines in the bag", async () => {
      given(5, { sencha: 1 });

      await addToCart(null, form("dian-hong", "2"));

      const written = JSON.parse(store.set.mock.calls[0][1]);
      expect(written).toEqual({ sencha: 1, "dian-hong": 2 });
    });
  });
});
