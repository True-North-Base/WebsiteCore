import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { coreCollections, coreGlobals } from './modules/core'
import { rentalsCollections, rentalsGlobals } from './modules/rentals'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

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
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})
