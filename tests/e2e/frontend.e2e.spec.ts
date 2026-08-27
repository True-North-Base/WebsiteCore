import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('root redirects to /en and renders the homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveURL('http://localhost:3000/en')
    await expect(page).toHaveTitle(/CR Mariposa/)

    const heading = page.locator('h1').first()
    await expect(heading).toHaveText('CR Mariposa')
  })

  test('Spanish homepage renders', async ({ page }) => {
    await page.goto('http://localhost:3000/es')

    await expect(page.locator('html')).toHaveAttribute('lang', 'es')
    await expect(page.locator('h1').first()).toHaveText('CR Mariposa')
  })
})
