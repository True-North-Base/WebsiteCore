import path from 'node:path'

import { expect, test } from '@playwright/test'

type AxeWindow = Window & {
  axe: {
    run: (
      root: Document,
      options: { runOnly: { type: 'tag'; values: string[] } },
    ) => Promise<{
      violations: Array<{
        description: string
        help: string
        id: string
        nodes: Array<{ target: string[] }>
      }>
    }>
  }
}

const axePath = path.resolve(process.cwd(), 'node_modules/axe-core/axe.min.js')

test.describe('WCAG 2.1 AA', () => {
  test.setTimeout(120_000)

  test('representative English and Spanish templates have no automated violations', async ({
    page,
  }) => {
    const routes = [
      '/en',
      '/es',
      '/en/properties',
      '/en/about',
      '/en/property-management',
      '/en/contact',
      '/es/contact',
      '/en/properties/penthouse-lago',
      '/en/properties/penthouse-lago/photos',
    ]

    for (const route of routes) {
      await page.goto(`http://localhost:3000${route}`)
      await page.addScriptTag({ path: axePath })
      const violations = await page.evaluate(async () => {
        const results = await (window as unknown as AxeWindow).axe.run(document, {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
          },
        })

        return results.violations.map(({ description, help, id, nodes }) => ({
          description,
          help,
          id,
          targets: nodes.map((node) => node.target.join(' ')),
        }))
      })

      expect(violations, `${route}: ${JSON.stringify(violations, null, 2)}`).toEqual([])
    }
  })
})
