import { describe, expect, it } from 'vitest'

import { scopePayloadThemeHeaders } from '../../src/modules/core/hosting/payload-admin-headers'

describe('Payload admin theme headers', () => {
  it('scopes theme negotiation to admin while preserving unrelated public headers', () => {
    const poweredBy = { key: 'X-Powered-By', value: 'Next.js, Payload' }
    const hints = ['Accept-CH', 'Vary', 'Critical-CH'].map((key) => ({
      key,
      value: 'Sec-CH-Prefers-Color-Scheme',
    }))
    const custom = { source: '/images/:path*', headers: [{ key: 'Cache-Control', value: 'max-age=60' }] }

    expect(scopePayloadThemeHeaders([
      custom,
      { source: '/:path*', headers: [...hints, poweredBy] },
    ])).toEqual([
      custom,
      { source: '/:path*', headers: [poweredBy] },
      { source: '/admin/:path*', headers: hints },
    ])
  })

  it('does not rewrite other client hints or existing scoped rules', () => {
    const rules = [
      { source: '/:path*', headers: [{ key: 'Vary', value: 'Accept-Encoding' }] },
      { source: '/admin/:path*', headers: [{ key: 'Accept-CH', value: 'Sec-CH-Prefers-Color-Scheme' }] },
    ]
    expect(scopePayloadThemeHeaders(rules)).toEqual(rules)
  })
})
