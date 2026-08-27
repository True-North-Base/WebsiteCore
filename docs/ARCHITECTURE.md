# ARCHITECTURE.md

System architecture for the CR Mariposa website and the WebsiteCore platform underneath it. This document describes what exists (or will exist in Phase 1) — future capabilities live in [FUTURE_MODULES.md](FUTURE_MODULES.md).

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

Why this shape: Payload 3 is designed to install into Next.js; one repo, one deploy, one auth story, and the owner gets `/admin` on the same domain. It deploys to Netlify as a normal Next.js site.

## 2. Platform organization

Three conceptual layers. Only the first two get code in V1.

```
                        AGENCY PLATFORM (this repo)
                                  │
          ┌───────────────────────┴────────────────────────┐
          │                                                │
    PLATFORM CORE                                  BUSINESS MODULES
    src/modules/core                               src/modules/rentals
    ├─ users                                       ├─ properties
    ├─ media                                       ├─ reviews→property link
    ├─ site-settings                               ├─ rental page components
    ├─ leads                                       └─ rental frontend routes
    ├─ reviews (testimonials)
    └─ shared fields (seo, slug)
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

What makes something "core": it would be needed unchanged by a roofing company's site. Roofing is the thought experiment only — **no roofing code goes in this repo, ever**. A second business gets value from this repo via Phase 9 extraction, not by being added here.

## 3. Repository structure (target, created in Phase 1)

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
      collections/               # users.ts, media.ts, leads.ts, reviews.ts
      globals/                   # site-settings.ts, about-page.ts, ...
      fields/                    # seoField.ts, slugField.ts
      components/                # generic UI: buttons, nav shell, forms
      index.ts
    rentals/
      collections/               # properties.ts
      components/                # PropertyCard, GalleryMosaic, AmenityGroups,
                                 # StickyInquiryCard, CollectionCarousel
      lib/                       # property queries, whatsapp-link builder
      index.ts
  i18n/                          # dictionaries/en.ts, es.ts + helpers
  payload.config.ts
docs/
public/
```

Deliberately absent: `packages/`, `apps/` (no monorepo), `src/providers/` (no provider layer), `src/modules/scheduling` (future), generic `utils/` grab-bag.

## 4. Key mechanisms

**Rendering** — Server Components by default. Client Components only where interaction demands it: carousel arrows, mobile menu, gallery lightbox, search/filter bar, language toggle, form inputs. Property and home pages are statically rendered and revalidated on publish (Payload `afterChange` hook → `revalidatePath`), so the 14-property site is effectively static and fast, and Netlify cold starts don't hurt visitors.

**Internationalization** — two mechanisms, both simple:
- Content: Payload `localization: { locales: ['en', 'es'], defaultLocale: 'en', fallback: true }`. Editors switch locale in the admin; untranslated fields fall back to English.
- UI chrome (nav labels, buttons, form labels): a typed dictionary per locale in `src/i18n`. No i18n framework in V1 — with ~6 pages the dictionary is smaller than any library's configuration.
- Routing: `/[locale]/...` segment; middleware redirects `/` → `/en` (default) and the toggle links to the same path in the other locale. `hreflang` alternates emitted per page.

**Media** — Payload `media` collection with required localized `alt`, optional caption. Dev: local disk (gitignored). Production: Cloudflare R2 through `@payloadcms/storage-s3` — uploads never touch Netlify's ephemeral filesystem. Payload generates the size variants; the frontend uses `next/image` with remote patterns pointed at the R2 public host.

**Leads** — the one write path from the public site. A server action validates input (zod), creates a `leads` doc, done. No email/WhatsApp automation in V1 — the owner reads leads in the admin (and most contact happens over the WhatsApp deep links, which are plain `wa.me` links with a prefilled message, no API). Notification automation is a documented future capability.

**The "search" bar** — the design's Where / When / Guests bar is a navigation control in V1, not a search engine: it filters the 14 properties by region and guest count client-side, and any date input is only carried into the prefilled WhatsApp/inquiry message. There is no availability data anywhere in the system. (Confirm final behavior with the client in Phase 2 — see DECISIONS.md D-011.)

**SEO** — shared `seoField` group (title, description, og image, optional canonical) on Property and page globals; `generateMetadata` per route; sitemap + robots from route handlers; `VacationRental`/`LodgingBusiness` JSON-LD on property pages; 301 redirects for all legacy Squarespace URLs (table in CONTENT_MODEL.md).

## 5. Design reference

Source of truth: Claude Design project **"CR Mariposa 1C Refined"** (Wander-inspired layout in the "Classical" identity — screens 3a/3b are the approved homepage direction; 2c–2e are listing and detail pages). Key tokens to carry into Tailwind config in Phase 2:

- Fonts: **Cormorant Garamond** (display/headings, weight 400–600), **Lora** / Archivo (body/UI) — via `next/font`.
- Palette: sand `#eae3d6` / `#f6f2ea` grounds, basalt ink `#1d1f1c`, clay accent `#7a4526` / `#9c5f3c` / `#c98a5e`, muted text `#4a4f46` / `#6e6a5f`.
- Character: square-cut (no border radius on cards/images), hairline dividers `rgba(29,31,28,0.16)`, uppercase letterspaced kickers, 1:1 property cards with corner feature badge, ★ rating inline with the title.
- Full token sheet: the design system's `styles.css` in the design project. A `docs/DESIGN_SYSTEM.md` will be written in Phase 2 when tokens are translated to Tailwind.

## 6. Environments

| | Dev | Production |
|---|---|---|
| App | `next dev` local | Netlify (Next.js runtime) |
| DB | local Postgres or Supabase dev project | Supabase Postgres via pooler |
| Media | local disk | Cloudflare R2 |
| Secrets | `.env` (gitignored), documented in `.env.example` | Netlify env vars |

Known risk: Payload admin on serverless can hit cold starts and connection limits. Mitigations: pooled connection string, static public pages, and — if admin UX on Netlify proves poor — the same repo deploys unchanged to a Node host (Railway/Render/Fly). This portability is a requirement: nothing may depend on Netlify-specific APIs. (DECISIONS.md D-006.)
