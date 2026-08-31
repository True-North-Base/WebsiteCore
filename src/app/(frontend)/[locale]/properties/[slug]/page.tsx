import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getDictionary, isLocale } from '@/i18n'
import { PropertyDetail } from '@/modules/rentals/components/PropertyDetail'
import { getPropertyPageContent } from '@/modules/rentals/lib/cms-content'

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await props.params
  if (!isLocale(locale)) return {}

  const result = await getPropertyPageContent(locale, slug)
  if (!result) return {}
  const property = result.content
  const title = property.seo?.title || property.name
  const description = property.seo?.description || property.shortDescription
  const image = property.seo?.image || property.gallery[0]

  return {
    title,
    description,
    alternates: {
      canonical: property.seo?.canonical || `/${locale}/properties/${slug}`,
      languages: {
        en: `/en/properties/${slug}`,
        es: `/es/properties/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      images: [{ alt: image.alt, url: image.src }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image.src],
    },
  }
}

export default async function PropertyPage(props: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await props.params
  if (!isLocale(locale)) notFound()

  const result = await getPropertyPageContent(locale, slug)
  if (!result) notFound()

  return (
    <PropertyDetail
      content={result.content}
      footer={result.footer}
      locale={locale}
      t={getDictionary(locale)}
    />
  )
}
