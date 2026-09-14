import type { NextConfig } from 'next'

type HeaderRule = Awaited<ReturnType<NonNullable<NextConfig['headers']>>>[number]

/** Payload's theme negotiation is useful in admin, but restarts first public visits. */
export function scopePayloadThemeHeaders(rules: HeaderRule[]): HeaderRule[] {
  return rules.flatMap((rule) => {
    if (rule.source !== '/:path*') return [rule]

    const isThemeHint = (header: HeaderRule['headers'][number]) =>
      ['accept-ch', 'critical-ch', 'vary'].includes(header.key.toLowerCase()) &&
      header.value === 'Sec-CH-Prefers-Color-Scheme'
    const hints = rule.headers.filter(isThemeHint)
    if (!hints.length) return [rule]

    const remaining = rule.headers.filter((header) => !isThemeHint(header))
    return [
      ...(remaining.length ? [{ ...rule, headers: remaining }] : []),
      { ...rule, source: '/admin/:path*', headers: hints },
    ]
  })
}
