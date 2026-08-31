# CMS owner walkthrough

Phase 3 exits when the owner can complete these tasks in `/admin` without editing code. Perform the walkthrough in both English and Spanish where a field is localized.

## Local browser verification — 2026-08-27

The following workflow was exercised against the local Payload admin before handing access to the owner:

- Edited the English Penthouse Lago short description while confirming the Spanish value remained independent.
- Saved the edit as a draft and confirmed the public page retained the last published value; published it, confirmed the public change, then restored and republished the original copy.
- Created **OWNER WORKFLOW TEST — UNPUBLISHED** as a draft and confirmed its public URL returns 404.
- Submitted a clearly labelled test inquiry from the homepage, confirmed its locale and source in the admin, and changed its status to **Closed**.
- Confirmed an unauthenticated REST create request to `/api/leads` is denied with HTTP 403.
- Inspected the property photo/amenity controls, reviews, localized homepage content, shared settings, and draft/version controls in the admin.

No approved public content was left changed. The temporary property remains a draft and the workflow inquiry remains closed so the owner can inspect both records. The owner's hands-on walkthrough is still required for the unchecked media, review, contact-setting, featured-order, and hide/republish operations below.

## Properties and publishing

- Open **Rentals → Properties** and edit Penthouse Lago.
- Change a localized short description in English, switch to Spanish, and confirm the Spanish value remains independent.
- Save a draft and confirm the public page still shows the last published content.
- Publish the change and confirm it appears on `/en/properties/penthouse-lago` or `/es/properties/penthouse-lago` as appropriate.
- Unpublish/hide the property and confirm public reads no longer expose the document; republish it before finishing.
- Create a temporary draft property with the required basics, then leave it unpublished. This proves the workflow without adding an unapproved public page.
- Change **Featured** and **Display order** and confirm the homepage row changes only after publication.

## Photos

- Upload an image with meaningful English and Spanish alt text.
- Select a hero image.
- Add several gallery images, assign each a category, and mark only the strongest cross-section as **Featured in showcase**.
- Drag gallery images to reorder them, save, and confirm the first five update the property mosaic after publishing.
- Open the public `/photos` route and confirm its Showcase and category tabs reflect those selections without duplicating media records.
- Remove a gallery relationship and confirm the media item itself is not accidentally deleted.
- Delete only an intentionally disposable media item; do not delete an image still used by another document.

## Sleeping arrangements

- Add one row for each distinct bedroom or sleeping area, select its representative photo, and write localized room names and factual bed summaries.
- Do not guess bed size from a photograph. Use a neutral summary such as “1 bed” until the owner confirms king/queen/twin details.
- Reorder the rows, publish, and confirm “Where you'll sleep” / “Dónde dormirás” follows the property description in the intended order.

## Amenities, reviews, and shared settings

- Edit an amenity group and its localized items.
- Review each property's cancellation summary/details, pets, smoking, events, check-in/out, and maximum-guest wording in both locales; publish only factual terms.
- Confirm the public map stays at district level. Add approximate coordinates only when they cannot reveal a private address.
- Create or edit a genuine review, select its platform and optional Property relationship, and publish it.
- Confirm **Source URL** is visible to signed-in editors but absent from the public API.
- Edit phone, email, and WhatsApp wording in **Site → Site settings** and verify public links after publishing.
- Edit homepage headings/features in **Pages → Home page** and verify both locales.
- Under **Rentals → Rental settings**, keep the intended platform rows with blank URLs during owner review, delete unwanted platforms, and add complete approved profile URLs. Confirm placeholders become links only after publication.

## Inquiries

- Open the homepage and property inquiry forms; confirm name plus either email or phone is required.
- Submit one clearly labelled test inquiry, confirm it appears under **Rentals → Inquiries** with locale/source/property, then mark it closed.
- Confirm an unauthenticated POST to `/api/leads` is denied; the public form must use the validated server action.

## Open production decisions

- Approve privacy copy, consent behavior if required, and a lead retention/deletion period before staging.
- Approve the remaining 13 property names/slugs and all Spanish content during Phase 4.
- Complete final visual acceptance of the deployed 2026-08-29 mobile refinement before multiplying the design into later pages.
