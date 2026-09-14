import Image from 'next/image'
import Link from 'next/link'

import type { Dictionary } from '@/i18n/dictionaries/en'
import type { Locale } from '@/i18n'

import type { FooterContent, HomeContent, ReviewContent } from '../lib/phase2-content'
import { FeatureIcon } from './FeatureIcon'
import { HomeHeroImage } from './HomeHeroImage'
import { InquiryForm } from './InquiryForm'
import { MobileContactBar } from './MobileContactBar'
import { PropertyCarousel } from './PropertyCarousel'
import { SiteFooter } from './SiteFooter'

type HomePreviewProps = {
  content: HomeContent
  footer: FooterContent
  locale: Locale
  t: Dictionary
}

function Reviews({ reviews }: { reviews: ReviewContent[] }) {
  return (
    <div className="reviews-grid">
      {reviews.map((review) => (
        <article className="review" key={review.attribution}>
          <div aria-label="5 / 5" className="review__stars">
            ★★★★★
          </div>
          <blockquote>{review.quote}</blockquote>
          <p>{review.attribution}</p>
        </article>
      ))}
    </div>
  )
}

export function HomePreview({ content, footer, locale, t }: HomePreviewProps) {
  const otherLocale = locale === 'en' ? 'es' : 'en'

  return (
    <div className="site-shell site-shell--with-mobile-bar">
      <header className="site-header">
        <Link className="site-wordmark" href={`/${locale}`}>
          {t.siteName}
        </Link>
        <Link className="discovery-bar discovery-bar--desktop" href={`/${locale}/properties`}>
          <span>
            <small>{t.discovery.where}</small>
            {t.discovery.locationSummary}
          </span>
          <span>
            <small>{t.discovery.guests}</small>
            {t.discovery.guestSummary}
          </span>
          <strong>{t.cta.explore}</strong>
        </Link>
        <div className="site-header__actions">
          <Link aria-label={t.language.switchTo} href={`/${otherLocale}`}>
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
          <details className="site-menu">
            <summary aria-label={t.nav.menu}>
              <span />
              <span />
            </summary>
            <nav aria-label={t.nav.menu}>
              <Link href={`/${locale}/properties`}>{t.nav.properties}</Link>
              <Link href={`/${locale}/about`}>{t.nav.about}</Link>
              <Link href={`/${locale}/property-management`}>{t.nav.propertyManagement}</Link>
              <Link href={`/${locale}/contact`}>{t.nav.contact}</Link>
            </nav>
          </details>
        </div>
      </header>

      <main>
        <section className="home-hero">
          <HomeHeroImage hero={content.hero} />
          <div className="home-hero__shade" />
          <div className="home-hero__copy">
            <h1>{content.hero.title}</h1>
            <p>{content.hero.subtitle}</p>
          </div>
          <Link className="discovery-bar discovery-bar--mobile" href={`/${locale}/properties`}>
            <span>
              <small>
                {t.discovery.where} · {t.discovery.guests}
              </small>
              {t.discovery.locationSummary} · {t.discovery.guestSummary}
            </span>
            <strong>{t.cta.explore}</strong>
          </Link>
        </section>

        <PropertyCarousel
          ariaLabel={content.featured.title}
          id="homes"
          labels={t.carousel}
          properties={content.featured.properties}
          title={content.featured.title}
        />

        <PropertyCarousel
          ariaLabel={content.pacific.title}
          id="pacific"
          intro={content.pacific.intro}
          labels={t.carousel}
          properties={content.pacific.properties}
          title={content.pacific.title}
        />

        <section className="reviews-section" id="reviews">
          <div className="section-heading section-heading--split">
            <h2>{content.reviews.title}</h2>
            <p>{content.reviews.proof}</p>
          </div>
          <Reviews reviews={content.reviews.reviews} />
        </section>

        <section className="difference-section" id="difference">
          <div className="difference-section__story">
            <p className="eyebrow">{content.difference.eyebrow}</p>
            <h2>
              {content.difference.title}
              <span>{content.difference.titleMuted}</span>
            </h2>
            <div className="difference-section__image">
              <Image
                alt={content.difference.imageAlt}
                fill
                sizes="(max-width: 800px) 100vw, 44vw"
                src={content.difference.image}
              />
            </div>
          </div>
          <div className="feature-grid">
            {content.difference.features.map((feature) => (
              <article className="feature" key={feature.title}>
                <div className="feature__icon">
                  <FeatureIcon name={feature.icon} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="hospitality-section" aria-labelledby="hospitality-heading">
          <div className="hospitality-section__story">
            <p className="eyebrow">{content.hospitalityDifference.eyebrow}</p>
            <h2 id="hospitality-heading">
              {content.hospitalityDifference.title}
              <span>{content.hospitalityDifference.titleMuted}</span>
            </h2>
            <div className="hospitality-section__image">
              <Image
                alt={content.hospitalityDifference.imageAlt}
                fill
                sizes="(max-width: 800px) 100vw, 36vw"
                src={content.hospitalityDifference.image}
              />
            </div>
          </div>
          <div className="hospitality-feature-grid">
            {content.hospitalityDifference.features.map((feature) => (
              <article className="hospitality-feature" key={feature.title}>
                <div className="hospitality-feature__icon">
                  <FeatureIcon name={feature.icon} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="contact-cta">
          <div>
            <h2>{content.contact.heading}</h2>
            <p>{content.contact.body}</p>
          </div>
          <div className="contact-cta__actions">
            <a
              className="button button--dark"
              href={content.whatsappHref}
              rel="noreferrer"
              target="_blank"
            >
              {t.cta.whatsapp}
            </a>
            <a className="button button--outline" href={footer.contact.phoneHref}>
              {t.cta.call}
            </a>
            <details className="inquiry-disclosure">
              <summary>{t.inquiryForm.open}</summary>
              <InquiryForm locale={locale} source="contact-form" t={t.inquiryForm} />
            </details>
          </div>
        </section>
      </main>

      <SiteFooter content={footer} locale={locale} t={t} />
      <MobileContactBar
        phoneHref={footer.contact.phoneHref}
        t={t}
        whatsappHref={content.whatsappHref}
      />
    </div>
  )
}
