import Image from 'next/image'
import Link from 'next/link'

import type { PropertyCardContent } from '../lib/phase2-content'

export function PropertyCard({
  property,
  variant = 'carousel',
}: {
  property: PropertyCardContent
  variant?: 'carousel' | 'catalogue'
}) {
  const content = (
    <>
      <div className="property-card__image">
        <Image
          alt={property.alt}
          className="property-card__photo"
          fill
          sizes={
            variant === 'catalogue'
              ? '(max-width: 720px) calc(100vw - 40px), (max-width: 1200px) calc(50vw - 52px), 560px'
              : '(max-width: 640px) 230px, 264px'
          }
          src={property.image}
          unoptimized
        />
        {property.badge ? <span className="property-card__badge">{property.badge}</span> : null}
      </div>
      <div className="property-card__title-row">
        <h3>{property.name}</h3>
        {property.rating ? (
          <span className="property-card__rating" aria-label={`${property.rating} / 5`}>
            ★ {property.rating}
          </span>
        ) : null}
      </div>
      <p className="property-card__facts">
        {property.bedrooms} · {property.bathrooms}
      </p>
      <p className="property-card__location">{property.location}</p>
    </>
  )

  return property.href ? (
    <Link className={`property-card property-card--${variant}`} href={property.href}>
      {content}
    </Link>
  ) : (
    <article className={`property-card property-card--${variant}`}>{content}</article>
  )
}
