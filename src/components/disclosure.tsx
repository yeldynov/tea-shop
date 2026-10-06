/** Native <details> accordion row; stack several for an FAQ-style list. */
export function Disclosure({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group border-t last:border-b">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-xl text-ink [&::-webkit-details-marker]:hidden">
        {title}
        <span
          aria-hidden
          className="grid size-8 shrink-0 place-items-center rounded-full border text-xl leading-none font-light transition-transform duration-300 group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="pb-5 text-ink-soft">{children}</div>
    </details>
  );
}
