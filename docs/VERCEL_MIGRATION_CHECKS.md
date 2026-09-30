# Vercel staging migration verification — 2026-09-30

## Verified

- Stable review URL: https://cr-mariposa-staging.vercel.app/en; CMS: https://cr-mariposa-staging.vercel.app/admin, in the `true-north-base` Vercel team. Node 22; pnpm frozen lockfile; generated Payload import map; remote production build succeeded. This is a staging site on the production deployment channel, not the client-domain launch.
- `pnpm lint` and `pnpm typecheck`: passed. `DOTENV_CONFIG_PATH=.env.netlify.local pnpm test:int`: 16 files, **66 tests passed** against the retained staging configuration. The unconfigured localhost database was not used for the successful suite.
- Public EN/ES homepage, Penthouse Lago detail and administrator login route: HTTP 200. Home/property HTML emits staging noindex; robots disallows all crawlers. Sitemap: 200. Legacy `/home`: 301 to `/en`. Unknown route: real 404.
- Browser workflow: visible homepage cards load distinct property images; first property photo opens the categorized showcase, then its photo opens the fullscreen gallery with the existing 13 photos.
- Existing administrator credentials: successful authenticated login. Anonymous direct-upload signing: denied with HTTP 403.
- Owner-approved R2 CORS saved on `cr-mariposa-media`: exact staging origin; PUT; Content-Type and If-None-Match; ETag exposed; 3,600-second preflight cache. Actual preflight returned 204 with the exact allowed origin; an unapproved origin received no access-control approval.
- Authenticated signing, direct R2 upload of a **6,291,456-byte (6 MiB)** disposable PNG, and CMS metadata creation: passed (200 / 200 / 201). Thumbnail, card, large and hero objects each delivered HTTP 200. The disposable record and its generated objects were deleted successfully after verification. No existing property or media was removed.
- GitHub transfer confirmed: [True-North-Base/WebsiteCore](https://github.com/True-North-Base/WebsiteCore), same public visibility, default `main`, preserved history/branches; local origin updated. Runtime credentials remain ignored and server-only. No reseed or schema migration was performed.
- Migration source committed and pushed in [pull request #1](https://github.com/True-North-Base/WebsiteCore/pull/1). Final staging rebuild `dpl_2N6aU5AsrH4mNqf3d8ZcTxUEyBXY` reached READY with the public measurement identifiers; HTML Search Console verification is present. Final route, crawler-block and anonymous-signing checks were repeated successfully.

## Remaining before client-domain launch

- Vercel GitHub app is prepared for WebsiteCore only but awaits approval; then connect Git integration and verify an actual source-triggered deployment. CLI deployment already works.
- The existing GA and Search Console public identifiers have been copied to Vercel and included in the final rebuild. Verify ownership once the real domain serves the new site. This check does not claim a live analytics event or Search Console ownership.
- With explicit owner approval, checked the existing Netlify production email settings privately: RESEND_API_KEY, INQUIRY_FROM_EMAIL and INQUIRY_TO_EMAIL are all absent, so no credentials were copied. Supply authorized mail credentials and a verified sender, then test inbox delivery and stored inquiry together. Vercel notifications remain disabled; saved inquiries do not require email delivery. No test email was sent.
- The local client Editor handoff password returns 401 on **both** Netlify and Vercel. The account was retained; no password reset was performed. Resolve by an explicitly authorized reset and renewed secure handoff, then complete the client create/update/media walkthrough.
- Obtain domain/DNS access, export the complete existing zone including mail records, and apply only Vercel's exact approved web records. Current GoDaddy registration, Squarespace DNS/site and Netlify fallback remain unchanged.
- Cloudflare's new True North Base account has not received the existing bucket. Any account consolidation needs a separately authorized copy, object/integrity verification, scoped credentials and controlled configuration switch. Preserve object keys. Configure a production-ready custom media domain before launch rather than relying on the rate-limited development `r2.dev` URL.
- Before production admin uploads, add only the approved production origin to R2 CORS; rebuild with the canonical production URL and reverify indexing, HTTPS, redirects and bilingual pages.

Historical Lighthouse results are in [LAUNCH_QUALITY_REPORT.md](LAUNCH_QUALITY_REPORT.md); this migration check does not claim new Vercel Lighthouse, complete editor workflow, or cross-host cache invalidation results.
