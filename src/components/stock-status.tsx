import { stockState, type Product } from "@/lib/catalog";

const dotClass = {
  "in-stock": "bg-matcha",
  "low-stock": "bg-hojicha",
  "sold-out": "bg-ink-faint",
} as const;

/** Coloured dot + short availability text. `detailed` adds shipping / restock info. */
export function StockStatus({
  product,
  detailed = false,
  className = "",
}: {
  product: Product;
  detailed?: boolean;
  className?: string;
}) {
  const state = stockState(product);

  const text = {
    "in-stock": "In stock",
    "low-stock": `Only ${product.stock} left`,
    "sold-out": "Sold out",
  }[state];

  const extra =
    state === "sold-out" ? product.restock : detailed ? "Ships within 2 working days" : undefined;

  return (
    <p className={`flex items-center gap-2 text-sm ${className}`}>
      <span aria-hidden className={`size-2 shrink-0 rounded-full ${dotClass[state]}`} />
      <span className={state === "low-stock" ? "text-hojicha" : "text-ink"}>{text}</span>
      {extra && <span className="text-ink-faint">· {extra}</span>}
    </p>
  );
}
