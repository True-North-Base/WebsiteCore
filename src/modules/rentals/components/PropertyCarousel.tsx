'use client'

import { useRef } from 'react'

import type { Dictionary } from '@/i18n/dictionaries/en'

import type { PropertyCardContent } from '../lib/phase2-content'
import { PropertyCard } from './PropertyCard'

type PropertyCarouselProps = {
  ariaLabel: string
  id: string
  intro?: string
  labels: Dictionary['carousel']
  properties: PropertyCardContent[]
  title: string
}

export function PropertyCarousel({
  ariaLabel,
  id,
  intro,
  labels,
  properties,
  title,
}: PropertyCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  function move(direction: -1 | 1) {
    trackRef.current?.scrollBy({ behavior: 'smooth', left: direction * 568 })
  }

  return (
    <section className="property-collection" id={id}>
      <div className="property-collection__heading">
        <div className="property-collection__title">
          <h2>{title}</h2>
          {intro ? <p>{intro}</p> : null}
        </div>
        <div className="property-collection__controls">
          <button aria-label={labels.previous} onClick={() => move(-1)} type="button">
            ←
          </button>
          <button aria-label={labels.next} onClick={() => move(1)} type="button">
            →
          </button>
        </div>
      </div>
      <div aria-label={ariaLabel} className="property-track" ref={trackRef} role="region" tabIndex={0}>
        {properties.map((property) => (
          <PropertyCard key={property.name} property={property} />
        ))}
      </div>
    </section>
  )
}
