import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";

import { auth } from "@/lib/auth";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Account", robots: { index: false } };

const providerLabels: Record<string, string> = {
  credential: "Email and password",
  google: "Google",
};

const memberSince = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });

export default async function AccountPage() {
  const { user } = await requireUser("/account");
  const accounts = await auth.api.listUserAccounts({ headers: await headers() });
  const signInMethods = accounts.map((a) => providerLabels[a.providerId] ?? a.providerId);

  const details = [
    { term: "Name", detail: user.name },
    { term: "Email", detail: user.email },
    { term: "Sign-in method", detail: signInMethods.join(", ") || "—" },
    { term: "Member since", detail: memberSince.format(user.createdAt) },
  ];

  return (
    <>
      <header className="flex flex-col gap-3">
        <p className="eyebrow">Your account</p>
        <h1>Hello, {user.name.split(" ")[0]}</h1>
      </header>

      <section aria-labelledby="account-info" className="card p-6 sm:p-8">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="account-info" className="text-display-sm">
            Account information
          </h2>
          <Link href="/account/details" className="link-arrow text-sm">
            Edit details <span aria-hidden>→</span>
          </Link>
        </div>
        <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {details.map(({ term, detail }) => (
            <div key={term} className="flex min-w-0 flex-col gap-1">
              <dt className="label text-ink-faint">{term}</dt>
              <dd className="break-words text-ink">{detail}</dd>
            </div>
          ))}
        </dl>
      </section>

      {user.role === "admin" && (
        <section aria-labelledby="admin-tools" className="panel bg-matcha-pale">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <h2 id="admin-tools" className="text-display-sm">
                Shop admin
              </h2>
              <p className="text-sm text-ink-soft">You have admin access to this shop.</p>
            </div>
            <Link href="/admin" className="btn-ink btn-sm self-start sm:self-auto">
              Open admin
            </Link>
          </div>
        </section>
      )}

      <Link href="/shop" className="link-arrow self-start">
        Continue shopping <span aria-hidden>→</span>
      </Link>
    </>
  );
}
