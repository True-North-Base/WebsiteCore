import type { Locale } from '@/i18n'

export type InquiryField =
  | 'email'
  | 'message'
  | 'name'
  | 'phone'
  | 'privacyConsent'
  | 'requestedDates'
export type InquirySource = 'contact-form' | 'property-form'

export type InquiryFormState = {
  errors?: Partial<Record<InquiryField, string>>
  message?: string
  status: 'error' | 'idle' | 'success'
}

export const initialInquiryState: InquiryFormState = { status: 'idle' }

export type ValidInquiry = {
  email?: string
  locale: Locale
  message?: string
  name: string
  phone?: string
  propertySlug?: string
  requestedDates?: string
  source: InquirySource
}

function text(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

export function isHoneypotSubmission(formData: FormData): boolean {
  return text(formData, 'website').length > 0
}

export function inquiryLocale(formData: FormData): Locale {
  return text(formData, 'locale') === 'es' ? 'es' : 'en'
}

function requiredMessage(locale: Locale): string {
  return locale === 'es' ? 'Este campo es obligatorio.' : 'This field is required.'
}

export function validateInquiry(
  formData: FormData,
):
  | { data: ValidInquiry; valid: true }
  | { errors: NonNullable<InquiryFormState['errors']>; valid: false } {
  const locale = inquiryLocale(formData)
  const requestedSource = text(formData, 'source')
  const source: InquirySource =
    requestedSource === 'property-form' ? 'property-form' : 'contact-form'
  const name = text(formData, 'name')
  const email = text(formData, 'email')
  const phone = text(formData, 'phone')
  const message = text(formData, 'message')
  const requestedDates = text(formData, 'requestedDates')
  const propertySlug = text(formData, 'propertySlug')
  const privacyConsent = text(formData, 'privacyConsent')
  const errors: Partial<Record<InquiryField, string>> = {}

  if (name.length < 2) errors.name = requiredMessage(locale)
  else if (name.length > 120)
    errors.name = locale === 'es' ? 'Usa 120 caracteres o menos.' : 'Use 120 characters or fewer.'

  if (!email && !phone) {
    const contactError =
      locale === 'es' ? 'Incluye tu correo o teléfono.' : 'Include your email or phone number.'
    errors.email = contactError
    errors.phone = contactError
  }
  if (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    errors.email = locale === 'es' ? 'Ingresa un correo válido.' : 'Enter a valid email address.'
  }
  if (phone.length > 40)
    errors.phone = locale === 'es' ? 'Usa 40 caracteres o menos.' : 'Use 40 characters or fewer.'
  if (message.length > 3000)
    errors.message =
      locale === 'es' ? 'Usa 3000 caracteres o menos.' : 'Use 3000 characters or fewer.'
  if (requestedDates.length > 120) {
    errors.requestedDates =
      locale === 'es' ? 'Usa 120 caracteres o menos.' : 'Use 120 characters or fewer.'
  }
  if (privacyConsent !== 'accepted') {
    errors.privacyConsent =
      locale === 'es'
        ? 'Confirma que podemos usar tus datos para responder a la consulta.'
        : 'Confirm that we may use your details to answer the inquiry.'
  }
  const validPropertySlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(propertySlug)
  if (source === 'property-form' && !validPropertySlug) {
    errors.message =
      locale === 'es'
        ? 'No pudimos identificar la propiedad. Recarga la página e inténtalo de nuevo.'
        : 'We could not identify the property. Reload the page and try again.'
  }

  if (Object.keys(errors).length) return { errors, valid: false }

  return {
    data: {
      email: email || undefined,
      locale,
      message: message || undefined,
      name,
      phone: phone || undefined,
      propertySlug: validPropertySlug ? propertySlug : undefined,
      requestedDates: requestedDates || undefined,
      source,
    },
    valid: true,
  }
}
