# ARCHITECTURE.md

System architecture for the CR Mariposa website and the WebsiteCore platform underneath it. The content architecture described here exists after Phase 3; later public routes, production media, quality work, and deployment remain on the roadmap. Future capabilities live in [FUTURE_MODULES.md](FUTURE_MODULES.md).

## 1. The shape of the system

One deployable: a single Next.js 16 App Router application with Payload CMS 3 installed inside it. Payload serves `/admin` and its APIs; the public site is server-rendered React from the same process, reading content through Payload's Local API (no HTTP hop, no separate CMS deployment).

```
┌────────────────────────── Next.js app (one deploy) ──────────────────────────┐
│                                                                              │
│  src/app/(frontend)/[locale]/...      src/app/(payload)/admin, /api          │
│        public site (RSC)                    Payload admin + REST             │
│                │                                   │                         │
│                └────────── Payload Local API ──────┘                         │
│                                    │                                         │
└────────────────────────────────────┼─────────────────────────────────────────┘
                                     │
                    PostgreSQL (Supabase, pooled)     Cloudflare R2 (media)
```

Why this shape: Payload 3 is installed into Next.js; one repo, one deploy, one auth story, and `/admin` on the same domain. Vercel is the current target (D-031); Netlify remains a fallback during migration. No proprietary storage or database migration is required.

## 2. Platform organization

Three conceptual layers. Only the first two get code in V1.

```
                        AGENCY PLATFORM (this repo)
                                  │
          ┌───────────────────────┴────────────────────────┐
          │                                                │
    PLATFORM CORE                                  RENTALS DOMAIN
    src/modules/core                               src/modules/rentals
    ├─ users                                       ├─ properties
    ├─ media                                       ├─ leads / inquiries
    ├─ site-settings                               ├─ reviews
    ├─ shared fields (seo, slug)                   ├─ typed page globals
    └─ access helpers                              ├─ rental settings / listing links
                                                    ├─ rental page components
                                                    └─ rental frontend routes
          │
          │
    FUTURE CAPABILITIES — documented only, zero code in V1
    (Scheduling, Appointments, Reservations, Payments,
     Notifications, Calendar, external providers)
    → see FUTURE_MODULES.md
```

### Boundary rules (enforced by review, and by ESLint import rules once Phase 1 lands)

1. `core` never imports from `rentals` (or any future business module).
2. `rentals` may import from `core`.
3. Modules never import from each other's internals — only from a module's public `index.ts`.
4. Composition happens in exactly two places: `payload.config.ts` (collections/globals/plugins) and `src/app` (routes). Nothing else knows the full system.
5. Business rules live in modules, not in React components. Components render; hooks/server functions decide.

What makes something "core": it would be needed unchanged by a roofing company's site. Roofing is the thought experiment only — **no roofing code goes in this repo, ever**. Leads and testimonials are potentially reusable later, but Mariposa's V1 versions contain rental-specific sources, marketplace attribution, and Property relationships, so they remain in `rentals` until Phase 9 proves and extracts a genuinely generic shape. A second business gets value from this repo via Phase 9 extraction, not by being added here (D-015).

## 3. Repository structure

Phases 1–3 created the route groups, module boundaries, localization, Payload composition point, content collections/globals, the homepage and one approved property route, and the controlled inquiry path. Remaining public routes below are intended locations for later phases, not permission to create them early.

```
src/
  app/
    (frontend)/
      [locale]/                  # 'en' | 'es'
        page.tsx                 # home
        properties/page.tsx      # listing
        properties/[slug]/page.tsx
        about/page.tsx
        property-management/page.tsx
        contact/page.tsx
      sitemap.ts, robots.ts
    (payload)/                   # generated admin + api routes
  modules/
    core/
      collections/               # users.ts, media.ts
      globals/                   # site-settings.ts
      fields/                    # shared SEO fields
      access.ts                   # shared Payload access helpers
      index.ts
    rentals/
      collections/               # properties.ts, leads.ts, reviews.ts
      globals/                   # home, listing, about, management, contact,
                                 # rental settings
      components/                # PropertyCard, GalleryMosaic, AmenityGroups,
                                 # StickyInquiryCard, CollectionCarousel
      actions/                   # validated server-only inquiry ingress
      lib/                       # Local API content adapter, validation, fallback seed content
      index.ts
  i18n/                          # dictionaries/en.ts, es.ts + helpers
  payload.config.ts
docs/
public/
```

Deliberately absent: `packages/`, `apps/` (no monorepo), `src/providers/` (no provider layer), `src/modules/scheduling` (future), a generic component library, and a generic `utils/` grab-bag. Reusable UI is promoted only after two current screens demonstrate the same contract; site navigation and page sections are not "core" merely because another website might also have them.

## 4. Key mechanisms

**Rendering** — Server Components by default. Client Components only where interaction demands it: carousel arrows, mobile menu, gallery lightbox, search/filter bar, language toggle, form inputs. Property and home pages are statically rendered and revalidated on publish (Payload `afterChange` hook → `revalidatePath`), so the 14-property site is effectively static and fast, and Netlify cold starts do not sit on the main visitor path. Netlify officially supports App Router, RSC, ISR, Route Handlers, Server Actions, redirects, image optimization, and path/tag revalidation through its maintained OpenNext adapter; do not pin that adapter ([Netlify Next.js support](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/)).

**Internationalization** — two mechanisms, both simple:
- Content: Payload `localization: { locales: ['en', 'es'], defaultLocale: 'en', fallback: true }`. Editors switch locale in the admin; untranslated fields fall back to English.
- UI chrome (nav labels, buttons, form labels): a typed dictionary per locale in `src/i18n`. No i18n framework in V1 — with ~6 pages the dictionary is smaller than any library's configuration.
- Routing: `/[locale]/...` segment; the root redirect sends `/` → `/en` (default) and the toggle links to the same path in the other locale. `hreflang` alternates are emitted per page. Do not add locale middleware/proxy unless a real routing case requires it.

**Media** — Payload `media` collection with required localized `alt`, optional caption. Dev: local disk (gitignored). Production: Cloudflare R2 through `@payloadcms/storage-s3` at the same exact version as Payload. The production configuration must use `region: 'auto'`, the R2 S3 API endpoint for uploads, `forcePathStyle: true`, a separate `R2_PUBLIC_URL` (prefer a custom media domain), `generateFileURL`, and `disablePayloadAccessControl: true` for intentionally public website imagery. Upload credentials remain server-only. Postgres stores provider-neutral object keys; absolute public URLs are derived from `R2_PUBLIC_URL` in the media collection's read hook (D-022). Payload generates the size variants; the frontend uses `next/image` with a narrow remote pattern for the public media host. This is Payload's documented recommendation for R2 on Netlify/Node environments ([Payload storage adapters](https://payloadcms.com/docs/upload/storage-adapters)). Large originals must be tested on staging; enable direct client uploads and the corresponding R2 CORS policy only if the real files require it (D-017).

**Leads** — the one write path from the public site. A server action validates every untrusted field and creates a `leads` document through server-only Local API code. Public REST create access stays denied; the trusted action intentionally overrides collection access only after validation. `requestedDates` is free text, not availability. Rate limiting, honeypot controls, consent evidence, and retention review are part of the ingress. A narrow `afterChange` hook may send the family a transactional email only after the Lead is stored; Payload remains authoritative and notification failure never rejects the saved inquiry. WhatsApp remains a plain `wa.me` link, and broader notification automation stays outside V1.

**Content availability** — production public reads use Payload Local API with `overrideAccess: false`, `draft: false`, locale fallback to English, and collection access constrained to `_status = published`. Publish/delete hooks revalidate the homepage and approved property paths. In local development only, a missing/unseeded database falls back to the approved Phase 2 content so visual work remains reviewable; production database failures are surfaced rather than silently serving stale mock data.

**The discovery bar** — V1 does not have availability data. Phase 2 therefore implements only Where / Guests as a clear link to the curated homes section; it is not a booking or availability search. Phase 4 may add honest client-side filtering by region and guest capacity when all 14 properties are present. Dates belong in the manual inquiry conversation, not in a control that looks like an availability promise (D-018).

**SEO** — shared `seoField` group (title, description, og image, optional canonical) on Property and page globals; `generateMetadata` per route; sitemap + robots from route handlers; `VacationRental`/`LodgingBusiness` JSON-LD on property pages; 301 redirects for all legacy Squarespace URLs (table in CONTENT_MODEL.md).

## 5. Design reference

Product reference: [Wander](https://www.wander.com/) for the image-led discovery flow, curated property rows, concise trust messaging, and compact property facts. Project source of truth: Claude Design project **"CR Mariposa 1C Refined"** (Wander-inspired layout in the "Classical" identity — screens 3a/3b are the approved homepage direction; 2c–2e are listing and detail pages). Key tokens carried into the Phase 1 foundation for refinement in Phase 2:

- Fonts: **Cormorant Garamond** (display/headings, weight 400–600) and **Archivo** (body/UI) — via `next/font`.
- Palette: sand `#eae3d6` / `#f6f2ea` grounds, basalt ink `#1d1f1c`, clay accent `#7a4526` / `#9c5f3c` / `#c98a5e`, muted text `#4a4f46` / `#6e6a5f`.
- Character: square-cut (no border radius on cards/images), hairline dividers `rgba(29,31,28,0.16)`, uppercase letterspaced kickers, 1:1 property cards with corner feature badge, ★ rating inline with the title.
- Production token and component guidance: [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).

Stable design evidence is now stored under `Desings/Contemporary hospitality design direction/`. `CR Mariposa 1C Refined.dc.html` is the Phase 2 visual authority; its offline companion and bundled support files make the reference reviewable without relying on an external design session. The production implementation intentionally covers only screens 3a/3b and 2d/2e in this phase.

## 6. Environments

| | Dev | Production |
|---|---|---|
| App | `next dev` local | Vercel (Next.js runtime, Node 22) |
| DB | local Postgres or Supabase dev project | Supabase Postgres via pooler |
| Media | local disk | Cloudflare R2 |
| Secrets | `.env` (gitignored), documented in `.env.example` | Vercel environment variables |

**Vercel migration — 2026-09-30:** runtime database pooling, Payload authentication and media object keys remain unchanged. `R2_CLIENT_UPLOADS=true` enables authenticated signed direct uploads of originals to avoid the Vercel Functions 4.5 MB request-body limit; Payload still generates image variants. The optional flag defaults off for existing server-mediated hosts. Bucket CORS must allow the exact admin origin and PUT with Content-Type/If-None-Match. Preview builds cannot index even when inheriting a canonical production URL; noncanonical staging builds also emit noindex metadata. See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for current operational requirements; earlier Netlify-specific passages are historical context.

Production database traffic uses Supabase's transaction pooler (`:6543`) because Netlify functions are short-lived. Schema migrations and administrative tools use a controlled direct or session connection instead; transaction mode does not support prepared statements or session-level features ([Supabase connection guidance](https://supabase.com/docs/guides/database/connecting-to-postgres)). The application and migration connection strings are separate secrets and must never reach the client bundle (D-016).

Known risk: Payload admin on serverless can hit cold starts, request limits, and database connection limits. Mitigations: pooled runtime connections, static public pages, real upload tests, and — if admin UX on Netlify proves poor — the same repo deploys unchanged to a Node host (Railway/Render/Fly). This portability is a requirement: nothing may depend on Netlify-specific APIs. (DECISIONS.md D-005.)
