import { revalidatePath } from 'next/cache.js'
import type { GlobalAfterChangeHook } from 'payload'

export const revalidateSite: GlobalAfterChangeHook = ({ doc, previousDoc, req }) => {
  if (req.context.skipRevalidation) return doc

  const wasPublic = previousDoc?._status === 'published'
  const isPublic = doc?._status === 'published'
  if (!wasPublic && !isPublic) return doc

  revalidatePath('/en', 'layout')
  revalidatePath('/es', 'layout')
  return doc
}
