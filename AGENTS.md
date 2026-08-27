# AGENTS.md — map and rules for agents working in this repo

This file is a concise map. Long-form reasoning lives under `docs/`. Read this fully before writing code.

## What this project is

The production website for **CR Mariposa Rentals** (14 furnished rental homes in Santa Ana / Escazú / Pacific coast, Costa Rica), built as the first instance of a reusable small-business website platform ("WebsiteCore").

Priorities, in order — never trade 1 for 2:

1. **Ship an excellent CR Mariposa website.**
2. Establish reusable patterns for future client sites (roofing, dentist, etc.).

## Current phase

**Phase 0 done. Next: Phase 1 (foundation scaffold).** See [docs/ROADMAP.md](docs/ROADMAP.md). Do not start work from a later phase without the earlier phase's exit criteria met.

## Stack

Next.js 16 App Router + Payload CMS 3 in a single app · TypeScript · Tailwind · Postgres (Supabase, pooled) · Cloudflare R2 media via `@payloadcms/storage-s3` · Netlify · pnpm · Node 22 LTS. Pinned versions and rationale: [docs/DECISIONS.md](docs/DECISIONS.md).

## Hard rules

- **V1 scope**: content site + inquiry funnel (WhatsApp / call / lead form). **Never build** reservations, availability calendars, checkout, payments, appointment scheduling, PMS/OTA integrations, notification engines, or provider interfaces (`ReservationProvider` etc.) unless a task explicitly activates that capability. They are documented in [docs/FUTURE_MODULES.md](docs/FUTURE_MODULES.md) as future work — documentation is the deliverable, not code.
- **Module boundary**: `src/modules/core` (reusable across any business) must never import from `src/modules/rentals` (Mariposa domain). Rentals may import core. Wiring happens only in `payload.config.ts` and `src/app`. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
- **Property stays a content entity.** No `reservations[]`, availability, or payment fields inside Property. Future modules relate to Property by its UUID.
- **No premature abstraction.** No generic page builder, no plugin framework, no unused interfaces, no monorepo split. The extraction into a generic starter is Phase 9, after launch.
- **Bilingual**: every user-visible string is localized EN/ES (Payload localized fields for content; UI dictionary for chrome). Never hardcode display copy in components.
- **Security**: no secrets in the client bundle or in git; `.env.example` documents every variable; admin routes stay authenticated.
- **Legacy URLs**: the old Squarespace property URLs must 301 to new paths before production cutover — the mapping is in [docs/CONTENT_MODEL.md](docs/CONTENT_MODEL.md#legacy-url-redirects).

## Definition of done

Code is not "done" when written. Before reporting completion: `git diff` reviewed, lint clean, typecheck clean, tests pass where they exist, production build succeeds, and key pages manually verified in the browser when UI changed. Report exactly what was verified.

## Git

`main` stays deployable. One logical change per focused branch (`feature/...`) and PR. Commit messages explain why, not just what.

## Documentation map

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — system shape, boundaries, repo layout, design reference
- [docs/CONTENT_MODEL.md](docs/CONTENT_MODEL.md) — collections, globals, fields, redirects
- [docs/FUTURE_MODULES.md](docs/FUTURE_MODULES.md) — future capabilities and when to introduce abstractions
- [docs/DECISIONS.md](docs/DECISIONS.md) — decision log (append-only; add an entry when you make a significant choice)
- [docs/ROADMAP.md](docs/ROADMAP.md) — phase plan with exit criteria
