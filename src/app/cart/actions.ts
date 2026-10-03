"use server";

import { cookies } from "next/headers";

import { CART_COOKIE, clampQuantity, MAX_LINES, maxQuantity, serializeCart } from "@/lib/cart";
import { readCart } from "@/lib/cart-queries";
import { getProduct } from "@/lib/catalog-queries";

// Open to guests: the cart is per browser, so there's nothing to authorize.
// Every action re-reads stock from the database; quantities from the form are
// only requests.

export type CartActionState = { tone: "error" | "success"; message: string } | null;

async function writeCart(items: Map<string, number>) {
  const store = await cookies();
  if (items.size === 0) return store.delete(CART_COOKIE);
  store.set(CART_COOKIE, serializeCart(items), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

function readInput(formData: FormData) {
  const slug = formData.get("slug");
  const qty = Number(formData.get("quantity"));
  return {
    slug: typeof slug === "string" && slug.length <= 200 ? slug : "",
    qty: Number.isInteger(qty) ? qty : NaN,
  };
}

function limitedMessage(available: number) {
  return `Only ${available} available, so your bag now has ${available}.`;
}

export async function addToCart(_: CartActionState, formData: FormData): Promise<CartActionState> {
  const { slug, qty } = readInput(formData);
  if (!slug || !(qty >= 1)) return { tone: "error", message: "Choose a quantity to add." };

  const product = await getProduct(slug);
  if (!product) return { tone: "error", message: "This product is no longer available." };
  if (maxQuantity(product.stock) === 0) return { tone: "error", message: "Sold out." };

  const items = await readCart();
  const existing = items.get(slug) ?? 0;
  if (!items.has(slug) && items.size >= MAX_LINES) {
    return { tone: "error", message: "Your bag is full. Remove something first." };
  }
  const wanted = existing + qty;
  const quantity = clampQuantity(wanted, product.stock);
  if (quantity === existing) {
    return { tone: "error", message: `You already have the most available (${quantity}).` };
  }
  await writeCart(new Map(items).set(slug, quantity));

  return quantity < wanted
    ? { tone: "error", message: limitedMessage(quantity) }
    : { tone: "success", message: `Added to your bag. You have ${quantity}.` };
}

export async function updateCartItem(
  _: CartActionState,
  formData: FormData,
): Promise<CartActionState> {
  const { slug, qty } = readInput(formData);
  const items = new Map(await readCart());
  if (!slug || !items.has(slug) || Number.isNaN(qty)) return null;

  const product = await getProduct(slug);
  const quantity = product ? clampQuantity(qty, product.stock) : 0;
  if (quantity === 0) items.delete(slug);
  else items.set(slug, quantity);
  await writeCart(items);

  return quantity < qty && quantity > 0 ? { tone: "error", message: limitedMessage(quantity) } : null;
}

export async function removeFromCart(formData: FormData) {
  const { slug } = readInput(formData);
  const items = new Map(await readCart());
  if (items.delete(slug)) await writeCart(items);
}

export async function clearCart() {
  (await cookies()).delete(CART_COOKIE);
}
