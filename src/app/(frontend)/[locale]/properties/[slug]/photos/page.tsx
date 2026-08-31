import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { isLocale } from '@/i18n'
import { PhotoShowcase } from '@/modules/rentals/components/PhotoShowcase'
import { getPropertyPageContent } from '@/modules/rentals/lib/cms-content'

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await props.params
  if (!isLocale(locale)) return {}

  const result = await getPropertyPageContent(locale, slug)
  if (!result) return {}

  return {
    title: `${result.content.name} · ${result.content.labels.photoShowcase}`,
    alternates: {
      canonical: `/${locale}/properties/${slug}`,
      languages: {
        en: `/en/properties/${slug}/photos`,
        es: `/es/properties/${slug}/photos`,
      },
    },
    robots: { follow: true, index: false },
  }
}

export default async function PropertyPhotosPage(props: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await props.params
  if (!isLocale(locale)) notFound()

  const result = await getPropertyPageContent(locale, slug)
  if (!result) notFound()

  const otherLocale = locale === 'en' ? 'es' : 'en'
  const propertyHref = `/${locale}/properties/${slug}`

  return (
    <PhotoShowcase
      gallery={result.content.gallery}
      labels={result.content.labels}
      languageHref={`/${otherLocale}/properties/${slug}/photos`}
      languageLabel={otherLocale.toUpperCase()}
      propertyHref={propertyHref}
      propertyName={result.content.name}
    />
  )
}
