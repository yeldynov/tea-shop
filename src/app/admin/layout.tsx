import { AdminNav } from "./admin-nav";

// Navigation only. Each page and server action checks requireAdmin() itself
// (layouts don't re-run on navigation).
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="container-page section-sm">
      <div className="grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
        <AdminNav />
        <div className="flex max-w-4xl min-w-0 flex-col gap-10">{children}</div>
      </div>
    </div>
  );
}
