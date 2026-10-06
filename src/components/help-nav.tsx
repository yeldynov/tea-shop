import Link from "next/link";

const items = [
  { label: "FAQ", href: "/help" },
  { label: "Shipping & returns", href: "/help/shipping" },
  { label: "Contact", href: "/contact" },
] as const;

/** Breadcrumb plus the chip row shared by the help pages. */
export function HelpNav({ current }: { current: (typeof items)[number]["href"] }) {
  const page = items.find((i) => i.href === current)!;

  return (
    <div className="mb-10 flex flex-col gap-6 md:mb-14">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-faint">
          <li>
            <Link href="/" className="link-quiet">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          {current !== "/help" && (
            <>
              <li>
                <Link href="/help" className="link-quiet">
                  Help
                </Link>
              </li>
              <li aria-hidden>/</li>
            </>
          )}
          <li aria-current="page" className="text-ink">
            {current === "/help" ? "Help" : page.label}
          </li>
        </ol>
      </nav>

      <nav aria-label="Help">
        <ul className="-mx-gutter flex gap-2 overflow-x-auto px-gutter pb-1 [scrollbar-width:none] lg:mx-0 lg:px-0">
          {items.map((item) => (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                className="chip"
                aria-current={item.href === current ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
