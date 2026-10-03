import Link from "next/link";

import { UserIcon } from "@/components/icons";
import { SignOutButton } from "@/components/sign-out-button";
import { getSession } from "@/lib/session";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts.at(-1)![0] : "")).toUpperCase() || "?";
}

const menuLink = "block rounded-md px-3 py-2 text-sm text-ink transition-colors hover:bg-mist";

/**
 * Header account icon with a hover/focus card. Server-rendered from the
 * request's session, so it's correct on first paint and needs no client state.
 * Opens on :hover and :focus-within (CSS only). On touch screens the icon is
 * just a link to /account.
 */
export async function UserMenu() {
  const session = await getSession();
  const user = session?.user;

  return (
    <div className="group relative hidden sm:block">
      <Link
        href="/account"
        className="btn-icon relative"
        aria-label={user ? `Account: ${user.name}` : "Account"}
      >
        <UserIcon />
        {user && (
          <span
            aria-hidden
            className="absolute top-2 right-2 size-2 rounded-full bg-matcha ring-2 ring-paper"
          />
        )}
      </Link>

      {/* pt-2 bridges the gap so the card stays open while the pointer moves onto it. */}
      <div className="invisible absolute top-full right-0 z-50 w-72 pt-2 opacity-0 transition-[opacity,visibility] delay-100 duration-150 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:delay-0 group-hover:visible group-hover:opacity-100 group-hover:delay-0">
        <div className="card p-4 shadow-lift">
          {user ? (
            <>
              <div className="flex items-center gap-3 px-1 pb-4">
                <span
                  aria-hidden
                  className="grid size-11 shrink-0 place-items-center rounded-full bg-matcha-pale font-display text-lg text-matcha-deep"
                >
                  {initials(user.name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">{user.name}</p>
                  <p className="truncate text-sm text-ink-faint">{user.email}</p>
                </div>
              </div>
              <hr className="divider" />
              <nav aria-label="Account menu" className="flex flex-col py-2">
                <Link href="/account" className={menuLink}>
                  Your account
                </Link>
                <Link href="/account/details" className={menuLink}>
                  Account details
                </Link>
                {user.role === "admin" && (
                  <Link href="/admin" className={menuLink}>
                    Shop admin
                  </Link>
                )}
              </nav>
              <hr className="divider" />
              <div className="pt-2">
                <SignOutButton className={`${menuLink} w-full text-left text-ink-soft`} />
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-4 p-1">
              <div className="flex flex-col gap-1">
                <p className="font-display text-display-sm text-ink">Welcome</p>
                <p className="text-sm text-ink-soft">Sign in to see your account and details.</p>
              </div>
              <div className="flex flex-col gap-2">
                <Link href="/sign-in" className="btn-primary btn-sm">
                  Sign in
                </Link>
                <Link href="/sign-up" className="btn-outline btn-sm">
                  Create account
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
