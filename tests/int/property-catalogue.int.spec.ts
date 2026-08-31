import { describe, expect, it } from 'vitest'

import { phase4Properties } from '../../scripts/phase4-property-catalogue'

describe('Phase 4 property catalogue source', () => {
  it('defines the thirteen additional legacy homes exactly once', () => {
    expect(phase4Properties).toHaveLength(13)
    expect(new Set(phase4Properties.map((property) => property.slug)).size).toBe(13)
  })

  it('contains bilingual public copy and a usable gallery for every home', () => {
    for (const property of phase4Properties) {
      expect(property.title).toBeTruthy()
      expect(property.shortDescription.en).toBeTruthy()
      expect(property.shortDescription.es).toBeTruthy()
      expect(property.description.en.length).toBeGreaterThanOrEqual(2)
      expect(property.description.es.length).toBe(property.description.en.length)
      expect(property.images.length).toBeGreaterThanOrEqual(6)
      expect(property.images.every((image) => image.alt.en && image.alt.es)).toBe(true)
    }
  })

  it('preserves the detailed specifications where the old summary copy conflicted', () => {
    expect(
      phase4Properties.find((property) => property.slug === 'terraza-downtown')?.bathrooms,
    ).toBe(1)
    expect(
      phase4Properties.find((property) => property.slug === 'apartment-montana')?.bathrooms,
    ).toBe(1)
    expect(phase4Properties.find((property) => property.slug === 'playa-langosta')?.bathrooms).toBe(
      3,
    )
  })
})
