'use client'

import { useState } from 'react'

import type { Dictionary } from '@/i18n/dictionaries/en'

import type { CataloguePropertyCardContent, PropertyCatalogueArea } from '../lib/phase2-content'
import { PropertyCard } from './PropertyCard'

type Filter = 'all' | PropertyCatalogueArea

type PropertiesCatalogueProps = {
  labels: Dictionary['catalogue']
  properties: CataloguePropertyCardContent[]
}

const INITIAL_VISIBLE = 8

export function PropertiesCatalogue({ labels, properties }: PropertiesCatalogueProps) {
  const [filter, setFilter] = useState<Filter>('all')
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)
  const filters: { label: string; value: Filter }[] = [
    { label: labels.all, value: 'all' },
    { label: labels.santaAna, value: 'santa-ana' },
    { label: labels.escazu, value: 'escazu' },
    { label: labels.beach, value: 'beach' },
  ]
  const filtered =
    filter === 'all' ? properties : properties.filter((property) => property.area === filter)
  const visible = filtered.slice(0, visibleCount)
  const remaining = filtered.length - visible.length
  const resultText = labels.results
    .replace('{visible}', String(visible.length))
    .replace('{total}', String(filtered.length))

  function selectFilter(value: Filter) {
    setFilter(value)
    setVisibleCount(INITIAL_VISIBLE)
  }

  return (
    <>
      <div aria-label={labels.filters} className="catalogue-filters" role="group">
        {filters.map((item) => (
          <button
            aria-pressed={filter === item.value}
            className={filter === item.value ? 'is-active' : undefined}
            key={item.value}
            onClick={() => selectFilter(item.value)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="sr-only">
        {resultText}
      </p>

      <div className="catalogue-grid">
        {visible.map((property) => (
          <PropertyCard
            key={property.href || property.name}
            property={property}
            variant="catalogue"
          />
        ))}
      </div>

      {remaining > 0 ? (
        <button
          className="catalogue-show-more"
          onClick={() => setVisibleCount(filtered.length)}
          type="button"
        >
          {labels.showMore.replace('{count}', String(remaining))}
        </button>
      ) : null}
    </>
  )
}
