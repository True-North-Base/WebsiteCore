import React from 'react'

import { getDictionary, isLocale, type Locale } from '@/i18n'

// Phase 1 placeholder — the designed homepage (screen 3a/3b) lands in Phase 2.
export default async function HomePage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const t = getDictionary(isLocale(locale) ? locale : ('en' as Locale))

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-display text-5xl tracking-[0.2em] uppercase">{t.siteName}</h1>
      <p className="text-moss-600 max-w-md text-lg">{t.tagline}</p>
      <p className="text-moss-400 text-sm">{t.underConstruction}</p>
    </div>
  )
}
