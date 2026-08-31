import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { cache } from 'react'

import { getDictionary, isLocale, type Locale } from '@/i18n'
import type {
  ContactPage as ContactPageGlobal,
  Media,
  RentalSetting,
  SiteSetting,
} from '@/payload-types'
import config from '@/payload.config'
import { InquiryForm } from '@/modules/rentals/components/InquiryForm'
import { MobileContactBar } from '@/modules/rentals/components/MobileContactBar'
import { SiteFooter } from '@/modules/rentals/components/SiteFooter'
import {
  getFooterContent,
  getHomeContent,
  type FooterContent,
  type GalleryImage,
  type SeoContent,
} from '@/modules/rentals/lib/phase2-content'
import { localizedAlternates } from '@/modules/rentals/lib/seo'

type ContactContent = {
  body?: ContactPageGlobal['body']
  ctaLabel: string
  fallbackBody: string
  heading: string
  image?: GalleryImage
  seo?: SeoContent
  whatsappHref: string
}

const platformLabels = {
  airbnb: 'Airbnb',
  booking: 'Booking.com',
  direct: 'Direct',
  expedia: 'Expedia',
  facebook: 'Facebook',
  instagram: 'Instagram',
  vrbo: 'Vrbo',
} as const

function media(value: null | string | Media | undefined): GalleryImage | undefined {
  if (!value || typeof value === 'string' || !value.url) return undefined
  return { alt: value.alt, category: 'other', showcase: false, src: value.url }
}

function whatsapp(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

function extractNodeText(value: unknown): string {
  if (!value || typeof value !== 'object') return ''
  if ('text' in value && typeof value.text === 'string') return value.text
  if (!('children' in value) || !Array.isArray(value.children)) return ''
  return value.children.map(extractNodeText).join(' ')
}

function richTextDescription(value: ContactPageGlobal['body']): string {
  return extractNodeText(value.root).replace(/\s+/g, ' ').trim()
}

function footerFromCms(locale: Locale, site: SiteSetting, rental: RentalSetting): FooterContent {
  const fallback = getFooterContent(locale)
  const configuredPlatforms = rental.marketplaceLinks?.map((item) => ({
    href: item.url || undefined,
    label: platformLabels[item.platform],
  }))

  return {
    ...fallback,
    company: fallback.company.map((item) => ({
      ...item,
      href: item.href.startsWith('mailto:')
        ? `mailto:${site.email}?subject=${
            locale === 'en' ? 'Property%20management' : 'Administraci%C3%B3n%20de%20propiedades'
          }`
        : item.href,
    })),
    contact: {
      email: site.email,
      phoneDisplay: site.phoneDisplay,
      phoneHref: `tel:+${site.whatsappNumber}`,
      whatsappNumber: site.whatsappNumber,
    },
    intro: site.tagline,
    location: site.address || fallback.location,
    platforms: configuredPlatforms?.length ? configuredPlatforms : fallback.platforms,
    tagline: site.tagline,
  }
}

const getContactPageContent = cache(
  async (locale: Locale): Promise<{ content: ContactContent; footer: FooterContent }> => {
    const t = getDictionary(locale)
    const fallbackHome = getHomeContent(locale)
    const fallback: { content: ContactContent; footer: FooterContent } = {
      content: {
        ctaLabel: t.cta.whatsapp,
        fallbackBody: fallbackHome.contact.body,
        heading: fallbackHome.contact.heading,
        whatsappHref: fallbackHome.whatsappHref,
      },
      footer: getFooterContent(locale),
    }

    if (!process.env.DATABASE_URL) return fallback

    try {
      const payload = await getPayload({ config })
      const common = {
        draft: false,
        fallbackLocale: 'en' as const,
        locale,
        overrideAccess: false,
      }
      const [page, rental, site] = await Promise.all([
        payload.findGlobal({ ...common, depth: 2, slug: 'contact-page' }),
        payload.findGlobal({ ...common, depth: 1, slug: 'rental-settings' }),
        payload.findGlobal({ ...common, depth: 2, slug: 'site-settings' }),
      ])
      const footer = footerFromCms(locale, site, rental)

      if (page._status !== 'published' || site._status !== 'published') {
        return { content: fallback.content, footer }
      }

      const image = media(page.image)
      const seoImage = media(page.seo?.ogImage) || image
      const description = page.seo?.description || richTextDescription(page.body)

      return {
        content: {
          body: page.body,
          ctaLabel: page.ctaLabel || t.cta.whatsapp,
          fallbackBody: fallbackHome.contact.body,
          heading: page.heading,
          image,
          seo: {
            canonical: page.seo?.canonical || undefined,
            description: description || fallbackHome.contact.body,
            image: seoImage,
            title: page.seo?.title || page.heading,
          },
          whatsappHref: whatsapp(site.whatsappNumber, site.whatsappDefaultMessage),
        },
        footer,
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'production') throw error
      console.error('[contact-page] Unable to read published CMS content; using fallback', error)
      return fallback
    }
  },
)

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  if (!isLocale(locale)) return {}
  const { content } = await getContactPageContent(locale)
  const title = content.seo?.title || content.heading
  const description = content.seo?.description || content.fallbackBody
  const image = content.seo?.image

  return {
    title,
    description,
    alternates: {
      canonical: content.seo?.canonical || `/${locale}/contact`,
      languages: localizedAlternates('contact'),
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

export default async function ContactPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const otherLocale = locale === 'en' ? 'es' : 'en'
  const { content, footer } = await getContactPageContent(locale)

  return (
    <div className="site-shell site-shell--with-mobile-bar bg-sand-50">
      <header className="catalogue-header">
        <Link className="site-wordmark" href={`/${locale}`}>
          {t.siteName}
        </Link>
        <nav aria-label={t.nav.menu} className="catalogue-header__nav">
          <Link href={`/${locale}/properties`}>{t.nav.properties}</Link>
          <Link href={`/${locale}/about`}>{t.nav.about}</Link>
          <Link href={`/${locale}/property-management`}>{t.nav.propertyManagement}</Link>
          <Link aria-current="page" href={`/${locale}/contact`}>
            {t.nav.contact}
          </Link>
        </nav>
        <div className="catalogue-header__actions">
          <Link aria-label={t.language.switchTo} href={`/${otherLocale}/contact`}>
            {locale.toUpperCase()} / {otherLocale.toUpperCase()}
          </Link>
          <a
            className="button button--light"
            href={content.whatsappHref}
            rel="noreferrer"
            target="_blank"
          >
            {content.ctaLabel}
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-5 py-12 sm:px-12 sm:py-20 lg:py-24">
        <section
          aria-labelledby="contact-heading"
          className="grid items-start gap-10 border-b border-divider pb-14 sm:pb-20 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.72fr)] lg:gap-20"
        >
          <div>
            <h1
              className="max-w-[11ch] font-display text-[3.25rem] font-normal leading-[0.94] sm:text-7xl lg:text-8xl"
              id="contact-heading"
            >
              {content.heading}
            </h1>
            {content.body ? (
              <RichText
                className="mt-8 max-w-[62ch] space-y-5 text-[15px] leading-7 text-moss-600 [&_a]:border-b [&_a]:border-current [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-normal [&_li]:mb-2 [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:m-0 [&_ul]:ml-5 [&_ul]:list-disc"
                data={content.body}
              />
            ) : (
              <p className="mt-8 max-w-[62ch] text-[15px] leading-7 text-moss-600">
                {content.fallbackBody}
              </p>
            )}
          </div>
          {content.image ? (
            <div className="relative aspect-[4/5] min-h-[340px] overflow-hidden rounded-[18px]">
              <Image
                alt={content.image.alt}
                className="object-cover"
                fill
                sizes="(max-width: 1024px) 100vw, 38vw"
                src={content.image.src}
              />
            </div>
          ) : null}
        </section>

        <section className="grid gap-12 py-14 sm:py-20 lg:grid-cols-[minmax(260px,0.7fr)_minmax(0,1.3fr)] lg:gap-24">
          <div className="font-ui">
            <h2 className="font-display text-4xl font-normal">{footer.touchHeading}</h2>
            <div className="mt-7 grid gap-4 text-sm text-moss-600">
              <a
                className="w-fit border-b border-current pb-1"
                href={content.whatsappHref}
                rel="noreferrer"
                target="_blank"
              >
                {t.cta.whatsapp} · {footer.contact.phoneDisplay}
              </a>
              <a className="w-fit border-b border-current pb-1" href={footer.contact.phoneHref}>
                {t.cta.call} · {footer.contact.phoneDisplay}
              </a>
              <a
                className="w-fit border-b border-current pb-1"
                href={`mailto:${footer.contact.email}`}
              >
                {footer.contact.email}
              </a>
              <span>{footer.location}</span>
            </div>
          </div>

          <div className="border border-divider bg-sand-100 p-6 sm:p-10 lg:p-12">
            <h2 className="mb-7 font-display text-4xl font-normal">{t.inquiryForm.open}</h2>
            <InquiryForm locale={locale} source="contact-form" t={t.inquiryForm} />
          </div>
        </section>
      </main>

      <SiteFooter content={footer} languageHref={`/${otherLocale}/contact`} locale={locale} t={t} />
      <MobileContactBar
        phoneHref={footer.contact.phoneHref}
        t={t}
        whatsappHref={content.whatsappHref}
      />
    </div>
  )
}
