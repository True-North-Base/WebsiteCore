import Link from 'next/link'

import type { Locale } from '@/i18n'
import type { Dictionary } from '@/i18n/dictionaries/en'

import type { FooterContent, PropertiesPageContent } from '../lib/phase2-content'
import { MobileContactBar } from './MobileContactBar'
import { PropertiesCatalogue } from './PropertiesCatalogue'
import { SiteFooter } from './SiteFooter'

type PropertiesIndexProps = {
  content: PropertiesPageContent
  footer: FooterContent
  locale: Locale
  t: Dictionary
}

export function PropertiesIndex({ content, footer, locale, t }: PropertiesIndexProps) {
  const otherLocale = locale === 'en' ? 'es' : 'en'

  return (
    <div className="catalogue-page site-shell site-shell--with-mobile-bar">
      <header className="catalogue-header">
        <Link className="site-wordmark" href={`/${locale}`}>
          {t.siteName}
        </Link>
        <nav aria-label={t.nav.menu} className="catalogue-header__nav">
          <Link aria-current="page" href={`/${locale}/properties`}>
            {t.nav.properties}
          </Link>
          <Link href={`/${locale}/about`}>{t.nav.about}</Link>
          <Link href={`/${locale}/property-management`}>{t.nav.propertyManagement}</Link>
          <Link href={`/${locale}/contact`}>{t.nav.contact}</Link>
        </nav>
        <div className="catalogue-header__actions">
          <Link aria-label={t.language.switchTo} href={`/${otherLocale}/properties`}>
            {locale.toUpperCase()} / {otherLocale.toUpperCase()}
          </Link>
          <a
            className="button button--light"
            href={content.whatsappHref}
            rel="noreferrer"
            target="_blank"
          >
            {t.cta.whatsapp}
          </a>
        </div>
      </header>

      <main className="catalogue-main">
        <div className="catalogue-intro">
          <h1>{content.heading}</h1>
          <p>{content.introduction}</p>
        </div>
        <PropertiesCatalogue labels={t.catalogue} properties={content.properties} />
      </main>

      <section className="catalogue-cta">
        <div>
          <h2>{t.catalogue.ctaHeading}</h2>
          <p>{t.catalogue.ctaBody}</p>
        </div>
        <div className="catalogue-cta__actions">
          <a
            className="button button--light"
            href={content.whatsappHref}
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

      <SiteFooter
        content={footer}
        languageHref={`/${otherLocale}/properties`}
        locale={locale}
        t={t}
      />
      <MobileContactBar
        phoneHref={footer.contact.phoneHref}
        t={t}
        whatsappHref={content.whatsappHref}
      />
    </div>
  )
}
