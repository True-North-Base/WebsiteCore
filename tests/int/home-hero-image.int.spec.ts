import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { HomeHeroImage } from '../../src/modules/rentals/components/HomeHeroImage'
import { getHomeContent } from '../../src/modules/rentals/lib/phase2-content'

describe('homepage hero image discovery', () => {
  it('renders one eager high-priority image with an art-directed mobile source', () => {
    const hero = {
      ...getHomeContent('en').hero,
      image: '/images/desktop.png',
      mobileImage: '/images/mobile.png',
    }
    const container = document.createElement('div')
    container.innerHTML = renderToStaticMarkup(createElement(HomeHeroImage, { hero }))

    expect(container.querySelectorAll('img')).toHaveLength(1)
    const image = container.querySelector('img')
    expect(image?.getAttribute('loading')).toBe('eager')
    expect(image?.getAttribute('fetchpriority')).toBe('high')
    expect(image?.getAttribute('alt')).toBe(hero.imageAlt)
    expect(image?.getAttribute('srcset')).toContain('desktop.png')
    const mobile = container.querySelector('source')
    expect(mobile?.getAttribute('media')).toBe('(max-width: 640px)')
    expect(mobile?.getAttribute('srcset')).toContain('mobile.png')
  })
})
