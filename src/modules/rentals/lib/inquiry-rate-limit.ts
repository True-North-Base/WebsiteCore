import { createHmac } from 'node:crypto'
import { isIP } from 'node:net'

import type { Payload } from 'payload'

import type { ValidInquiry } from './inquiry'

export const INQUIRY_RATE_LIMIT_MAX = 5
export const INQUIRY_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000

type HeaderReader = Pick<Headers, 'get'>
type LeadCounter = Pick<Payload, 'count'>

function firstValidAddress(value: string | null): string | undefined {
  if (!value) return undefined

  return value
    .split(',')
    .map((part) => part.trim())
    .find((part) => isIP(part) !== 0)
}

export function getClientAddress(headers: HeaderReader): string | undefined {
  return (
    firstValidAddress(headers.get('x-nf-client-connection-ip')) ||
    firstValidAddress(headers.get('cf-connecting-ip')) ||
    firstValidAddress(headers.get('x-real-ip')) ||
    firstValidAddress(headers.get('x-forwarded-for'))
  )
}

export function createInquiryRateLimitKey({
  clientAddress,
  inquiry,
  secret,
}: {
  clientAddress?: string
  inquiry: Pick<ValidInquiry, 'email' | 'phone'>
  secret: string
}): string {
  const identity = clientAddress
    ? `ip:${clientAddress}`
    : `contact:${inquiry.email?.toLowerCase() || ''}|${inquiry.phone || ''}`

  return createHmac('sha256', secret).update(identity).digest('hex')
}

export async function isInquiryRateLimited({
  key,
  now = Date.now(),
  payload,
}: {
  key: string
  now?: number
  payload: LeadCounter
}): Promise<boolean> {
  const windowStart = new Date(now - INQUIRY_RATE_LIMIT_WINDOW_MS).toISOString()
  const { totalDocs } = await payload.count({
    collection: 'leads',
    overrideAccess: true,
    where: {
      and: [{ rateLimitKey: { equals: key } }, { createdAt: { greater_than: windowStart } }],
    },
  })

  return totalDocs >= INQUIRY_RATE_LIMIT_MAX
}
