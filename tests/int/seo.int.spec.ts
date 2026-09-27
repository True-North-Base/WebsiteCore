import { afterEach, describe, expect, it } from 'vitest'

import sitemap from '../../src/app/sitemap'
import robots from '../../src/app/robots'
import { serializeJsonLd } from '../../src/modules/core/components/JsonLd'
import { getPropertyStaticParams } from '../../src/modules/rentals/lib/cms-content'
import { legacyRedirects } from '../../src/modules/rentals/lib/legacy-redirects'
import {
  buildPropertyJsonLd,
  localizedAlternates,
  productionSiteURL,
} from '../../src/modules/rentals/lib/seo'
import type { PropertyDetailContent } from '../../src/modules/rentals/lib/phase2-content'

const originalServerURL = process.env.NEXT_PUBLIC_SERVER_URL

afterEach(() => {
  process.env.NEXT_PUBLIC_SERVER_URL = originalServerURL
})

describe('SEO and cutover infrastructure', () => {
  it('serializes JSON-LD without leaving executable HTML characters', () => {
    const serialized = serializeJsonLd({ description: '</script><script>alert(1)</script>' })

    expect(serialized).not.toContain('<')
    expect(serialized).toContain('\\u003c/script>')
  })

  it('provides complete locale alternates with an English default', () => {
    expect(localizedAlternates('properties/penthouse-lago')).toEqual({
      en: '/en/properties/penthouse-lago',
      es: '/es/properties/penthouse-lago',
      'x-default': '/en/properties/penthouse-lago',
    })
  })

  it('covers every URL in the fresh Squarespace sitemap with permanent redirects', () => {
    expect(legacyRedirects).toHaveLength(15)
    expect(new Set(legacyRedirects.map((redirect) => redirect.source)).size).toBe(15)
    expect(legacyRedirects).toContainEqual({
      destination: '/en',
      source: '/home',
      statusCode: 301,
    })
    expect(legacyRedirects.every((redirect) => redirect.statusCode === 301)).toBe(true)
  })

  it('blocks staging crawlers but exposes the canonical production sitemap', () => {
    process.env.NEXT_PUBLIC_SERVER_URL = 'https://cr-mariposa-staging.netlify.app'
    expect(robots()).toEqual({ rules: { userAgent: '*', disallow: '/' } })

    process.env.NEXT_PUBLIC_SERVER_URL = productionSiteURL
    expect(robots()).toMatchObject({
      host: productionSiteURL,
      sitemap: `${productionSiteURL}/sitemap.xml`,
    })
  })

  it('lists every published property in both languages with hreflang alternates', async () => {
    const [entries, publishedProperties] = await Promise.all([sitemap(), getPropertyStaticParams()])
    const propertyEntries = entries.filter((entry) => entry.url.includes('/properties/'))

    expect(entries).toHaveLength(12 + publishedProperties.length * 2)
    expect(propertyEntries).toHaveLength(publishedProperties.length * 2)
    expect(entries.every((entry) => entry.url.startsWith(productionSiteURL))).toBe(true)
    expect(
      entries.every((entry) => {
        const languages = entry.alternates?.languages as Record<string, string> | undefined
        return ['en', 'es', 'x-default'].every((language) =>
          languages?.[language]?.startsWith(productionSiteURL),
        )
      }),
    ).toBe(true)
  })

  it('uses truthful accommodation markup without claiming vacation-rental eligibility', () => {
    const property = {
      amenities: [{ items: ['Pool'], label: 'Shared amenities' }],
      complexAndLocation: 'Río Oro · Santa Ana',
      gallery: [
        {
          alt: 'Pool at sunset',
          category: 'amenities',
          showcase: true,
          src: '/images/pool.png',
        },
      ],
      map: { latitude: 9.93, longitude: -84.18, query: 'Santa Ana, Costa Rica' },
      name: 'Penthouse Lago',
      shortDescription: 'A furnished home in Santa Ana.',
      slug: 'penthouse-lago',
    } as PropertyDetailContent

    const markup = buildPropertyJsonLd('en', property)
    const accommodation = markup.find((item) => item['@type'] === 'Accommodation')

    expect(accommodation).toMatchObject({
      '@type': 'Accommodation',
      image: [`${productionSiteURL}/images/pool.png`],
      name: 'Penthouse Lago',
    })
    expect(JSON.stringify(markup)).not.toContain('VacationRental')
    expect(JSON.stringify(markup)).not.toContain('aggregateRating')
    expect(JSON.stringify(markup)).not.toContain('streetAddress')
  })
})
