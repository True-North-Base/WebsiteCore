# DECISIONS.md

Append-only log of significant decisions. Add an entry (D-###) in the PR that makes the choice. Reversals get a new entry referencing the old one.

---

## D-001 — Stack versions (verified 2026-08-26)

Verified against official sources on this date:

| Component | Choice | Basis |
|---|---|---|
| Payload | **3.x, latest at install (3.88.0 as of 2026-08-11)** | Actively maintained 3.x line; pin exact version in package.json at scaffold time |
| Next.js | **16.2.6+ (16.3.x line)** | Payload's documented supported ranges are 15.2.9–15.4.x and **16.2.6+**; Payload 3.88 itself ships against Next 16.3.0 |
| Node | **22 LTS** | Payload requires ≥ 20.9.0; 22 is the current active LTS, supported by Netlify |
| Package manager | **pnpm** | Payload's documented preference; yarn 1.x unsupported |
| Database | **PostgreSQL via `@payloadcms/db-postgres`** | Relational fits the content model; team familiarity |
| React | Version paired with Next 16 | Comes with the scaffold |

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

---

*Template:*

```
## D-0XX — Title
Context → decision → why → what would change it.
```
