import { RichText } from '@payloadcms/richtext-lexical/react'
import { getPayload } from 'payload'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import { getDictionary, isLocale, type Locale } from '@/i18n'
import { MobileContactBar } from '@/modules/rentals/components/MobileContactBar'
import { SiteFooter } from '@/modules/rentals/components/SiteFooter'
import { getHomePageContent } from '@/modules/rentals/lib/cms-content'
import { localizedAlternates } from '@/modules/rentals/lib/seo'
import type { Media, PropertyManagementPage } from '@/payload-types'
import config from '@/payload.config'

import styles from './page.module.css'

type PageContent = {
  body?: PropertyManagementPage['body']
  ctaLabel: string
  fallbackParagraphs: string[]
  heading: string
  image: { alt: string; src: string }
  seo?: {
    canonical?: string
    description?: string
    image?: { alt: string; src: string }
    title?: string
  }
}

const fallbackContent: Record<Locale, PageContent> = {
  en: {
    ctaLabel: 'Talk with our family',
    fallbackParagraphs: [
      'Your Costa Rica property deserves attentive, local care. CR Mariposa brings the same personal approach used across our own small collection of furnished homes.',
      'Speak directly with our family about your property, your priorities and the kind of guest experience you want to create.',
    ],
    heading: 'Property management with a personal touch',
    image: {
      alt: 'Pool and clubhouse overlooking Costa Rica’s Central Valley',
      src: '/images/mariposa/photos-1787785691293-pk7i.png',
    },
  },
  es: {
    ctaLabel: 'Hable con nuestra familia',
    fallbackParagraphs: [
      'Su propiedad en Costa Rica merece una atención local y cuidadosa. CR Mariposa aporta el mismo enfoque personal que usamos en nuestra propia colección de casas amuebladas.',
      'Hable directamente con nuestra familia sobre su propiedad, sus prioridades y la experiencia que desea ofrecer a sus huéspedes.',
    ],
    heading: 'Administración de propiedades con atención personal',
    image: {
      alt: 'Piscina y casa club con vista al Valle Central de Costa Rica',
      src: '/images/mariposa/photos-1787785691293-pk7i.png',
    },
  },
}

function resolvedMedia(value: Media | null | string | undefined) {
  if (!value || typeof value === 'string' || !value.url) return undefined
  return { alt: value.alt, src: value.url }
}

const getPropertyManagementContent = cache(async (locale: Locale): Promise<PageContent> => {
  const fallback = fallbackContent[locale]
  if (!process.env.DATABASE_URL) return fallback

  try {
    const payload = await getPayload({ config })
    const page = await payload.findGlobal({
      slug: 'property-management-page',
      depth: 2,
      draft: false,
      fallbackLocale: 'en',
      locale,
      overrideAccess: false,
    })

    if (page._status !== 'published') return fallback

    const image = resolvedMedia(page.image) || fallback.image
    const seoImage = resolvedMedia(page.seo?.ogImage) || image

    return {
      body: page.body,
      ctaLabel: page.ctaLabel || fallback.ctaLabel,
      fallbackParagraphs: fallback.fallbackParagraphs,
      heading: page.heading || fallback.heading,
      image,
      seo: {
        canonical: page.seo?.canonical || undefined,
        description: page.seo?.description || undefined,
        image: seoImage,
        title: page.seo?.title || undefined,
      },
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'production') throw error
    const reason = error instanceof Error ? `: ${error.message}` : ''
    console.warn(`[content] Using property-management fallback${reason}`)
    return fallback
  }
})

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  if (!isLocale(locale)) return {}

  const content = await getPropertyManagementContent(locale)
  const title = content.seo?.title || content.heading
  const description = content.seo?.description || content.fallbackParagraphs[0]
  const image = content.seo?.image || content.image

  return {
    title,
    description,
    alternates: {
      canonical: content.seo?.canonical || `/${locale}/property-management`,
      languages: localizedAlternates('property-management'),
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

export default async function PropertyManagementRoute(props: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await props.params
  if (!isLocale(locale)) notFound()

  const [content, home] = await Promise.all([
    getPropertyManagementContent(locale),
    getHomePageContent(locale),
  ])
  const t = getDictionary(locale)
  const otherLocale = locale === 'en' ? 'es' : 'en'

  return (
    <div className="catalogue-page site-shell site-shell--with-mobile-bar">
      <header className="catalogue-header">
        <Link className="site-wordmark" href={`/${locale}`}>
          {t.siteName}
        </Link>
        <nav aria-label={t.nav.menu} className="catalogue-header__nav">
          <Link href={`/${locale}/properties`}>{t.nav.properties}</Link>
          <Link href={`/${locale}/about`}>{t.nav.about}</Link>
          <Link aria-current="page" href={`/${locale}/property-management`}>
            {t.nav.propertyManagement}
          </Link>
          <Link href={`/${locale}/contact`}>{t.nav.contact}</Link>
        </nav>
        <div className="catalogue-header__actions">
          <Link aria-label={t.language.switchTo} href={`/${otherLocale}/property-management`}>
            {locale.toUpperCase()} / {otherLocale.toUpperCase()}
          </Link>
          <a
            className="button button--light"
            href={home.content.whatsappHref}
            rel="noreferrer"
            target="_blank"
          >
            {t.cta.whatsapp}
          </a>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.copy}>
            <p className="eyebrow">{t.nav.propertyManagement}</p>
            <h1>{content.heading}</h1>
            <div className={styles.richText}>
              {content.body ? (
                <RichText data={content.body} />
              ) : (
                content.fallbackParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
              )}
            </div>
            <a
              className="button button--dark"
              href={home.content.whatsappHref}
              rel="noreferrer"
              target="_blank"
            >
              {content.ctaLabel}
            </a>
          </div>

          <div className={styles.image}>
            <Image
              alt={content.image.alt}
              fill
              priority
              sizes="(max-width: 800px) 100vw, 50vw"
              src={content.image.src}
            />
          </div>
        </section>
      </main>

      <SiteFooter
        content={home.footer}
        languageHref={`/${otherLocale}/property-management`}
        locale={locale}
        t={t}
      />
      <MobileContactBar
        phoneHref={home.footer.contact.phoneHref}
        t={t}
        whatsappHref={home.content.whatsappHref}
      />
    </div>
  )
}
