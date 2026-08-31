import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { coreCollections, coreGlobals } from './modules/core'
import { getR2Config, getR2ObjectKey } from './modules/core/storage/r2'
import { rentalsCollections, rentalsGlobals } from './modules/rentals'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const r2 = getR2Config()
const databaseUrl = process.env.DATABASE_URL || ''

function usesLocalDatabase(value: string): boolean {
  if (!value) return false
  try {
    const hostname = new URL(value).hostname
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]'
  } catch {
    return false
  }
}

// Composition point: modules are wired together here and in src/app only.
export default buildConfig({
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [...coreCollections, ...rentalsCollections],
  globals: [...coreGlobals, ...rentalsGlobals],
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'Español', code: 'es' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    // UUIDs: stable external identity for every document (docs/DECISIONS.md D-008).
    idType: 'uuid',
    pool: {
      connectionString: databaseUrl,
    },
    // Drizzle push is a local-development convenience. Shared environments use reviewed migrations.
    push: usesLocalDatabase(databaseUrl),
  }),
  sharp,
  plugins: r2
    ? [
        s3Storage({
          bucket: r2.bucket,
          collections: {
            media: {
              disablePayloadAccessControl: true,
              generateFileURL: ({ filename: storedFilename, prefix }) =>
                getR2ObjectKey(storedFilename, prefix),
            },
          },
          config: {
            credentials: {
              accessKeyId: r2.accessKeyId,
              secretAccessKey: r2.secretAccessKey,
            },
            endpoint: r2.endpoint,
            forcePathStyle: true,
            region: 'auto',
          },
        }),
      ]
    : [],
})
