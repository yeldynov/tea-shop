"use client";

import { useActionState } from "react";

import { addToCart } from "@/app/cart/actions";
import { FormMessage } from "@/components/form-field";
import { maxQuantity } from "@/lib/cart";
import { formatPrice } from "@/lib/catalog";

export function AddToBagForm({
  slug,
  stock,
  priceCents,
}: {
  slug: string;
  stock: number;
  priceCents: number;
}) {
  const [state, action, pending] = useActionState(addToCart, null);

  return (
    <form action={action} className="flex flex-col gap-3">
      <div className="flex gap-3">
        <input type="hidden" name="slug" value={slug} />
        <label htmlFor="quantity" className="sr-only">
          Quantity
        </label>
        <select
          id="quantity"
          name="quantity"
          defaultValue={1}
          className="input w-24! shrink-0 cursor-pointer rounded-pill! px-5!"
        >
          {Array.from({ length: maxQuantity(stock) }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="btn-primary btn-lg flex-1"
          disabled={pending}
          aria-busy={pending}
        >
          {pending ? "Adding…" : `Add to bag · ${formatPrice(priceCents)}`}
        </button>
      </div>
      {state && <FormMessage tone={state.tone}>{state.message}</FormMessage>}
    </form>
  );
}
