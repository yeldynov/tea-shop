# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

The package manager is pnpm (pinned via `packageManager` in `package.json`). Don't use npm or commit a `package-lock.json`. Use `pnpm add` / `pnpm add -D` for dependencies and `pnpm dlx` instead of `npx`. Dependency build scripts are blocked unless they're listed under `allowBuilds` in `pnpm-workspace.yaml`. If a new dependency needs one, run `pnpm approve-builds <pkg>`.

- `pnpm install`
- `pnpm dev` / `pnpm build` / `pnpm start`
- `pnpm lint` — ESLint (flat config, `eslint-config-next`)
- `pnpm db:generate` + `pnpm db:migrate` (migrations go to `drizzle/`); `pnpm db:studio` to browse data
- `pnpm db:seed` — upserts the sample catalog from `src/db/seed-data.ts` (re-runnable; resets stock to the seed values)
- `pnpm auth:generate` — regenerates Better Auth tables into `src/db/auth-schema.ts`

There is no test runner configured.

Env: copy `.env.example` to `.env.local` and set `DATABASE_URL` (Neon pooled connection string), `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`. For local webhooks run `stripe listen --forward-to localhost:3000/api/stripe/webhook`. `drizzle.config.ts` reads `.env.local` then `.env`.

## Stack

Next.js 16 (App Router, React 19) + TypeScript + Tailwind CSS v4, Better Auth, Drizzle ORM on Neon Postgres (HTTP driver). Path alias `@/*` → `src/*`. Route components use the generated global `PageProps<"/route">` / `LayoutProps<"/route">` types with `params` as a Promise.

## Architecture

- **Catalog lives in Postgres** (`categories`, `products`, `product_stock` in `src/db/schema.ts`). Conventions:
  - Components never query `db` directly. Reads go through `src/lib/catalog-queries.ts`, which wraps each query in React `cache()` and maps rows to the `Product`/`Category` types in `src/lib/catalog.ts`.
  - Money is integer cents (`priceCents`); `formatPrice` takes cents. Never store prices as floats.
  - Stock lives in `product_stock` (1:1 with products), not on `products`, so stock writes don't touch product rows. A missing stock row means sold out.
  - Data that's always read whole with its product (notes, details, brew, gallery) goes in array/JSONB columns, not child tables.
  - Pages that read the catalog use `export const dynamic = "force-dynamic"`: stock stays current and `next build` must never need `DATABASE_URL`. Add caching later via `cacheComponents` + `"use cache"`, not by prerendering from the DB.
  - Schema changes use versioned migrations: `db:generate`, review the SQL, commit `drizzle/`, then `db:migrate`. Don't use `db:push`.
  - Homepage merchandising picks (bestsellers, spotlight, new arrival) are slug constants in `catalog.ts`, not DB columns.
  - The UI and URLs call categories "collections" (`/collections/*`); the database calls them `categories`.
- **Site-wide copy and navigation** live in `src/lib/site.ts` (`site`, `mainNav`, `footerNav`). Many nav links point to routes that don't exist yet (`/journal`, `/help`, …). Only `/`, `/shop`, `/search`, `/new-arrivals`, `/cart`, `/checkout/*`, `/account/orders`, `/account/orders/[id]`, `/collections/[slug]`, `/products/[slug]`, `/sign-in`, `/sign-up`, `/account` and `/admin` are implemented.
- **Cart** is an httpOnly `cart` cookie holding only `{ slug: quantity }` (`src/lib/cart.ts`), so guests can use it and there's no cart table. Prices and stock are never stored there. `getCart()` (`src/lib/cart-queries.ts`) joins it to the catalog on every render and clamps quantities to `min(stock, 10)`. Only the server actions in `src/app/cart/actions.ts` write the cookie, and they re-check stock on every call. Adding to the bag doesn't reserve stock; checkout does. `pnpm tsx src/lib/cart.check.ts` asserts the cart rules.
- **Checkout** (Stripe Checkout, hosted): `startCheckout` (`src/app/checkout/actions.ts`) takes no input. It builds the order and the Stripe line items (`price_data`) from `getCart()`, never from the client.
  - The order (`orders` + `order_items`, which keep a snapshot of name and price) is created `pending` together with the stock reservation, in one `db.batch()`. `product_stock`'s non-negative CHECK makes the reservation all-or-nothing.
  - Only Stripe marks an order `paid`: `syncOrderFromCheckoutSession` (`src/lib/orders.ts`) reads the session from the Stripe API. It's called by the webhook (`src/app/api/stripe/webhook/route.ts`) and by `/checkout/success`.
  - `checkout.session.expired`, `checkout.session.async_payment_failed` and `/checkout/cancel` call `releaseOrder`, which returns the stock.
  - Every status change is a single `… where status = 'pending'` statement, so duplicate webhooks are harmless. Keep it that way.
  - Link to `/checkout/cancel` with `<a>`, not `<Link>`: a prefetch would cancel the order.
- **Database:** `src/db/index.ts` exports `db` as a lazy Proxy so importing it (e.g. through the auth route during `next build`) doesn't require `DATABASE_URL`. Keep that property: don't touch the DB at module top level. `src/db/schema.ts` is the single schema entry point used by drizzle-kit, the Drizzle client, and the Better Auth adapter. Generated auth tables must be re-exported from it.
- **Auth:** `src/lib/auth.ts` (server, Drizzle adapter, `nextCookies()` must stay the last plugin), `src/lib/auth-client.ts` (React client), mounted at `src/app/api/auth/[...all]/route.ts`.
  - Email/password plus Google (enabled only when `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` are set). Sign-in/up/out forms call `authClient` (`src/app/(auth)/auth-forms.tsx`) so requests go through `/api/auth/*`, where Better Auth's rate limiting and origin checks run. Server-side `auth.api.*` calls skip rate limiting, so don't use them for credential checks.
  - Authorization is server-side via `src/lib/session.ts`: call `requireUser(path)` or `requireAdmin()` at the top of every protected page **and** every protected server action/route handler. Don't rely on layouts (they don't re-run on navigation). Non-admins get a 404 from `/admin`.
  - `user.role` is `"customer"` by default and can't be set by clients (`input: false`). Promote admins with SQL: `update "user" set role = 'admin' where email = '…'`.
  - Redirect targets from user input go through `safeNext()` (same-site paths only).
  - The header's account card (`src/components/user-menu.tsx`) reads the session on the server via `getSession()`. No client auth state. It's a CSS-only `:hover`/`:focus-within` dropdown. Use the same pattern for the cart: server-side data in the header, no client store.
- **Images** come from Unsplash via the `unsplash()` helper in `catalog.ts`. `next.config.ts` allowlists only `images.unsplash.com/photo-*` for `next/image`.

## Design system

`src/app/globals.css` is the design system: Tailwind v4 `@theme` tokens (paper/ink neutrals, matcha brand color, yuzu/sakura/hojicha accents, fluid `text-display-*` sizes, `gutter`/`section`/`grid` spacing) plus custom `@utility` classes such as `btn-*`, `badge-*`, `card`, `panel`, `media`, `input`, `link*`, `eyebrow`, `label`, `price`, `container-page`/`container-wide`/`container-prose`, `section`, `grid-products`, `grid-cards`, `rail`. Use these tokens and utilities instead of raw colors or ad-hoc spacing. Fonts (Cormorant for display, Jost for body) are loaded with `next/font` in `src/app/layout.tsx` and exposed as CSS variables. Chinese names are marked up with `lang="zh-Hans"`.
