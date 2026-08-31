import { describe, expect, it } from 'vitest'

import { getGoogleMapsURLs } from '@/modules/rentals/components/PropertyMap'

describe('Google Maps links', () => {
  it('keeps an approximate district link available without an API key', () => {
    const urls = getGoogleMapsURLs({
      center: { query: 'Santa Ana, Río Oro, Costa Rica' },
      locale: 'en',
    })

    expect(urls.embedHref).toBeUndefined()
    expect(urls.mapsHref).toBe(
      'https://www.google.com/maps/search/?api=1&query=Santa%20Ana%2C%20R%C3%ADo%20Oro%2C%20Costa%20Rica',
    )
  })

  it('uses official view mode for approximate coordinates and a referrer-restrictable key', () => {
    const urls = getGoogleMapsURLs({
      apiKey: 'maps-key',
      center: { latitude: 9.93, longitude: -84.19, query: 'Santa Ana, Costa Rica' },
      locale: 'es',
    })

    expect(urls.embedHref).toBe(
      'https://www.google.com/maps/embed/v1/view?key=maps-key&center=9.93,-84.19&zoom=14&maptype=roadmap&language=es&region=CR',
    )
  })
})
