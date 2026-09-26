'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { useEffect, useSyncExternalStore } from 'react'

import type { Locale } from '@/i18n'
import type { Dictionary } from '@/i18n/dictionaries/en'

type AnalyticsConsentProps = {
  locale: Locale
  measurementId?: string
  t: Dictionary['analyticsConsent']
}

type Consent = 'accepted' | 'rejected'

const STORAGE_KEY = 'cr-mariposa-analytics-consent'
const CONSENT_EVENT = 'cr-mariposa-analytics-consent-change'

function getConsentSnapshot(): Consent | null {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'accepted' || stored === 'rejected' ? stored : null
}

function getServerConsentSnapshot(): Consent | null {
  return null
}

function subscribeToConsent(onStoreChange: () => void): () => void {
  window.addEventListener('storage', onStoreChange)
  window.addEventListener(CONSENT_EVENT, onStoreChange)

  return () => {
    window.removeEventListener('storage', onStoreChange)
    window.removeEventListener(CONSENT_EVENT, onStoreChange)
  }
}

function sendPageView(measurementId: string, path: string) {
  const analyticsWindow = window as typeof window & {
    dataLayer?: unknown[][]
    gtag?: (...args: unknown[]) => void
  }
  analyticsWindow.dataLayer = analyticsWindow.dataLayer || []
  analyticsWindow.gtag =
    analyticsWindow.gtag ||
    function gtag(...args: unknown[]) {
      analyticsWindow.dataLayer?.push(args)
    }
  analyticsWindow.gtag('config', measurementId, {
    anonymize_ip: true,
    page_path: path,
  })
}

export function AnalyticsConsent({ locale, measurementId, t }: AnalyticsConsentProps) {
  const pathname = usePathname()
  const consent = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  )

  useEffect(() => {
    if (measurementId && consent === 'accepted') {
      sendPageView(measurementId, `${pathname}${window.location.search}`)
    }
  }, [consent, measurementId, pathname])

  if (!measurementId) return null

  function choose(nextConsent: Consent) {
    window.localStorage.setItem(STORAGE_KEY, nextConsent)
    window.dispatchEvent(new Event(CONSENT_EVENT))
  }

  return (
    <>
      {consent === 'accepted' ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`}
            strategy="afterInteractive"
          />
          <Script id="cr-mariposa-google-analytics" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${measurementId}',{anonymize_ip:true,send_page_view:false});`}
          </Script>
        </>
      ) : null}
      {consent === null ? (
        <aside aria-label={t.privacyLink} className="analytics-consent" role="dialog">
          <p>
            {t.body} <Link href={`/${locale}/privacy`}>{t.privacyLink}</Link>
          </p>
          <div className="analytics-consent__actions">
            <button className="button button--dark" onClick={() => choose('accepted')} type="button">
              {t.accept}
            </button>
            <button className="analytics-consent__reject" onClick={() => choose('rejected')} type="button">
              {t.reject}
            </button>
          </div>
        </aside>
      ) : null}
    </>
  )
}
