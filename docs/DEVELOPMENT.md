# DEVELOPMENT.md

## Prerequisites

- Node 22 (a portable install lives at `%LOCALAPPDATA%\nodejs` on the original dev machine and is on the user PATH)
- pnpm (via `corepack enable pnpm`)
- PostgreSQL — one of:
  - the portable PostgreSQL 17.11 already installed at `%LOCALAPPDATA%\pgsql` on the original dev machine — start/stop with `.\scripts\dev-db.ps1 start|stop|status` (trust auth, localhost only, database `mariposa`), or
  - Docker: `docker compose up -d` (uses [docker-compose.yml](../docker-compose.yml)), or
  - a Supabase dev project (use its pooler connection string in `.env`)

## Setup

```bash
cp .env.example .env   # fill in PAYLOAD_SECRET; adjust DATABASE_URL if needed
pnpm install
pnpm dev               # http://localhost:3000  → redirects to /en
                       # http://localhost:3000/admin → create first user
```

For local dev there is a seeded admin user (`pnpm tsx scripts/seed-admin.ts`): `dev@websitecore.local` / `devpassword`. Dev-only — never seed it in a shared environment; create real users through `/admin`.

In development Payload pushes schema changes directly to the DB (drizzle push). Before production, migrations are generated with `pnpm payload migrate:create` (Phase 7 concern).

## Commands

| Command | What |
|---|---|
| `pnpm dev` | Dev server |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint (includes the core→rentals boundary rule) |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm generate:types` | Regenerate `src/payload-types.ts` after schema changes |
| `pnpm generate:importmap` | Regenerate the admin import map |
| `pnpm test` | Vitest integration + Playwright e2e |

## Where things go

See [ARCHITECTURE.md](ARCHITECTURE.md) §3. Short version: reusable platform code in `src/modules/core`, Mariposa-specific code in `src/modules/rentals`, wiring only in `src/payload.config.ts` and `src/app`. Core must never import from rentals (ESLint enforces this).

## Environments & secrets

All variables documented in [.env.example](../.env.example). `PAYLOAD_SECRET` must differ per environment. Production `DATABASE_URL` must be the Supabase **transaction pooler** string (port 6543) — a direct connection will exhaust Postgres connections under Netlify serverless.
