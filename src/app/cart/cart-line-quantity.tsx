"use client";

import { useActionState } from "react";

import { updateCartItem } from "@/app/cart/actions";
import { maxQuantity } from "@/lib/cart";

/** Quantity select that saves on change. The server clamps to current stock. */
export function CartLineQuantity({
  slug,
  name,
  quantity,
  stock,
}: {
  slug: string;
  name: string;
  quantity: number;
  stock: number;
}) {
  const [state, action, pending] = useActionState(updateCartItem, null);
  const id = `quantity-${slug}`;

  return (
    <form action={action} className="flex flex-col gap-1">
      <input type="hidden" name="slug" value={slug} />
      <label htmlFor={id} className="sr-only">
        Quantity of {name}
      </label>
      {/* key resets the uncontrolled select when the server changes the quantity. */}
      <select
        key={quantity}
        id={id}
        name="quantity"
        defaultValue={quantity}
        disabled={pending}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        className="input w-20! cursor-pointer rounded-pill! px-4! py-2!"
      >
        {Array.from({ length: maxQuantity(stock) }, (_, i) => i + 1).map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
      <noscript>
        <button type="submit" className="link text-sm">
          Update
        </button>
      </noscript>
      {state && (
        <p role="alert" className="text-sm text-danger">
          {state.message}
        </p>
      )}
    </form>
  );
}
