import type { MetadataRoute } from 'next'

import { productionSiteURL } from '@/modules/rentals/lib/seo'

function normalizeURL(value: string | undefined): string | undefined {
  return value?.replace(/\/+$/, '')
}

export default function robots(): MetadataRoute.Robots {
  const isCanonicalProduction =
    normalizeURL(process.env.NEXT_PUBLIC_SERVER_URL) === productionSiteURL

  if (!isCanonicalProduction) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }

  return {
    host: productionSiteURL,
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${productionSiteURL}/sitemap.xml`,
  }
}
