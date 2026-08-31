import type { Dictionary } from '@/i18n/dictionaries/en'
import type { Locale } from '@/i18n'

import type { FooterContent, PropertyDetailContent, ReviewContent } from '../lib/phase2-content'
import { InquiryForm } from './InquiryForm'
import { MobileContactBar } from './MobileContactBar'
import { PropertyGallery } from './PropertyGallery'
import { PropertyMap } from './PropertyMap'
import { SleepingArrangements } from './SleepingArrangements'
import { SiteFooter } from './SiteFooter'
import { ThingsToKnow } from './ThingsToKnow'

type PropertyDetailProps = {
  content: PropertyDetailContent
  footer: FooterContent
  locale: Locale
  t: Dictionary
}

function PropertyReviews({ reviews }: { reviews: ReviewContent[] }) {
  return (
    <div className="property-reviews">
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

export function PropertyDetail({ content, footer, locale, t }: PropertyDetailProps) {
  const otherLocale = locale === 'en' ? 'es' : 'en'
  const otherPropertyPath = `/${otherLocale}/properties/${content.slug}`

  return (
    <div className="property-page site-shell--with-mobile-bar">
      <PropertyGallery
        backHref={`/${locale}/properties`}
        gallery={content.gallery}
        labels={content.labels}
        languageHref={otherPropertyPath}
        languageLabel={otherLocale.toUpperCase()}
        photosHref={`/${locale}/properties/${content.slug}/photos`}
      />

      <header className="property-titlebar">
        <div>
          <h1>{content.name}</h1>
          <p>{content.complexAndLocation}</p>
        </div>
        <ul aria-label={content.name}>
          {content.facts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      </header>

      <div className="property-layout">
        <main className="property-content">
          <section className="property-description">
            <p className="property-description__lead">{content.shortDescription}</p>
            {content.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>

          <SleepingArrangements
            arrangements={content.sleepingArrangements}
            heading={content.labels.whereYouSleep}
          />

          <section className="amenities-section">
            <h2>{content.labels.amenities}</h2>
            <div className="amenities-grid">
              {content.amenities.map((group) => (
                <article key={group.label}>
                  <h3>{group.label}</h3>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          {content.reviews.length ? (
            <section className="property-reviews-section">
              <div className="section-heading section-heading--split">
                <h2>{content.labels.reviews}</h2>
                <p>Airbnb · Booking.com · Vrbo · Expedia</p>
              </div>
              <PropertyReviews reviews={content.reviews} />
            </section>
          ) : null}

          <section className="neighborhood-section">
            <h2>{content.labels.neighborhood}</h2>
            <PropertyMap
              areaLabel={content.labels.approximateArea}
              center={content.map}
              locale={locale}
              openLabel={content.labels.openInGoogleMaps}
            />
            <p>{content.neighborhood}</p>
            <small>{content.labels.locationNote}</small>
          </section>

          <ThingsToKnow content={content.thingsToKnow} heading={content.labels.thingsToKnow} />

          <section className="property-mobile-inquiry">
            <h2>{content.inquiry.heading}</h2>
            <p>{content.inquiry.body}</p>
            <InquiryForm
              locale={locale}
              propertySlug={content.slug}
              source="property-form"
              t={t.inquiryForm}
            />
          </section>
        </main>

        <aside className="inquiry-card">
          <h2>{content.inquiry.heading}</h2>
          <p>{content.inquiry.body}</p>
          <a
            className="button button--dark"
            href={content.whatsappHref}
            rel="noreferrer"
            target="_blank"
          >
            {t.cta.whatsappHome}
          </a>
          <a className="button button--outline" href={footer.contact.phoneHref}>
            {t.cta.call} {footer.contact.phoneDisplay}
          </a>
          <a
            className="inquiry-card__link"
            href={`mailto:${footer.contact.email}?subject=${encodeURIComponent(content.name)}`}
          >
            {t.cta.inquiry}
          </a>
          <details className="inquiry-disclosure">
            <summary>{t.inquiryForm.open}</summary>
            <InquiryForm
              locale={locale}
              propertySlug={content.slug}
              source="property-form"
              t={t.inquiryForm}
            />
          </details>
          <hr />
          <small>{content.inquiry.platformNote}</small>
        </aside>
      </div>

      <SiteFooter content={footer} languageHref={otherPropertyPath} locale={locale} t={t} />
      <MobileContactBar
        phoneHref={footer.contact.phoneHref}
        t={t}
        whatsappHref={content.whatsappHref}
      />
    </div>
  )
}
