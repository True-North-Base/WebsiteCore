# CONTENT_MODEL.md

Payload collections and globals for V1. Fields marked **(L)** are localized EN/ES. This model is derived from the approved design (screens 3a/3b, 2c–2e), the live Squarespace site (14 properties), and the V1 journey: discover → evaluate → trust → WhatsApp/call/inquiry.

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

### leads
Inquiries from the contact/property forms. Minimal on purpose — this is not a CRM.

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
| source | select: `contact-form` / `property-form` | WhatsApp/call clicks don't create leads (they leave the site) — tracked in GA4 instead |

Future evolution (documented, not built): an optional `customer` relationship when a Customers collection exists. See FUTURE_MODULES.md.

### reviews
Genuine guest reviews, entered by the owner from the OTA platforms. Serves both the homepage testimonial band and per-property review sections — one collection, because they are the same real-world thing.

| Field | Type | Notes |
|---|---|---|
| quote **(L)** | textarea, required | Original language + owner's translation |
| guestName | text, required | "Andrea" |
| guestCountry **(L)** | text | "Canada" / "Canadá" |
| rating | number 1–5 | Displayed as stars |
| platform | select: airbnb / booking / vrbo / expedia / direct | Attribution shown in UI |
| property | relationship → properties | Optional — a review without it is a general testimonial |
| featured | checkbox | Surfaces on the homepage band |

### Globals (core)

**site-settings** — the only place contact data lives (components never hardcode it):
whatsappNumber, phoneDisplay, email, address **(L)**, platformLinks (airbnb/booking/vrbo/expedia URLs), instagram, facebook, defaultSeo (seoField), tagline **(L)**, whatsappDefaultMessage **(L)** (the prefilled `wa.me` text).

**about-page**, **property-management-page**, **contact-page** — one global per static page with the specific fields that page's design needs (heading **(L)**, body richtext **(L)**, images, seoField). Deliberately *not* a generic block-based Pages collection — see "Rejected" below.

## Rentals domain (`src/modules/rentals`)

### properties

| Field | Type | Notes |
|---|---|---|
| title | text, required | "Penthouse Lago" — brand names, not localized |
| slug | text, unique, required | `penthouse-lago`; auto from title, editable |
| status | Payload drafts (`_status`) | Draft/published = owner's hide/unpublish switch |
| featured | checkbox | Feeds "Homes our guests love" row |
| region | select: `central-valley` / `pacific-coast` | Feeds the "On the Pacific" row and search filter |
| district **(L)** | text, required | "Santa Ana, Río Oro" — the clay line on cards |
| complexName | text | "Avalon Country Club" — shown next to title on detail |
| badge **(L)** | text | Corner chip on cards: "Lakeview", "Jacuzzi", "Beachfront" |
| shortDescription **(L)** | textarea, required | Lead paragraph on detail page (~1–2 sentences) |
| description **(L)** | richtext (Lexical), required | 2–5 paragraphs |
| heroImage | upload → media, required | |
| gallery | array of { image → media } | Ordered (drag in admin); first 5 fill the mosaic; "View all N photos" uses the rest |
| bedrooms | number, required | |
| bathrooms | number, required | Supports 2.5 |
| maxGuests | number, required | "Sleeps 4" |
| parking **(L)** | text | "Covered space" |
| extraFacts **(L)** | array of text, max 2 | Detail fact bar / card facts line: "Mezzanine", "Two storey", "Terrace" |
| rating | number 0–5, step 0.1 | Manually maintained from OTA averages; hidden on UI when empty |
| amenityGroups | array { label **(L)**, items **(L)** array of text }, max 6 groups | Matches design's six labelled columns; empty groups omitted in UI |
| thingsToKnow | group: checkInTime, checkOutTime, minStayNights (number), smoking **(L)**, pets **(L)** | Key-value rows on detail page |
| externalListings | array { platform select, url } | "Also on Airbnb…" links |
| mapImage | upload → media | District-level map (4:3). Exact address is never published |
| approxCoordinates | group lat/lng, optional | For future interactive map / JSON-LD geo; not rendered in V1 |
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
| `/playalangosta` | `/en/properties/playa-langosta` |
| `/beachfront` | `/en/properties/beachfront-villa` |
| `/#contact` (fragment) | `/en/contact` (root redirect covers it) |

Also: Bosques de Carao exists on the current site without a discovered URL — re-crawl the sitemap (`/sitemap.xml` on Squarespace) during Phase 6 to catch stragglers, image URLs, and any blog/extra pages before cutover.
