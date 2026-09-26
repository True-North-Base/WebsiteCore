import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  count: vi.fn(),
  create: vi.fn(),
  getPayload: vi.fn(),
  headers: vi.fn(),
}))

vi.mock('payload', async (importOriginal) => ({
  ...(await importOriginal<typeof import('payload')>()),
  getPayload: mocks.getPayload,
}))
vi.mock('next/headers', () => ({ headers: mocks.headers }))
vi.mock('@/payload.config', () => ({ default: {} }))

import { submitInquiry } from '@/modules/rentals/actions/submitInquiry'
import { initialInquiryState } from '@/modules/rentals/lib/inquiry'
import { INQUIRY_RATE_LIMIT_MAX } from '@/modules/rentals/lib/inquiry-rate-limit'

function inquiryForm(overrides: Record<string, string> = {}): FormData {
  const data = new FormData()
  const values = {
    email: 'guest@example.com',
    locale: 'en',
    name: 'Guest',
    privacyConsent: 'accepted',
    source: 'contact-form',
    ...overrides,
  }
  Object.entries(values).forEach(([key, value]) => data.set(key, value))
  return data
}

describe('inquiry server action spam controls', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.headers.mockResolvedValue(new Headers({ 'x-nf-client-connection-ip': '203.0.113.7' }))
    mocks.getPayload.mockResolvedValue({
      count: mocks.count,
      create: mocks.create,
      secret: 'test-secret',
    })
  })

  it('silently accepts a filled honeypot without touching Payload', async () => {
    const result = await submitInquiry(
      initialInquiryState,
      inquiryForm({ website: 'https://spam.example' }),
    )

    expect(result).toEqual({
      message: 'Thank you. The family will reply personally.',
      status: 'success',
    })
    expect(mocks.getPayload).not.toHaveBeenCalled()
  })

  it('stores a valid lead with a keyed rate-limit hash', async () => {
    mocks.count.mockResolvedValue({ totalDocs: 0 })
    mocks.create.mockResolvedValue({ id: 'lead-id' })

    await expect(submitInquiry(initialInquiryState, inquiryForm())).resolves.toMatchObject({
      status: 'success',
    })
    expect(mocks.create).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'leads',
        data: expect.objectContaining({
          email: 'guest@example.com',
          privacyConsentAt: expect.any(String),
          privacyNoticeVersion: '2026-09-25',
          rateLimitKey: expect.stringMatching(/^[a-f0-9]{64}$/),
          retentionUntil: expect.any(String),
          status: 'new',
        }),
        overrideAccess: true,
      }),
    )
  })

  it('blocks the threshold request before creating another lead', async () => {
    mocks.count.mockResolvedValue({ totalDocs: INQUIRY_RATE_LIMIT_MAX })

    await expect(submitInquiry(initialInquiryState, inquiryForm())).resolves.toEqual({
      message: 'You have sent several inquiries recently. Try again in 15 minutes or use WhatsApp.',
      status: 'error',
    })
    expect(mocks.create).not.toHaveBeenCalled()
  })
})
