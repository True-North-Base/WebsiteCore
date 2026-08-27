# ROADMAP.md

Implementation phases for the CR Mariposa site. Each phase has exit criteria; don't start a phase before the previous one's criteria are met. `main` stays deployable throughout; work happens on focused `feature/*` branches.

## Phase 0 — Discovery & architecture ✅ (2026-08-26)

Design reviewed, live site inventoried, versions verified, architecture and content model documented (this docs set). No application code.

## Phase 1 — Foundation ✅ (2026-08-26)

Scaffolded Payload 3.88 + Next 16.3 (pnpm, Node 22.23) with Postgres adapter (UUID ids), Tailwind 4 with design tokens, ESLint (incl. core→rentals boundary rule) + Prettier, module skeleton (`src/modules/core`, `src/modules/rentals`), `users` (roles admin/editor) + `media` collections, localization en/es with `[locale]` routing and typed UI dictionaries, `.env.example`, fonts via next/font.

**Exit verified:** `pnpm build` ✅ (`/en`, `/es` SSG); admin login ✅ (schema pushed to local Postgres 17.11, seeded admin, JWT login via `/api/users/login`, login UI renders); lint ✅ typecheck ✅; DEVELOPMENT.md written. *Deviation from plan: verified against local portable Postgres instead of a Supabase dev DB (no accounts available in-session — Supabase is wired for staging in Phase 7 setup).*

## Phase 2 — Design proof  `feature/homepage`, `feature/property-page`

With seed/mock data only: homepage (design 3a/3b), ONE polished property detail page (2d/2e), navigation, footer, mobile experience, WhatsApp CTA. Translate design tokens to Tailwind config; write docs/DESIGN_SYSTEM.md. Resolve D-011 (search bar date field) with the client.

**Exit:** client visual approval of homepage + property page on desktop and mobile. Do not multiply unapproved page designs.

## Phase 3 — Content & CMS  `feature/content-model`, `feature/contact-leads`

Implement collections/globals per CONTENT_MODEL.md (properties, reviews, leads, site-settings, page globals), localized fields, drafts, admin UX polish (field descriptions in plain language for the owner), connect frontend to Local API with publish-revalidation, lead form server action with validation.

**Exit:** owner can perform every task on the admin checklist (create/edit/hide property, upload/reorder/delete photos, pick hero, edit amenities/reviews/contact info) in a walkthrough; frontend renders CMS content in both locales.

## Phase 4 — Complete public site  `feature/i18n` etc.

Properties listing (2c), all 14 properties entered with real content (EN + ES), About, Property Management, Contact pages, reviews populated, language toggle everywhere.

**Exit:** every route in both locales renders real content; no lorem ipsum anywhere.

## Phase 5 — Production media  `feature/production-media`

Wire `@payloadcms/storage-s3` → Cloudflare R2; migrate originals (pull full-resolution images from Squarespace); verify upload/replace/delete/reorder/hero flows and responsive output against R2.

**Exit:** all media served from R2 on the staging deploy; large-original upload verified.

## Phase 6 — Quality  `feature/seo`

Accessibility pass (keyboard, contrast, alt coverage), per-page/property SEO metadata, JSON-LD, sitemap/robots, **all legacy redirects from CONTENT_MODEL.md implemented and re-verified against a fresh crawl of the Squarespace sitemap**, 404 page, GA4 + Search Console, form spam protection (honeypot + rate limit first; CAPTCHA only if abused), performance budget (Lighthouse ≥ 90 mobile on home and property pages).

**Exit:** checks above documented as executed, with numbers.

## Phase 7 — Staging & client acceptance

Netlify staging deploy on production infra (Supabase prod DB, R2). Reassess D-005 (admin behavior on Netlify). Give the client an acceptance checklist; collect consolidated feedback; implement approved fixes.

**Exit:** written client sign-off.

## Phase 8 — Production cutover

Record **all** existing DNS first (MX, SPF, DKIM, DMARC, TXT — the domain's email must survive the move). Attach domain, verify SSL, redirects live, forms, analytics, email flow, every major page smoke-tested mobile + desktop. Keep Squarespace paid until verified, then cancel.

**Exit:** production live on crmariposarentals.com; post-launch monitoring for 1–2 weeks (404 reports in Search Console catch missed redirects).

## Phase 9 — Extraction (only after launch)

Identify code proven reusable in production and extract `agency-web-starter`: core collections (users, media, site-settings, leads, reviews), seo/slug fields, form patterns, UI primitives, deployment + docs conventions. Rental-specific concepts stay out of the starter.

**Exit:** a second site can be scaffolded from the starter without importing anything rentals-flavored.

---

## Open risks (tracked)

1. **Netlify + Payload admin ergonomics** (cold starts, timeouts) — mitigation and escape hatch in D-005; decision checkpoint at Phase 7.
2. **Search bar date field over-promises** (D-011) — resolve in Phase 2 with client.
3. **Spanish content authoring load** — the current site is English-only; 14 properties × all localized fields is real owner work. Plan it into Phase 4, offer machine-translation drafts the owner corrects.
4. **Squarespace URL completeness** — nav-derived redirect table may miss pages/images; re-crawl sitemap in Phase 6 before cutover.
5. **Image rights/quality** — confirm originals exist outside Squarespace at full resolution before Phase 5.
6. **Rating data staleness** — manual OTA ratings on properties; owner must own updating them (note in admin field description).
