import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

import { getR2Config, getR2ImageRemotePattern } from './src/modules/core/storage/r2'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)
const r2 = getR2Config()

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1'],
  redirects: async () => [
    // Locale routing: the site lives under /en and /es. Full legacy
    // Squarespace redirects are added in Phase 6 (docs/CONTENT_MODEL.md).
    { source: '/', destination: '/en', permanent: false },
  ],
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
