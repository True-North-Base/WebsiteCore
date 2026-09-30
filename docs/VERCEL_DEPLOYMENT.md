# CR Mariposa: Vercel deployment and later domain cutover

## Current state — 2026-09-30

Project `cr-mariposa-staging`, team `true-north-base`. Client review URL: https://cr-mariposa-staging.vercel.app/en; CMS: https://cr-mariposa-staging.vercel.app/admin. This uses Vercel's production channel for a stable **staging** alias; it is not the client-domain production launch. Existing Supabase, R2 and Payload accounts are shared with Netlify, so CMS edits affect both hosts' underlying data. Cross-host cache invalidation is not automatic; use the Vercel CMS for Vercel acceptance tests. No database migration or seed is needed.

## Reproducible settings

- Next.js preset; project root is repository root; Node `22.x` in project settings.
- `vercel.json`: `pnpm install --frozen-lockfile`, then `pnpm generate:importmap && pnpm build`.
- Local Vercel link state and all `.env*` credentials are ignored; `.vercelignore` also excludes local secrets and prior deployment artifacts from CLI source uploads.
- Stable staging alias is public for review. Preview deployments retain Vercel authentication. Payload `/admin` and write APIs remain authenticated independently.
- Preview and noncanonical staging builds block crawlers; public layouts emit `noindex, nofollow`. Enable production indexing only at approved cutover using `NEXT_PUBLIC_SERVER_URL=https://www.crmariposarentals.com`, then rebuild and verify actual HTML/robots.

## Environment variables

Required: `DATABASE_URL` (existing transaction pooler), `PAYLOAD_SECRET` (retain existing account/session secret), `NEXT_PUBLIC_SERVER_URL`, the existing five `R2_*` configuration values, and `R2_CLIENT_UPLOADS=true`. Never deploy the migration-only database connection or account password handoff files. Variables are scoped per deployment environment; changes require a new build.

Optional: `GOOGLE_MAPS_EMBED_API_KEY`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `RESEND_API_KEY`, `INQUIRY_TO_EMAIL`, `INQUIRY_FROM_EMAIL`. Carry existing approved measurement IDs forward. Resend notifications remain disabled until all three mail values are supplied with a verified sender; saved inquiries do not depend on email delivery.

## R2 direct uploads

Original photos bypass Vercel Functions via Payload's authenticated signing endpoint, `/api/storage-s3-generate-signed-url`. Payload still processes image variants and stores provider-neutral object keys. Do not broaden credentials or replace the storage adapter.

Preserve existing bucket CORS and add only approved admin origins. Initial staging rule:

```json
[
  {
    "AllowedOrigins": ["https://cr-mariposa-staging.vercel.app"],
    "AllowedMethods": ["PUT"],
    "AllowedHeaders": ["Content-Type", "If-None-Match"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

Add `https://www.crmariposarentals.com` before production admin use, and specific preview origins only if media editing on those previews is required. Never allow every `*.vercel.app` origin. Object-scoped runtime credentials may not manage CORS; use the existing Cloudflare dashboard with owner approval rather than expanding runtime credentials. Verify anonymous signing denial and a real upload above 4.5 MB, generated variants, public delivery and CMS edit/publish before sign-off.

## GitHub

The repository transfer is complete: [True-North-Base/WebsiteCore](https://github.com/True-North-Base/WebsiteCore). Name, public visibility, branches and history were retained; the local origin now points to the organization. The Vercel GitHub app installation is prepared with **WebsiteCore only** selected and awaits owner approval before granting its displayed permissions. Reconnect Vercel after installation. Until Git integration is verified, deploy through the authorized CLI; do not claim pushes automatically deploy.

## Domain cutover — not performed yet

1. Obtain DNS-capable Squarespace access and GoDaddy delegate access if nameservers may move. GoDaddy is registrar; Squarespace currently hosts authoritative DNS. Export **all** records, including MX, SPF, DKIM, DMARC, verification TXT, CAA and subdomains. Confirm the email provider and retain a rollback copy.
2. Add root and `www` domains to the Vercel project only during the approved cutover workflow. Read the **exact** A/CNAME/verification records supplied by Vercel; do not use the old Netlify values or hardcoded generic IPs. Choose `www` as canonical and redirect root.
3. Change web records at the current authoritative DNS provider, preserving mail and unrelated records. A registrar transfer is unnecessary. If retiring Squarespace requires new authoritative DNS, recreate the complete zone elsewhere before changing GoDaddy nameservers.
4. Verify HTTPS, root/www redirects, all legacy 301s, EN/ES/mobile pages, CMS editing, R2 upload, stored inquiry and verified-sender Resend delivery. Update canonical URL, measurement settings and any restricted map-key referrers for the new host, redeploy, and verify crawl settings and Search Console ownership.
5. Keep Squarespace and Netlify until acceptance, propagation and rollback checks pass. **Do not disconnect Nameserver Connect or cancel/delete the Squarespace site while DNS still depends on it**: disconnecting can remove custom DNS records. Retire services only in a separately approved cleanup.

## Validation / rollback

Local: `pnpm lint`, `pnpm typecheck`, `pnpm test:int`. Release: remote production build; EN/ES, property and photo showcase, images, login, anonymous API access, uploads, robots/sitemap, 301 and real 404 checks. Do not submit fake inquiries that would email the owner once Resend is enabled. Deployments do not roll back shared CMS data; use backups/content restoration for data changes. DNS rollback restores the saved original web records, not an unreviewed zone replacement.

Executed checks and remaining limitations: [VERCEL_MIGRATION_CHECKS.md](VERCEL_MIGRATION_CHECKS.md). A 6 MiB original successfully bypassed the function body limit, and all four image variants were verified. The test record and objects were deleted after verification; existing property content was not changed. Existing administrator credentials work. The stored client Editor handoff password currently fails on both Netlify and Vercel, so it needs an explicitly authorized reset before a new client walkthrough; this migration did not reset any account.

References: [Payload direct uploads](https://payloadcms.com/docs/upload/storage-adapters), [Vercel function limits](https://vercel.com/docs/functions/limitations), [R2 CORS](https://developers.cloudflare.com/r2/buckets/cors/), [Vercel domains](https://vercel.com/docs/domains/working-with-domains/add-a-domain), [GitHub transfers](https://docs.github.com/en/repositories/creating-and-managing-repositories/transferring-a-repository).
