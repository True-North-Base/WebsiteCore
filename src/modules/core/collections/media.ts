import type { CollectionConfig } from 'payload'

import { anyone, isLoggedIn } from '../access'
import {
  getR2Config,
  materializeR2MediaURLs,
  normalizeR2MediaStorageKeys,
} from '../storage/r2'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Content',
  },
  access: {
    read: anyone,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        const r2 = getR2Config()
        return r2 ? normalizeR2MediaStorageKeys(data, r2.publicURL) : data
      },
    ],
    afterRead: [
      ({ doc }) => {
        const r2 = getR2Config()
        return r2 ? materializeR2MediaURLs(doc, r2.publicURL) : doc
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description:
          'Describe the image for search engines and screen readers, e.g. "Living room with lake view at Penthouse Lago".',
      },
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
    },
  ],
  upload: {
    // Dev: local ./media (gitignored). Production storage moves to R2 in Phase 5
    // via @payloadcms/storage-s3 — nothing else in the app may assume local files.
    mimeTypes: ['image/*'],
    adminThumbnail: 'thumbnail',
    imageSizes: [
      { name: 'thumbnail', width: 320 },
      { name: 'card', width: 900, height: 900, position: 'centre' },
      { name: 'large', width: 1600 },
      { name: 'hero', width: 2200 },
    ],
  },
}
