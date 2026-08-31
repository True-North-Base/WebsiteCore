# CONTENT_MODEL.md

Payload collections and globals for V1. Fields marked **(L)** are localized EN/ES. This model is derived from the approved design summary (screens 3a/3b, 2c–2e), the live Squarespace site (14 properties, re-inspected 2026-08-26), and the V1 journey: discover → evaluate → trust → WhatsApp/call/inquiry.

Principle applied throughout: **Property is a content entity with a stable identity.** Anything with its own lifecycle (a future reservation, a customer's history, a payment) will be a separate document relating to Property/Lead by ID — never nested inside them. All collections use **UUID primary keys** so external systems (a PMS, an analytics pipeline) can reference documents durably (DECISIONS.md D-008).

## Platform core collections (`src/modules/core`)

### users
Payload auth collection. Roles: `admin` (developer), `editor` (owner — full content access, no user/system management). Least privilege from day one.

### media
Upload collection → R2 in production.

| Field | Type | Notes |
|---|---|---|
| alt **(L)** | text, required | Photography is business-critical; alt is not optional |
| caption **(L)** | text | Optional |

Payload image sizes: card (1:1), gallery large, hero. Originals retained.

### Globals (core)

**site-settings** — the only place shared identity/contact data lives; components never hardcode it.

| Field | Type | Notes |
|---|---|---|
| siteName | text, required | Brand name; not localized |
| tagline **(L)** | text | Shared short brand line |
| whatsappNumber | text, required | Digits-only international form used to build `wa.me` links |
| phoneDisplay | text, required | Human-readable formatting |
| email | email, required | |
| address **(L)** | textarea | Public business-level address, never private property addresses |
| instagramUrl | text | Optional, URL-validated |
| facebookUrl | text | Optional, URL-validated |
| whatsappDefaultMessage **(L)** | textarea | Shared prefilled inquiry text |
| defaultSeo | `seoField` group | Site-wide metadata fallback |

Core stays deliberately small in V1. A collection is not made core merely because another business might someday need a similar concept.

## Rentals domain (`src/modules/rentals`)

### leads

Inquiries from the contact/property forms. This V1 collection stays in Rentals because its source options and optional Property relationship are domain-specific. It may yield a generic lead foundation during Phase 9 extraction; no factory or polymorphic subject abstraction is justified now.

| Field | Type | Notes |
|---|---|---|
| name | text, required | |
| email | email | At least one of email/phone required (validation) |
| phone | text | |
| message | textarea | |
| property | relationship → properties | Optional; set when inquiry came from a property page |
| requestedDates | text | Free text ("Mar 10–17"); **not** structured availability data |
| locale | select en/es | Language the visitor used |
| status | select: `new` / `contacted` / `closed` | Owner's working state |
| source | select: `contact-form` / `property-form` | WhatsApp/call clicks do not create leads; track those outbound events in GA4 |

Public REST create access is denied. A validated, server-only action creates documents. Define retention/deletion policy and privacy copy before production; add consent evidence fields only if the approved legal/UX approach requires them. Future evolution (documented, not built): an optional Customer relationship when a Customers collection exists. See FUTURE_MODULES.md.

### reviews

Genuine guest reviews, entered by the owner from the OTA platforms. This V1 collection stays in Rentals because marketplace attribution and the Property relationship are domain-specific. It serves both the homepage testimonial band and per-property review sections — one collection, because they are the same real-world thing.

| Field | Type | Notes |
|---|---|---|
| quote **(L)** | textarea, required | Original language + owner's translation |
| guestName | text, required | "Andrea" |
| guestCountry **(L)** | text | "Canada" / "Canadá" |
| rating | number 1–5 | Displayed as stars |
| platform | select: airbnb / booking / vrbo / expedia / direct | Attribution shown in UI |
| sourceUrl | text | Optional private provenance for the editor; validate as a URL |
| property | relationship → properties | Optional — a review without it is a general testimonial |
| featured | checkbox | Surfaces on the homepage band |

### Globals (rentals/site-specific)

- **rental-settings** — `marketplaceLinks[]` containing platform (Airbnb / Booking.com / Vrbo / Expedia / Instagram / Facebook) and an optional approved URL. Blank URLs render an explicit non-clickable placeholder so the owner can add/delete the intended platforms before links are confirmed. These do not belong in platform `site-settings`.
- **home-page** — `heroEyebrow` **(L)**, `heroHeading` **(L)**, `heroBody` **(L)**, `heroImage`, optional `heroMobileImage`; `featuredHeading` / `featuredIntro` **(L)**; `pacificHeading` / `pacificIntro` **(L)**; `reviewsHeading` / `reviewsProof` **(L)**; `trustEyebrow`, `trustHeading`, `trustHeadingMuted` **(L)**, `trustImage`, and up to six typed trust features (icon + localized title/body); a second, explicitly named `hospitality*` heading/image/features set retained temporarily for the owner comparison described in D-021; `contactHeading` / `contactBody` **(L)**; SEO. Property membership comes from `featured`, `region`, and `displayOrder`, not nested copies.
- **properties-page** — heading **(L)**, introduction **(L)**, SEO.
- **about-page**, **property-management-page**, **contact-page** — one typed global per static page with heading **(L)**, body rich text **(L)**, approved imagery, CTA copy **(L)** where the approved screen contains it, and SEO. Freeze the exact image/section fields against the stable Phase 2 design artifact before implementing these Phase 3 globals.

These are deliberately not a generic block-based Pages collection. Add only the fields demonstrated by approved screens; see "Rejected" below.

### properties

| Field | Type | Notes |
|---|---|---|
| title | text, required | "Penthouse Lago" — brand names, not localized |
| slug | text, unique, required | `penthouse-lago`; auto from title, editable |
| status | Payload drafts (`_status`) | Draft/published = owner's hide/unpublish switch |
| featured | checkbox | Feeds "Homes our guests love" row |
| displayOrder | number, required | Stable manual order for listing and curated rows |
| region | select: `central-valley` / `pacific-coast` | Feeds the "On the Pacific" row and search filter |
| district **(L)** | text, required | "Santa Ana, Río Oro" — the clay line on cards |
| complexName | text | "Avalon Country Club" — shown next to title on detail |
| badge **(L)** | text | Corner chip on cards: "Lakeview", "Jacuzzi", "Beachfront" |
| shortDescription **(L)** | textarea, required | Lead paragraph on detail page (~1–2 sentences) |
| description **(L)** | richtext (Lexical), required | 2–5 paragraphs |
| neighborhoodDescription **(L)** | textarea | District-level public context; never the exact address |
| heroImage | upload → media, required | |
| gallery | array of { image → media, category, featuredInShowcase } | Ordered (drag in admin); the first 5 fill the detail mosaic. Category drives the dedicated photo-showcase tabs; the showcase checkbox curates its lead view. Media remains related by UUID and stores provider-neutral object keys. |
| sleepingArrangements | array of { image → media, roomName **(L)**, bedSummary **(L)** } | Powers “Where you'll sleep.” Keep bed descriptions factual and localized; do not infer bed sizes from photography. |
| bedrooms | number, required | |
| beds | number | Optional until source content is confirmed; distinct from bedrooms |
| bathrooms | number, required | Supports 2.5 |
| maxGuests | number, required | "Sleeps 4" |
| parking **(L)** | text | "Covered space" |
| extraFacts **(L)** | array of text, max 2 | Detail fact bar / card facts line: "Mezzanine", "Two storey", "Terrace" |
| rating | number 0–5, step 0.1 | Manually maintained from OTA averages; hidden on UI when empty |
| amenityGroups | array { label **(L)**, items **(L)** array of text }, max 6 groups | Matches design's six labelled columns; empty groups omitted in UI |
| thingsToKnow | group: cancellationSummary/details **(L)**, checkInTime, checkOutTime, minStayNights, smoking/pets/events/rulesDetails **(L)** | Drives the three concrete “Cancellation & terms,” “Property rules,” and “Stay details” columns; mobile stacks the same semantic groups. |
| externalListings | array { platform select, url } | "Also on Airbnb…" links |
| mapImage | upload → media | District-level map (4:3). Exact address is never published |
| approxCoordinates | group lat/lng, optional | Approximate district point for the Google Maps `view` embed and future JSON-LD. When empty, the embed searches the public district text. Never store or render a private address. |
| seo | seoField group | Per-property metadata + OG image |

**Deliberately NOT on Property:** price/rates (owner doesn't publish them; card foot has room if that changes), availability, reservations, any OTA API linkage, payment anything. Future reservation documents will point *at* a property UUID (FUTURE_MODULES.md).

### Rejected modeling options (aggressively pruned as premature)

| Rejected | Instead | Revisit when |
|---|---|---|
| Separate **Amenities** taxonomy collection | `amenityGroups` array on Property | Amenity-based filtering/search is requested, or >~30 properties make consistency painful |
| Separate **Locations** collection | `region` select + `district` text | A third region or location landing pages with own content appear |
| Generic block-based **Pages** collection / page builder | One typed global per static page | The owner actually asks to compose new pages; then add Pages for *those* pages only |
| **Customers** collection | Leads only, with status | First capability that needs identity across interactions (reservations/appointments) begins implementation |
| **PropertyReviews** separate from Testimonials | Single `reviews` collection with optional property link | A second business vertical needs reviews attached to non-property subjects — generalize the relationship then |
| Structured availability/date fields on leads | `requestedDates` free text | Reservations module is activated |
| Generic collection factories to inject rental relationships into core | Keep Leads and Reviews in Rentals for V1 | Phase 9 has a second proven collection shape worth extracting |

## Legacy URL redirects

Every legacy Squarespace path 301s to the new structure before DNS cutover (implemented in `next.config.ts` redirects; verified in Phase 6). Slugs below are proposals — confirm with the owner in Phase 3.

| Legacy path | New path |
|---|---|
| `/terrazasescazu` | `/en/properties/terrazas-escazu` |
| `/penthouseoasis` | `/en/properties/penthouse-oasis` |
| `/terrazadowntown` | `/en/properties/terraza-downtown` |
| `/riverpark` | `/en/properties/riverpark-downtown` |
| `/apartmentparaiso` | `/en/properties/apartment-paraiso` |
| `/apartmentroca` | `/en/properties/apartment-roca` |
| `/apartmentmontana` | `/en/properties/apartment-montana` |
| `/lago` | `/en/properties/penthouse-lago` |
| `/lvistaandjacuzzi` | `/en/properties/vista-and-jacuzzi` |
| `/apartmentbrisa` | `/en/properties/apartment-brisa` |
| `/lago-1` | `/en/properties/penthouse-laguna` |
| `/bosquesdecarao` | `/en/properties/bosques-de-carao` |
| `/playalangosta` | `/en/properties/playa-langosta` |
| `/beachfront` | `/en/properties/beachfront-villa` |

URL fragments are not sent to the server, so `/#contact` cannot have its own server-side redirect rule. Preserve the old deep link by making the `/` → `/en` transition retain `#contact` and providing a matching contact anchor on `/en`, or use a tiny client-side handoff to `/en/contact`. Verify the real browser behavior before cutover.

The homepage navigation exposed all 14 property paths above on 2026-08-26. The Squarespace sitemap could not be fetched through the audit tool, so Phase 6 must still crawl the live sitemap and internal links to catch unlinked pages, alternate/case/trailing-slash forms, and any URLs added after this inventory.

## Content migration concerns

1. Export or obtain original-resolution photography; do not treat Squarespace CDN derivatives as the master archive. Preserve gallery order and record rights/ownership.
2. Build an idempotent import sequence: Media first, then Properties, then Reviews and page globals. UUIDs become canonical only after import; published slugs remain the durable public identifiers.
3. Treat current copy as source material, not approved final copy. Correct visible errors (for example "Mezannine" and "Whastapp"), normalize decimal bathrooms, and have the owner confirm bedrooms/beds/guest limits and exact property names.
4. The existing site is English-only. Machine-assisted Spanish may be a draft, but the owner must approve every localized field before publication; English fallback is a safety net, not completion.
5. Preserve private-address boundaries. Import only district-level location and approximate coordinates intended for public display.
6. Confirm that every review and marketplace logo/link may be republished with its attribution. Store review provenance privately where available.
7. Keep a cutover manifest containing old path, new path, HTTP status, imported record UUID, media count, and owner approval. Test the manifest against staging and again after DNS cutover.
