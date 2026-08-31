# DESIGN_SYSTEM.md

Production translation of the approved **CR Mariposa 1C Refined** direction, including the owner's 2026-08-29 mobile/property-photography refinement.

## Source and scope

- Visual authority: `Desings/Contemporary hospitality design direction/CR Mariposa 1C Refined.dc.html`.
- Durable companion: `CR Mariposa 1C Refined - offline-src.html` and the supporting files in the same directory.
- Implemented screens: desktop/mobile homepage (3a/3b), all-homes catalogue (2c), and desktop/mobile property detail page (2d/2e).
- Production styles: `src/app/(frontend)/styles.css`.
- Phase 2 imagery: supplied design images copied to `public/images/mariposa/`; these remain seed/mock assets until the owner approves production originals in Phase 5.

The design export is a reference, not application code. Components are implemented in React/Next.js and follow the repository's core/rentals boundaries.

## Visual foundation

### Color

| Role                  | Token      | Value                 |
| --------------------- | ---------- | --------------------- |
| Light ground          | `sand-50`  | `#f6f2ea`             |
| Warm ground           | `sand-100` | `#eae3d6`             |
| Strong ground/divider | `sand-200` | `#ddd6c8`             |
| Primary ink           | `basalt`   | `#1d1f1c`             |
| Primary accent        | `clay-500` | `#9c5f3c`             |
| Dark accent           | `clay-700` | `#7a4526`             |
| Light accent          | `clay-300` | `#c98a5e`             |
| Body copy             | `moss-600` | `#4a4f46`             |
| Secondary copy        | `moss-400` | `#6e6a5f`             |
| Hairline              | `divider`  | `rgba(29,31,28,0.16)` |

Use warm sand as the normal canvas, basalt for the strongest text and dark sections, and clay for intentional actions or small accents. Do not introduce arbitrary near-duplicate colors.

### Typography

- Display and headings: Cormorant Garamond, generally 400–600 weight.
- Body, navigation, controls, and metadata: Archivo.
- Eyebrows and utility labels: uppercase Archivo with deliberate letter spacing.
- Headings may use tight line height; body copy must retain comfortable reading measure and line height.
- All fonts are loaded through `next/font`; do not add runtime font requests.

### Geometry and spacing

- The identity remains editorial and lightly structured, but hospitality photography uses a selective `18px` media radius. Apply it to listing images, property mosaics, sleeping cards, and showcase tiles—not every container.
- Metadata badges and compact photo controls may use a full pill radius. Buttons, forms, content panels, and general layout surfaces remain square unless their interaction specifically calls for a pill.
- Use 1px hairlines for quiet separation; avoid heavy borders and card shadows.
- Desktop content width is approximately 1328px with 48–56px page gutters.
- Mobile gutters are 20px. Major sections use roughly 72–96px vertical rhythm on desktop and 56–72px on mobile.
- Property discovery cards are 1:1. Photography should crop with `object-fit: cover`, with focal positioning adjusted only when the subject requires it.

## Components established in Phase 2

| Component              | Responsibility                                                           | Important states                                                                                             |
| ---------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `HomePreview`          | Homepage composition and section hierarchy                               | EN/ES content, desktop/mobile hero                                                                           |
| `PropertyCarousel`     | Horizontally browsable property row                                      | previous/next disabled at bounds; touch scroll                                                               |
| `PropertyCard`         | Image-led property summary                                               | compact carousel and 3:2 catalogue variants; linked when the property is published                           |
| `PropertiesCatalogue`  | Location filters and progressive reveal for all published homes          | All / Santa Ana / Escazú / Beach; eight initially, then reveal remaining homes; live accessible result count |
| `PropertiesIndex`      | Bilingual all-homes page composition                                     | interior navigation, catalogue, direct-contact CTA and locale-preserving footer                              |
| `PropertyGallery`      | Five-image desktop mosaic and native swipe rail on mobile                | current count; every photo and photo-count control enters the showcase                                       |
| `PhotoViewer`          | Full-screen, touch-first inspection of every property image              | swipe/scroll snap, keyboard previous/next, close, live count                                                 |
| `PhotoShowcase`        | Dedicated curated/categorized property-photo route                       | Showcase, Exterior, Living room, Kitchen, Bedrooms, Amenities, Other                                         |
| `SleepingArrangements` | Concrete room and bed presentation below the property story              | zero or more localized room cards; touch rail on mobile                                                      |
| `PropertyMap`          | Approximate district context through the official Google Maps iframe API | interactive embed when configured; styled fallback plus Google Maps link otherwise                           |
| `ThingsToKnow`         | Scannable cancellation, rules, and stay-detail groups                    | three columns on desktop; one-column reading order on mobile; optional disclosures                           |
| `PropertyDetail`       | Property facts, story, amenities, reviews, location context, inquiry     | responsive two-column/sticky inquiry layout                                                                  |
| `SiteFooter`           | Localized site/contact navigation                                        | locale-aware paths; linked platform profile or explicit pending-link placeholder                             |
| `MobileContactBar`     | Persistent WhatsApp and telephone actions                                | mobile only, above safe-area inset                                                                           |
| `FeatureIcon`          | Small, domain-specific visual marks used by the approved proof           | decorative; neighboring text carries meaning                                                                 |

These are concrete Mariposa components. They are not a generic block/page-builder API. A component may move to platform core only after a second real site demonstrates the same contract.

## Responsive behavior

- At desktop width, the homepage hero is a compact 420px tall so the first property collection enters the initial viewport, while still carrying the full navigation, central headline, and discovery control.
- The all-homes page deliberately has no hero. Its heading, short introduction, four location chips and first 3:2 property row enter the viewport quickly. Desktop uses two columns; mobile uses one column and a horizontally scrollable filter row.
- The catalogue renders eight homes first and reveals the remaining six on request. Location filters reset that reveal state and use `aria-pressed`; this is client-side discovery, not availability search.
- At mobile width, the hero switches to the supplied portrait crop and compresses to `clamp(410px, 52svh, 460px)` so the first property row enters the initial screen. Property rows remain touch-first horizontal scrollers with approximately 230px cards.
- The property detail uses a rounded five-image mosaic on desktop. Mobile shows a native swipe rail with a deliberate next-photo peek and count/progress. Selecting any image enters the dedicated photo showcase first.
- The dedicated photo-showcase route groups CMS-managed images by category and lets the owner curate a lead Showcase set without duplicating media. Selecting an image there launches the full-screen scroll-snap viewer without small-window chrome.
- Sleeping arrangements follow the narrative description and precede broad amenity lists, giving guests concrete room-level information without implying availability or booking semantics.
- The neighbourhood map uses a broad 16:7 interactive surface on desktop and 4:3 on mobile. It remains district-level; a real Google map never relaxes the exact-address privacy rule.
- “Things to know” uses three evenly weighted columns at desktop and the same semantic order as stacked sections on mobile. Hairlines provide structure; these are not boxed cards.
- The desktop inquiry card stays visible alongside property content. Mobile visitors receive a fixed WhatsApp/call bar instead.
- Breakpoints are content-driven in the production stylesheet (principal transitions at 1040px, 800px, and 640px), not device-name contracts.

## Content, localization, and interaction rules

- Every visitor-visible string exists in both EN and ES. UI chrome belongs in the typed dictionary; Phase 2 mock domain content lives in `src/modules/rentals/lib/phase2-content.ts` and moves to Payload in Phase 3.
- Photography always has localized alternative text. Decorative icons are hidden from assistive technology when adjacent copy already conveys the meaning.
- Links and buttons retain a visible keyboard focus indicator. Interactive controls must have text or an accessible name, and touch targets are at least 44px where practical.
- Footer platform placeholders never use `href="#"`; they state that the link is pending. Once an approved URL exists, the same CMS row becomes a genuine external link.
- Motion is functional and restrained: native scrolling, scroll snapping, gallery state changes, and subtle hover/focus feedback. The experience must remain understandable with reduced motion.
- The discovery control is not an availability search. It presents Where / Guests and navigates to the homes section. Dates, calendars, checkout, reservation, payment, and scheduling interfaces are out of scope.

## Asset and metadata guidance

- Use `next/image` for content photography with explicit responsive `sizes`.
- `public/og.png` is the 1200×630 social preview for the design proof. Property pages may override it with their lead image where appropriate.
- Supplied Phase 2 images prove composition, not production rights or master-file quality. Phase 5 must replace them with owner-approved originals and verify R2 delivery.

## Premature abstractions to avoid

- No generic section renderer or block-based page builder.
- No theme engine, token package, component package, or monorepo split.
- No universal carousel/gallery framework beyond what the approved pages currently need.
- No property availability, reservation, booking, payment, calendar, notification, or provider interfaces.
- No promotion of rental-specific cards, amenities, reviews, or inquiry contracts into `src/modules/core` before a second client proves they are generic.

The owner approved the 2026-08-29 mobile/property-photography direction for implementation. Final acceptance follows review of the deployed responsive result; that acceptance, not additional abstraction, unlocks broader page production.
