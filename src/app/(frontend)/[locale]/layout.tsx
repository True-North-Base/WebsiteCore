import type { Metadata } from 'next'
import { Archivo, Cormorant_Garamond } from 'next/font/google'
import { notFound } from 'next/navigation'
import React from 'react'

import { getDictionary, isLocale, locales } from '@/i18n'
import { AnalyticsConsent } from '@/modules/core/components/AnalyticsConsent'
import { allowsIndexing } from '@/modules/core/hosting/indexing'
import { localizedAlternates, productionSiteURL } from '@/modules/rentals/lib/seo'
import '../styles.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-cormorant',
  display: 'swap',
})

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-archivo',
  display: 'swap',
})

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return {
    metadataBase: new URL(productionSiteURL),
    title: {
      default: `${t.siteName} — ${t.tagline}`,
      template: `%s · ${t.siteName}`,
    },
    description: t.tagline,
    robots: allowsIndexing(productionSiteURL) ? undefined : { index: false, follow: false },
    alternates: {
      canonical: `/${locale}`,
      languages: localizedAlternates(),
    },
    verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : undefined,
    openGraph: {
      title: `${t.siteName} — ${t.tagline}`,
      description: t.tagline,
      images: [{ alt: `${t.siteName} — ${t.tagline}`, url: '/og.png' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t.siteName} — ${t.tagline}`,
      description: t.tagline,
      images: ['/og.png'],
    },
  }
}

export default async function LocaleLayout(props: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await props.params
  if (!isLocale(locale)) notFound()

  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${archivo.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="bg-sand-100 font-body text-basalt antialiased">
        {props.children}
        <AnalyticsConsent
          locale={locale}
          measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
          t={getDictionary(locale).analyticsConsent}
        />
      </body>
    </html>
  )
}
