import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { config as loadEnv } from 'dotenv'
import type { Payload } from 'payload'

import type { Media, Property } from '../src/payload-types'
import { phase4Properties, type LocalizedText } from './phase4-property-catalogue'

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
loadEnv({ path: path.join(repositoryRoot, '.env'), override: false })
for (const filename of ['.env.supabase.local', '.env.r2.local']) {
  loadEnv({ path: path.join(repositoryRoot, filename), override: true })
}

const amenityLabels: Record<string, LocalizedText> = {
  'air-conditioning': { en: 'Air conditioning', es: 'Aire acondicionado' },
  balcony: { en: 'Private outdoor space', es: 'Espacio exterior privado' },
  'beach-access': { en: 'Beach access', es: 'Acceso a la playa' },
  'full-kitchen': { en: 'Fully equipped kitchen', es: 'Cocina totalmente equipada' },
  gym: { en: 'Gym', es: 'Gimnasio' },
  laundry: { en: 'Washer & dryer', es: 'Lavadora y secadora' },
  parking: { en: 'Parking', es: 'Parqueo' },
  pool: { en: 'Shared swimming pool', es: 'Piscina compartida' },
  'private-jacuzzi': { en: 'Private jacuzzi', es: 'Jacuzzi privado' },
  'private-pool': { en: 'Private swimming pool', es: 'Piscina privada' },
  restaurant: { en: 'On-site restaurant', es: 'Restaurante en el condominio' },
  security: { en: 'Controlled access', es: 'Acceso controlado' },
  tennis: { en: 'Tennis courts', es: 'Canchas de tenis' },
  wifi: { en: 'Fast Wi-Fi', es: 'Wi-Fi rápido' },
  workspace: { en: 'Dedicated workspace', es: 'Área de trabajo' },
}

const amenityGroups = [
  {
    keys: ['air-conditioning', 'wifi', 'full-kitchen', 'laundry', 'workspace', 'balcony'],
    label: { en: 'Inside the home', es: 'Dentro de la casa' },
  },
  {
    keys: ['private-pool', 'private-jacuzzi', 'pool', 'gym', 'tennis', 'restaurant'],
    label: { en: 'Amenities', es: 'Amenidades' },
  },
  {
    keys: ['beach-access', 'security', 'parking'],
    label: { en: 'Access & setting', es: 'Acceso y entorno' },
  },
] as const

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

function extensionFor(url: string): string {
  const extension = path.extname(new URL(url).pathname).toLowerCase()
  return ['.jpeg', '.jpg', '.png', '.webp'].includes(extension) ? extension : '.jpg'
}

async function mediaForImage(
  payload: Payload,
  tempDirectory: string,
  slug: string,
  index: number,
  image: (typeof phase4Properties)[number]['images'][number],
): Promise<Media> {
  const filename = `phase4-${slug}-${String(index + 1).padStart(2, '0')}${extensionFor(image.url)}`
  const existing = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { filename: { equals: filename } },
  })

  let document = existing.docs[0]
  if (!document) {
    const response = await fetch(image.url, { signal: AbortSignal.timeout(45_000) })
    if (!response.ok) throw new Error(`Could not download ${image.url}: ${response.status}`)
    const filePath = path.join(tempDirectory, filename)
    await fs.writeFile(filePath, Buffer.from(await response.arrayBuffer()))
    document = await payload.create({
      collection: 'media',
      data: { alt: image.alt.en },
      filePath,
      locale: 'en',
      overrideAccess: true,
    })
  } else {
    document = await payload.update({
      collection: 'media',
      id: document.id,
      data: { alt: image.alt.en },
      locale: 'en',
      overrideAccess: true,
    })
  }

  await payload.update({
    collection: 'media',
    id: document.id,
    data: { alt: image.alt.es },
    locale: 'es',
    overrideAccess: true,
  })
  return document
}

function localizedAmenityGroups(keys: string[], locale: 'en' | 'es') {
  return amenityGroups
    .map((group) => ({
      items: group.keys
        .filter((key) => keys.includes(key))
        .map((key) => ({ item: amenityLabels[key][locale] })),
      label: group.label[locale],
    }))
    .filter((group) => group.items.length)
}

async function main() {
  if (!process.env.DATABASE_URL)
    throw new Error('DATABASE_URL is required to seed Phase 4 properties.')
  if (!process.env.PAYLOAD_SECRET)
    throw new Error('PAYLOAD_SECRET is required to seed Phase 4 properties.')
  if (!process.env.R2_BUCKET)
    throw new Error('R2 configuration is required so imported media is stored canonically in R2.')

  const [{ getPayload }, { default: config }] = await Promise.all([
    import('payload'),
    import('../src/payload.config'),
  ])
  const payload = await getPayload({ config })
  const tempDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'mariposa-phase4-'))

  try {
    await payload.updateGlobal({
      slug: 'properties-page',
      context: { skipRevalidation: true },
      data: {
        _status: 'published',
        heading: 'Fourteen homes',
        introduction:
          'Apartments and penthouses across Santa Ana and Escazú, plus two homes on the Pacific coast. Daily, weekly and monthly stays.',
        seo: {
          description:
            'Explore fourteen furnished CR Mariposa homes in Santa Ana, Escazú, Playa Langosta and Playa Tivives.',
          title: 'Furnished homes in Santa Ana, Escazú and the Pacific',
        },
      },
      draft: false,
      locale: 'en',
      overrideAccess: true,
    })
    await payload.updateGlobal({
      slug: 'properties-page',
      context: { skipRevalidation: true },
      data: {
        _status: 'published',
        heading: 'Catorce casas',
        introduction:
          'Apartamentos y penthouses en Santa Ana y Escazú, además de dos casas en la costa del Pacífico. Estadías diarias, semanales y mensuales.',
        seo: {
          description:
            'Explora catorce casas amuebladas de CR Mariposa en Santa Ana, Escazú, Playa Langosta y Playa Tivives.',
          title: 'Casas amuebladas en Santa Ana, Escazú y el Pacífico',
        },
      },
      draft: false,
      locale: 'es',
      overrideAccess: true,
    })

    for (const seed of phase4Properties) {
      console.log(`Importing ${seed.title}...`)
      const images: Media[] = []
      for (const [index, image] of seed.images.entries()) {
        images.push(await mediaForImage(payload, tempDirectory, seed.slug, index, image))
      }

      const englishAmenities = localizedAmenityGroups(seed.amenities, 'en')
      const spanishAmenities = localizedAmenityGroups(seed.amenities, 'es')
      const englishData = {
        amenityGroups: englishAmenities,
        badge: seed.badge.en,
        bathrooms: seed.bathrooms,
        bedrooms: seed.bedrooms,
        beds: seed.beds,
        complexName: seed.complexName,
        description: lexical(seed.description.en),
        displayOrder: seed.displayOrder,
        district: seed.district.en,
        externalListings: [],
        extraFacts: seed.extraFacts.en.map((fact) => ({ fact })),
        featured: seed.featured,
        gallery: images.map((image, index) => ({
          category: seed.images[index].category,
          featuredInShowcase: index < 5,
          image: image.id,
        })),
        heroImage: images[0].id,
        neighborhoodDescription: seed.neighborhood.en,
        parking: seed.parking?.en,
        region: seed.region,
        seo: {
          description: seed.shortDescription.en,
          ogImage: images[0].id,
          title: seed.title,
        },
        shortDescription: seed.shortDescription.en,
        sleepingArrangements: seed.sleeping.map((room) => ({
          bedSummary: room.bed.en,
          image: images[room.image].id,
          roomName: room.room.en,
        })),
        slug: seed.slug,
        thingsToKnow: {
          cancellationDetails:
            'Because stay lengths vary, the terms that apply to your inquiry are shared clearly before you confirm.',
          cancellationSummary: 'Cancellation terms are confirmed personally before your stay.',
        },
        title: seed.title,
      }
      const existing = await payload.find({
        collection: 'properties',
        depth: 0,
        limit: 1,
        overrideAccess: true,
        where: { slug: { equals: seed.slug } },
      })
      const englishDraft = existing.docs[0]
        ? await payload.update({
            collection: 'properties',
            id: existing.docs[0].id,
            context: { skipRevalidation: true },
            data: { ...englishData, _status: 'draft' },
            draft: true,
            locale: 'en',
            overrideAccess: true,
          })
        : await payload.create({
            collection: 'properties',
            context: { skipRevalidation: true },
            data: { ...englishData, _status: 'draft' },
            draft: true,
            locale: 'en',
            overrideAccess: true,
          })

      function spanishData(property: Property) {
        return {
          amenityGroups: spanishAmenities.map((group, index) => ({
            id: property.amenityGroups?.[index]?.id,
            items: group.items.map((item) => ({ item: item.item })),
            label: group.label,
          })),
          badge: seed.badge.es,
          description: lexical(seed.description.es),
          district: seed.district.es,
          extraFacts: seed.extraFacts.es.map((fact, index) => ({
            id: property.extraFacts?.[index]?.id,
            fact,
          })),
          neighborhoodDescription: seed.neighborhood.es,
          parking: seed.parking?.es,
          seo: { description: seed.shortDescription.es, title: seed.title },
          shortDescription: seed.shortDescription.es,
          sleepingArrangements: seed.sleeping.map((room, index) => ({
            bedSummary: room.bed.es,
            id: property.sleepingArrangements?.[index]?.id,
            image: images[room.image].id,
            roomName: room.room.es,
          })),
          thingsToKnow: {
            cancellationDetails:
              'Como la duración de cada estadía varía, compartimos claramente las condiciones aplicables antes de que confirmes.',
            cancellationSummary:
              'Las condiciones de cancelación se confirman personalmente antes de tu estadía.',
          },
        }
      }

      await payload.update({
        collection: 'properties',
        id: englishDraft.id,
        context: { skipRevalidation: true },
        data: { ...spanishData(englishDraft), _status: 'draft' },
        draft: true,
        locale: 'es',
        overrideAccess: true,
      })

      await payload.update({
        collection: 'properties',
        id: englishDraft.id,
        context: { skipRevalidation: true },
        data: { ...englishData, _status: 'published' },
        draft: false,
        locale: 'en',
        overrideAccess: true,
      })
    }

    const count = await payload.count({ collection: 'properties', overrideAccess: true })
    console.log(`Phase 4 catalogue seed complete. Property records: ${count.totalDocs}.`)
  } finally {
    await fs.rm(tempDirectory, { force: true, recursive: true })
    await payload.destroy()
  }
}

await main()
