# WebsiteCore — CR Mariposa Rentals

Production website for [CR Mariposa Rentals](https://www.crmariposarentals.com/) (family-run furnished rentals in Santa Ana, Costa Rica) and the first implementation of a reusable small-business website platform.

**Status: Phase 0 complete (architecture & documentation). No application code yet.**

## Two objectives, in priority order

1. Ship an excellent CR Mariposa website.
2. Establish genuinely reusable engineering patterns for future client websites.

Objective 2 is never allowed to delay or complicate Objective 1.

## Stack (decided, not yet scaffolded)

Next.js 16 (App Router) · React · TypeScript · Tailwind CSS · Payload CMS 3 · PostgreSQL · Cloudflare R2 media · Netlify hosting. Exact versions and rationale: [docs/DECISIONS.md](docs/DECISIONS.md).

## Documentation map

| File | What it answers |
|---|---|
| [AGENTS.md](AGENTS.md) | Rules and map for AI agents / contributors working in this repo |
| [CLAUDE.md](CLAUDE.md) | Claude Code entry point (points to AGENTS.md) |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System shape, module boundaries, repo structure |
| [docs/CONTENT_MODEL.md](docs/CONTENT_MODEL.md) | Collections, globals, fields, localization |
| [docs/FUTURE_MODULES.md](docs/FUTURE_MODULES.md) | Scheduling / reservations / payments — documented, NOT built |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Version choices and architectural decisions with rationale |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Phases 1–9 with exit criteria |
