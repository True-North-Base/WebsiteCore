# PROJECT_BRIEF.md

## Product

CR Mariposa Rentals is a bilingual production website for a family-run portfolio of 14 furnished homes in Costa Rica. It is also the first proving ground for reusable small-business website patterns, but the client website has unconditional priority over platform extraction.

## Phase status

- Phase 0 — discovery and architecture: complete; re-audited 2026-08-26.
- Phase 1 — foundation scaffold: complete.
- Phase 2 — desktop direction approved; owner intentionally deferred the mobile visual review.
- Phase 4B — the bilingual fourteen-home catalogue, property records, About, Property Management and Contact pages are implemented. The three supplied reviews are seeded; owner confirmation of their final publication/source attribution and the hands-on CMS walkthrough remain pending.

## Primary V1 journey

Property discovery → property evaluation → reviews/trust → WhatsApp, call, or inquiry → owner manually books the guest.

The website supports discovery and inquiry. It does not claim to check availability or complete a booking.

## V1 outcomes

1. Present all approved properties through a fast, photography-led, mobile-first experience.
2. Let visitors evaluate facts, amenities, galleries, location context, genuine reviews, and trust signals.
3. Make WhatsApp, telephone, and a minimal inquiry form obvious without implying automated booking.
4. Let the owner manage properties, media, reviews, contact information, page content, and leads through authenticated Payload admin.
5. Publish all user-visible content in English and Spanish with intentional SEO and legacy redirects.
6. Deploy portably: Netlify for the application, Supabase Postgres for content, and Cloudflare R2 for production media.

## Explicit V1 exclusions

No direct reservations, availability calendar, OTA synchronization, Booking.com/Airbnb API, PMS, channel manager, checkout, payments, appointment scheduling, calendar engine, automated SMS/email/WhatsApp, generic workflow engine, multi-tenant SaaS, or unused provider interfaces.

Those capabilities are documented in [FUTURE_MODULES.md](FUTURE_MODULES.md) and require a later task that explicitly activates them.

## Users and needs

### Guest

- Quickly understand where a property is, how many people it accommodates, and why it is distinctive.
- Browse high-quality, accessible photography and practical details on mobile.
- See credible reviews and owner/business context.
- Contact the owner in the visitor's language through a familiar channel.

### Owner/editor

- Work entirely through a plain-language admin interface, without Git or source access.
- Create, edit, order, feature, publish, and unpublish properties.
- Upload, reorder, replace, and delete media; select hero imagery and provide localized alt text.
- Maintain reviews, page copy, contact details, external listings, and inquiry status.

### Developer/agency

- Preserve a one-way core → rentals boundary and a portable deployment.
- Keep secrets server-only and shared environments migration-driven.
- Extract reusable patterns only after Mariposa has shipped and a second real site proves the common contract.

## Product and design references

- Existing production site: [crmariposarentals.com](https://www.crmariposarentals.com/)
- Product/design inspiration: [Wander](https://www.wander.com/)
- Approved project direction: `Desings/Contemporary hospitality design direction/CR Mariposa 1C Refined.dc.html`. Phase 2 implements homepage screens 3a/3b and property-detail screens 2d/2e.

The source export, its offline companion, supporting files, and supplied image assets are stored together in the repository. [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) records the production translation; the source export remains the visual authority for Phase 2 review.

## Success and launch gates

- Owner completes the admin workflow checklist without developer intervention.
- Every approved route renders real content in EN and ES; no placeholder copy remains.
- All legacy page URLs in the verified cutover manifest return intentional permanent redirects.
- Production media is served from R2, and real large-original upload/replace/delete/order flows pass on staging.
- Accessibility, SEO, security, analytics, form behavior, and mobile performance pass the Phase 6 criteria.
- Client signs off on staging before DNS changes.
- DNS email records are captured and preserved through cutover.

Detailed architecture, content model, decisions, risks, and phase exit criteria live in the other documents linked from the repository README.
