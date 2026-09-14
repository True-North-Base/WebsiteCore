# Launch quality report — Phase 6, Chunk 2

Run date: 2026-08-31

## Accessibility

The public EN/ES routes were audited against WCAG 2.1 A/AA using automated Axe checks plus keyboard, focus, narrow-viewport, and touch-target browser checks. The final automated sweep covered the home, catalogue, About, Property Management, Contact, representative property, and photo-gallery experiences and reported no WCAG A/AA violations.

Verified fixes include:

- a top-level main landmark on the homepage;
- a high-contrast two-colour focus indicator that remains visible on light and dark surfaces;
- corrected muted-text contrast (`#666359` on sand is approximately 4.71:1);
- explicit form labels, error relationships, and invalid-state semantics;
- meaningful CMS-backed image alternative text;
- keyboard-operable navigation, disclosures, gallery controls, and actions;
- at least 44 × 44 CSS-pixel targets for the audited compact links and controls; and
- no horizontal overflow at 320 px or 390 px.

Automated testing cannot prove the full assistive-technology experience. The client acceptance pass still includes a human content review and keyboard walkthrough; a screen-reader spot check is recommended before production sign-off.

## Mobile performance

Method: local production build; desktop Chrome emulating 390 × 844 CSS pixels at DPR 1; 4× CPU slowdown; 1.6 Mbps download, 750 Kbps upload, and 150 ms latency; three cold-cache runs per route; medians reported. These are controlled engineering measurements, not field data or a Lighthouse score.

| Route                           | State  | CLS | DOMContentLoaded |      FCP |      LCP |     Load | Requests | Transfer |
| ------------------------------- | ------ | --: | ---------------: | -------: | -------: | -------: | -------: | -------: |
| `/en`                           | Before |   0 |           894 ms | 2,144 ms | 8,292 ms | 8,853 ms |       26 | 1,593 KB |
| `/en`                           | After  |   0 |           820 ms | 1,948 ms | 6,132 ms | 7,232 ms |       25 | 1,219 KB |
| `/en/properties/penthouse-lago` | Before |   0 |           858 ms | 1,588 ms | 4,308 ms | 6,426 ms |       22 | 1,126 KB |
| `/en/properties/penthouse-lago` | After  |   0 |           824 ms | 1,612 ms | 5,476 ms | 7,058 ms |       16 | 1,254 KB |

The safe homepage image-loading adjustment removes one competing responsive-image request while retaining high fetch priority for the visible candidate. The homepage median transferred 24% fewer bytes and LCP improved by 26% in this profile. Applying the same strategy to the property gallery regressed its median, so that gallery change was rejected and its prior loading contract restored. The property before/after values also span the local content refresh needed for browser fixtures and are not treated as evidence of a code-level regression or improvement. The visual design, content model, and inquiry-only scope are unchanged.

At the August 31 checkpoint, Phase 6's formal Lighthouse mobile ≥90 gate remained open pending measurements against the final deployed staging build, where CDN, serverless, and R2 behaviour are representative. The September 14 verification below closes that measurement gate.

## Deployed mobile verification — 2026-09-14

Verified Netlify staging deploy `6aa77a2931cf6bb5fd19551a`, published at 2026-09-14 04:42:45 UTC, on [cr-mariposa-staging.netlify.app](https://cr-mariposa-staging.netlify.app). This is the existing staging site's main alias, not a production-domain cutover.

Method: pinned Lighthouse 12.8.2 CLI, default simulated mobile profile (412 × 823 CSS pixels, DPR 1.75, 150 ms RTT, 1,638.4 Kbps throughput, 4× CPU slowdown), three fresh-browser runs per route, alternating homepage and property runs. These are lab results, not field Core Web Vitals.

| Route | Performance runs | Median performance | Median LCP | CLS |
| --- | --- | ---: | ---: | ---: |
| `/en` | 97, 95, 96 | 96 | 2,529 ms | 0 |
| `/en/properties/penthouse-lago` | 97, 98, 97 | 97 | 2,456 ms | 0 |

Every run scored Accessibility 100 and Best Practices 100. SEO scored 69 solely because staging deliberately blocks crawling; all other scored SEO checks passed. Keep the staging robots block until the controlled canonical-domain cutover. Console-error checks passed, the favicon no longer returns 404, and redirect savings were zero in every run.

The deployed fixes select one eager, high-priority responsive homepage hero through native picture art direction; pre-render all published property detail/photo routes while allowing newly published slugs to generate on demand; keep missing/unpublished CMS properties out of seed fallbacks; scope Payload's colour-scheme client hints to the admin instead of restarting public first navigations; and provide the brand favicon. The property gallery's previously verified loading contract was preserved.

Verification also passed: all 51 integration tests across 13 files, lint, typecheck, production build (73 static routes), live EN/ES home/catalogue/property/photo smoke checks, favicon, sitemap and robots. Manual desktop and mobile checks preserved the approved photo/layout, confirmed one eager hero candidate and no horizontal overflow at 320/390 px, and confirmed the discovery bar's internal right gap is effectively zero. Public responses no longer carry the admin colour-scheme critical hint; admin responses retain it.

The formal mobile ≥90 gate is met for both required routes. Owner/client CMS acceptance, including a post-build new-property publish/unpublish/republish walkthrough, privacy/content approval, analytics/Search Console, and production-domain cutover remain open. No test property or inquiry was created during these checks.
