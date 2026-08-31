import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getDictionary, isLocale } from '@/i18n'
import { PropertiesIndex } from '@/modules/rentals/components/PropertiesIndex'
import { getPropertiesPageContent } from '@/modules/rentals/lib/cms-content'
import { localizedAlternates } from '@/modules/rentals/lib/seo'

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  if (!isLocale(locale)) return {}
  const { content } = await getPropertiesPageContent(locale)
  const title = content.seo?.title || content.heading
  const description = content.seo?.description || content.introduction
  const image = content.seo?.image

  return {
    title,
    description,
    alternates: {
      canonical: content.seo?.canonical || `/${locale}/properties`,
      languages: localizedAlternates('properties'),
    },
    openGraph: {
      title,
      description,
      images: image ? [{ alt: image.alt, url: image.src }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image.src] : undefined,
    },
  }
}

export default async function PropertiesPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const { content, footer } = await getPropertiesPageContent(locale)

  return <PropertiesIndex content={content} footer={footer} locale={locale} t={t} />
}
