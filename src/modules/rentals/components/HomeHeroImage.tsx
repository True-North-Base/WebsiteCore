import { getImageProps } from 'next/image'

import type { HomeContent } from '../lib/phase2-content'

/** One eager request, selected by the browser before CSS or hydration. */
export function HomeHeroImage({ hero }: { hero: HomeContent['hero'] }) {
  const common = {
    alt: hero.imageAlt,
    fill: true,
    fetchPriority: 'high' as const,
    loading: 'eager' as const,
    sizes: '100vw',
  }
  const { props: desktop } = getImageProps({ ...common, src: hero.image })
  const { props: mobile } = getImageProps({ ...common, src: hero.mobileImage })

  return (
    <picture>
      <source media="(max-width: 640px)" sizes={mobile.sizes} srcSet={mobile.srcSet} />
      {/* Art direction needs a native img; getImageProps retains Next image optimization. */}
      <img {...desktop} alt={hero.imageAlt} className="home-hero__image" />
    </picture>
  )
}
