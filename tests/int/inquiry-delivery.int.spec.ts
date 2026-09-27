import { afterEach, describe, expect, it, vi } from 'vitest'

import { deliverInquiryNotification } from '@/modules/rentals/lib/inquiry-delivery'

const inquiry = {
  createdAt: '2026-09-27T12:00:00.000Z',
  email: 'guest@example.com',
  id: '2af22d92-e991-41a8-b9db-d5ecfd83605c',
  locale: 'en' as const,
  message: 'We would like to stay for a week.',
  name: 'Guest',
  phone: '+506 8000-0000',
  propertyTitle: 'Penthouse Lago',
  requestedDates: 'November 4–11',
  source: 'property-form' as const,
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('inquiry email delivery', () => {
  it('stays disabled unless the API key, recipient and sender are all configured', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    vi.stubEnv('RESEND_API_KEY', 'test-key')
    vi.stubEnv('INQUIRY_TO_EMAIL', 'owner@example.com')
    vi.stubEnv('INQUIRY_FROM_EMAIL', '')

    await expect(deliverInquiryNotification(inquiry)).resolves.toBe('disabled')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('sends a plain-text, idempotent property notification with reply-to', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 })
    vi.stubGlobal('fetch', fetchMock)
    vi.stubEnv('RESEND_API_KEY', 'test-key')
    vi.stubEnv('INQUIRY_TO_EMAIL', 'owner@example.com, manager@example.com')
    vi.stubEnv('INQUIRY_FROM_EMAIL', 'CR Mariposa <inquiries@example.com>')
    vi.stubEnv('NEXT_PUBLIC_SERVER_URL', 'https://example.com/')

    await expect(deliverInquiryNotification(inquiry)).resolves.toBe('email')
    expect(fetchMock).toHaveBeenCalledTimes(1)

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    const body = JSON.parse(String(init.body)) as Record<string, unknown>
    expect(url).toBe('https://api.resend.com/emails')
    expect(init.method).toBe('POST')
    expect(init.headers).toMatchObject({
      Authorization: 'Bearer test-key',
      'Idempotency-Key': `inquiry/${inquiry.id}`,
    })
    expect(body).toMatchObject({
      from: 'CR Mariposa <inquiries@example.com>',
      reply_to: 'guest@example.com',
      subject: 'Website inquiry: Penthouse Lago',
      to: ['owner@example.com', 'manager@example.com'],
    })
    expect(body.text).toContain('Admin record: https://example.com/admin/collections/leads/')
    expect(body.text).toContain('Requested dates: November 4–11')
  })

  it('supports phone-only inquiries without adding an empty reply-to header', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 })
    vi.stubGlobal('fetch', fetchMock)
    vi.stubEnv('RESEND_API_KEY', 'test-key')
    vi.stubEnv('INQUIRY_TO_EMAIL', 'owner@example.com')
    vi.stubEnv('INQUIRY_FROM_EMAIL', 'CR Mariposa <inquiries@example.com>')

    await deliverInquiryNotification({ ...inquiry, email: null })

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    const body = JSON.parse(String(init.body)) as Record<string, unknown>
    expect(body).not.toHaveProperty('reply_to')
    expect(body.text).toContain('Phone: +506 8000-0000')
  })

  it('reports a provider rejection without exposing the response body', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 403 }))
    vi.stubEnv('RESEND_API_KEY', 'test-key')
    vi.stubEnv('INQUIRY_TO_EMAIL', 'owner@example.com')
    vi.stubEnv('INQUIRY_FROM_EMAIL', 'CR Mariposa <inquiries@example.com>')

    await expect(deliverInquiryNotification(inquiry)).rejects.toThrow('Resend responded 403')
  })
})
