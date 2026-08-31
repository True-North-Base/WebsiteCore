# DEVELOPMENT.md

## Prerequisites

- Node 22.23.2 reference version (22.x Maintenance LTS; see [DECISIONS.md](DECISIONS.md) D-014)
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
pnpm seed:phase3       # idempotent approved homepage/Penthouse preview content
```

For local dev there is a seeded admin user (`pnpm tsx scripts/seed-admin.ts`): `dev@websitecore.local` / `devpassword`. Dev-only — never seed it in a shared environment; create real users through `/admin`.

In development Payload pushes schema changes directly to the DB (drizzle push). Before production, migrations are generated with `pnpm payload migrate:create` (Phase 7 concern).

## Commands

| Command | What |
|---|---|
| `pnpm dev` | Dev server |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint (includes the core→rentals boundary rule) |
| `pnpm migrate:media:r2 -- --help` | Show the guarded Phase 3 media migration workflow |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm generate:types` | Regenerate `src/payload-types.ts` after schema changes |
| `pnpm generate:importmap` | Regenerate the admin import map |
| `pnpm seed:phase3` | Upsert the local Phase 3 CMS seed without duplicating documents |
| `pnpm test` | Vitest integration + Playwright e2e |

## Phase 3 content workflow

1. Start Postgres, then run `pnpm seed:phase3` once. It is safe to rerun after resetting or refining local content.
2. Open `/admin`, sign in, and use the locale selector to maintain both English and Spanish localized fields.
3. Save drafts freely. Only published documents are visible on the public site.
4. Publishing or unpublishing relevant content triggers path revalidation for `/en`, `/es`, and the approved property route.
5. Use [CMS_ADMIN_CHECKLIST.md](CMS_ADMIN_CHECKLIST.md) for the owner walkthrough. Phase 4 does not start until that walkthrough and the deferred mobile visual review are accepted.

The seed intentionally includes only the approved homepage and Penthouse Lago proof content. The remaining 13 properties and the rest of the public pages are Phase 4 content work. When `DATABASE_URL` is absent or the local database has not been seeded, development falls back to the approved Phase 2 content; production does not hide database failures this way.

## Where things go

See [ARCHITECTURE.md](ARCHITECTURE.md) §3. Short version: reusable platform code in `src/modules/core`, Mariposa-specific code in `src/modules/rentals`, wiring only in `src/payload.config.ts` and `src/app`. Core must never import from rentals (ESLint enforces this).

## Environments & secrets

All currently implemented variables are documented in [.env.example](../.env.example). `PAYLOAD_SECRET` must differ per environment.

Production has two database connection contexts (D-016):

- Application runtime: `DATABASE_URL` uses the Supabase **transaction pooler** string (port 6543) for Netlify's short-lived functions.
- Migrations, schema inspection, backup/restore: `MIGRATION_DATABASE_URL` uses a separate server-only direct connection, or the session pooler where direct connectivity is unavailable. Supply it only to the controlled command/job running that operation; do not run production migrations through the transaction-pooler URL.

The repository is linked to the CR Mariposa Supabase project through `supabase/config.toml`; CLI link state is under ignored `supabase/.temp/`. Local staging credentials live only in ignored `.env.supabase.local`. Payload remains the schema-migration authority: committed migrations are under `src/migrations`, while `supabase/migrations` is intentionally unused.

The initial Phase 3 migration was applied and the approved seed was verified idempotent on Supabase on 2026-08-27. The reviewed mobile-gallery and property-information refinements were applied as batches 2 and 3 on 2026-08-29. Do not copy the local `dev@websitecore.local` account to any shared environment; staging uses a separately created named administrator. The 13 approved media records were migrated to provider-neutral R2 object keys and are served from R2 on the Netlify staging deployment.

## Google Maps

`GOOGLE_MAPS_EMBED_API_KEY` enables the official interactive map on property pages. Create a dedicated browser-visible key, restrict it to the **Maps Embed API**, and add website-referrer restrictions for staging and production. The build uses `view` mode when approximate coordinates exist and a public-district `place` query otherwise. With no key, the page deliberately retains the styled approximate-area panel and a functional **Open in Google Maps** link; it never exposes an exact property address.

## Production media / R2

R2 is an all-or-none optional configuration. With no `R2_*` values, local development continues to use the ignored `media/` directory. If even one R2 value is present, every value in [.env.example](../.env.example) is required and validated at startup; this prevents a production deploy from silently writing uploads to Netlify's ephemeral filesystem.

Payload uploads through the private `R2_ENDPOINT`. Postgres stores provider-neutral object keys; the media collection prepends the separate `R2_PUBLIC_URL` only when records are read. Changing the public asset host therefore does not require a media-table rewrite. The Next image allowlist is generated narrowly from that public URL. Uploads remain server-mediated; do not enable direct browser uploads or R2 CORS until the largest owner-approved originals prove they are necessary.

After the bucket, public delivery URL, and scoped object read/write credentials exist, keep their five `R2_*` values in an ignored `.env.r2.local` file. Then run:

```bash
# Validates configuration, exactly 13 DB records, and exactly 13 local source files.
pnpm migrate:media:r2 -- --env-file .env.supabase.local --env-file .env.r2.local

# Only after reviewing the dry-run mapping; uploads in place and verifies every
# original/derived public object over HTTP before reporting success.
pnpm migrate:media:r2 -- --env-file .env.supabase.local --env-file .env.r2.local --apply
```

The command retains each media UUID, so existing home/property relationships remain intact. Its exact-count and one-to-one filename guards are deliberately specific to the current approved Phase 3 dataset; do not weaken them to turn this into a generic bulk migration tool. If additional media is added first, stop and make a reviewed migration manifest instead.

For Netlify, set `DATABASE_URL`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, and the complete five-variable R2 set. Do **not** set `MIGRATION_DATABASE_URL` in the app runtime. These runtime variables, a named administrator, the migrated media set, and the public staging smoke test were verified on 2026-08-29. A real large-original upload test and the owner's upload/replace/delete/reorder workflow remain required before production.
