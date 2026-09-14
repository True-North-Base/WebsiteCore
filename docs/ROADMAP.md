# ROADMAP.md

Implementation phases for the CR Mariposa site. Each phase has exit criteria; don't start a phase before the previous one's criteria are met. `main` stays deployable throughout; work happens on focused `feature/*` branches.

## Phase 0 — Discovery & architecture ✅ (2026-08-26)

Design direction reviewed, live site inventoried, versions verified, architecture and content model documented (this docs set). No application code was created in this phase.

**Re-audit on 2026-08-26:** verified the completed foundation against current official Payload, Next.js, Node.js, Netlify, Supabase, and Payload storage documentation; added the missing `/bosquesdecarao` legacy path; tightened the core/rentals content boundary; and specified separate runtime/migration database connections and R2 public-delivery configuration.

## Phase 1 — Foundation ✅ (2026-08-26)

Scaffolded Payload 3.88 + Next 16.3 (pnpm, Node 22.23) with Postgres adapter (UUID ids), Tailwind 4 with design tokens, ESLint (incl. core→rentals boundary rule) + Prettier, module skeleton (`src/modules/core`, `src/modules/rentals`), `users` (roles admin/editor) + `media` collections, localization en/es with `[locale]` routing and typed UI dictionaries, `.env.example`, fonts via next/font.

**Exit verified:** `pnpm build` ✅ (`/en`, `/es` SSG); admin login ✅ (schema pushed to local Postgres 17.11, seeded admin, JWT login via `/api/users/login`, login UI renders); lint ✅ typecheck ✅; DEVELOPMENT.md written. _Deviation from plan: verified against local portable Postgres instead of a Supabase dev DB (no accounts available in-session — Supabase is wired for staging in Phase 7 setup)._

## Phase 2 — Design proof (implementation complete; desktop approved, mobile refinement awaiting live acceptance) `feature/phase-2-design-proof`

With seed/mock data only: homepage (design 3a/3b), ONE polished property detail page (2d/2e), navigation, footer, mobile experience, WhatsApp CTA. The 1C source is stored in-repository, the validated tokens and component rules are recorded in `docs/DESIGN_SYSTEM.md`, and D-011 is resolved by omitting the misleading date field. No search, availability, booking, or payment engine was introduced.

**Exit:** client visual approval of homepage + property page on desktop and mobile. Desktop direction was approved on 2026-08-27. On 2026-08-29 the owner reviewed mobile/Wander references and approved implementation of rounded listing media, a shorter mobile hero, structured sleeping arrangements, a full-screen swipe viewer, and a categorized photo showcase. Final acceptance of the deployed responsive result remains the open gate before broader Phase 4 page production.

## Phase 3 — Content & CMS (implementation and browser workflow verification complete; owner hands-on walkthrough pending) `feature/phase-3-content-cms`

Implement collections/globals per CONTENT_MODEL.md: core Site Settings; rental Properties, Reviews, Leads, rental settings, and typed page globals. Add localized fields, drafts, admin UX polish (field descriptions in plain language for the owner), connect frontend to Local API with publish-revalidation, and add the controlled lead form server action with validation. Do not introduce generic collection factories to move rental relationships into core.

**Implemented:** concrete core/rentals collections and globals; localized fields and drafts; published-only Local API reads; publish/delete revalidation; bilingual CMS-backed homepage and Penthouse Lago page; validated server-action inquiry form with public REST create denied; idempotent local Phase 3 seed; generated Payload types and owner checklist. On 2026-08-27, the local browser workflow verified localized edit/draft/publish/restore behavior, unpublished-property isolation, inquiry submission and closure, and REST create denial. The homepage temporarily retains both approved and Wander-inspired trust-section concepts for the explicit owner comparison in D-021.

**Mobile content refinement — 2026-08-29:** added categorized gallery metadata, a curated showcase flag, localized room-level sleeping arrangements, and the corresponding public photo showcase/viewer. The generated migration was reviewed and applied through the staging migration connection; Penthouse Lago's 13 existing R2-backed media relationships were categorized in place, with two neutral sleeping summaries pending owner confirmation of exact bed sizes.

**Property-information refinement — 2026-08-29:** replaced the compact key/value list with localized cancellation, property-rule, and stay-detail groups; added an official district-level Google Maps embed contract with a functional map link fallback; and seeded six explicit platform placeholders whose URLs can be approved or removed in Rental settings. The reviewed schema migration was applied as staging batch 3. A restricted Google Maps Embed API key is still required before the interactive iframe replaces the fallback.

**Exit:** owner can perform every task on [CMS_ADMIN_CHECKLIST.md](CMS_ADMIN_CHECKLIST.md) (create/edit/hide property, upload/reorder/delete photos, pick hero, edit amenities/reviews/contact info) in a walkthrough; frontend renders CMS content in both locales. Frontend rendering and the core browser workflow are verified; the owner's hands-on walkthrough, including the remaining media and settings operations, is still pending.

**Early infrastructure checkpoint — 2026-08-27:** linked the dedicated `CRMARIPOSA` Supabase project; generated, reviewed, and applied the initial Payload migration; seeded the approved Phase 3 content without copying the local development user or test records; verified seed idempotency; and passed the production build plus all five integration tests against Supabase. This deliberately does not mark Phase 7 complete: Cloudflare R2, a named staging administrator, the Netlify deploy, and client acceptance remain pending.

## Phase 4 — Complete public site `feature/i18n` etc.

Properties listing (2c), all 14 properties entered with real content (EN + ES), About, Property Management, Contact pages, reviews populated, language toggle everywhere.

**Phase 4A catalogue checkpoint — 2026-08-30:** implemented the approved no-hero all-homes catalogue with two-column desktop/one-column mobile cards, All / Santa Ana / Escazú / Beach filters, an eight-plus-six progressive reveal, bilingual interior navigation, and direct-contact CTA. Audited all fourteen legacy property pages; seeded the thirteen remaining homes in EN/ES with verified facts and six representative R2-backed images each; left unverified occupancy, ratings, stay times, rules and platform URLs blank. Source conflicts and the master-image follow-up are recorded in [PHASE4_PROPERTY_CONTENT_AUDIT.md](PHASE4_PROPERTY_CONTENT_AUDIT.md). About, Property Management, Contact and review population remain in Phase 4B.

**Phase 4B editorial checkpoint — 2026-08-30:** implemented dedicated CMS-backed About, Property Management and Contact routes in EN/ES with localized SEO, locale-preserving navigation, WhatsApp/call actions, the validated inquiry form, safe approved fallbacks, and mobile layouts. The three reviews already supplied for the approved design were seeded; the owner must still confirm their final publication and platform attribution. The real staging CMS/R2 browser suite passes 8/8; no additional testimonials are invented.

**Exit:** every route in both locales renders real content; no lorem ipsum anywhere.

## Phase 5 — Production media `feature/production-media`

Wire `@payloadcms/storage-s3` 3.88.0 → Cloudflare R2 per D-017; migrate owner-approved originals (do not assume Squarespace derivatives are masters); verify upload/replace/delete/reorder/hero flows and responsive output against the R2 public domain. Test the largest real originals before deciding whether direct client uploads/CORS are needed.

**Credential-free preparation — 2026-08-28:** installed the exact 3.88.0 adapter; added all-or-none R2 environment validation, server-mediated uploads, public-URL generation, and a strict `next/image` remote pattern; and prepared a dry-run-first migration command guarded to the current 13-record Phase 3 dataset. No bucket was created, no object was uploaded, and no deployment was made. Owner action is still required to create/configure R2, provide the ignored credentials, review and apply the migration, and run the real upload/admin checks.

**Operational staging checkpoint — 2026-08-29:** created/configured the R2 bucket and public delivery URL with scoped credentials; stored the five local variables only in ignored files; reviewed, dry-ran, and applied the guarded 13-record migration; verified provider-neutral object keys in Postgres and public R2 delivery on the Netlify staging site. The largest-original and full owner upload/replace/delete/reorder walkthrough remain the Phase 5 exit gate.

**Exit:** all media served from R2 on the staging deploy; large-original upload verified.

## Phase 6 — Quality `feature/seo`

Accessibility pass (keyboard, contrast, alt coverage), per-page/property SEO metadata, JSON-LD, sitemap/robots, **all legacy redirects from CONTENT_MODEL.md implemented and re-verified against a fresh crawl of the Squarespace sitemap**, 404 page, GA4 + Search Console, form spam protection (honeypot + rate limit first; CAPTCHA only if abused), performance budget (Lighthouse ≥ 90 mobile on home and property pages).

**Exit:** checks above documented as executed, with numbers.

**Chunk 1 launch-foundation checkpoint — 2026-08-30:** added a CMS-backed bilingual sitemap with EN/ES/x-default alternates, environment-safe robots behavior that blocks staging while reserving production crawling for the canonical domain, sanitized Organization/WebSite/Accommodation/Breadcrumb JSON-LD, complete 301 coverage for the fresh 15-path Squarespace sitemap, and a branded bilingual global/route-level 404. Current Google VacationRental rich-result markup is deliberately deferred because most properties do not yet meet its required occupancy, precise-coordinate, stable-identifier and minimum-eight-photo contract. Chunk 2 remains accessibility, performance measurement/fixes, form spam protection and the client acceptance checklist.

**Chunk 2 launch-hardening checkpoint — 2026-08-31:** fixed the narrow mobile discovery-bar gap at 320 px and 390 px; added a silent honeypot and conservative database-backed HMAC rate limit (five accepted attempts per 15 minutes, with raw network addresses never stored); completed automated WCAG 2.1 A/AA plus keyboard/focus/touch-target checks; and reduced competing responsive-image fetches without changing the approved design. The bilingual [CLIENT_ACCEPTANCE_CHECKLIST.md](CLIENT_ACCEPTANCE_CHECKLIST.md) and measured [LAUNCH_QUALITY_REPORT.md](LAUNCH_QUALITY_REPORT.md) record the verification and open approvals. Phase 6 remains open for analytics/Search Console, the final deployed Lighthouse ≥90 measurements, privacy approval, and owner/client acceptance gates.

**Deployed performance checkpoint — 2026-09-14:** the final staging build passed three fresh Lighthouse mobile runs per required route: homepage performance median 96 (LCP 2,529 ms), property median 97 (LCP 2,456 ms), Accessibility/Best Practices 100 throughout, and CLS 0. SEO 69 reflects only the deliberate staging crawl block. All 51 integration tests, lint, typecheck, production build and live EN/ES smoke/mobile checks passed. The mobile ≥90 measurement gate is now met; analytics/Search Console, privacy/content approval and owner/client walkthroughs remain open. See [LAUNCH_QUALITY_REPORT.md](LAUNCH_QUALITY_REPORT.md) and D-028.

## Phase 7 — Staging & client acceptance

Netlify staging deploy on production infra (Supabase prod DB, R2). Reassess D-005 (admin behavior on Netlify). Give the client an acceptance checklist; collect consolidated feedback; implement approved fixes.

**Staging checkpoint — 2026-08-29:** created the named staging administrator, entered the runtime variables in Netlify, and deployed [cr-mariposa-staging.netlify.app](https://cr-mariposa-staging.netlify.app). Live checks passed for EN/ES homepage, property detail, categorized photo showcase, R2 images, and the Payload login route; the full local Chrome suite passed 9/9. Written owner acceptance is still pending.

**Client editor checkpoint — 2026-09-13/14:** with explicit approval, created the Editor account for `mariposacrtravel@gmail.com` and verified its staging login and property-creation access, without user-management access or permanent content-deletion permission. The temporary credential was kept out of files/Git and was lost when the interrupted session ended; the existing account's empty password-change form is prepared for the administrator to complete securely. Password handoff and the client-led CMS walkthrough remain pending. The bilingual [CLIENT_CMS_QUICKSTART.md](CLIENT_CMS_QUICKSTART.md) covers property/media publishing and account care. No production-domain changes were made.

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
2. **Discovery control semantics** (resolved for Phase 2 by D-018) — Where / Guests links to the homes section; dates are intentionally omitted because the site cannot verify availability.
3. **Spanish content authoring load** — the current site is English-only; 14 properties × all localized fields is real owner work. Plan it into Phase 4, offer machine-translation drafts the owner corrects.
4. **Squarespace URL completeness** — nav-derived redirect table may miss pages/images; re-crawl sitemap in Phase 6 before cutover.
5. **Image rights/quality** — confirm originals exist outside Squarespace at full resolution before Phase 5.
6. **Rating data staleness** — manual OTA ratings on properties; owner must own updating them (note in admin field description).
7. **Approved design evidence** (resolved for Phase 2) — the 1C refined source, offline companion, support files, and supplied imagery are stored under `Desings/Contemporary hospitality design direction/`.
8. **Node/runtime drift and enforcement** — Phase 1 is on Node 22, now Maintenance LTS, while Node 24 is Active LTS; `package.json` also still permits unsupported Node 18 and omits the selected pnpm version. Keep 22 for Phase 2, fix the metadata in the next tooling change, and evaluate 24 once with the full suite before staging (D-014).
9. **Database connection modes** — Netlify runtime needs transaction pooling, while migrations/admin tools need a direct or session connection. Mixing them can cause migration or prepared-statement failures (D-016).
10. **Lead privacy/retention** — the form stores contact details. Approve privacy copy, consent behavior where applicable, access roles, and a retention/deletion policy before production.
