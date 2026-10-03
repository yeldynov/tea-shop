import Link from "next/link";

import { BagIcon, CloseIcon, MenuIcon, SearchIcon } from "@/components/icons";
import { UserMenu } from "@/components/user-menu";
import { mainNav, site } from "@/lib/site";

export function SiteHeader() {
  return (
    <>
      <div className="bg-ink text-cream">
        <p className="container-page py-2.5 text-center text-xs tracking-[0.06em]">
          {site.announcement[0]}
          {/* Second message only where it fits on one line. */}
          <span className="hidden sm:inline"> · {site.announcement[1]}</span>
        </p>
      </div>

      <header className="sticky top-0 z-40 border-b bg-paper/85 backdrop-blur-md">
        <div className="container-page grid h-16 grid-cols-[1fr_auto_1fr] items-center lg:h-20">
          {/* Mobile menu: native <details> so it works without client JS. */}
          <details className="group lg:hidden">
            <summary
              className="btn-icon -ml-2.5 list-none [&::-webkit-details-marker]:hidden"
              aria-label="Menu"
            >
              <MenuIcon className="group-open:hidden" />
              <CloseIcon className="hidden group-open:block" />
            </summary>
            <nav
              aria-label="Main"
              className="absolute inset-x-0 top-full border-b bg-paper shadow-soft"
            >
              <ul className="container-page flex flex-col py-4">
                {mainNav.map((item) => (
                  <li key={item.href} className="border-b">
                    <Link
                      href={item.href}
                      className="block py-4 font-display text-display-sm text-ink"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li className="pt-4">
                  <Link href="/account" className="link-quiet text-sm">
                    Account
                  </Link>
                </li>
              </ul>
            </nav>
          </details>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-7 text-[0.9375rem] text-ink">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-quiet">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link
            href="/"
            className="justify-self-center font-display text-[1.75rem] leading-none tracking-[-0.01em] text-ink lg:text-[2rem]"
          >
            {site.name}
          </Link>

          <div className="flex items-center justify-self-end lg:gap-1">
            <Link href="/search" className="btn-icon" aria-label="Search">
              <SearchIcon />
            </Link>
            <UserMenu />
            <Link href="/cart" className="btn-icon relative -mr-2.5" aria-label="Cart, 0 items">
              <BagIcon />
              <span className="absolute top-1.5 right-1 grid size-4 place-items-center rounded-full bg-matcha text-[0.625rem] leading-none text-cream">
                0
              </span>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
