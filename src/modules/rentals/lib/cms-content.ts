import { getPayload } from 'payload'
import { cache } from 'react'

import config from '@/payload.config'
import type {
  HomePage,
  Media,
  PropertiesPage,
  Property,
  RentalSetting,
  Review,
  SiteSetting,
} from '@/payload-types'
import type { Locale } from '@/i18n'

import {
  getFooterContent as getFallbackFooter,
  getHomeContent as getFallbackHome,
  getPropertyContent as getFallbackProperty,
  type FooterContent,
  type CataloguePropertyCardContent,
  type GalleryCategory,
  type GalleryImage,
  type HomeContent,
  type PropertyCardContent,
  type PropertiesPageContent,
  type PropertyDetailContent,
  type ReviewContent,
  type SeoContent,
  type SleepingArrangement,
  type ThingsToKnowContent,
} from './phase2-content'

type CmsGlobals = {
  home: HomePage
  rental: RentalSetting
  site: SiteSetting
}

const platformLabels = {
  airbnb: 'Airbnb',
  booking: 'Booking.com',
  direct: 'Direct',
  expedia: 'Expedia',
  facebook: 'Facebook',
  instagram: 'Instagram',
  vrbo: 'Vrbo',
} as const

function media(value: null | string | Media | undefined): GalleryImage | undefined {
  if (!value || typeof value === 'string' || !value.url) return undefined
  return { alt: value.alt, category: 'other', showcase: false, src: value.url }
}

function whatsapp(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

function pluralizedFact(locale: Locale, value: number, singular: string, plural: string): string {
  const label = value === 1 ? singular : plural
  return `${value} ${label}`
}

function bedrooms(locale: Locale, value: number): string {
  return pluralizedFact(
    locale,
    value,
    locale === 'en' ? 'bedroom' : 'habitación',
    locale === 'en' ? 'bedrooms' : 'habitaciones',
  )
}

function bathrooms(locale: Locale, value: number): string {
  return pluralizedFact(
    locale,
    value,
    locale === 'en' ? 'bath' : 'baño',
    locale === 'en' ? 'baths' : 'baños',
  )
}

function extractNodeText(value: unknown): string {
  if (!value || typeof value !== 'object') return ''
  if ('text' in value && typeof value.text === 'string') return value.text
  if (!('children' in value) || !Array.isArray(value.children)) return ''
  return value.children.map(extractNodeText).join('')
}

function richTextParagraphs(value: unknown): string[] {
  if (!value || typeof value !== 'object' || !('root' in value)) return []
  const root = value.root
  if (!root || typeof root !== 'object' || !('children' in root) || !Array.isArray(root.children))
    return []
  return root.children
    .map(extractNodeText)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}

function reviewContent(review: Review): ReviewContent {
  const location = review.guestCountry ? ` — ${review.guestCountry}` : ''
  return {
    attribution: `${review.guestName}${location} · ${platformLabels[review.platform]}`,
    quote: `“${review.quote.replace(/^[“"]|[”"]$/g, '')}”`,
  }
}

function propertyCard(property: Property, locale: Locale): PropertyCardContent | undefined {
  const hero = media(property.heroImage)
  if (!hero) return undefined

  return {
    alt: hero.alt,
    badge: property.badge || '',
    bathrooms: bathrooms(locale, property.bathrooms),
    bedrooms: bedrooms(locale, property.bedrooms),
    href: `/${locale}/properties/${property.slug}`,
    image: hero.src,
    location: property.district,
    name: property.title,
    rating: property.rating?.toFixed(1),
  }
}

function propertyArea(property: Pick<Property, 'district' | 'region'>) {
  if (property.region === 'pacific-coast') return 'beach' as const
  const district = property.district
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
  return district.includes('escazu') || district.includes('guachipelin')
    ? ('escazu' as const)
    : ('santa-ana' as const)
}

function mergeCards(
  cms: PropertyCardContent[],
  fallback: PropertyCardContent[],
): PropertyCardContent[] {
  // The fallback row is only a local-development safety net. Once CMS cards exist,
  // return them directly so renamed properties are not duplicated by stale seed cards
  // and client-managed hero changes flow through to the homepage.
  return cms.length ? cms : fallback
}

function footerFromCms(locale: Locale, site: SiteSetting, rental: RentalSetting): FooterContent {
  const fallback = getFallbackFooter(locale)
  const contact = {
    email: site.email,
    phoneDisplay: site.phoneDisplay,
    phoneHref: `tel:+${site.whatsappNumber}`,
    whatsappNumber: site.whatsappNumber,
  }
  const configuredPlatforms = rental.marketplaceLinks?.map((item) => ({
    href: item.url || undefined,
    label: platformLabels[item.platform],
  }))
  const platforms = configuredPlatforms?.length ? configuredPlatforms : fallback.platforms

  return {
    ...fallback,
    company: fallback.company.map((item) => ({
      ...item,
      href: item.href.startsWith('mailto:')
        ? `mailto:${contact.email}?subject=${locale === 'en' ? 'Property%20management' : 'Administraci%C3%B3n%20de%20propiedades'}`
        : item.href,
    })),
    contact,
    intro: site.tagline,
    location: site.address || fallback.location,
    platforms,
    tagline: site.tagline,
  }
}

function homeSeo(home: HomePage): SeoContent | undefined {
  const image = media(home.seo?.ogImage) || media(home.heroImage)
  if (!home.seo?.title && !home.seo?.description && !home.seo?.canonical && !image) return undefined
  return {
    canonical: home.seo?.canonical || undefined,
    description: home.seo?.description || undefined,
    image,
    title: home.seo?.title || undefined,
  }
}

function catalogueSeo(page: PropertiesPage, firstProperty?: Property): SeoContent | undefined {
  const image = media(page.seo?.ogImage) || media(firstProperty?.heroImage)
  if (!page.seo?.title && !page.seo?.description && !page.seo?.canonical && !image) return undefined
  return {
    canonical: page.seo?.canonical || undefined,
    description: page.seo?.description || page.introduction,
    image,
    title: page.seo?.title || page.heading,
  }
}

function propertySeo(property: Property): SeoContent | undefined {
  const image = media(property.seo?.ogImage) || media(property.heroImage)
  return {
    canonical: property.seo?.canonical || undefined,
    description: property.seo?.description || property.shortDescription,
    image,
    title: property.seo?.title || property.title,
  }
}

async function globals(locale: Locale): Promise<CmsGlobals> {
  const payload = await getPayload({ config })
  const common = { draft: false, fallbackLocale: 'en' as const, locale, overrideAccess: false }
  const [home, rental, site] = await Promise.all([
    payload.findGlobal({ ...common, depth: 2, slug: 'home-page' }),
    payload.findGlobal({ ...common, depth: 1, slug: 'rental-settings' }),
    payload.findGlobal({ ...common, depth: 2, slug: 'site-settings' }),
  ])
  return { home, rental, site }
}

function canReadCms(): boolean {
  return Boolean(process.env.DATABASE_URL)
}

function warnFallback(area: string, error?: unknown) {
  if (process.env.NODE_ENV === 'production') return
  const reason = error instanceof Error ? `: ${error.message}` : ''
  console.warn(`[content] Using approved Phase 2 fallback for ${area}${reason}`)
}

export const getHomePageContent = cache(
  async (locale: Locale): Promise<{ content: HomeContent; footer: FooterContent }> => {
    if (!canReadCms()) {
      warnFallback('homepage (DATABASE_URL is not configured)')
      return { content: getFallbackHome(locale), footer: getFallbackFooter(locale) }
    }

    try {
      const payload = await getPayload({ config })
      const [{ home, rental, site }, properties, reviews] = await Promise.all([
        globals(locale),
        payload.find({
          collection: 'properties',
          depth: 2,
          draft: false,
          fallbackLocale: 'en',
          limit: 100,
          locale,
          overrideAccess: false,
          sort: 'displayOrder',
        }),
        payload.find({
          collection: 'reviews',
          depth: 1,
          draft: false,
          fallbackLocale: 'en',
          limit: 12,
          locale,
          overrideAccess: false,
          where: { featured: { equals: true } },
        }),
      ])

      if (
        home._status !== 'published' ||
        site._status !== 'published' ||
        properties.docs.length === 0
      ) {
        warnFallback('homepage (published CMS seed is incomplete)')
        return { content: getFallbackHome(locale), footer: getFallbackFooter(locale) }
      }

      const fallback = getFallbackHome(locale)
      const cards = properties.docs
        .map((property) => propertyCard(property, locale))
        .filter((card): card is PropertyCardContent => Boolean(card))
      const featured = cards.filter((card) => {
        const source = properties.docs.find((property) => property.title === card.name)
        return source?.featured
      })
      const pacific = cards.filter((card) => {
        const source = properties.docs.find((property) => property.title === card.name)
        return source?.region === 'pacific-coast'
      })
      const heroImage = media(home.heroImage)
      const mobileImage = media(home.heroMobileImage) || heroImage
      const trustImage = media(home.trustImage)
      const featureList = home.trustFeatures?.map(({ body, icon, title }) => ({
        body,
        icon,
        title,
      }))
      const hospitalityImage = media(home.hospitalityImage)
      const hospitalityFeatureList = home.hospitalityFeatures?.map(({ body, icon, title }) => ({
        body,
        icon,
        title,
      }))
      const reviewList = reviews.docs.map(reviewContent)

      const content: HomeContent = {
        contact: { body: home.contactBody, heading: home.contactHeading },
        difference: {
          eyebrow: home.trustEyebrow,
          features: featureList?.length ? featureList : fallback.difference.features,
          image: trustImage?.src || fallback.difference.image,
          imageAlt: trustImage?.alt || fallback.difference.imageAlt,
          title: home.trustHeading,
          titleMuted: home.trustHeadingMuted,
        },
        hospitalityDifference: {
          eyebrow: home.hospitalityEyebrow,
          features: hospitalityFeatureList?.length
            ? hospitalityFeatureList
            : fallback.hospitalityDifference.features,
          image: hospitalityImage?.src || fallback.hospitalityDifference.image,
          imageAlt: hospitalityImage?.alt || fallback.hospitalityDifference.imageAlt,
          title: home.hospitalityHeading,
          titleMuted: home.hospitalityHeadingMuted,
        },
        featured: {
          properties: mergeCards(featured, fallback.featured.properties),
          title: home.featuredHeading,
        },
        hero: {
          image: heroImage?.src || fallback.hero.image,
          imageAlt: heroImage?.alt || fallback.hero.imageAlt,
          mobileImage: mobileImage?.src || fallback.hero.mobileImage,
          mobileImageAlt: mobileImage?.alt || fallback.hero.mobileImageAlt,
          subtitle: home.heroBody,
          title: home.heroHeading,
        },
        pacific: {
          intro: home.pacificIntro,
          properties: mergeCards(pacific, fallback.pacific.properties),
          title: home.pacificHeading,
        },
        reviews: {
          proof: home.reviewsProof,
          reviews: reviewList.length ? reviewList : fallback.reviews.reviews,
          title: home.reviewsHeading,
        },
        seo: homeSeo(home),
        whatsappHref: whatsapp(site.whatsappNumber, site.whatsappDefaultMessage),
      }

      return { content, footer: footerFromCms(locale, site, rental) }
    } catch (error) {
      if (process.env.NODE_ENV === 'production') throw error
      warnFallback('homepage', error)
      return { content: getFallbackHome(locale), footer: getFallbackFooter(locale) }
    }
  },
)

export const getPropertiesPageContent = cache(
  async (locale: Locale): Promise<{ content: PropertiesPageContent; footer: FooterContent }> => {
    const fallbackHome = getFallbackHome(locale)
    const fallbackProperties = [
      ...fallbackHome.featured.properties,
      ...fallbackHome.pacific.properties,
    ]
      .filter(
        (property, index, all) =>
          all.findIndex((candidate) => candidate.name === property.name) === index,
      )
      .map((property): CataloguePropertyCardContent => ({
        ...property,
        area: property.location.toLowerCase().includes('escaz')
          ? 'escazu'
          : property.location.toLowerCase().includes('playa')
            ? 'beach'
            : 'santa-ana',
      }))
    const fallbackContent: PropertiesPageContent = {
      heading: locale === 'en' ? 'Fourteen homes' : 'Catorce casas',
      introduction:
        locale === 'en'
          ? 'Apartments and penthouses across Santa Ana and Escazú, plus two homes on the Pacific coast. Daily, weekly and monthly stays.'
          : 'Apartamentos y penthouses en Santa Ana y Escazú, además de dos casas en la costa del Pacífico. Estadías diarias, semanales y mensuales.',
      properties: fallbackProperties,
      whatsappHref: fallbackHome.whatsappHref,
    }

    if (!canReadCms()) {
      warnFallback('properties catalogue (DATABASE_URL is not configured)')
      return { content: fallbackContent, footer: getFallbackFooter(locale) }
    }

    try {
      const payload = await getPayload({ config })
      const [{ rental, site }, page, properties] = await Promise.all([
        globals(locale),
        payload.findGlobal({
          slug: 'properties-page',
          depth: 2,
          draft: false,
          fallbackLocale: 'en',
          locale,
          overrideAccess: false,
        }),
        payload.find({
          collection: 'properties',
          depth: 2,
          draft: false,
          fallbackLocale: 'en',
          limit: 100,
          locale,
          overrideAccess: false,
          sort: 'displayOrder',
        }),
      ])

      const cards = properties.docs
        .map((property): CataloguePropertyCardContent | undefined => {
          const card = propertyCard(property, locale)
          return card ? { ...card, area: propertyArea(property) } : undefined
        })
        .filter((card): card is CataloguePropertyCardContent => Boolean(card))

      if (!cards.length || site._status !== 'published') {
        warnFallback('properties catalogue (published CMS seed is incomplete)')
        return { content: fallbackContent, footer: getFallbackFooter(locale) }
      }

      return {
        content: {
          heading: page._status === 'published' ? page.heading : fallbackContent.heading,
          introduction:
            page._status === 'published' ? page.introduction : fallbackContent.introduction,
          properties: cards,
          seo: catalogueSeo(page, properties.docs[0]),
          whatsappHref: whatsapp(site.whatsappNumber, site.whatsappDefaultMessage),
        },
        footer: footerFromCms(locale, site, rental),
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'production') throw error
      warnFallback('properties catalogue', error)
      return { content: fallbackContent, footer: getFallbackFooter(locale) }
    }
  },
)

export const getPropertyPageContent = cache(
  async (
    locale: Locale,
    slug: string,
  ): Promise<{ content: PropertyDetailContent; footer: FooterContent } | undefined> => {
    const fallback = getFallbackProperty(locale, slug)
    if (!canReadCms()) {
      warnFallback(`property ${slug} (DATABASE_URL is not configured)`)
      return fallback ? { content: fallback, footer: getFallbackFooter(locale) } : undefined
    }

    try {
      const payload = await getPayload({ config })
      const [{ rental, site }, result] = await Promise.all([
        globals(locale),
        payload.find({
          collection: 'properties',
          depth: 2,
          draft: false,
          fallbackLocale: 'en',
          limit: 1,
          locale,
          overrideAccess: false,
          where: { slug: { equals: slug } },
        }),
      ])
      const property = result.docs[0]
      if (!property || site._status !== 'published') {
        if (!fallback) return undefined
        warnFallback(`property ${slug} (published CMS seed is incomplete)`)
        return { content: fallback, footer: getFallbackFooter(locale) }
      }

      const reviewResult = await payload.find({
        collection: 'reviews',
        depth: 1,
        draft: false,
        fallbackLocale: 'en',
        limit: 12,
        locale,
        overrideAccess: false,
        where: { property: { equals: property.id } },
      })
      const labels = fallback?.labels || getFallbackProperty(locale, 'penthouse-lago')?.labels
      const inquiry = fallback?.inquiry || getFallbackProperty(locale, 'penthouse-lago')?.inquiry
      if (!labels || !inquiry) return undefined

      const gallery =
        property.gallery
          ?.map(({ category, featuredInShowcase, image }) => {
            const photo = media(image)
            if (!photo) return undefined
            return {
              ...photo,
              category: (category || 'other') as GalleryCategory,
              showcase: Boolean(featuredInShowcase),
            }
          })
          .filter((image): image is GalleryImage => Boolean(image)) || []
      const hero = media(property.heroImage)
      if (!gallery.length && hero) gallery.push(hero)
      if (!gallery.length) return undefined
      const sleepingArrangements =
        property.sleepingArrangements
          ?.map(({ bedSummary, image, roomName }): SleepingArrangement | undefined => {
            const photo = media(image)
            if (!photo) return undefined
            return {
              bedSummary,
              image: { ...photo, category: 'bedroom' },
              roomName,
            }
          })
          .filter((item): item is SleepingArrangement => item !== undefined) || []

      const facts = [bedrooms(locale, property.bedrooms), bathrooms(locale, property.bathrooms)]
      facts.push(...(property.extraFacts?.map(({ fact }) => fact) || []))
      const reviewList = reviewResult.docs.map(reviewContent)
      const fallbackReviews = fallback?.reviews || []
      const platformNames =
        property.externalListings?.map((item) => platformLabels[item.platform]) || []
      const platformNote = platformNames.length
        ? `${rental.directBookingNote} ${platformNames.join(' · ')}`
        : rental.directBookingNote
      const things = property.thingsToKnow
      const fallbackKnowledge = fallback?.thingsToKnow
      const rules = [
        things?.pets && {
          icon: 'pets' as const,
          text: `${locale === 'en' ? 'Pets' : 'Mascotas'} — ${things.pets}`,
        },
        things?.smoking && {
          icon: 'smoking' as const,
          text: `${locale === 'en' ? 'Smoking' : 'Fumar'} — ${things.smoking}`,
        },
        things?.events && {
          icon: 'events' as const,
          text: `${locale === 'en' ? 'Events' : 'Eventos'} — ${things.events}`,
        },
      ].filter((item): item is { icon: 'events' | 'pets' | 'smoking'; text: string } =>
        Boolean(item),
      )
      const stayDetails = [
        things?.checkInTime && {
          icon: 'clock' as const,
          text: `${locale === 'en' ? 'Check-in after' : 'Llegada después de las'} ${things.checkInTime}`,
        },
        things?.checkOutTime && {
          icon: 'clock' as const,
          text: `${locale === 'en' ? 'Check-out before' : 'Salida antes de las'} ${things.checkOutTime}`,
        },
        things?.minStayNights && {
          icon: 'calendar' as const,
          text: `${locale === 'en' ? 'Minimum stay' : 'Estadía mínima'} — ${pluralizedFact(
            locale,
            things.minStayNights,
            locale === 'en' ? 'night' : 'noche',
            locale === 'en' ? 'nights' : 'noches',
          )}`,
        },
        property.maxGuests && {
          icon: 'guests' as const,
          text:
            locale === 'en'
              ? `${property.maxGuests} guests maximum`
              : `Máximo ${property.maxGuests} huéspedes`,
        },
      ].filter((item): item is { icon: 'calendar' | 'clock' | 'guests'; text: string } =>
        Boolean(item),
      )
      const thingsToKnow: ThingsToKnowContent = {
        cancellation: {
          details: things?.cancellationDetails || fallbackKnowledge?.cancellation.details,
          summary:
            things?.cancellationSummary ||
            fallbackKnowledge?.cancellation.summary ||
            (locale === 'en'
              ? 'Cancellation terms are confirmed personally before your stay.'
              : 'Las condiciones de cancelación se confirman personalmente antes de tu estadía.'),
          title: locale === 'en' ? 'Cancellation & terms' : 'Cancelación y condiciones',
        },
        readMore: locale === 'en' ? 'Read more' : 'Leer más',
        rules: {
          details: things?.propertyRulesDetails || fallbackKnowledge?.rules.details,
          items: rules.length ? rules : fallbackKnowledge?.rules.items || [],
          title: locale === 'en' ? 'Property rules' : 'Reglas de la propiedad',
        },
        stay: {
          items: stayDetails,
          title: locale === 'en' ? 'Stay details' : 'Detalles de la estadía',
        },
      }
      const message =
        locale === 'en'
          ? `Hello CR Mariposa, I would like to ask about ${property.title}.`
          : `Hola CR Mariposa, quisiera consultar sobre ${property.title}.`

      return {
        content: {
          amenities:
            property.amenityGroups?.map(({ items, label }) => ({
              items: items?.map(({ item }) => item) || [],
              label,
            })) || [],
          complexAndLocation: [property.complexName, property.district].filter(Boolean).join(' · '),
          description: richTextParagraphs(property.description),
          facts,
          gallery,
          inquiry: {
            body: inquiry.body,
            heading:
              locale === 'en' ? `Ask about ${property.title}` : `Consulta sobre ${property.title}`,
            platformNote,
          },
          labels: {
            ...labels,
            approximateArea: `${locale === 'en' ? 'Approximate area' : 'Zona aproximada'} · ${property.district}`,
          },
          map: {
            latitude: property.approxCoordinates?.latitude ?? undefined,
            longitude: property.approxCoordinates?.longitude ?? undefined,
            query: `${property.district}, Costa Rica`,
          },
          name: property.title,
          neighborhood: property.neighborhoodDescription || '',
          reviews: reviewList.length ? reviewList : fallbackReviews,
          seo: propertySeo(property),
          shortDescription: property.shortDescription,
          sleepingArrangements,
          slug: property.slug,
          thingsToKnow,
          whatsappHref: whatsapp(site.whatsappNumber, message),
        },
        footer: footerFromCms(locale, site, rental),
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'production') throw error
      if (!fallback) return undefined
      warnFallback(`property ${slug}`, error)
      return { content: fallback, footer: getFallbackFooter(locale) }
    }
  },
)
