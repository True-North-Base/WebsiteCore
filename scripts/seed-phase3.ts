import 'dotenv/config'

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { getPayload } from 'payload'

import config from '../src/payload.config'
import type { Media, Property } from '../src/payload-types'
import { getHomeContent, getPropertyContent } from '../src/modules/rentals/lib/phase2-content'

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

type LocalizedText = { en: string; es: string }

function lexical(paragraphs: string[]): Property['description'] {
  return {
    root: {
      children: paragraphs.map((paragraph) => ({
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: paragraph,
            type: 'text',
            version: 1,
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      })),
      direction: null,
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  } as Property['description']
}

function publicFile(source: string): string {
  return path.join(repositoryRoot, 'public', ...source.split('/').filter(Boolean))
}

function isSeedMediaFilename(candidate: string | null | undefined, source: string): boolean {
  if (!candidate) return false

  const filename = path.basename(source)
  if (candidate === filename) return true

  const extension = path.extname(filename)
  const stem = path.basename(filename, extension).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const escapedExtension = extension.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  return new RegExp(`^${stem}-\\d+${escapedExtension}$`).test(candidate)
}

async function main() {
  if (!process.env.DATABASE_URL)
    throw new Error('DATABASE_URL is required to seed Phase 3 content.')
  if (!process.env.PAYLOAD_SECRET)
    throw new Error('PAYLOAD_SECRET is required to seed Phase 3 content.')

  const payload = await getPayload({ config })
  const homeEn = getHomeContent('en')
  const homeEs = getHomeContent('es')
  const propertyEn = getPropertyContent('en', 'penthouse-lago')
  const propertyEs = getPropertyContent('es', 'penthouse-lago')
  if (!propertyEn || !propertyEs)
    throw new Error('Approved Penthouse Lago seed content is missing.')

  const altBySource = new Map<string, LocalizedText>()
  function addAlt(source: string, en: string, es: string) {
    if (!altBySource.has(source)) altBySource.set(source, { en, es })
  }

  addAlt(homeEn.hero.image, homeEn.hero.imageAlt, homeEs.hero.imageAlt)
  addAlt(homeEn.hero.mobileImage, homeEn.hero.mobileImageAlt, homeEs.hero.mobileImageAlt)
  addAlt(homeEn.difference.image, homeEn.difference.imageAlt, homeEs.difference.imageAlt)
  addAlt(
    homeEn.hospitalityDifference.image,
    homeEn.hospitalityDifference.imageAlt,
    homeEs.hospitalityDifference.imageAlt,
  )
  propertyEn.gallery.forEach((image, index) =>
    addAlt(image.src, image.alt, propertyEs.gallery[index]?.alt || image.alt),
  )

  const existingMedia = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1000,
    overrideAccess: true,
  })
  const knownMedia = [...existingMedia.docs]
  const mediaBySource = new Map<string, Media>()
  for (const [source, alt] of altBySource) {
    const existing = knownMedia
      .filter((document) => isSeedMediaFilename(document.filename, source))
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))[0]
    const document = existing
      ? await payload.update({
          collection: 'media',
          id: existing.id,
          data: { alt: alt.en },
          locale: 'en',
          overrideAccess: true,
        })
      : await payload.create({
          collection: 'media',
          data: { alt: alt.en },
          filePath: publicFile(source),
          locale: 'en',
          overrideAccess: true,
        })

    if (!existing) knownMedia.push(document)

    await payload.update({
      collection: 'media',
      id: document.id,
      data: { alt: alt.es },
      locale: 'es',
      overrideAccess: true,
    })
    mediaBySource.set(source, document)
  }

  function mediaId(source: string): string {
    const document = mediaBySource.get(source)
    if (!document) throw new Error(`Seed media is missing for ${source}`)
    return document.id
  }

  const siteEn = {
    _status: 'published' as const,
    address: 'Santa Ana, Costa Rica',
    defaultSeo: {
      description: homeEn.hero.subtitle,
      ogImage: mediaId(homeEn.hero.image),
      title: `CR Mariposa — ${homeEn.hero.title}`,
    },
    email: 'mariposacrtravel@gmail.com',
    phoneDisplay: '+506 8825-5888',
    siteName: 'CR Mariposa',
    tagline: homeEn.hero.title,
    whatsappDefaultMessage: 'Hello CR Mariposa, I would like to ask about a stay in Costa Rica.',
    whatsappNumber: '50688255888',
  }
  await payload.updateGlobal({
    slug: 'site-settings',
    context: { skipRevalidation: true },
    data: siteEn,
    draft: false,
    locale: 'en',
    overrideAccess: true,
  })
  await payload.updateGlobal({
    slug: 'site-settings',
    context: { skipRevalidation: true },
    data: {
      ...siteEn,
      address: 'Santa Ana, Costa Rica',
      defaultSeo: {
        description: homeEs.hero.subtitle,
        ogImage: mediaId(homeEn.hero.image),
        title: `CR Mariposa — ${homeEs.hero.title}`,
      },
      tagline: homeEs.hero.title,
      whatsappDefaultMessage:
        'Hola CR Mariposa, quisiera consultar sobre una estadía en Costa Rica.',
    },
    draft: false,
    locale: 'es',
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'rental-settings',
    context: { skipRevalidation: true },
    data: {
      _status: 'published',
      directBookingNote:
        'Dates and terms are confirmed personally. Contacting us directly avoids platform fees.',
      marketplaceLinks: [
        { platform: 'airbnb' },
        { platform: 'booking' },
        { platform: 'vrbo' },
        { platform: 'expedia' },
        { platform: 'instagram' },
        { platform: 'facebook' },
      ],
    },
    draft: false,
    locale: 'en',
    overrideAccess: true,
  })
  await payload.updateGlobal({
    slug: 'rental-settings',
    context: { skipRevalidation: true },
    data: {
      _status: 'published',
      directBookingNote:
        'Las fechas y condiciones se confirman personalmente. El contacto directo evita comisiones de plataforma.',
    },
    draft: false,
    locale: 'es',
    overrideAccess: true,
  })

  const homePageDocument = await payload.updateGlobal({
    slug: 'home-page',
    context: { skipRevalidation: true },
    data: {
      _status: 'published',
      contactBody: homeEn.contact.body,
      contactHeading: homeEn.contact.heading,
      featuredHeading: homeEn.featured.title,
      heroBody: homeEn.hero.subtitle,
      heroHeading: homeEn.hero.title,
      heroImage: mediaId(homeEn.hero.image),
      heroMobileImage: mediaId(homeEn.hero.mobileImage),
      hospitalityEyebrow: homeEn.hospitalityDifference.eyebrow,
      hospitalityFeatures: homeEn.hospitalityDifference.features,
      hospitalityHeading: homeEn.hospitalityDifference.title,
      hospitalityHeadingMuted: homeEn.hospitalityDifference.titleMuted,
      hospitalityImage: mediaId(homeEn.hospitalityDifference.image),
      pacificHeading: homeEn.pacific.title,
      pacificIntro: homeEn.pacific.intro,
      reviewsHeading: homeEn.reviews.title,
      reviewsProof: homeEn.reviews.proof,
      seo: {
        description: homeEn.hero.subtitle,
        ogImage: mediaId(homeEn.hero.image),
        title: homeEn.hero.title,
      },
      trustEyebrow: homeEn.difference.eyebrow,
      trustFeatures: homeEn.difference.features,
      trustHeading: homeEn.difference.title,
      trustHeadingMuted: homeEn.difference.titleMuted,
      trustImage: mediaId(homeEn.difference.image),
    },
    draft: false,
    locale: 'en',
    overrideAccess: true,
  })
  await payload.updateGlobal({
    slug: 'home-page',
    context: { skipRevalidation: true },
    data: {
      _status: 'published',
      contactBody: homeEs.contact.body,
      contactHeading: homeEs.contact.heading,
      featuredHeading: homeEs.featured.title,
      heroBody: homeEs.hero.subtitle,
      heroHeading: homeEs.hero.title,
      hospitalityEyebrow: homeEs.hospitalityDifference.eyebrow,
      hospitalityFeatures: homeEs.hospitalityDifference.features.map((feature, index) => ({
        ...feature,
        id: homePageDocument.hospitalityFeatures?.[index]?.id,
      })),
      hospitalityHeading: homeEs.hospitalityDifference.title,
      hospitalityHeadingMuted: homeEs.hospitalityDifference.titleMuted,
      pacificHeading: homeEs.pacific.title,
      pacificIntro: homeEs.pacific.intro,
      reviewsHeading: homeEs.reviews.title,
      reviewsProof: homeEs.reviews.proof,
      seo: { description: homeEs.hero.subtitle, title: homeEs.hero.title },
      trustEyebrow: homeEs.difference.eyebrow,
      trustFeatures: homeEs.difference.features.map((feature, index) => ({
        ...feature,
        id: homePageDocument.trustFeatures?.[index]?.id,
      })),
      trustHeading: homeEs.difference.title,
      trustHeadingMuted: homeEs.difference.titleMuted,
    },
    draft: false,
    locale: 'es',
    overrideAccess: true,
  })

  const editorialPages = [
    {
      slug: 'about-page' as const,
      en: {
        body: [
          'For more than twenty years, CR Mariposa has welcomed guests to Costa Rica with the warmth and practical care of a family-run business.',
          'Our collection stays intentionally small: fourteen furnished homes chosen, prepared and managed by the people who know them best. When you contact us, you reach the family—not a call center or an anonymous marketplace.',
          'That personal approach lets us help each guest find the right setting, from the everyday convenience of Santa Ana and Escazú to slower days beside the Pacific.',
        ],
        description:
          'Meet the family behind CR Mariposa and its personally managed collection of homes in Costa Rica.',
        heading: 'A more personal way to stay in Costa Rica',
      },
      es: {
        body: [
          'Durante más de veinte años, CR Mariposa ha recibido huéspedes en Costa Rica con la calidez y la atención práctica de un negocio familiar.',
          'Nuestra colección se mantiene pequeña a propósito: catorce casas amuebladas, elegidas, preparadas y administradas por quienes mejor las conocen. Cuando nos contactas, hablas con la familia, no con un centro de llamadas ni con un mercado anónimo.',
          'Ese trato personal nos permite ayudar a cada huésped a encontrar el ambiente ideal, desde la comodidad cotidiana de Santa Ana y Escazú hasta días más tranquilos junto al Pacífico.',
        ],
        description:
          'Conoce a la familia detrás de CR Mariposa y su colección de casas administradas personalmente en Costa Rica.',
        heading: 'Una forma más personal de hospedarse en Costa Rica',
      },
      image: homeEn.difference.image,
    },
    {
      slug: 'property-management-page' as const,
      en: {
        body: [
          'Your Costa Rica property deserves attentive, local care. CR Mariposa brings the same personal approach used across our own small collection of furnished homes.',
          'Speak directly with our family about your property, your priorities and the kind of guest experience you want to create.',
        ],
        ctaLabel: 'Talk with our family',
        description: 'Personal, local property management from the family behind CR Mariposa.',
        heading: 'Property management with a personal touch',
      },
      es: {
        body: [
          'Su propiedad en Costa Rica merece una atención local y cuidadosa. CR Mariposa aporta el mismo enfoque personal que usamos en nuestra propia colección de casas amuebladas.',
          'Hable directamente con nuestra familia sobre su propiedad, sus prioridades y la experiencia que desea ofrecer a sus huéspedes.',
        ],
        ctaLabel: 'Hable con nuestra familia',
        description:
          'Administración local y personal de propiedades por la familia detrás de CR Mariposa.',
        heading: 'Administración de propiedades con atención personal',
      },
      image: homeEn.hospitalityDifference.image,
    },
    {
      slug: 'contact-page' as const,
      en: {
        body: [homeEn.contact.body],
        ctaLabel: 'WhatsApp',
        description: homeEn.contact.body,
        heading: homeEn.contact.heading,
      },
      es: {
        body: [homeEs.contact.body],
        ctaLabel: 'WhatsApp',
        description: homeEs.contact.body,
        heading: homeEs.contact.heading,
      },
      image: homeEn.hero.mobileImage,
    },
  ]

  for (const editorial of editorialPages) {
    await payload.updateGlobal({
      slug: editorial.slug,
      context: { skipRevalidation: true },
      data: {
        _status: 'published',
        body: lexical(editorial.en.body),
        heading: editorial.en.heading,
        image: mediaId(editorial.image),
        seo: {
          description: editorial.en.description,
          ogImage: mediaId(editorial.image),
          title: editorial.en.heading,
        },
      },
      draft: false,
      locale: 'en',
      overrideAccess: true,
    })
    await payload.updateGlobal({
      slug: editorial.slug,
      context: { skipRevalidation: true },
      data: {
        _status: 'published',
        body: lexical(editorial.es.body),
        heading: editorial.es.heading,
        seo: {
          description: editorial.es.description,
          title: editorial.es.heading,
        },
      },
      draft: false,
      locale: 'es',
      overrideAccess: true,
    })
  }

  for (const locale of ['en', 'es'] as const) {
    const isEnglish = locale === 'en'
    await payload.updateGlobal({
      slug: 'property-management-page',
      context: { skipRevalidation: true },
      data: { ctaLabel: isEnglish ? 'Talk with our family' : 'Hable con nuestra familia' },
      draft: false,
      locale,
      overrideAccess: true,
    })
    await payload.updateGlobal({
      slug: 'contact-page',
      context: { skipRevalidation: true },
      data: { ctaLabel: 'WhatsApp' },
      draft: false,
      locale,
      overrideAccess: true,
    })
  }

  const existingProperty = await payload.find({
    collection: 'properties',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: propertyEn.slug } },
  })
  const propertyDataEn = {
    _status: 'published' as const,
    amenityGroups: propertyEn.amenities.map((group) => ({
      items: group.items.map((item) => ({ item })),
      label: group.label,
    })),
    bathrooms: 2,
    beds: 2,
    bedrooms: 2,
    complexName: 'Avalon Country Club',
    description: lexical(propertyEn.description),
    displayOrder: 10,
    district: 'Santa Ana, Río Oro',
    externalListings: [],
    extraFacts: propertyEn.facts.slice(2).map((fact) => ({ fact })),
    featured: true,
    gallery: propertyEn.gallery.map((image) => ({
      category: image.category,
      featuredInShowcase: image.showcase,
      image: mediaId(image.src),
    })),
    heroImage: mediaId(homeEn.featured.properties[0].image),
    maxGuests: 4,
    neighborhoodDescription: propertyEn.neighborhood,
    parking: 'Covered space',
    rating: 5,
    region: 'central-valley' as const,
    seo: {
      description: propertyEn.shortDescription,
      ogImage: mediaId(homeEn.featured.properties[0].image),
      title: propertyEn.name,
    },
    shortDescription: propertyEn.shortDescription,
    sleepingArrangements: propertyEn.sleepingArrangements.map((item) => ({
      bedSummary: item.bedSummary,
      image: mediaId(item.image.src),
      roomName: item.roomName,
    })),
    slug: propertyEn.slug,
    thingsToKnow: {
      cancellationDetails:
        'Because stay lengths vary, the terms that apply to your inquiry are shared clearly before you confirm.',
      cancellationSummary: 'Cancellation terms are confirmed personally before your stay.',
      checkInTime: '3:00 pm',
      checkOutTime: '11:00 am',
      events: 'Ask before planning events',
      pets: 'On request',
      propertyRulesDetails:
        'Please discuss any special use of the home with the family before confirming your stay.',
      smoking: 'Not permitted',
    },
    title: propertyEn.name,
  }
  const property = existingProperty.docs[0]
    ? await payload.update({
        collection: 'properties',
        id: existingProperty.docs[0].id,
        context: { skipRevalidation: true },
        data: propertyDataEn,
        draft: false,
        locale: 'en',
        overrideAccess: true,
      })
    : await payload.create({
        collection: 'properties',
        context: { skipRevalidation: true },
        data: propertyDataEn,
        draft: false,
        locale: 'en',
        overrideAccess: true,
      })

  await payload.update({
    collection: 'properties',
    id: property.id,
    context: { skipRevalidation: true },
    data: {
      _status: 'published',
      amenityGroups: propertyEs.amenities.map((group, index) => ({
        id: property.amenityGroups?.[index]?.id,
        items: group.items.map((item) => ({ item })),
        label: group.label,
      })),
      description: lexical(propertyEs.description),
      district: 'Santa Ana, Río Oro',
      extraFacts: propertyEs.facts.slice(2).map((fact) => ({ fact })),
      neighborhoodDescription: propertyEs.neighborhood,
      parking: 'Espacio cubierto',
      seo: { description: propertyEs.shortDescription, title: propertyEs.name },
      shortDescription: propertyEs.shortDescription,
      sleepingArrangements: propertyEs.sleepingArrangements.map((item, index) => ({
        bedSummary: item.bedSummary,
        id: property.sleepingArrangements?.[index]?.id,
        image: mediaId(item.image.src),
        roomName: item.roomName,
      })),
      thingsToKnow: {
        cancellationDetails:
          'Como la duración de cada estadía varía, compartimos claramente las condiciones aplicables antes de que confirmes.',
        cancellationSummary:
          'Las condiciones de cancelación se confirman personalmente antes de tu estadía.',
        events: 'Consulta antes de planificar eventos',
        pets: 'Previa consulta',
        propertyRulesDetails:
          'Conversa con la familia sobre cualquier uso especial de la casa antes de confirmar tu estadía.',
        smoking: 'No permitido',
      },
    },
    draft: false,
    locale: 'es',
    overrideAccess: true,
  })

  const reviewSeeds = [
    {
      country: { en: 'United States', es: 'Estados Unidos' },
      featured: true,
      guestName: 'Sarah',
      platform: 'airbnb' as const,
      property: undefined,
      quote: { en: homeEn.reviews.reviews[0].quote, es: homeEs.reviews.reviews[0].quote },
    },
    {
      country: { en: 'Germany', es: 'Alemania' },
      featured: true,
      guestName: 'Martin and Heike',
      platform: 'booking' as const,
      property: property.id,
      quote: { en: homeEn.reviews.reviews[1].quote, es: homeEs.reviews.reviews[1].quote },
    },
    {
      country: { en: 'Canada', es: 'Canadá' },
      featured: true,
      guestName: 'Andrea',
      platform: 'vrbo' as const,
      property: property.id,
      quote: { en: homeEn.reviews.reviews[2].quote, es: homeEs.reviews.reviews[2].quote },
    },
  ]

  for (const reviewSeed of reviewSeeds) {
    const existing = await payload.find({
      collection: 'reviews',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { guestName: { equals: reviewSeed.guestName } },
    })
    const englishQuote = reviewSeed.quote.en.replace(/^[“"]|[”"]$/g, '')
    const review = existing.docs[0]
      ? await payload.update({
          collection: 'reviews',
          id: existing.docs[0].id,
          context: { skipRevalidation: true },
          data: {
            _status: 'published',
            featured: reviewSeed.featured,
            guestCountry: reviewSeed.country.en,
            guestName: reviewSeed.guestName,
            platform: reviewSeed.platform,
            property: reviewSeed.property,
            quote: englishQuote,
            rating: 5,
          },
          draft: false,
          locale: 'en',
          overrideAccess: true,
        })
      : await payload.create({
          collection: 'reviews',
          context: { skipRevalidation: true },
          data: {
            _status: 'published',
            featured: reviewSeed.featured,
            guestCountry: reviewSeed.country.en,
            guestName: reviewSeed.guestName,
            platform: reviewSeed.platform,
            property: reviewSeed.property,
            quote: englishQuote,
            rating: 5,
          },
          draft: false,
          locale: 'en',
          overrideAccess: true,
        })

    await payload.update({
      collection: 'reviews',
      id: review.id,
      context: { skipRevalidation: true },
      data: {
        _status: 'published',
        guestCountry: reviewSeed.country.es,
        quote: reviewSeed.quote.es.replace(/^[“"]|[”"]$/g, ''),
      },
      draft: false,
      locale: 'es',
      overrideAccess: true,
    })
  }

  console.log(
    'Phase 3 seed complete: site settings, rental settings, homepage, Penthouse Lago, media, and reviews.',
  )
  await payload.destroy()
  process.exit(0)
}

await main()
