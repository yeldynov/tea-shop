import type { Metadata } from "next";

import { requireUser } from "@/lib/session";

import { ProfileForm } from "./profile-form";

export const metadata: Metadata = { title: "Account details", robots: { index: false } };

export default async function AccountDetailsPage() {
  const { user } = await requireUser("/account/details");

  return (
    <>
      <header className="flex flex-col gap-3">
        <p className="eyebrow">Your account</p>
        <h1>Account details</h1>
      </header>

      <section className="card p-6 sm:p-8">
        <ProfileForm name={user.name} email={user.email} />
      </section>
    </>
  );
}
