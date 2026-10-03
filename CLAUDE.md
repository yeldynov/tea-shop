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

Env: copy `.env.example` to `.env.local` and set `DATABASE_URL` (Neon pooled connection string), `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL`. `drizzle.config.ts` reads `.env.local` then `.env`.

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
- **Site-wide copy and navigation** live in `src/lib/site.ts` (`site`, `mainNav`, `footerNav`). Many nav links point to routes that don't exist yet (`/journal`, `/help`, `/cart`, …). Only `/`, `/shop`, `/search`, `/new-arrivals`, `/collections/[slug]` and `/products/[slug]` are implemented.
- **Cart/checkout isn't wired up.** The product page purchase form renders UI states only.
- **Database:** `src/db/index.ts` exports `db` as a lazy Proxy so importing it (e.g. through the auth route during `next build`) doesn't require `DATABASE_URL`. Keep that property: don't touch the DB at module top level. `src/db/schema.ts` is the single schema entry point used by drizzle-kit, the Drizzle client, and the Better Auth adapter. Generated auth tables must be re-exported from it.
- **Auth:** `src/lib/auth.ts` (server, Drizzle adapter, `nextCookies()` must stay the last plugin), `src/lib/auth-client.ts` (React client), mounted at `src/app/api/auth/[...all]/route.ts`.
- **Images** come from Unsplash via the `unsplash()` helper in `catalog.ts`. `next.config.ts` allowlists only `images.unsplash.com/photo-*` for `next/image`.

## Design system

`src/app/globals.css` is the design system: Tailwind v4 `@theme` tokens (paper/ink neutrals, matcha brand color, yuzu/sakura/hojicha accents, fluid `text-display-*` sizes, `gutter`/`section`/`grid` spacing) plus custom `@utility` classes such as `btn-*`, `badge-*`, `card`, `panel`, `media`, `input`, `link*`, `eyebrow`, `label`, `price`, `container-page`/`container-wide`/`container-prose`, `section`, `grid-products`, `grid-cards`, `rail`. Use these tokens and utilities instead of raw colors or ad-hoc spacing. Fonts (Cormorant for display, Jost for body) are loaded with `next/font` in `src/app/layout.tsx` and exposed as CSS variables. Chinese names are marked up with `lang="zh-Hans"`.
