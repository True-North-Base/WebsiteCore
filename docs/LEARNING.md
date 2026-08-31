# LEARNING.md

Short explanations of architectural ideas used in this project. This is not a second decision log; authoritative choices remain in [DECISIONS.md](DECISIONS.md).

## Why Payload and Next.js are one application

Payload 3 installs inside the Next.js App Router. The public pages, admin interface, REST endpoints, and server-side content access therefore share one deployment and one configuration. Public Server Components can use Payload's Local API without making an HTTP request back to the same application.

Recognize this pattern when a CMS is an application framework dependency, not a separate SaaS endpoint. Split deployments only when operational or organizational requirements justify the extra network and deployment boundary.

## Collection versus global

- A collection stores many documents with independent identities and lifecycles: Properties, Leads, Reviews, Media, Users.
- A global stores one editable document for a site-wide or single-page concern: Site Settings or the About page.

Mariposa has fixed page types and one owner, so typed globals are easier and safer than a generic page builder.

## Why UUIDs matter now but provider interfaces do not

A primary-key choice is expensive to change after content and integrations exist, so UUIDs are a cheap, real extension seam today. A reservation-provider interface has no current implementation or requirements, so its shape would be speculation. Stable identity is preparation; an unused interface is premature abstraction.

## Why Leads and Reviews are in Rentals during V1

The concepts sound generic, but their current fields are not: Leads can relate to a Property and use rental-form sources; Reviews relate to Properties and use OTA attribution. Moving them into core would hide a domain dependency or require a collection factory before a second use case exists. Phase 9 can extract the fields that prove identical in a real second site.

## Server Components versus Client Components

Server Components are the default because they can fetch content securely, send less JavaScript, and render quickly. A component becomes client-side only when it needs browser state or event handling, such as a mobile menu, lightbox, carousel controls, interactive filters, or form input state.

A useful question is: "Does this component need the browser after the initial HTML exists?" If not, keep it on the server.

## Why production database connections use two modes

Netlify functions open many temporary connections, so runtime queries use Supabase transaction pooling. Migrations and administrative tools need capabilities that transaction pooling does not provide reliably, so they use a controlled direct or session connection. These are two credentials for two execution contexts, not two databases.

## Why media cannot live on the deployment filesystem

Serverless filesystems are ephemeral: an uploaded file may disappear when an instance is replaced and is not automatically shared across instances. Payload stores media metadata in Postgres while Cloudflare R2 stores the file bytes persistently. The private S3-compatible endpoint handles uploads; a public media domain handles browser delivery.

## What "static with revalidation" means here

Most visitors receive pre-rendered property and marketing pages. When an editor publishes or deletes content, a Payload hook invalidates the affected Next.js paths so they regenerate. This preserves fast public pages without requiring a separate manual site rebuild for every content edit.

## The core boundary test

Ask: "Would a roofing website use this unchanged?" If the answer requires removing Property fields, OTA options, or Mariposa page copy, the code is not core yet. Similarity is not enough; the contract must already be the same.

## Things intentionally not learned by building them in V1

Reservations, availability, payments, appointments, calendars, provider adapters, notifications, multi-tenancy, and plugin systems. Their future boundaries are documented so today's code does not block them, but real requirements must arrive before their interfaces do.
