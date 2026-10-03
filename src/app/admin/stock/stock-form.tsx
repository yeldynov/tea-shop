"use client";

import { FormMessage } from "@/components/form-field";

import { updateStock } from "../actions";
import { useAdminForm } from "../use-admin-form";

/** Quantity + restock note for one product. Sends the quantity it was rendered with, so a stale edit is refused. */
export function StockForm({
  productId,
  quantity,
  restockNote,
}: {
  productId: number;
  /** null when the product has no stock row yet. */
  quantity: number | null;
  restockNote: string | null;
}) {
  const { state, pending, onSubmit, error } = useAdminForm(updateStock);
  const id = (name: string) => `${name}-${productId}`;

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-2">
      <input type="hidden" name="productId" value={productId} />
      {/* A controlled value so it follows the refreshed quantity after each save. */}
      <input type="hidden" name="expectedQuantity" value={quantity ?? ""} />
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor={id("quantity")} className="label text-ink-faint">
            Quantity
          </label>
          <input
            id={id("quantity")}
            name="quantity"
            type="number"
            min={0}
            defaultValue={quantity ?? 0}
            className="input w-28"
            aria-invalid={error("quantity") ? true : undefined}
          />
        </div>
        <div className="flex min-w-48 flex-1 flex-col gap-1">
          <label htmlFor={id("restockNote")} className="label text-ink-faint">
            Restock note
          </label>
          <input
            id={id("restockNote")}
            name="restockNote"
            maxLength={200}
            placeholder="Shown when sold out"
            defaultValue={restockNote ?? ""}
            className="input"
          />
        </div>
        <button type="submit" className="btn-ink btn-sm" disabled={pending} aria-busy={pending}>
          {pending ? "Saving…" : "Update"}
        </button>
      </div>
      {state && (
        <FormMessage tone={state.tone}>
          {state.errors?.quantity ?? state.errors?.restockNote ?? state.message}
        </FormMessage>
      )}
    </form>
  );
}
