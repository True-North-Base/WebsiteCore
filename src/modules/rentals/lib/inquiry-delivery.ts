import type { Lead } from '@/payload-types'

const RESEND_EMAIL_ENDPOINT = 'https://api.resend.com/emails'
const DELIVERY_TIMEOUT_MS = 8_000

export type InquiryDeliveryResult = 'disabled' | 'email'

type InquiryNotification = Pick<
  Lead,
  'createdAt' | 'email' | 'id' | 'locale' | 'message' | 'name' | 'phone' | 'requestedDates' | 'source'
> & {
  propertyTitle?: string
}

function inquirySummary(inquiry: InquiryNotification): string {
  const adminBaseUrl = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, '')
  const lines = [
    'New CR Mariposa website inquiry',
    '',
    `Name: ${inquiry.name}`,
    inquiry.email ? `Email: ${inquiry.email}` : null,
    inquiry.phone ? `Phone: ${inquiry.phone}` : null,
    inquiry.propertyTitle ? `Property: ${inquiry.propertyTitle}` : null,
    inquiry.requestedDates ? `Requested dates: ${inquiry.requestedDates}` : null,
    `Source: ${inquiry.source}`,
    `Site language: ${inquiry.locale}`,
    `Submitted: ${inquiry.createdAt}`,
    adminBaseUrl ? `Admin record: ${adminBaseUrl}/admin/collections/leads/${inquiry.id}` : null,
    '',
    inquiry.message || '(No message supplied)',
  ]

  return lines.filter((line): line is string => line !== null).join('\n')
}

export async function deliverInquiryNotification(
  inquiry: InquiryNotification,
): Promise<InquiryDeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.INQUIRY_FROM_EMAIL?.trim()
  const to = process.env.INQUIRY_TO_EMAIL?.split(',')
    .map((address) => address.trim())
    .filter(Boolean)

  // Payload remains authoritative. Email notification is intentionally inert
  // until CR Mariposa's own Resend sender and recipient are configured.
  if (!apiKey || !from || !to?.length) return 'disabled'

  const subject = inquiry.propertyTitle
    ? `Website inquiry: ${inquiry.propertyTitle}`
    : 'Website inquiry: CR Mariposa'
  const body: Record<string, unknown> = {
    from,
    subject,
    text: inquirySummary(inquiry),
    to,
  }

  if (inquiry.email) body.reply_to = inquiry.email

  const response = await fetch(RESEND_EMAIL_ENDPOINT, {
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `inquiry/${inquiry.id}`,
    },
    method: 'POST',
    signal: AbortSignal.timeout(DELIVERY_TIMEOUT_MS),
  })

  if (!response.ok) throw new Error(`Resend responded ${response.status}`)
  return 'email'
}
