import type { Locale } from '@/i18n'

import type { FooterContent, HomeContent, PropertyDetailContent } from './phase2-content'

export const productionSiteURL = 'https://www.crmariposarentals.com'

export function absoluteSiteURL(path = ''): string {
  const normalizedPath = path ? `/${path.replace(/^\/+/, '')}` : ''
  return `${productionSiteURL}${normalizedPath}`
}

export function localizedPath(locale: Locale, path = ''): string {
  const normalizedPath = path ? `/${path.replace(/^\/+|\/+$/g, '')}` : ''
  return `/${locale}${normalizedPath}`
}

export function localizedAlternates(path = '') {
  return {
    en: localizedPath('en', path),
    es: localizedPath('es', path),
    'x-default': localizedPath('en', path),
  }
}

function absoluteImageURL(src: string): string {
  if (/^https?:\/\//i.test(src)) return src
  return absoluteSiteURL(src)
}

export function buildWebsiteJsonLd(
  locale: Locale,
  content: HomeContent,
  footer: FooterContent,
): Record<string, unknown>[] {
  const sameAs = footer.platforms.flatMap((platform) => (platform.href ? [platform.href] : []))
  const organizationId = `${productionSiteURL}/#organization`

  return [
    {
      '@context': 'https://schema.org',
      '@id': organizationId,
      '@type': ['Organization', 'LodgingBusiness'],
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'CR',
        addressLocality: footer.location,
      },
      email: footer.contact.email,
      image: absoluteImageURL(content.hero.image),
      knowsLanguage: ['en', 'es'],
      name: 'CR Mariposa Rentals',
      sameAs: sameAs.length ? sameAs : undefined,
      telephone: footer.contact.phoneDisplay,
      url: productionSiteURL,
    },
    {
      '@context': 'https://schema.org',
      '@id': `${productionSiteURL}/#website`,
      '@type': 'WebSite',
      description: content.hero.subtitle,
      inLanguage: locale,
      name: 'CR Mariposa Rentals',
      publisher: { '@id': organizationId },
      url: absoluteSiteURL(localizedPath(locale)),
    },
  ]
}

export function buildPropertyJsonLd(
  locale: Locale,
  property: PropertyDetailContent,
): Record<string, unknown>[] {
  const propertyPath = localizedPath(locale, `properties/${property.slug}`)
  const propertyURL = absoluteSiteURL(propertyPath)
  const amenities = property.amenities.flatMap((group) =>
    group.items.map((item) => ({
      '@type': 'LocationFeatureSpecification',
      name: item,
      value: true,
    })),
  )
  const hasCoordinates =
    typeof property.map.latitude === 'number' && typeof property.map.longitude === 'number'

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          item: absoluteSiteURL(localizedPath(locale)),
          name: locale === 'en' ? 'Home' : 'Inicio',
          position: 1,
        },
        {
          '@type': 'ListItem',
          item: absoluteSiteURL(localizedPath(locale, 'properties')),
          name: locale === 'en' ? 'Properties' : 'Propiedades',
          position: 2,
        },
        {
          '@type': 'ListItem',
          item: propertyURL,
          name: property.name,
          position: 3,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@id': `${propertyURL}#accommodation`,
      '@type': 'Accommodation',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'CR',
        addressLocality: property.complexAndLocation,
      },
      amenityFeature: amenities.length ? amenities : undefined,
      description: property.shortDescription,
      geo: hasCoordinates
        ? {
            '@type': 'GeoCoordinates',
            latitude: property.map.latitude,
            longitude: property.map.longitude,
          }
        : undefined,
      image: property.gallery.map((image) => absoluteImageURL(image.src)),
      inLanguage: locale,
      name: property.name,
      url: propertyURL,
    },
  ]
}
