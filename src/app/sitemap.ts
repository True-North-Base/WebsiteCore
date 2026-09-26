import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'

import { locales, type Locale } from '@/i18n'
import { absoluteSiteURL, localizedAlternates, localizedPath } from '@/modules/rentals/lib/seo'
import config from '@/payload.config'

const staticRoutes = [
  { changeFrequency: 'weekly' as const, path: '', priority: 1 },
  { changeFrequency: 'weekly' as const, path: 'properties', priority: 0.9 },
  { changeFrequency: 'monthly' as const, path: 'about', priority: 0.6 },
  { changeFrequency: 'monthly' as const, path: 'property-management', priority: 0.6 },
  { changeFrequency: 'monthly' as const, path: 'contact', priority: 0.7 },
  { changeFrequency: 'yearly' as const, path: 'privacy', priority: 0.3 },
]

function languageURLs(path: string) {
  const alternates = localizedAlternates(path)
  return Object.fromEntries(
    Object.entries(alternates).map(([language, href]) => [language, absoluteSiteURL(href)]),
  )
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'properties',
    depth: 0,
    draft: false,
    limit: 100,
    overrideAccess: false,
    pagination: false,
    select: { slug: true, updatedAt: true },
  })

  const staticEntries = locales.flatMap((locale: Locale) =>
    staticRoutes.map((route) => ({
      alternates: { languages: languageURLs(route.path) },
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      url: absoluteSiteURL(localizedPath(locale, route.path)),
    })),
  )

  const propertyEntries = locales.flatMap((locale: Locale) =>
    result.docs.map((property) => {
      const path = `properties/${property.slug}`
      return {
        alternates: { languages: languageURLs(path) },
        changeFrequency: 'weekly' as const,
        lastModified: property.updatedAt,
        priority: 0.8,
        url: absoluteSiteURL(localizedPath(locale, path)),
      }
    }),
  )

  return [...staticEntries, ...propertyEntries]
}
