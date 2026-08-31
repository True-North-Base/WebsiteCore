import { describe, expect, it } from 'vitest'

import { validateInquiry } from '@/modules/rentals/lib/inquiry'

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
})
