# WebsiteCore — CR Mariposa Rentals

Production website for [CR Mariposa Rentals](https://www.crmariposarentals.com/) (family-run furnished rentals in Santa Ana, Costa Rica) and the first implementation of a reusable small-business website platform.

**Status: Phase 3 content/CMS is implemented and the Supabase/R2-backed Netlify staging site is live. The owner admin walkthrough and final acceptance of the 2026-08-29 mobile refinement remain open before Phase 4.**

## Two objectives, in priority order

1. Ship an excellent CR Mariposa website.
2. Establish genuinely reusable engineering patterns for future client websites.

Objective 2 is never allowed to delay or complicate Objective 1.

## Stack

Next.js 16 (App Router) · React · TypeScript · Tailwind CSS · Payload CMS 3 · PostgreSQL · Cloudflare R2 media · Netlify hosting. The staging application runs on Supabase, serves provider-neutral media object keys through R2's public URL, and is deployed at [cr-mariposa-staging.netlify.app](https://cr-mariposa-staging.netlify.app). Exact versions and rationale: [docs/DECISIONS.md](docs/DECISIONS.md).

## Documentation map

| File | What it answers |
|---|---|
| [AGENTS.md](AGENTS.md) | Rules and map for AI agents / contributors working in this repo |
| [CLAUDE.md](CLAUDE.md) | Claude Code entry point (points to AGENTS.md) |
| [docs/PROJECT_BRIEF.md](docs/PROJECT_BRIEF.md) | Product goal, users, scope, and launch gates |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System shape, module boundaries, repo structure |
| [docs/CONTENT_MODEL.md](docs/CONTENT_MODEL.md) | Collections, globals, fields, localization |
| [docs/FUTURE_MODULES.md](docs/FUTURE_MODULES.md) | Scheduling / reservations / payments — documented, NOT built |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Version choices and architectural decisions with rationale |
| [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | Approved 1C visual direction, tokens, components, and responsive rules |
| [docs/CMS_ADMIN_CHECKLIST.md](docs/CMS_ADMIN_CHECKLIST.md) | Owner walkthrough for content, media, publishing, and inquiries |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Phases 1–9 with exit criteria |
| [docs/LEARNING.md](docs/LEARNING.md) | Plain-language explanations of the architecture being learned |
