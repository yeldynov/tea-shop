import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { googleEnabled } from "@/lib/auth";
import { getSession, safeNext } from "@/lib/session";

import { GoogleButton, SignUpForm } from "../auth-forms";
import { OrDivider } from "../or-divider";

export const metadata: Metadata = {
  title: "Create account",
  robots: { index: false },
};

export default async function SignUpPage({ searchParams }: PageProps<"/sign-up">) {
  const next = safeNext((await searchParams).next);
  if (await getSession()) redirect(next);

  return (
    <>
      <header className="flex flex-col gap-3 text-center">
        <p className="eyebrow">Join us</p>
        <h1>Create an account</h1>
      </header>

      {googleEnabled && (
        <>
          <GoogleButton next={next} />
          <OrDivider />
        </>
      )}

      <SignUpForm next={next} />

      <p className="text-center text-sm text-ink-soft">
        Already have an account?{" "}
        <Link href={`/sign-in?next=${encodeURIComponent(next)}`} className="link">
          Sign in
        </Link>
      </p>
    </>
  );
}
