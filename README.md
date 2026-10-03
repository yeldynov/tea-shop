# Tea Shop

Next.js (App Router) + TypeScript + Tailwind CSS, with Better Auth, Drizzle ORM, and Neon Postgres.

## Setup

1. `pnpm install`
2. `cp .env.example .env.local` and fill in `DATABASE_URL` (Neon) and `BETTER_AUTH_SECRET` (`openssl rand -base64 32`).
3. `pnpm auth:generate` to generate the Better Auth tables into `src/db/auth-schema.ts`, re-export them from `src/db/schema.ts`, then `pnpm db:push` (or `db:generate` + `db:migrate`).
4. `pnpm dev`

## Layout

- `src/db/index.ts` – Drizzle client (Neon HTTP driver)
- `src/db/schema.ts` – Drizzle schema entry point
- `src/lib/auth.ts` – Better Auth server instance
- `src/lib/auth-client.ts` – Better Auth React client
- `src/app/api/auth/[...all]/route.ts` – Better Auth route handler
- `drizzle.config.ts` – drizzle-kit config (migrations output to `drizzle/`)
