'use server'

import { getPayload } from 'payload'

import config from '@/payload.config'

import { type InquiryFormState, validateInquiry } from '../lib/inquiry'

export async function submitInquiry(
  _previousState: InquiryFormState,
  formData: FormData,
): Promise<InquiryFormState> {
  const result = validateInquiry(formData)
  if (!result.valid) return { errors: result.errors, status: 'error' }

  const { propertySlug, ...inquiry } = result.data

  try {
    const payload = await getPayload({ config })
    let property: string | undefined

    if (propertySlug) {
      const propertyResult = await payload.find({
        collection: 'properties',
        depth: 0,
        draft: false,
        limit: 1,
        overrideAccess: false,
        where: { slug: { equals: propertySlug } },
      })
      property = propertyResult.docs[0]?.id
      if (!property) {
        return {
          message: inquiry.locale === 'es' ? 'Esta propiedad ya no está disponible para consultas.' : 'This property is no longer available for inquiries.',
          status: 'error',
        }
      }
    }

    // Public API creation is denied on the collection. This trusted server-only
    // action intentionally uses Local API access override after validating input.
    await payload.create({
      collection: 'leads',
      data: { ...inquiry, property, status: 'new' },
      overrideAccess: true,
    })

    return {
      message: inquiry.locale === 'es' ? 'Gracias. La familia te responderá personalmente.' : 'Thank you. The family will reply personally.',
      status: 'success',
    }
  } catch (error) {
    console.error('[inquiry] Unable to store inquiry', error)
    return {
      message:
        inquiry.locale === 'es'
          ? 'No pudimos enviar tu consulta. Intenta por WhatsApp o teléfono.'
          : 'We could not send your inquiry. Please try WhatsApp or phone.',
      status: 'error',
    }
  }
}
