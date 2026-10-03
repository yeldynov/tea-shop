import type { Metadata } from "next";
import Link from "next/link";

import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

const sections = [
  { href: "/admin/products", title: "Products", text: "Add teas and teaware, edit copy, prices and images." },
  { href: "/admin/collections", title: "Collections", text: "Create, edit and order the shop’s collections." },
  { href: "/admin/stock", title: "Stock", text: "See what’s left and update quantities and restock notes." },
  { href: "/admin/orders", title: "Orders", text: "Every order with its payment status and details." },
];

// Every admin page *and* server action must call requireAdmin() itself.
export default async function AdminPage() {
  const { user } = await requireAdmin();

  return (
    <>
      <header className="flex flex-col gap-3">
        <p className="eyebrow">Admin</p>
        <h1>Shop admin</h1>
        <p className="text-ink-soft">Signed in as {user.email}.</p>
      </header>
      <ul className="grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <li key={s.href}>
            <Link href={s.href} className="card flex h-full flex-col gap-2 p-6 transition-colors hover:bg-paper">
              <span className="text-display-sm">{s.title}</span>
              <span className="text-sm text-ink-soft">{s.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
