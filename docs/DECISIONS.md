# DECISIONS.md

Append-only log of significant decisions. Add an entry (D-###) in the PR that makes the choice. Reversals get a new entry referencing the old one.

---

## D-001 — Stack versions (verified 2026-08-26)

Verified against official sources on this date:

| Component       | Choice                                               | Basis                                                                                                                  |
| --------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Payload         | **3.x, latest at install (3.88.0 as of 2026-08-11)** | Actively maintained 3.x line; pin exact version in package.json at scaffold time                                       |
| Next.js         | **16.2.6+ (16.3.x line)**                            | Payload's documented supported ranges are 15.2.9–15.4.x and **16.2.6+**; Payload 3.88 itself ships against Next 16.3.0 |
| Node            | **22 LTS**                                           | Payload requires ≥ 20.9.0; 22 is the current active LTS, supported by Netlify                                          |
| Package manager | **pnpm**                                             | Payload's documented preference; yarn 1.x unsupported                                                                  |
| Database        | **PostgreSQL via `@payloadcms/db-postgres`**         | Relational fits the content model; team familiarity                                                                    |
| React           | Version paired with Next 16                          | Comes with the scaffold                                                                                                |

Rule: do **not** blindly bump majors; re-verify Payload's supported-Next range before any Next upgrade (they pin tightly).

## D-002 — Payload embedded in the Next.js app (not headless-separate)

One repo, one deploy, admin on the same domain, content read through the Local API with zero HTTP overhead. This is Payload 3's designed mode. Alternative (separate CMS deployment) adds an API hop, CORS, two deploys — no benefit at this scale.

## D-003 — Postgres hosted on Supabase (pooled)

Netlify's serverless functions require a pooled connection string (Supabase's pooler / pgBouncer) to avoid connection exhaustion. Supabase chosen over Neon on team familiarity (existing Supabase projects); either works and switching is a connection-string change. Server-only credentials; never in the client bundle.

## D-004 — Media on Cloudflare R2 via `@payloadcms/storage-s3`

Netlify's filesystem is ephemeral, so production uploads must live in object storage. R2 through Payload's documented S3-compatible adapter: no egress fees, custom domain for public delivery. Local disk in dev. Decided in Phase 0; wired in Phase 5 (dev proceeds on local storage until then).

## D-005 — Hosting on Netlify (with a portability requirement)

Client-side constraint (given). Netlify's Next.js runtime supports this stack per Netlify's own Payload deployment guide. Known risks — admin cold starts, function timeouts, DB connection limits — are mitigated by D-003, static public pages, and a hard rule: **no Netlify-proprietary APIs anywhere**, so the app can move to a Node host (Railway/Render/Fly) unchanged if admin UX proves unacceptable. Reassess at Phase 7 staging.

## D-006 — Public pages statically generated, revalidated on publish

14 properties, ~6 pages: fully static output with `revalidatePath` from Payload `afterChange`/`afterDelete` hooks. Visitors never wait on a cold function; only editors touch the dynamic path.

## D-007 — i18n: Payload localization + typed UI dictionary; no i18n framework

EN (default) + ES. Content fields localized in Payload with fallback to English — one place for editors to work, per-locale versions of every text field. UI chrome strings in a hand-rolled typed dictionary (`src/i18n`). next-intl or similar is unjustified at 2 locales × ~6 pages; revisit if pluralization/date-formatting needs grow. Routing via `/[locale]/` segment with hreflang alternates.

## D-008 — UUID primary keys everywhere

`idType: 'uuid'` on the Postgres adapter. Stable, globally unique identity for every document so future systems (PMS sync, reservations, analytics) can reference documents durably, and IDs don't leak document counts. Decided now because retrofitting key type later is a painful migration; costs nothing today.

## D-009 — Per-page globals instead of a generic Pages collection

About / Property Management / Contact are typed Payload globals with exactly the fields their designs need. A block-based page builder is the single most tempting premature abstraction in this project: it multiplies admin complexity for an owner who edits three fixed pages. Add a Pages collection only when the owner concretely asks to compose new pages.

## D-010 — Amenities and locations as fields, not collections

`amenityGroups` array and `region` select + `district` text live on Property (see CONTENT_MODEL.md "Rejected"). 14 properties, one editor: taxonomy collections would add relational bookkeeping with no user-facing feature behind it. Promotion criteria documented in CONTENT_MODEL.md.

## D-011 — Search bar is a filter + message-prefill, not availability search

The approved design's Where/When/Guests bar cannot query availability (none exists in V1). Behavior: Where/Guests filter the listing client-side; When (if kept) rides along into the prefilled WhatsApp/inquiry text. **Open item: confirm with client in Phase 2** whether to keep the date field visually given it doesn't check dates — risk of a promise the site can't keep.

## D-012 — No provider interfaces, no scheduling/payment/notification code in V1

Restated as a decision so it's citable: interfaces (`ReservationProvider` etc.) are introduced when their first implementation begins (FUTURE_MODULES.md). V1's extension points are stable UUIDs, module boundaries, and documentation — not code.

## D-013 — Single app, no monorepo; extraction is Phase 9

The generic `agency-web-starter` is extracted **after** Mariposa ships, from code proven by production use. A `packages/` split today would be organizing code we haven't written for a second client we don't have.

## D-014 — Exact verified version baseline after Phase 1 (2026-08-26)

This re-verification refines D-001 with the exact versions now locked by the completed Phase 1 foundation. It does not authorize an upgrade during this documentation pass.

| Component                     | Exact baseline                                         | Decision                                                                                                                                                                                                                   |
| ----------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Payload family                | **3.88.0**                                             | Keep `payload` and every `@payloadcms/*` package on the same exact version, including future `@payloadcms/storage-s3`                                                                                                      |
| Next.js / ESLint config       | **16.3.3**                                             | Exact pin; it is inside Payload's supported `16.2.6+` range and is the current stable security-fixed release                                                                                                               |
| React / React DOM             | **19.2.6**                                             | Exact versions paired in the current lockfile                                                                                                                                                                              |
| Node.js                       | **22.23.2 reference patch; deploy on the 22.x line**   | Phase 1 was verified on Node 22. Node 22 is now Maintenance LTS, not Active LTS as D-001 originally stated. Retain it for the current phase; evaluate Node 24 in one controlled upgrade with the full suite before staging |
| pnpm                          | **11.19.0**                                            | Record in `packageManager` when dependency metadata is next changed; the lockfile remains authoritative meanwhile                                                                                                          |
| TypeScript                    | **5.7.3**                                              | Exact current compiler baseline                                                                                                                                                                                            |
| Tailwind CSS / PostCSS plugin | **4.3.3**                                              | Exact resolved baseline; do not accept unreviewed minor drift during a feature branch                                                                                                                                      |
| Sharp                         | **0.34.2** direct dependency                           | Exact application dependency; transitive copies may differ                                                                                                                                                                 |
| PostgreSQL                    | **17.11 local reference; Supabase-managed production** | Keep local/staging schema behavior aligned and use generated migrations for shared environments                                                                                                                            |

Why retain Node 22 rather than silently changing it now: both [Payload](https://payloadcms.com/docs/getting-started/installation) and [Next.js 16](https://nextjs.org/docs/app/getting-started/installation) require Node 20.9+, and [Netlify can install a selected Node line or exact release](https://docs.netlify.com/build/configure-builds/manage-dependencies/). Node 24.20.0 is the current Active LTS while Node 22 remains supported LTS ([Node release status](https://nodejs.org/en/about/previous-releases), [Node 24 archive](https://nodejs.org/en/download/archive/v24)). The already-tested runtime is lower risk for Phase 2; the upgrade checkpoint prevents accidental permanent stagnation.

Compatibility evidence: [Payload 3.88.0 release](https://github.com/payloadcms/payload/releases/tag/v3.88.0), [Payload supported Next ranges](https://payloadcms.com/docs/getting-started/installation), [Next.js 16.3.3 release](https://github.com/vercel/next.js/releases/tag/v16.3.3), and [Netlify's maintained Next.js feature matrix](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/).

Known enforcement gap found by this audit: `package.json` still permits Node 18 even though current Payload and Next.js documentation require Node 20.9+, and it does not declare the selected pnpm version. Netlify is protected by `NODE_VERSION = "22"` and the lockfile records exact dependency resolutions, but the next foundation/tooling change should narrow the Node engine and add `packageManager: "pnpm@11.19.0"`. This documentation-only pass intentionally does not modify application metadata.

## D-015 — Rental-coupled content stays in the Rentals module during V1

The earlier Phase 0 model placed Leads, Reviews, and all static page globals in core. Their actual V1 shapes contain Property relationships, rental-form sources, OTA attribution, or Mariposa-specific page contracts. Keeping those definitions in core would either create a semantic dependency on Rentals or invite factories and polymorphic relationships with no second implementation.

Decision: V1 core contains Users, Media, generic Site Settings, access helpers, and genuinely shared SEO/slug fields. Rentals owns Properties, Leads, Reviews, rental settings, and the typed Mariposa page globals. Phase 9 may extract proven generic subsets after comparing them with a real second site. This preserves the core → rentals import prohibition without speculative abstraction.

## D-016 — Separate production runtime and migration database connections

Netlify runtime functions use Supabase's transaction pooler on port 6543. Migrations, schema inspection, backup/restore, and other administrative work use a controlled direct connection (or session pooler when direct connectivity is unavailable). Supabase explicitly recommends transaction mode for temporary/serverless clients and direct connections for migrations and administrative tools; transaction mode does not support prepared statements or session-level features ([Supabase connection guidance](https://supabase.com/docs/guides/database/connecting-to-postgres)).

The two connection strings are separate server-only environment secrets. Payload's development `push` behavior remains local-only; staging and production schema changes use generated, reviewed migrations through the migration connection. This refines D-003.

## D-017 — R2 public delivery and upload configuration are separate concerns

Production media uses `@payloadcms/storage-s3` **3.88.0** with Cloudflare R2, following Payload's documented Node/Netlify approach. Uploads use the private R2 S3 endpoint with server-only credentials, `region: 'auto'`, and `forcePathStyle: true`. Public images use a distinct `R2_PUBLIC_URL` (prefer a custom domain), `generateFileURL`, and `disablePayloadAccessControl: true`; `next/image` permits only that host. The S3 endpoint is never used as the public asset URL ([Payload storage adapters](https://payloadcms.com/docs/upload/storage-adapters)).

Start with server-mediated uploads. During Phase 5, test the client's real largest originals on Netlify. Enable direct client uploads and an explicit R2 CORS policy only if those tests demonstrate a request-size or reliability need. Do not add a generic storage abstraction: Payload's adapter is already the boundary.

## D-018 — Phase 2 follows 1C Refined and removes the date-shaped availability promise

The repository-held `CR Mariposa 1C Refined.dc.html` is the visual authority for the Phase 2 homepage (3a/3b) and property-detail proof (2d/2e). The implementation translates its typography, palette, square-cut geometry, image-led hierarchy, carousels, gallery, trust content, and mobile contact actions into production components; it does not reproduce the design export's generated runtime.

D-011's open question is resolved conservatively: the homepage discovery control contains **Where** and **Guests**, then navigates to the curated homes section. It has no **When** field, calendar UI, search backend, or availability claim. Phase 4 may turn Where / Guests into client-side filters once all 14 properties exist. A date control can return only when a later explicitly activated capability has honest semantics for it; manual dates may still be included in a WhatsApp or inquiry message.

The proof uses typed rental-owned mock content. Payload integration remains Phase 3, and only Penthouse Lago has a detail route in Phase 2. This prevents unapproved designs and content wiring from multiplying before the client accepts the visual system.

## D-019 — Phase 3 uses concrete CMS contracts with a strict publication boundary

Phase 3 implements concrete collection/global files rather than factories: core owns Site Settings and shared SEO/URL validation; Rentals owns Properties, Reviews, Leads, rental settings, typed page globals, content queries, and the inquiry action. This keeps D-015 enforceable and avoids turning one site's schema into a speculative framework.

Public rendering uses Payload Local API with `overrideAccess: false`, `draft: false`, localized reads, and collection access constrained to published documents. Authenticated editors can see drafts in admin. Collection/global hooks revalidate only when published content may have changed. A development-only fallback preserves the approved Phase 2 preview when the database is missing or unseeded; production database failures are not hidden by mock content.

The local seed deliberately contains the approved homepage, Penthouse Lago, its media, and genuine review examples only. Creating the remaining property/page content is Phase 4 work. The D-014 metadata gap is resolved in this tooling change by declaring `packageManager: pnpm@11.19.0` and narrowing the Node engine to supported `>=20.9.0 <25`.

## D-020 — Inquiry storage has one validated server-only ingress

Unauthenticated REST create access to `leads` is denied. The public form submits to one rental-owned Server Action that treats form data as untrusted, validates length/format/locale/source, resolves an optional published Property by slug, and only then uses the trusted Local API override to create a `new` lead. `requestedDates` remains free text and creates no availability, reservation, calendar, or booking semantics.

The form does not send email, WhatsApp, or notifications. The owner works inquiries in Payload admin. Rate limiting/honeypot controls, approved privacy copy, and a retention/deletion policy remain Phase 6/staging gates; CAPTCHA is introduced only if demonstrated abuse justifies it.

## D-021 — Two concrete trust-section concepts are retained for owner comparison

The owner requested that the approved 1C “Why Mariposa” section remain visible while a second, Wander-inspired hospitality concept is evaluated. The homepage therefore renders both sections temporarily. The alternate uses Mariposa-specific bilingual copy and existing Mariposa imagery; it copies neither Wander's brand language nor its content claims.

Payload exposes this as one explicitly named `hospitality*` field group under **Owner comparison**, alongside the existing `trust*` fields. This is intentionally duplicated, concrete schema—not a reusable section registry, visibility framework, experiment engine, or generic page builder. After the owner chooses a direction, remove the rejected rendering and its unused fields instead of preserving an unneeded abstraction.

## D-022 — Media object keys are canonical; delivery URLs are read-time projections

Payload's cloud-storage plugin normally writes the result of `generateFileURL` into the media table as well as returning it from reads. Persisting a Cloudflare hostname there would turn a delivery choice into canonical content and force a database rewrite when a custom domain or storage provider changes.

The R2 adapter therefore returns only the provider-neutral object key from `generateFileURL`. Payload persists that key for originals and generated sizes. A Media `afterRead` hook prepends `R2_PUBLIC_URL` for the admin, Local/REST APIs, and frontend. Property relationships remain stable Media UUIDs, while the media row's filenames/object keys identify the stored objects. Moving from the temporary R2 development hostname to a custom media domain—or from R2 to another object store—changes configuration and storage credentials, not content rows.

## D-023 — Property photography is rounded selectively and explored touch-first

The owner approved a 2026-08-29 refinement after comparing the mobile site with strong hospitality references. CR Mariposa keeps its warm editorial typography, color, quiet hairlines, and mostly square layout surfaces, while content photography gains an `18px` radius and compact metadata controls may use pills. This is a targeted hospitality-media treatment, not a universal rounded-card redesign.

Property photos follow a deliberate progressive path: the detail page retains its desktop mosaic and uses a native horizontal swipe rail on mobile; selecting any detail-page image enters the localized `/properties/[slug]/photos` route, which presents a CMS-curated Showcase plus category tabs. Selecting an image from that showcase launches the full-screen scroll-snap viewer with keyboard controls on larger screens. Gallery rows carry concrete category and showcase fields rather than deriving meaning from filenames or adding a generic gallery framework.

Property also gains localized `sleepingArrangements` rows with an existing Media relationship, room name, and factual bed summary. These support “Where you'll sleep” without introducing availability, reservation, or booking semantics. Unknown bed sizes remain neutral (“1 bed”) until confirmed by the owner. Existing Media UUID relationships and provider-neutral R2 object keys remain canonical under D-022.

## D-024 — Property logistics are structured, approximate, and never represented by dead links

The owner approved a second 2026-08-29 refinement based on the clarity of Wander's property-logistics presentation. CR Mariposa adopts the information hierarchy, not its booking semantics or copy: `thingsToKnow` now supplies localized **Cancellation & terms**, **Property rules**, and **Stay details** groups. The desktop view uses three hairline-separated columns and mobile preserves the same order as stacked sections. Optional “Read more” controls use real disclosures; cancellation promises and unverified rules are never invented.

Property location context uses Google's official Maps Embed API in an iframe. The implementation uses approximate coordinates with `view` mode when supplied, otherwise a district-level `place` query, and always retains a functional Google Maps search link. Exact addresses remain private. The browser-visible key must be dedicated to Maps Embed, API-restricted, and website-referrer-restricted; without it the designed district-level fallback remains visible. Google documents that an API key and enabled billing account are required even though Maps Embed usage is available without charge ([setup](https://developers.google.com/maps/documentation/embed/get-api-key), [embedding guide](https://developers.google.com/maps/documentation/embed/embedding-map), [key security](https://developers.google.com/maps/api-security-best-practices)).

The rental-settings platform list includes the intended marketplace/social profiles with optional URLs. A blank URL renders a labelled non-clickable placeholder instead of a fake `#` link. The owner can delete a platform during review or supply its approved public URL; only then does it become an external link.

## D-025 — The catalogue filters verified location, not availability

The Phase 4 all-homes page implements the approved 2c editorial pattern: no hero, two 3:2 image columns on desktop, one column on mobile, and eight homes before an explicit reveal of the remaining six. `PropertyCard` gains only a concrete catalogue variant; the page does not introduce a generic grid or filtering framework.

The four chips filter published records by public district/region: All, Santa Ana, Escazú, and Beach. Pacific properties map to Beach; central-valley records containing Escazú or Guachipelín map to Escazú; the remaining central-valley records map to Santa Ana. This small derivation respects the existing D-009 content model instead of adding a second overlapping location taxonomy for fourteen records. A future need for owner-defined regions or more cities would justify an explicit CMS field.

Filters are browser-local discovery only. They make no claim about dates, inventory, reservations, prices, or guest eligibility. Unverified occupancy, ratings, stay times, rules and marketplace links remain absent rather than being estimated. The legacy source audit and its factual conflicts are recorded in `docs/PHASE4_PROPERTY_CONTENT_AUDIT.md` for owner confirmation.

## D-026 — Structured data describes verified content without claiming rich-result eligibility

Phase 6 adds sanitized JSON-LD using the broad, truthful `Organization`, `LodgingBusiness`, `WebSite`, `Accommodation`, and `BreadcrumbList` types. Public property markup includes only page-visible names, descriptions, imagery, amenities, district-level location, and approximate coordinates already approved for display. It does not invent ratings, prices, availability, occupancy, reviews, or exact street addresses.

Google's current `VacationRental` rich-result contract requires a stable identifier shared across languages, precise latitude and longitude, occupancy, and at least eight photos including bedroom, bathroom, and common-area coverage. Most of the fourteen current property records intentionally have six representative migrated images and several retain unverified occupancy or coordinate fields. Emitting `VacationRental` now would therefore be incomplete or misleading. Activate it property-by-property only after the owner-approved originals and required facts satisfy the full contract and validate in Google's Rich Results Test. This choice does not alter the Property content boundary or introduce reservation functionality.

## D-027 — Public inquiry protection is quiet, privacy-conscious, and database-backed

The public form now uses an off-screen honeypot that silently accepts bot-shaped submissions without creating a Lead. Plausible submissions are limited to five accepted attempts per 15-minute window before a localized validation response is returned. The shared Postgres Lead store supplies the count, so the control works across serverless instances without adding a cache service or relying on unreliable process memory.

The key is an HMAC of the best platform-provided client address (Netlify, then Cloudflare/real/forwarded headers), with normalized email or telephone as a fallback when no valid address is available. The secret is server-only and raw network addresses are never stored. Historical Leads remain valid because the indexed key is nullable. A small concurrent burst may pass before both inserts are visible; that is an accepted trade-off for a conservative inquiry funnel. CAPTCHA remains deferred unless observed abuse shows this layered control is insufficient.

## D-028 — Published property pages are pre-rendered without freezing the portfolio

The mobile staging audit found late homepage hero discovery and cold property-page rendering to be the primary remaining performance costs. The hero now uses Next.js 16's documented `getImageProps` art-direction pattern: one eager, high-priority image selected by a native picture source, preserving the desktop/mobile imagery and crops without fetching both candidates.

Property detail and photo pages pre-render every published CMS slug for both parent locales. `force-static` and `dynamicParams: true` retain request-time generation for newly published properties, while the existing exact-path revalidation hooks refresh published edits, unpublishing, and republishing. A configured CMS is authoritative: a missing published property must return not-found rather than resurrecting the local Penthouse Lago seed. The no-database seed remains a development preview only; production static generation requires the database.

Payload 3.88 injects colour-scheme client-hint negotiation globally. Only its three exact theme headers are moved to `/admin/:path*`, preserving admin theme detection and unrelated headers while avoiding a first-visit public-page navigation restart. The property-gallery loading contract is unchanged because its earlier loading experiment regressed. Deployed Lighthouse and publish/unpublish verification remain release checks rather than assumptions.

## D-029 — Inquiry consent is explicit and analytics is opt-in

The production inquiry form stores personal contact details, so launch uses a concrete bilingual privacy notice and requires an unchecked consent box before submission. New Leads record the notice version, consent timestamp, and a 24-month retention-review date. The fields stay nullable so historical inquiries remain valid; an administrator performs a documented quarterly review and may retain a record longer only for an active relationship, a guest request, or a documented legal obligation. This operational policy requires owner/legal review where appropriate and does not claim to replace Costa Rican legal advice.

Google Analytics is optional and does not load until a visitor explicitly accepts the bilingual analytics notice. The preference remains in that browser; the site uses no advertising-cookie flow. Search Console verification is environment-driven. Blank marketplace rows are kept editable in the CMS but are hidden from the public footer until an approved URL exists, superseding D-024's temporary staging placeholder presentation.

---

_Template:_

```
## D-0XX — Title
Context → decision → why → what would change it.
```
