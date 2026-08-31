'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'

import type { GalleryImage, PropertyDetailContent } from '../lib/phase2-content'

type PropertyGalleryProps = {
  backHref: string
  gallery: GalleryImage[]
  languageHref: string
  languageLabel: string
  labels: PropertyDetailContent['labels']
  photosHref: string
}

export function PropertyGallery({
  backHref,
  gallery,
  languageHref,
  languageLabel,
  labels,
  photosHref,
}: PropertyGalleryProps) {
  const mobileTrackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  function updateMobileIndex() {
    const track = mobileTrackRef.current
    if (!track || track.clientWidth === 0) return
    setActiveIndex(Math.round(track.scrollLeft / track.clientWidth))
  }

  return (
    <section aria-label={labels.gallery} className="property-gallery">
      <div className="property-gallery__mosaic">
        {gallery.slice(0, 5).map((image, index) => (
          <Link
            aria-label={`${labels.viewPhotos}: ${index + 1}`}
            href={photosHref}
            key={`${image.src}-${index}`}
          >
            <Image
              alt={image.alt}
              fill
              loading={index === 0 ? 'eager' : 'lazy'}
              sizes={
                index === 0
                  ? '(max-width: 800px) 1px, 50vw'
                  : '(max-width: 800px) 1px, 25vw'
              }
              src={image.src}
            />
          </Link>
        ))}
      </div>

      <div className="property-gallery__mobile" onScroll={updateMobileIndex} ref={mobileTrackRef}>
        {gallery.map((image, index) => (
          <Link
            aria-label={`${labels.viewPhotos}: ${index + 1}`}
            href={photosHref}
            key={`${image.src}-${index}`}
          >
            <Image
              alt={image.alt}
              fill
              loading={index === 0 ? 'eager' : 'lazy'}
              sizes="(max-width: 800px) calc(100vw - 15px), 1px"
              src={image.src}
            />
          </Link>
        ))}
      </div>

      <div className="property-gallery__topbar">
        <Link href={backHref}>← {labels.allHomes}</Link>
        <div>
          <Link aria-label={languageLabel} href={languageHref}>
            {languageLabel}
          </Link>
          <Link
            aria-label={`${labels.showAllPhotos}: ${gallery.length}`}
            className="property-gallery__view-link"
            href={photosHref}
          >
            <span className="property-gallery__view-label">{labels.showAllPhotos}</span>
          </Link>
        </div>
      </div>

      <Link
        aria-label={`${labels.showAllPhotos}: ${gallery.length}`}
        className="property-gallery__photo-count"
        href={photosHref}
      >
        {activeIndex + 1} / {gallery.length}
      </Link>

      <div className="property-gallery__progress" aria-hidden="true">
        {gallery.slice(0, 4).map((image, index) => (
          <span
            className={index === Math.min(3, Math.floor((activeIndex * 4) / gallery.length)) ? 'is-active' : ''}
            key={`${image.src}-${index}`}
          />
        ))}
      </div>
    </section>
  )
}
