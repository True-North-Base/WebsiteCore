import type { Metadata } from 'next'
import { Archivo, Cormorant_Garamond, Lora } from 'next/font/google'
import { notFound } from 'next/navigation'
import React from 'react'

import { getDictionary, isLocale, locales } from '@/i18n'
import '../styles.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-cormorant',
  display: 'swap',
})

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-lora',
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
    title: {
      default: `${t.siteName} — ${t.tagline}`,
      template: `%s · ${t.siteName}`,
    },
    description: t.tagline,
  }
}

export default async function LocaleLayout(props: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await props.params
  if (!isLocale(locale)) notFound()

  return (
    <html lang={locale} className={`${cormorant.variable} ${lora.variable} ${archivo.variable}`}>
      <body className="bg-sand-100 font-body text-basalt antialiased">
        <main>{props.children}</main>
      </body>
    </html>
  )
}
