import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({ deliver: vi.fn() }))

vi.mock('@/modules/rentals/lib/inquiry-delivery', () => ({
  deliverInquiryNotification: mocks.deliver,
}))

import { notifyInquiryAfterCreate } from '@/modules/rentals/hooks/notifyInquiry'

const lead = {
  createdAt: '2026-09-27T12:00:00.000Z',
  email: 'guest@example.com',
  id: 'lead-id',
  locale: 'es',
  message: 'Consulta',
  name: 'Guest',
  property: 'property-id',
  requestedDates: '4–11 noviembre',
  source: 'property-form',
  status: 'new',
  updatedAt: '2026-09-27T12:00:00.000Z',
}

function hookArgs(overrides: Record<string, unknown> = {}) {
  const error = vi.fn()
  const warn = vi.fn()
  const findByID = vi.fn().mockResolvedValue({ id: 'property-id', title: 'Penthouse Lago' })
  return {
    args: {
      doc: lead,
      operation: 'create',
      req: { payload: { findByID, logger: { error, warn } } },
      ...overrides,
    },
    error,
    findByID,
    warn,
  }
}

describe('inquiry notification hook', () => {
  beforeEach(() => vi.clearAllMocks())

  it('notifies only after a lead is created and resolves the localized property title', async () => {
    mocks.deliver.mockResolvedValue('email')
    const { args, findByID } = hookArgs()

    await notifyInquiryAfterCreate(args as never)

    expect(findByID).toHaveBeenCalledWith(
      expect.objectContaining({ collection: 'properties', id: 'property-id', locale: 'es' }),
    )
    expect(mocks.deliver).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'lead-id', propertyTitle: 'Penthouse Lago' }),
    )
  })

  it('does nothing when an existing lead is updated', async () => {
    const { args } = hookArgs({ operation: 'update' })

    await notifyInquiryAfterCreate(args as never)

    expect(mocks.deliver).not.toHaveBeenCalled()
  })

  it('keeps the saved lead successful when Resend fails', async () => {
    mocks.deliver.mockRejectedValue(new Error('provider unavailable'))
    const { args, error } = hookArgs()

    await expect(notifyInquiryAfterCreate(args as never)).resolves.toEqual(lead)
    expect(error).toHaveBeenCalledWith(
      expect.objectContaining({ msg: '[inquiry] Email notification failed' }),
    )
  })
})
