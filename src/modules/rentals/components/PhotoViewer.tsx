'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import type { GalleryImage, PropertyDetailContent } from '../lib/phase2-content'

type PhotoViewerProps = {
  gallery: GalleryImage[]
  initialIndex: number
  labels: Pick<
    PropertyDetailContent['labels'],
    'closeGallery' | 'gallery' | 'nextPhoto' | 'previousPhoto'
  >
  onClose: () => void
}

export function PhotoViewer({ gallery, initialIndex, labels, onClose }: PhotoViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(initialIndex)

  useEffect(() => {
    const dialog = dialogRef.current
    const track = trackRef.current
    if (!dialog || !track) return

    dialog.showModal()
    const frame = requestAnimationFrame(() => {
      track.scrollTo({ left: track.clientWidth * initialIndex })
    })

    return () => cancelAnimationFrame(frame)
  }, [initialIndex])

  function close() {
    dialogRef.current?.close()
  }

  function move(direction: -1 | 1) {
    const nextIndex = (activeIndex + direction + gallery.length) % gallery.length
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setActiveIndex(nextIndex)
    trackRef.current?.scrollTo({
      behavior: reduceMotion ? 'auto' : 'smooth',
      left: (trackRef.current?.clientWidth || 0) * nextIndex,
    })
  }

  function updateIndex() {
    const track = trackRef.current
    if (!track || track.clientWidth === 0) return
    const nextIndex = Math.round(track.scrollLeft / track.clientWidth)
    if (nextIndex !== activeIndex && nextIndex >= 0 && nextIndex < gallery.length) {
      setActiveIndex(nextIndex)
    }
  }

  return (
    <dialog
      aria-label={labels.gallery}
      className="photo-viewer"
      onCancel={(event) => {
        event.preventDefault()
        close()
      }}
      onClose={onClose}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') move(-1)
        if (event.key === 'ArrowRight') move(1)
      }}
      ref={dialogRef}
    >
      <div className="photo-viewer__track" onScroll={updateIndex} ref={trackRef}>
        {gallery.map((image, index) => (
          <figure className="photo-viewer__slide" key={`${image.src}-${index}`}>
            <Image
              alt={image.alt}
              fill
              loading={index === initialIndex ? 'eager' : 'lazy'}
              sizes="100vw"
              src={image.src}
            />
          </figure>
        ))}
      </div>

      <button aria-label={labels.closeGallery} className="photo-viewer__close" onClick={close} type="button">
        ×
      </button>
      <button
        aria-label={labels.previousPhoto}
        className="photo-viewer__previous"
        onClick={() => move(-1)}
        type="button"
      >
        ←
      </button>
      <button aria-label={labels.nextPhoto} className="photo-viewer__next" onClick={() => move(1)} type="button">
        →
      </button>
      <p aria-live="polite" className="photo-viewer__counter">
        {activeIndex + 1} / {gallery.length}
      </p>
    </dialog>
  )
}
