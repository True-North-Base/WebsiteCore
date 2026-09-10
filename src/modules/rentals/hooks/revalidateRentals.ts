import { revalidatePath } from 'next/cache.js'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

function shouldRevalidate(
  doc: { _status?: null | string },
  previousDoc?: { _status?: null | string },
): boolean {
  return doc._status === 'published' || previousDoc?._status === 'published'
}

function revalidateHomepages() {
  revalidatePath('/en')
  revalidatePath('/es')
}

function revalidatePropertyCatalogue() {
  revalidatePath('/en/properties')
  revalidatePath('/es/properties')
  revalidatePath('/sitemap.xml')
}

function revalidatePropertyPages() {
  revalidatePath('/[locale]/properties/[slug]', 'page')
  revalidatePath('/[locale]/properties/[slug]/photos', 'page')
}

function revalidateEditorialPages() {
  for (const locale of ['en', 'es']) {
    revalidatePath(`/${locale}/about`)
    revalidatePath(`/${locale}/contact`)
    revalidatePath(`/${locale}/property-management`)
  }
}

export const revalidateProperty: CollectionAfterChangeHook = ({ doc, previousDoc, req }) => {
  if (req.context.skipRevalidation || !shouldRevalidate(doc, previousDoc)) return doc

  revalidateHomepages()
  revalidatePropertyCatalogue()
  revalidatePath(`/en/properties/${doc.slug}`)
  revalidatePath(`/es/properties/${doc.slug}`)
  revalidatePath(`/en/properties/${doc.slug}/photos`)
  revalidatePath(`/es/properties/${doc.slug}/photos`)

  if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
    revalidatePath(`/en/properties/${previousDoc.slug}`)
    revalidatePath(`/es/properties/${previousDoc.slug}`)
    revalidatePath(`/en/properties/${previousDoc.slug}/photos`)
    revalidatePath(`/es/properties/${previousDoc.slug}/photos`)
  }

  return doc
}

export const revalidatePropertyDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  if (req.context.skipRevalidation) return doc
  revalidateHomepages()
  revalidatePropertyCatalogue()
  revalidatePath(`/en/properties/${doc.slug}`)
  revalidatePath(`/es/properties/${doc.slug}`)
  revalidatePath(`/en/properties/${doc.slug}/photos`)
  revalidatePath(`/es/properties/${doc.slug}/photos`)
  return doc
}

export const revalidateReviews: CollectionAfterChangeHook = ({ doc, previousDoc, req }) => {
  if (req.context.skipRevalidation || !shouldRevalidate(doc, previousDoc)) return doc
  revalidateHomepages()
  revalidatePropertyPages()
  return doc
}

export const revalidateReviewDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  if (req.context.skipRevalidation) return doc
  revalidateHomepages()
  revalidatePropertyPages()
  return doc
}

export const revalidateRentalGlobal: GlobalAfterChangeHook = ({ doc, previousDoc, req }) => {
  if (req.context.skipRevalidation || !shouldRevalidate(doc, previousDoc)) return doc
  revalidateHomepages()
  revalidatePropertyPages()
  revalidateEditorialPages()
  return doc
}
