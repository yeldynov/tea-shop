import type { Metadata } from "next";

import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

// Every admin page *and* server action must call requireAdmin() itself.
export default async function AdminPage() {
  const { user } = await requireAdmin();

  return (
    <div className="container-prose section-sm flex flex-col gap-3">
      <p className="eyebrow">Admin</p>
      <h1>Dashboard</h1>
      <p className="text-ink-soft">Signed in as {user.email}.</p>
    </div>
  );
}
