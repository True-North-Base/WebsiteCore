import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('SEO endpoints, structured data, redirects and the bilingual 404 are connected', async ({
    page,
    request,
  }) => {
    const robotsResponse = await request.get('http://localhost:3000/robots.txt')
    expect(robotsResponse.status()).toBe(200)
    await expect(robotsResponse.text()).resolves.toContain('Disallow: /')

    const sitemapResponse = await request.get('http://localhost:3000/sitemap.xml')
    const sitemapXML = await sitemapResponse.text()
    expect(sitemapResponse.status()).toBe(200)
    expect(sitemapXML).toContain('https://www.crmariposarentals.com/en/properties/penthouse-lago')
    expect(sitemapXML).toContain('hreflang="es"')

    const redirectResponse = await request.get('http://localhost:3000/lago', {
      maxRedirects: 0,
    })
    expect(redirectResponse.status()).toBe(301)
    expect(redirectResponse.headers().location).toBe('/en/properties/penthouse-lago')

    await page.goto('http://localhost:3000/en/properties/penthouse-lago')
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent()
    expect(jsonLd).toContain('Accommodation')
    expect(jsonLd).toContain('BreadcrumbList')

    const notFoundResponse = await page.goto(
      'http://localhost:3000/en/properties/not-a-real-property',
    )
    expect(notFoundResponse?.status()).toBe(404)
    await expect(page.getByRole('heading', { name: 'This page has wandered away.' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Esta página tomó otro camino.' })).toBeVisible()
  })

  test('root redirects to /en and renders the homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveURL('http://localhost:3000/en')
    await expect(page).toHaveTitle(/Find your happy place in Costa Rica/)

    await expect(page.locator('h1').first()).toHaveText('Find your happy place in Costa Rica')
    await expect(page.getByRole('link', { name: 'Explore' }).first()).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Booked direct. Managed by the family who owns it.' }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', {
        name: 'The stay you hoped for. Beautiful homes, thoughtful care and honest value.',
      }),
    ).toBeVisible()
    const pacific = page.locator('#pacific')
    await expect(pacific.locator('.property-card')).toHaveCount(2)
    await expect(pacific.getByRole('heading', { name: 'Luxury Beachfront Villa' })).toBeVisible()
    await expect(
      pacific.getByRole('img', { name: 'Private pool in the tropical backyard' }),
    ).toBeVisible()
    await expect(
      pacific.getByRole('img', { name: 'Resort pool and palms glowing at sunset' }),
    ).toHaveCount(0)
  })

  test('Spanish homepage renders', async ({ page }) => {
    await page.goto('http://localhost:3000/es')

    await expect(page.locator('html')).toHaveAttribute('lang', 'es')
    await expect(page.locator('h1').first()).toHaveText('Encuentra tu lugar feliz en Costa Rica')
    await expect(page.getByRole('link', { name: 'Explorar' }).first()).toBeVisible()
    await expect(
      page.getByRole('heading', {
        name: 'Reserva directa. Administrado por la familia propietaria.',
      }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', {
        name: 'La estadía que imaginabas. Casas hermosas, atención cercana y un valor honesto.',
      }),
    ).toBeVisible()
  })

  test('bilingual catalogue filters and reveals all fourteen homes', async ({ page }) => {
    await page.goto('http://localhost:3000/en/properties')

    await expect(page.getByRole('heading', { name: 'Fourteen homes' })).toBeVisible()
    await expect(page.locator('.catalogue-grid .property-card')).toHaveCount(8)
    await page.getByRole('button', { name: 'Show 6 more homes' }).click()
    await expect(page.locator('.catalogue-grid .property-card')).toHaveCount(14)

    await page.getByRole('button', { name: 'Beach', exact: true }).click()
    await expect(page.locator('.catalogue-grid .property-card')).toHaveCount(2)
    await expect(page.getByRole('heading', { name: 'Playa Langosta' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Luxury Beachfront Villa' })).toBeVisible()

    await page.getByRole('link', { name: 'Español' }).first().click()
    await expect(page).toHaveURL(/\/es\/properties$/, { timeout: 20_000 })
    await expect(page.getByRole('heading', { name: 'Catorce casas' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Playa', exact: true })).toBeVisible()
  })

  test('bilingual editorial and contact pages are connected to the public navigation', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/en/about')
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'A more personal way to stay',
    )
    await expect(page.getByRole('link', { name: 'Property management' }).first()).toBeVisible()

    await page.getByRole('link', { name: 'Property management' }).first().click()
    await expect(page).toHaveURL(/\/en\/property-management$/, { timeout: 20_000 })
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Property management')

    await page.getByRole('link', { name: 'Contact', exact: true }).first().click()
    await expect(page).toHaveURL(/\/en\/contact$/, { timeout: 20_000 })
    await expect(page.getByRole('button', { name: 'Send inquiry' })).toBeVisible()

    await page.getByRole('link', { name: 'Español' }).first().click()
    await expect(page).toHaveURL(/\/es\/contact$/, { timeout: 20_000 })
    await expect(page.locator('html')).toHaveAttribute('lang', 'es')
    await expect(page.getByRole('button', { name: 'Enviar consulta' })).toBeVisible()
  })

  test('English property proof page renders without a booking engine', async ({ page }) => {
    await page.goto('http://localhost:3000/en/properties/penthouse-lago')

    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.locator('h1').first()).toHaveText('Penthouse Lago')
    await expect(page.getByRole('link', { name: 'WhatsApp about this home' }).first()).toBeVisible()
    await expect(page.getByText('Prefer a form? Send an inquiry').first()).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Where you’ll sleep' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Bedroom 1' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Bedroom 2' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Things to know' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Cancellation & terms' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Property rules' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Stay details' })).toBeVisible()
    const desktopThingsColumns = await page
      .locator('.things-grid')
      .evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length)
    expect(desktopThingsColumns).toBe(3)
    await expect(page.getByRole('link', { name: 'Open in Google Maps' })).toHaveAttribute(
      'href',
      /google\.com\/maps\/search/,
    )
    await expect(page.getByText('Link pending')).toHaveCount(6)
    await expect(page.getByText(/check availability/i)).toHaveCount(0)
  })

  test('Spanish property proof page renders', async ({ page }) => {
    await page.goto('http://localhost:3000/es/properties/penthouse-lago')

    await expect(page.locator('html')).toHaveAttribute('lang', 'es')
    await expect(page.locator('h1').first()).toHaveText('Penthouse Lago')
    await expect(
      page.getByRole('link', { name: 'Consultar esta casa por WhatsApp' }).first(),
    ).toBeVisible()
    await expect(page.getByText('¿Prefieres un formulario? Enviar consulta').first()).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Dónde dormirás' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Cancelación y condiciones' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Reglas de la propiedad' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Detalles de la estadía' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Abrir en Google Maps' })).toBeVisible()
    await expect(page.getByText('Enlace pendiente')).toHaveCount(6)
  })

  test('categorized property photo showcase renders in both languages', async ({ page }) => {
    await page.goto('http://localhost:3000/en/properties/penthouse-lago')
    const leadPhotoLink = page
      .locator('.property-gallery__mosaic')
      .getByRole('link', { name: 'View all photos: 1' })
    await expect(leadPhotoLink).toHaveAttribute('href', '/en/properties/penthouse-lago/photos')
    await leadPhotoLink.click()

    await expect(page).toHaveURL(/\/en\/properties\/penthouse-lago\/photos$/, {
      timeout: 15_000,
    })
    await expect(page.locator('h1')).toHaveText('Penthouse Lago')
    await expect(page.getByRole('heading', { name: 'Showcase' })).toBeVisible()
    await expect(page.getByRole('dialog', { name: 'Property gallery' })).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Exterior' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Living room' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Kitchen' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Bedrooms' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Amenities' })).toBeVisible()
    await expect(page.getByText(/reserve|availability/i)).toHaveCount(0)

    await page.locator('.photo-showcase__grid').getByRole('button').first().click()
    await expect(page.getByRole('dialog', { name: 'Property gallery' })).toBeVisible()
    await page.getByRole('button', { name: 'Close gallery' }).click()

    await page.getByRole('link', { name: 'ES' }).click()
    await expect(page).toHaveURL(/\/es\/properties\/penthouse-lago\/photos$/)
    await expect(page.getByRole('heading', { name: 'Selección' })).toBeVisible()
  })

  test('mobile discovery and property photography are touch-first', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('http://localhost:3000/en')

    const heroHeight = await page
      .locator('.home-hero')
      .evaluate((element) => Math.round(element.getBoundingClientRect().height))
    expect(heroHeight).toBeLessThanOrEqual(460)
    await expect(page.locator('.home-hero__image--mobile')).toHaveAttribute(
      'alt',
      'Pools and gardens overlooking Costa Rica’s Central Valley at sunset',
    )
    await expect(page.locator('.home-hero__shade')).toHaveCSS(
      'background-image',
      /linear-gradient/,
    )
    await expect(page.locator('.property-card').first()).toBeVisible()
    await expect(page.locator('.property-card__image').first()).toHaveCSS('border-radius', '18px')

    await page.goto('http://localhost:3000/en/properties/penthouse-lago')
    const mobileGallery = page.locator('.property-gallery__mobile')
    await expect(mobileGallery).toBeVisible()
    const mobilePhotoLink = mobileGallery.getByRole('link').first()
    await expect(mobilePhotoLink).toHaveAttribute('href', '/en/properties/penthouse-lago/photos')
    await mobilePhotoLink.click()

    await expect(page).toHaveURL(/\/en\/properties\/penthouse-lago\/photos$/, {
      timeout: 15_000,
    })
    await expect(page.getByRole('heading', { name: 'Showcase' })).toBeVisible()

    const viewer = page.getByRole('dialog', { name: 'Property gallery' })
    await expect(viewer).toHaveCount(0)
    await page.locator('.photo-showcase__grid').getByRole('button').first().click()
    await expect(viewer).toBeVisible()
    await expect(viewer.locator('.photo-viewer__previous')).toBeHidden()
    await expect(viewer.locator('.photo-viewer__next')).toBeHidden()
    await expect(viewer.locator('.photo-viewer__counter')).toHaveText('1 / 13')

    await viewer.locator('.photo-viewer__track').evaluate((track) => {
      track.scrollTo({ left: track.clientWidth })
    })
    await expect(viewer.locator('.photo-viewer__counter')).toHaveText('2 / 13')

    await page.getByRole('button', { name: 'Close gallery' }).click()
    await page.getByRole('link', { name: 'Back to property' }).click()
    const mobileThingsColumns = await page
      .locator('.things-grid')
      .evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length)
    expect(mobileThingsColumns).toBe(1)
    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    )
    expect(hasHorizontalOverflow).toBe(false)
  })
})
