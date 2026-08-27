# FUTURE_MODULES.md

Capabilities this platform is expected to grow, **none of which exist in code today**. This document defines the boundaries so V1 decisions don't foreclose them — and the trigger conditions that justify finally building each one. If you are implementing from this file without a task that explicitly activates a capability, stop.

## The rule for introducing abstractions

An interface, adapter, or provider layer is introduced **when the first real implementation of it begins — not before**. Until then, the "extension point" is nothing more than:

1. **Stable identity** — every document has a UUID that outlives content edits (done in V1).
2. **Clean boundaries** — reservation/payment/notification logic never embedded in Property, Lead, forms, or UI components (enforced in V1).
3. **This document** — so the intended seams are known.

Empty interfaces are a cost with no payoff: they must be designed against zero real requirements, and the first real provider always reshapes them anyway.

## Capability map (all future)

```
                    FUTURE CAPABILITIES
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
     Scheduling         Payments        Notifications
          │
    ┌─────┴─────────┐
    │               │
Appointments   Reservations
    │               │
 Roofing         Mariposa
 Dentist         vacation rentals
 Salon, etc.
```

External provider families (each an adapter behind one interface, introduced with its first implementation):

- **ReservationProvider** — Smoobu, Lodgify, Guesty, Hospitable
- **PaymentProvider** — Stripe, others
- **NotificationProvider** — Email, WhatsApp Business API, SMS
- **CalendarProvider** — Google Calendar, others
- **AvailabilityProvider** — often the same vendor as reservations, kept conceptually separate (read-availability vs write-booking)

## Scheduling Core (future `src/modules/scheduling`)

Shared time-based concepts that both Appointments and Reservations would specialize:
`Resource` (a bookable thing — a property, a technician, a chair), `Service`, `AvailabilityRule`, `BlackoutPeriod`, `Appointment`/`Booking` with a status lifecycle, explicit `TimeZone` handling (Costa Rica is UTC−6 year-round; guests are not).

Trigger to build: the first client engagement that pays for scheduling. Not before.

## Rental Reservation Module (Mariposa's likely first activation)

- `Reservation` is its own collection: property (relationship by UUID), guest/customer (relationship), check-in/check-out, party size, status (`inquiry → quoted → confirmed → completed/cancelled`), source (`direct`, `airbnb`, …), notes. Property's content model does not change.
- The realistic first step is **not** a checkout — it is availability display: an `AvailabilityProvider` adapter reading from whatever PMS/channel manager the owner adopts (Smoobu, Lodgify, Guesty, Hospitable all expose calendars). Direct booking with payment would follow only after that.
- V1 seams already in place: property UUIDs; `Lead.requestedDates` free text (a reservation flow would replace the free text, not migrate it); the sticky inquiry card is one component that would gain a "check availability" state.

## Appointment Module (other verticals — roofing inspection, dentist, salon, gaming venue)

Specializes Scheduling Core with `Service` catalogs and staff `Resource`s and time-slot picking. Explicitly out of scope for this repo — it exists here only to test that nothing in `core` assumes rentals. It doesn't: Leads, Reviews (optional subject), Media, Site Settings are vertical-agnostic.

## Payments

Future `PaymentProvider` interface, Stripe first. Payments attach to a Reservation or Appointment (the thing with a lifecycle), never to Property or Lead. No card data ever touches this codebase — hosted checkout/elements only.

## Notifications

Future `NotificationProvider` (email, WhatsApp Business API, SMS) triggered by domain events (lead created, reservation confirmed). V1 deliberately has zero automated messaging: the V1 forms only create Lead documents, which is exactly the seam a notification dispatch hook would attach to (Payload `afterChange` on `leads`). Do not put sending logic in form components or server actions — it belongs behind the future dispatcher.

## Customers

`Customer` emerges when any lifecycle capability (reservation/appointment) needs identity across interactions: a small collection (name, contacts, notes) that Leads, Reservations, Appointments and Payments relate **to** — never nested arrays inside one giant document. V1's Lead keeps a shape (name/email/phone) that converts by linking, not by migration.

## Feature activation (idea only)

When a second client site exists, capability toggles could live in configuration (site settings or env), e.g. `capabilities: { appointments: false, reservations: false, payments: false }`, wiring collections and routes per site. **Do not build a plugin framework for V1's single site** — the composition point (`payload.config.ts`) is already the feature switch: a capability is "off" by not being imported.

## What V1 explicitly does not contain (verbatim scope guard)

Direct reservations, availability calendar, OTA sync, Booking.com/Airbnb APIs, PMS, channel manager, checkout, payment engine, appointment scheduler, calendar engine, automated SMS/email/WhatsApp, workflow engine, multi-tenant SaaS platform, provider interfaces of any kind.
