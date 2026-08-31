import type { Metadata } from 'next'
import React from 'react'

import { getDictionary, isLocale, type Locale } from '@/i18n'
import { HomePreview } from '@/modules/rentals/components/HomePreview'
import { getHomePageContent } from '@/modules/rentals/lib/cms-content'

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  if (!isLocale(locale)) return {}
  const { content } = await getHomePageContent(locale)
  const t = getDictionary(locale)
  const title = content.seo?.title || `${t.siteName} — ${content.hero.title}`
  const description = content.seo?.description || content.hero.subtitle
  const image = content.seo?.image

  return {
    title,
    description,
    alternates: {
      canonical: content.seo?.canonical || `/${locale}`,
      languages: { en: '/en', es: '/es' },
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

export default async function HomePage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const safeLocale = isLocale(locale) ? locale : ('en' as Locale)
  const t = getDictionary(safeLocale)
  const { content, footer } = await getHomePageContent(safeLocale)

  return <HomePreview content={content} footer={footer} locale={safeLocale} t={t} />
}
