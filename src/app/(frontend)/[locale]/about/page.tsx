import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { cache } from 'react'

import { getDictionary, isLocale, type Locale } from '@/i18n'
import { MobileContactBar } from '@/modules/rentals/components/MobileContactBar'
import { SiteFooter } from '@/modules/rentals/components/SiteFooter'
import { getHomePageContent } from '@/modules/rentals/lib/cms-content'
import type { AboutPage, Media } from '@/payload-types'
import config from '@/payload.config'

type AboutContent = {
  body?: AboutPage['body']
  description: string
  eyebrow: string
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

const fallbackContent: Record<Locale, AboutContent> = {
  en: {
    description:
      'Meet the family behind CR Mariposa and its small, personally managed collection of homes in Costa Rica.',
    eyebrow: 'Our story',
    fallbackParagraphs: [
      'For more than twenty years, CR Mariposa has welcomed guests to Costa Rica with the warmth and practical care of a family-run business.',
      'Our collection stays intentionally small: fourteen furnished homes chosen, prepared and managed by the people who know them best. When you contact us, you reach the family—not a call center or an anonymous marketplace.',
      'That personal approach lets us help each guest find the right setting, from the everyday convenience of Santa Ana and Escazú to slower days beside the Pacific.',
    ],
    heading: 'A more personal way to stay in Costa Rica',
    image: {
      alt: 'Flowering trees and shared gardens at a CR Mariposa community',
      src: '/images/mariposa/photos-1787785697864-u83k.png',
    },
  },
  es: {
    description:
      'Conoce a la familia detrás de CR Mariposa y su pequeña colección de casas administradas personalmente en Costa Rica.',
    eyebrow: 'Nuestra historia',
    fallbackParagraphs: [
      'Durante más de veinte años, CR Mariposa ha recibido huéspedes en Costa Rica con la calidez y la atención práctica de un negocio familiar.',
      'Nuestra colección se mantiene pequeña a propósito: catorce casas amuebladas, elegidas, preparadas y administradas por quienes mejor las conocen. Cuando nos contactas, hablas con la familia, no con un centro de llamadas ni con un mercado anónimo.',
      'Ese trato personal nos permite ayudar a cada huésped a encontrar el ambiente ideal, desde la comodidad cotidiana de Santa Ana y Escazú hasta días más tranquilos junto al Pacífico.',
    ],
    heading: 'Una forma más personal de hospedarse en Costa Rica',
    image: {
      alt: 'Árboles floreados y jardines compartidos en una comunidad de CR Mariposa',
      src: '/images/mariposa/photos-1787785697864-u83k.png',
    },
  },
}

function resolvedMedia(value: Media | null | string | undefined) {
  if (!value || typeof value === 'string' || !value.url) return undefined
  return { alt: value.alt, src: value.url }
}

function hasRichText(value: AboutPage['body'] | undefined): value is AboutPage['body'] {
  return Boolean(value?.root?.children?.length)
}

const getAboutContent = cache(async (locale: Locale): Promise<AboutContent> => {
  const fallback = fallbackContent[locale]
  if (!process.env.DATABASE_URL) return fallback

  try {
    const payload = await getPayload({ config })
    const page = await payload.findGlobal({
      slug: 'about-page',
      depth: 2,
      draft: false,
      fallbackLocale: 'en',
      locale,
      overrideAccess: false,
    })

    if (page._status !== 'published' || !page.heading || !hasRichText(page.body)) return fallback

    const image = resolvedMedia(page.image) || fallback.image
    const socialImage = resolvedMedia(page.seo?.ogImage) || image

    return {
      ...fallback,
      body: page.body,
      heading: page.heading,
      image,
      seo: {
        canonical: page.seo?.canonical || undefined,
        description: page.seo?.description || fallback.description,
        image: socialImage,
        title: page.seo?.title || page.heading,
      },
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'production') throw error
    const reason = error instanceof Error ? `: ${error.message}` : ''
    console.warn(`[content] Using approved About-page fallback${reason}`)
    return fallback
  }
})

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  if (!isLocale(locale)) return {}

  const content = await getAboutContent(locale)
  const title = content.seo?.title || (locale === 'en' ? 'About us' : 'Sobre nosotros')
  const description = content.seo?.description || content.description
  const image = content.seo?.image || content.image

  return {
    title,
    description,
    alternates: {
      canonical: content.seo?.canonical || `/${locale}/about`,
      languages: { en: '/en/about', es: '/es/about' },
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

export default async function AboutRoute(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  if (!isLocale(locale)) notFound()

  const t = getDictionary(locale)
  const otherLocale = locale === 'en' ? 'es' : 'en'
  const [about, { content: home, footer }] = await Promise.all([
    getAboutContent(locale),
    getHomePageContent(locale),
  ])

  return (
    <div className="catalogue-page site-shell site-shell--with-mobile-bar">
      <header className="catalogue-header">
        <Link className="site-wordmark" href={`/${locale}`}>
          {t.siteName}
        </Link>
        <nav aria-label={t.nav.menu} className="catalogue-header__nav">
          <Link href={`/${locale}/properties`}>{t.nav.properties}</Link>
          <Link aria-current="page" href={`/${locale}/about`}>
            {t.nav.about}
          </Link>
          <Link href={`/${locale}/property-management`}>{t.nav.propertyManagement}</Link>
          <Link href={`/${locale}/contact`}>{t.nav.contact}</Link>
        </nav>
        <div className="catalogue-header__actions">
          <Link aria-label={t.language.switchTo} href={`/${otherLocale}/about`}>
            {locale.toUpperCase()} / {otherLocale.toUpperCase()}
          </Link>
          <a
            className="button button--light"
            href={home.whatsappHref}
            rel="noreferrer"
            target="_blank"
          >
            {t.cta.whatsapp}
          </a>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-[1280px] gap-12 px-5 py-12 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-center md:px-12 md:py-24">
          <div className="max-w-[680px]">
            <p className="eyebrow">{about.eyebrow}</p>
            <h1 className="m-0 max-w-[12ch] font-display text-[clamp(3.25rem,6vw,5.5rem)] font-normal leading-[0.94] text-basalt">
              {about.heading}
            </h1>
            {about.body ? (
              <RichText
                className="mt-8 font-body text-[15px] leading-[1.8] text-moss-600 [&_a]:text-clay-700 [&_a]:underline [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-4xl [&_h2]:font-normal [&_h2]:text-basalt [&_li]:mb-2 [&_p]:mb-5"
                data={about.body}
              />
            ) : (
              <div className="mt-8 font-body text-[15px] leading-[1.8] text-moss-600">
                {about.fallbackParagraphs.map((paragraph) => (
                  <p className="mb-5" key={paragraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>
          <div className="relative aspect-[4/3] min-h-[320px] overflow-hidden rounded-[var(--radius-media)] md:aspect-[5/6]">
            <Image
              alt={about.image.alt}
              className="object-cover"
              fill
              priority
              sizes="(max-width: 768px) calc(100vw - 40px), 52vw"
              src={about.image.src}
            />
          </div>
        </section>

        <section className="contact-cta">
          <div>
            <h2>{home.contact.heading}</h2>
            <p>{home.contact.body}</p>
          </div>
          <div className="contact-cta__actions">
            <a
              className="button button--dark"
              href={home.whatsappHref}
              rel="noreferrer"
              target="_blank"
            >
              {t.cta.whatsapp}
            </a>
            <a className="button button--outline" href={footer.contact.phoneHref}>
              {t.cta.call}
            </a>
          </div>
        </section>
      </main>

      <SiteFooter content={footer} languageHref={`/${otherLocale}/about`} locale={locale} t={t} />
      <MobileContactBar
        phoneHref={footer.contact.phoneHref}
        t={t}
        whatsappHref={home.whatsappHref}
      />
    </div>
  )
}
