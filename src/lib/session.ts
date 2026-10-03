import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";

import { auth } from "@/lib/auth";

// Server-side session checks. Call these in every protected page and server
// action. Layouts don't re-run on client navigation, so don't rely on them.
export const getSession = cache(async () => auth.api.getSession({ headers: await headers() }));

/** Signed-in user or a redirect to sign-in that returns to `next`. */
export async function requireUser(next: string) {
  const session = await getSession();
  if (!session) redirect(`/sign-in?next=${encodeURIComponent(next)}`);
  return session;
}

/** Admins only. Others get a 404 so the admin area isn't advertised. */
export async function requireAdmin(next = "/admin") {
  const session = await requireUser(next);
  if (session.user.role !== "admin") notFound();
  return session;
}

/** Only same-site paths; blocks `//evil.com` and absolute URLs. */
export function safeNext(value: unknown, fallback = "/account") {
  return typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.startsWith("/\\")
    ? value
    : fallback;
}
