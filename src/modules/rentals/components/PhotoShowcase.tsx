'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import type { GalleryCategory, GalleryImage, PropertyDetailContent } from '../lib/phase2-content'
import { PhotoViewer } from './PhotoViewer'

const categoryOrder: GalleryCategory[] = [
  'exterior',
  'living-room',
  'kitchen',
  'bedroom',
  'amenities',
  'other',
]

type PhotoShowcaseProps = {
  gallery: GalleryImage[]
  languageHref: string
  languageLabel: string
  labels: PropertyDetailContent['labels']
  propertyHref: string
  propertyName: string
}

export function PhotoShowcase({
  gallery,
  languageHref,
  languageLabel,
  labels,
  propertyHref,
  propertyName,
}: PhotoShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState<'showcase' | GalleryCategory>('showcase')
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)
  const selectedShowcase = gallery.filter((image) => image.showcase)
  const showcase = selectedShowcase.length ? selectedShowcase : gallery.slice(0, 8)
  const availableCategories = categoryOrder.filter((category) =>
    gallery.some((image) => image.category === category),
  )
  const visibleImages =
    activeCategory === 'showcase'
      ? showcase
      : gallery.filter((image) => image.category === activeCategory)

  return (
    <div className="photo-showcase-page">
      <header className="photo-showcase__header">
        <Link aria-label={labels.backToProperty} className="photo-showcase__back" href={propertyHref}>
          ←
        </Link>
        <div>
          <h1>{propertyName}</h1>
          <p>{labels.photoShowcase}</p>
        </div>
        <Link aria-label={languageLabel} className="photo-showcase__language" href={languageHref}>
          {languageLabel}
        </Link>
      </header>

      <nav aria-label={labels.photoShowcase} className="photo-showcase__tabs">
        {(['showcase', ...availableCategories] as const).map((category) => (
          <button
            aria-current={activeCategory === category ? 'page' : undefined}
            className={activeCategory === category ? 'is-active' : ''}
            key={category}
            onClick={() => setActiveCategory(category)}
            type="button"
          >
            {labels.photoCategories[category]}
          </button>
        ))}
      </nav>

      <main className="photo-showcase__content">
        <h2>{labels.photoCategories[activeCategory]}</h2>
        <div className="photo-showcase__grid">
          {visibleImages.map((image, index) => (
            <button
              aria-label={`${labels.viewPhotos}: ${index + 1}`}
              key={`${image.src}-${index}`}
              onClick={() => setViewerIndex(gallery.indexOf(image))}
              type="button"
            >
              <Image
                alt={image.alt}
                fill
                loading={index < 4 ? 'eager' : 'lazy'}
                sizes="(max-width: 640px) 46vw, (max-width: 1040px) 31vw, 360px"
                src={image.src}
              />
            </button>
          ))}
        </div>
      </main>

      {viewerIndex === null ? null : (
        <PhotoViewer
          gallery={gallery}
          initialIndex={viewerIndex}
          labels={labels}
          onClose={() => setViewerIndex(null)}
        />
      )}
    </div>
  )
}
