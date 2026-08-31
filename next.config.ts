import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

import { getR2Config, getR2ImageRemotePattern } from './src/modules/core/storage/r2'
import { legacyRedirects } from './src/modules/rentals/lib/legacy-redirects'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)
const r2 = getR2Config()

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1'],
  redirects: async () => [
    { source: '/', destination: '/en', permanent: false },
    ...legacyRedirects,
  ],
  experimental: {
    globalNotFound: true,
  },
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      {
        pathname: '/images/**',
      },
    ],
    remotePatterns: r2 ? [getR2ImageRemotePattern(r2.publicURL)] : [],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
