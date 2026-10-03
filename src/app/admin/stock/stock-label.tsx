import { stockState } from "@/lib/catalog";

const dotClass = {
  "in-stock": "bg-matcha",
  "low-stock": "bg-hojicha",
  "sold-out": "bg-ink-faint",
} as const;

/** Exact count with the storefront's stock colours ("Only 3 left" is customer copy). */
export function StockLabel({ quantity }: { quantity: number }) {
  const state = stockState({ stock: quantity });
  return (
    <span className="flex items-center gap-2 text-sm whitespace-nowrap">
      <span aria-hidden className={`size-2 rounded-full ${dotClass[state]}`} />
      <span className={state === "low-stock" ? "text-hojicha" : "text-ink-soft"}>
        {state === "sold-out" ? "Sold out" : `${quantity} in stock`}
      </span>
    </span>
  );
}
