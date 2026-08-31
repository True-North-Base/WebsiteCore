import { describe, expect, it, vi } from 'vitest'

import { isHoneypotSubmission, validateInquiry } from '@/modules/rentals/lib/inquiry'
import {
  createInquiryRateLimitKey,
  getClientAddress,
  INQUIRY_RATE_LIMIT_MAX,
  INQUIRY_RATE_LIMIT_WINDOW_MS,
  isInquiryRateLimited,
} from '@/modules/rentals/lib/inquiry-rate-limit'

function form(values: Record<string, string>): FormData {
  const data = new FormData()
  Object.entries(values).forEach(([key, value]) => data.set(key, value))
  return data
}

describe('inquiry validation', () => {
  it('accepts a localized property inquiry without creating availability data', () => {
    const result = validateInquiry(
      form({
        email: 'guest@example.com',
        locale: 'es',
        name: 'Elena',
        propertySlug: 'penthouse-lago',
        requestedDates: '10–17 de marzo',
        source: 'property-form',
      }),
    )

    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.data).toMatchObject({
        locale: 'es',
        propertySlug: 'penthouse-lago',
        requestedDates: '10–17 de marzo',
        source: 'property-form',
      })
      expect(result.data).not.toHaveProperty('availability')
    }
  })

  it('requires a name and at least one reply channel', () => {
    const result = validateInquiry(form({ locale: 'en', source: 'contact-form' }))

    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.errors.name).toBeTruthy()
      expect(result.errors.email).toBeTruthy()
      expect(result.errors.phone).toBeTruthy()
    }
  })

  it('rejects malformed email and overlong free-text dates', () => {
    const result = validateInquiry(
      form({
        email: 'not-an-email',
        locale: 'en',
        name: 'Guest',
        requestedDates: 'x'.repeat(121),
        source: 'contact-form',
      }),
    )

    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.errors.email).toMatch(/valid email/i)
      expect(result.errors.requestedDates).toMatch(/120/)
    }
  })

  it('requires a valid property slug for property-form submissions', () => {
    const result = validateInquiry(
      form({
        email: 'guest@example.com',
        locale: 'en',
        name: 'Guest',
        propertySlug: '../admin',
        source: 'property-form',
      }),
    )

    expect(result.valid).toBe(false)
    if (!result.valid) expect(result.errors.message).toMatch(/identify the property/i)
  })

  it('detects the hidden honeypot without affecting normal submissions', () => {
    expect(isHoneypotSubmission(form({ website: '' }))).toBe(false)
    expect(isHoneypotSubmission(form({ website: 'https://spam.example' }))).toBe(true)
  })

  it('uses a keyed, non-reversible rate-limit identity and trusted client headers', () => {
    const headers = new Headers({
      'x-forwarded-for': '198.51.100.10, 10.0.0.4',
      'x-nf-client-connection-ip': '203.0.113.7',
    })
    const key = createInquiryRateLimitKey({
      clientAddress: getClientAddress(headers),
      inquiry: { email: 'Guest@Example.com' },
      secret: 'test-secret',
    })

    expect(getClientAddress(headers)).toBe('203.0.113.7')
    expect(key).toMatch(/^[a-f0-9]{64}$/)
    expect(key).not.toContain('203.0.113.7')
  })

  it('blocks only after the conservative database-backed threshold', async () => {
    const count = vi
      .fn()
      .mockResolvedValueOnce({ totalDocs: INQUIRY_RATE_LIMIT_MAX - 1 })
      .mockResolvedValueOnce({ totalDocs: INQUIRY_RATE_LIMIT_MAX })
    const now = Date.parse('2026-08-31T12:00:00.000Z')

    await expect(isInquiryRateLimited({ key: 'key', now, payload: { count } })).resolves.toBe(false)
    await expect(isInquiryRateLimited({ key: 'key', now, payload: { count } })).resolves.toBe(true)
    expect(count).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'leads',
        overrideAccess: true,
        where: {
          and: [
            { rateLimitKey: { equals: 'key' } },
            {
              createdAt: {
                greater_than: new Date(now - INQUIRY_RATE_LIMIT_WINDOW_MS).toISOString(),
              },
            },
          ],
        },
      }),
    )
  })
})
