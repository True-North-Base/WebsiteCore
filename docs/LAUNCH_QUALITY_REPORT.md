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

Phase 6's formal Lighthouse mobile ≥90 gate remains open until it is measured against the final deployed staging build, where CDN, serverless, and R2 behaviour are representative.
