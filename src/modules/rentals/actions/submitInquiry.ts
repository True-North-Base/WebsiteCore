'use server'

import { getPayload } from 'payload'
import { headers } from 'next/headers'

import config from '@/payload.config'

import {
  inquiryLocale,
  isHoneypotSubmission,
  type InquiryFormState,
  validateInquiry,
} from '../lib/inquiry'
import {
  createInquiryRateLimitKey,
  getClientAddress,
  isInquiryRateLimited,
} from '../lib/inquiry-rate-limit'

function successMessage(locale: 'en' | 'es'): string {
  return locale === 'es'
    ? 'Gracias. La familia te responderá personalmente.'
    : 'Thank you. The family will reply personally.'
}

export async function submitInquiry(
  _previousState: InquiryFormState,
  formData: FormData,
): Promise<InquiryFormState> {
  const locale = inquiryLocale(formData)
  if (isHoneypotSubmission(formData)) {
    return { message: successMessage(locale), status: 'success' }
  }

  const result = validateInquiry(formData)
  if (!result.valid) return { errors: result.errors, status: 'error' }

  const { propertySlug, ...inquiry } = result.data

  try {
    const payload = await getPayload({ config })
    const requestHeaders = await headers()
    const rateLimitKey = createInquiryRateLimitKey({
      clientAddress: getClientAddress(requestHeaders),
      inquiry,
      secret: process.env.PAYLOAD_SECRET || payload.secret,
    })

    if (await isInquiryRateLimited({ key: rateLimitKey, payload })) {
      return {
        message:
          inquiry.locale === 'es'
            ? 'Has enviado varias consultas recientemente. Inténtalo de nuevo en 15 minutos o usa WhatsApp.'
            : 'You have sent several inquiries recently. Try again in 15 minutes or use WhatsApp.',
        status: 'error',
      }
    }

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
          message:
            inquiry.locale === 'es'
              ? 'Esta propiedad ya no está disponible para consultas.'
              : 'This property is no longer available for inquiries.',
          status: 'error',
        }
      }
    }

    // Public API creation is denied on the collection. This trusted server-only
    // action intentionally uses Local API access override after validating input.
    await payload.create({
      collection: 'leads',
      data: { ...inquiry, property, rateLimitKey, status: 'new' },
      overrideAccess: true,
    })

    return {
      message: successMessage(inquiry.locale),
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
