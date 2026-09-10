import { describe, expect, it } from 'vitest'

import { resolveCatalogueHeading } from '../../src/modules/rentals/lib/catalogue-heading'

describe('property catalogue heading', () => {
  it('preserves the approved written-out heading while fourteen properties are published', () => {
    expect(resolveCatalogueHeading('en', 'Fourteen homes', 14)).toBe('Fourteen homes')
    expect(resolveCatalogueHeading('es', 'Catorce casas', 14)).toBe('Catorce casas')
  })

  it('updates the legacy heading when the published property count changes', () => {
    expect(resolveCatalogueHeading('en', 'Fourteen homes', 15)).toBe('15 homes')
    expect(resolveCatalogueHeading('es', 'Catorce casas', 15)).toBe('15 casas')
    expect(resolveCatalogueHeading('en', 'Fourteen homes', 1)).toBe('1 home')
    expect(resolveCatalogueHeading('es', 'Catorce casas', 1)).toBe('1 casa')
  })

  it('supports an explicit count token without overriding custom editorial copy', () => {
    expect(resolveCatalogueHeading('en', 'Explore all {count} homes', 16)).toBe(
      'Explore all 16 homes',
    )
    expect(resolveCatalogueHeading('es', 'Nuestro portafolio', 16)).toBe('Nuestro portafolio')
  })
})
