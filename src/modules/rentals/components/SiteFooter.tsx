import Link from 'next/link'

import type { Dictionary } from '@/i18n/dictionaries/en'
import type { Locale } from '@/i18n'

import type { FooterContent } from '../lib/phase2-content'

type SiteFooterProps = {
  content: FooterContent
  languageHref?: string
  locale: Locale
  t: Dictionary
}

function toHomeSection(locale: Locale, href: string): string {
  if (href.startsWith('#')) return `/${locale}${href}`
  if (href.startsWith('/') && !href.startsWith(`/${locale}/`)) return `/${locale}${href}`
  return href
}

export function SiteFooter({ content, languageHref, locale, t }: SiteFooterProps) {
  const otherLocale = locale === 'en' ? 'es' : 'en'
  const linkedPlatforms = content.platforms.filter((platform) => platform.href)

  return (
    <footer className="site-footer" id="contact">
      {linkedPlatforms.length ? (
        <div className="site-footer__platforms">
          <strong>{content.findUsOn}</strong>
          {linkedPlatforms.map((platform) =>
            platform.href ? (
            <a
              className="site-footer__platform"
              href={platform.href}
              key={platform.label}
              rel="noreferrer"
              target="_blank"
            >
              {platform.label} <span aria-hidden="true">↗</span>
            </a>
            ) : null,
          )}
        </div>
      ) : null}
      <div className="site-footer__grid">
        <div className="site-footer__brand">
          <Link className="site-wordmark site-wordmark--dark" href={`/${locale}`}>
            {t.siteName}
          </Link>
          <p>{content.intro}</p>
        </div>
        <div className="site-footer__column">
          <h2>{content.stayHeading}</h2>
          {content.stay.map((link) => (
            <a href={toHomeSection(locale, link.href)} key={link.label}>
              {link.label}
            </a>
          ))}
        </div>
        <div className="site-footer__column">
          <h2>{content.companyHeading}</h2>
          {content.company.map((link) => (
            <a href={toHomeSection(locale, link.href)} key={link.label}>
              {link.label}
            </a>
          ))}
          <Link href={`/${locale}/privacy`}>{t.privacy.title}</Link>
        </div>
        <div className="site-footer__column">
          <h2>{content.touchHeading}</h2>
          <a href={`https://wa.me/${content.contact.whatsappNumber}`}>
            WhatsApp {content.contact.phoneDisplay}
          </a>
          <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a>
          <span>{content.location}</span>
          <div className="site-footer__language">
            <span>{locale.toUpperCase()}</span>
            <span>/</span>
            <Link aria-label={t.language.switchTo} href={languageHref ?? `/${otherLocale}`}>
              {otherLocale.toUpperCase()}
            </Link>
          </div>
        </div>
      </div>
      <div className="site-footer__baseline">
        <strong>{content.tagline}</strong>
        <span>{content.copyright}</span>
      </div>
    </footer>
  )
}
