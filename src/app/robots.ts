import type { MetadataRoute } from 'next'

import { allowsIndexing } from '@/modules/core/hosting/indexing'
import { productionSiteURL } from '@/modules/rentals/lib/seo'

export default function robots(): MetadataRoute.Robots {
  if (!allowsIndexing(productionSiteURL)) {
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
