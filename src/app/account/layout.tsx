import { AccountNav } from "./account-nav";

// Navigation only. Each page checks the session itself (layouts don't re-run on navigation).
// Reads cookies or the database before anything else, so the page may block
// instead of streaming from a static shell.
export const instant = false;

export default function AccountLayout({ children }: LayoutProps<"/account">) {
  return (
    <div className="container-page section-sm">
      <div className="grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
        <AccountNav />
        <div className="flex max-w-3xl flex-col gap-10">{children}</div>
      </div>
    </div>
  );
}
