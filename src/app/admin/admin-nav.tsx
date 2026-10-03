"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "Overview", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Collections", href: "/admin/collections" },
  { label: "Stock", href: "/admin/stock" },
  { label: "Orders", href: "/admin/orders" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin">
      {/* Chip row on mobile (scrolls if it overflows), stacked list on desktop. */}
      <ul className="-mx-gutter flex gap-2 overflow-x-auto px-gutter pb-1 lg:mx-0 lg:flex-col lg:items-start lg:overflow-visible lg:px-0">
        {items.map((item) => (
          <li key={item.href} className="shrink-0">
            <Link
              href={item.href}
              className="chip"
              aria-current={
                pathname === item.href || (item.href !== "/admin" && pathname.startsWith(`${item.href}/`))
                  ? "page"
                  : undefined
              }
            >
              {item.label}
            </Link>
          </li>
        ))}
        <li className="shrink-0 lg:mt-4">
          <Link href="/" className="chip">
            View shop
          </Link>
        </li>
      </ul>
    </nav>
  );
}
