import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { FormMessage } from "@/components/form-field";
import { googleEnabled } from "@/lib/auth";
import { getSession, safeNext } from "@/lib/session";

import { GoogleButton, SignInForm } from "../auth-forms";
import { OrDivider } from "../or-divider";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false },
};

// Set by Better Auth on the OAuth error redirect (`errorCallbackURL`).
function oauthError(code: string | string[] | undefined) {
  if (!code) return null;
  return String(code).includes("not_linked")
    ? "An account with this email already exists. Sign in with your password."
    : "Google sign-in didn’t complete. Please try again.";
}

export default async function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  const params = await searchParams;
  const next = safeNext(params.next);
  if (await getSession()) redirect(next);
  const error = oauthError(params.error);

  return (
    <>
      <header className="flex flex-col gap-3 text-center">
        <p className="eyebrow">Welcome back</p>
        <h1>Sign in</h1>
      </header>

      {error && <FormMessage tone="error">{error}</FormMessage>}

      {googleEnabled && (
        <>
          <GoogleButton next={next} />
          <OrDivider />
        </>
      )}

      <SignInForm next={next} />

      <p className="text-center text-sm text-ink-soft">
        New here?{" "}
        <Link href={`/sign-up?next=${encodeURIComponent(next)}`} className="link">
          Create an account
        </Link>
      </p>
    </>
  );
}
