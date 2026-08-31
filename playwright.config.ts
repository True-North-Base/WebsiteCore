import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import 'dotenv/config'

const browserChannel = process.env.PLAYWRIGHT_CHANNEL === 'chrome' ? 'chrome' : 'chromium'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: browserChannel },
    },
  ],
  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER
    ? undefined
    : {
        command: 'node node_modules/next/dist/bin/next dev',
        // Keep the test runner's tsx loader out of the nested Next CLI process.
        env: {
          DATABASE_URL: process.env.PLAYWRIGHT_DATABASE_URL || '',
          NODE_OPTIONS: '--no-deprecation',
          R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID || '',
          R2_BUCKET: process.env.R2_BUCKET || '',
          R2_ENDPOINT: process.env.R2_ENDPOINT || '',
          R2_PUBLIC_URL: process.env.R2_PUBLIC_URL || '',
          R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY || '',
        },
        reuseExistingServer: true,
        url: 'http://localhost:3000',
      },
})
