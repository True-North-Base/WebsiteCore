import { chromium } from '@playwright/test'

const baseURL = process.env.PERFORMANCE_BASE_URL || 'http://127.0.0.1:3000'
const routes = ['/en', '/en/properties/penthouse-lago']
const runs = Number(process.env.PERFORMANCE_RUNS || 3)

function median(values) {
  return [...values].sort((left, right) => left - right)[Math.floor(values.length / 2)]
}

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const results = {}

try {
  for (const route of routes) {
    const samples = []

    for (let run = 0; run < runs; run += 1) {
      const context = await browser.newContext({
        deviceScaleFactor: 1,
        isMobile: true,
        viewport: { height: 844, width: 390 },
      })
      const page = await context.newPage()
      const session = await context.newCDPSession(page)

      await session.send('Network.enable')
      await session.send('Network.setCacheDisabled', { cacheDisabled: true })
      await session.send('Network.emulateNetworkConditions', {
        connectionType: 'cellular4g',
        downloadThroughput: 1_600_000 / 8,
        latency: 150,
        offline: false,
        uploadThroughput: 750_000 / 8,
      })
      await session.send('Emulation.setCPUThrottlingRate', { rate: 4 })

      await page.addInitScript(() => {
        window.__mariposaVitals = { cls: 0, lcp: 0 }
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          window.__mariposaVitals.lcp = entries.at(-1)?.startTime || 0
        }).observe({ buffered: true, type: 'largest-contentful-paint' })
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) window.__mariposaVitals.cls += entry.value
          }
        }).observe({ buffered: true, type: 'layout-shift' })
      })

      await page.goto(`${baseURL}${route}`, { waitUntil: 'load' })
      await page.waitForTimeout(1_000)
      samples.push(
        await page.evaluate(() => {
          const navigation = performance.getEntriesByType('navigation')[0]
          const paints = Object.fromEntries(
            performance.getEntriesByType('paint').map((entry) => [entry.name, entry.startTime]),
          )
          const resources = performance.getEntriesByType('resource')
          const largestResources = resources
            .map((entry) => ({
              kb: Math.round((entry.transferSize || 0) / 1024),
              name: new URL(entry.name).pathname,
              type: entry.initiatorType,
            }))
            .sort((left, right) => right.kb - left.kb)
            .slice(0, 5)

          return {
            cls: Number(window.__mariposaVitals.cls.toFixed(3)),
            domContentLoadedMs: Math.round(navigation.domContentLoadedEventEnd),
            fcpMs: Math.round(paints['first-contentful-paint'] || 0),
            lcpMs: Math.round(window.__mariposaVitals.lcp),
            loadMs: Math.round(navigation.loadEventEnd),
            largestResources,
            requests: resources.length,
            transferKB: Math.round(
              resources.reduce((total, entry) => total + (entry.transferSize || 0), 0) / 1024,
            ),
          }
        }),
      )

      await context.close()
    }

    results[route] = {
      median: {
        cls: median(samples.map((sample) => sample.cls)),
        domContentLoadedMs: median(samples.map((sample) => sample.domContentLoadedMs)),
        fcpMs: median(samples.map((sample) => sample.fcpMs)),
        lcpMs: median(samples.map((sample) => sample.lcpMs)),
        loadMs: median(samples.map((sample) => sample.loadMs)),
        requests: median(samples.map((sample) => sample.requests)),
        transferKB: median(samples.map((sample) => sample.transferKB)),
      },
      samples,
    }
  }
} finally {
  await browser.close()
}

console.log(
  JSON.stringify(
    {
      conditions: '390x844, DPR 1, 4x CPU slowdown, 1.6 Mbps down / 750 Kbps up / 150 ms RTT',
      results,
    },
    null,
    2,
  ),
)
