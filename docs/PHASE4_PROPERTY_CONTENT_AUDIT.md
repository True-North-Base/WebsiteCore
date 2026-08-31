# Phase 4 property content audit

Source reviewed on 2026-08-30: the owner’s public legacy site, `https://www.crmariposarentals.com/`, including each of its fourteen property pages. The Phase 4 seed paraphrases factual source content; it does not copy unverified ratings, availability, prices, guest limits, check-in times, house rules, or exact addresses.

## Catalogue mapping

| Legacy path         | New slug             | Verified public area      | Beds/baths used        |
| ------------------- | -------------------- | ------------------------- | ---------------------- |
| `/terrazasescazu`   | `terrazas-escazu`    | Escazú, Guachipelín       | 2 bedrooms / 2 baths   |
| `/penthouseoasis`   | `penthouse-oasis`    | Santa Ana, Río Oro        | 2 bedrooms / 2 baths   |
| `/terrazadowntown`  | `terraza-downtown`   | Downtown Santa Ana        | 2 bedrooms / 1 bath    |
| `/riverpark`        | `riverpark-downtown` | Downtown Santa Ana        | 2 bedrooms / 2 baths   |
| `/apartmentparaiso` | `apartment-paraiso`  | Santa Ana                 | 2 bedrooms / 2 baths   |
| `/apartmentroca`    | `apartment-roca`     | Santa Ana, Río Oro        | 2 bedrooms / 2 baths   |
| `/apartmentmontana` | `apartment-montana`  | Santa Ana, Río Oro        | 2 bedrooms / 1 bath    |
| `/lago`             | `penthouse-lago`     | Santa Ana, Río Oro        | 2 bedrooms / 2 baths   |
| `/lvistaandjacuzzi` | `vista-and-jacuzzi`  | Santa Ana, Río Oro        | 2 bedrooms / 2.5 baths |
| `/apartmentbrisa`   | `apartment-brisa`    | Santa Ana, Río Oro        | 2 bedrooms / 2 baths   |
| `/lago-1`           | `penthouse-laguna`   | Santa Ana, Río Oro        | 2 bedrooms / 2 baths   |
| `/bosquesdecarao`   | `bosques-de-carao`   | Santa Ana, Lindora        | 2 bedrooms / 2 baths   |
| `/playalangosta`    | `playa-langosta`     | Playa Langosta, Tamarindo | 3 bedrooms / 3 baths   |
| `/beachfront`       | `beachfront-villa`   | Playa Tivives, Puntarenas | 3 bedrooms / 2.5 baths |

## Source conflicts retained for owner review

- Terraza Downtown’s summary says two bathrooms; its detailed specification and closing summary say one. The seed uses one.
- Apartment Montana contains one stray “2BR/2BA” phrase; its summary and detailed paragraph say one bathroom. The seed uses one.
- Playa Langosta’s top summary says 2.5 bathrooms; the current detailed description and property-highlights list say three full bathrooms. The seed uses three.
- Legacy page titles contain several copy/paste SEO errors. New titles use the actual property name rather than those legacy browser titles.
- Maximum occupancy, ratings, check-in/out times, cancellation rules, pet/smoking/event rules, and most external marketplace URLs are not consistently verifiable. They remain blank or use the existing neutral “confirmed personally” cancellation language pending owner confirmation.

## Media status

Six representative property-specific legacy images per new listing were imported through Payload and stored in Cloudflare R2. Database records refer to Payload media/object keys; public delivery URLs are materialized from configuration. These Squarespace derivatives are staging content, not a declaration that they are the owner’s highest-resolution masters. Replace them in the owner media review when original files are available.
