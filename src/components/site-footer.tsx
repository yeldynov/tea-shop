import Link from "next/link";

import { footerNav, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-ink text-cream/80">
      <div className="container-page section-sm grid gap-12 lg:grid-cols-[1.4fr_2fr]">
        <div className="flex max-w-sm flex-col gap-4">
          <Link href="/" className="font-display text-4xl leading-none text-cream">
            {site.name}
          </Link>
          <p className="text-sm leading-relaxed">
            Traditional Chinese teas from small farms in Yunnan and Fujian, stored with care and
            shipped with gongfu brewing notes.
          </p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {footerNav.map((group) => (
            <div key={group.title} className="flex flex-col gap-4">
              <h2 className="label font-sans text-cream/50">{group.title}</h2>
              <ul className="flex flex-col gap-2.5 text-sm">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="link-quiet hover:text-cream">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t border-cream/15">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-cream/50 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>
          <p>Photography via Unsplash</p>
        </div>
      </div>
    </footer>
  );
}
