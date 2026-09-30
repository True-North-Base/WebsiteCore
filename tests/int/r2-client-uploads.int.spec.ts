import { s3Storage } from '@payloadcms/storage-s3'
import type { PayloadRequest } from 'payload'
import { describe, expect, it } from 'vitest'

import { getR2Config } from '../../src/modules/core/storage/r2'

async function createStorageConfiguration(clientUploadSetting?: string) {
  const r2 = getR2Config({
    R2_ACCESS_KEY_ID: 'test-access-key',
    R2_BUCKET: 'test-media',
    R2_CLIENT_UPLOADS: clientUploadSetting,
    R2_ENDPOINT: 'https://test-account.r2.cloudflarestorage.com',
    R2_PUBLIC_URL: 'https://media.example.com',
    R2_SECRET_ACCESS_KEY: 'test-secret-key',
  })!

  return s3Storage({
    bucket: r2.bucket,
    clientUploads: r2.clientUploads,
    collections: { media: true },
    config: {
      credentials: {
        accessKeyId: r2.accessKeyId,
        secretAccessKey: r2.secretAccessKey,
      },
      endpoint: r2.endpoint,
      forcePathStyle: true,
      region: 'auto',
    },
  })({
    collections: [{ slug: 'media', fields: [], upload: true }],
    db: {
      defaultIDType: 'text',
      init: () => {
        throw new Error('The storage-access test must not initialize a database.')
      },
    },
    secret: 'test-payload-secret',
  })
}

describe('R2 direct-upload access', () => {
  it('keeps the signing endpoint disabled for the default server-upload flow', async () => {
    expect((await createStorageConfiguration()).endpoints).toBeUndefined()
  })

  it('rejects unauthenticated signing requests before accessing cloud storage', async () => {
    const configuration = await createStorageConfiguration('true')
    const endpoint = configuration.endpoints?.find(
      (candidate) => candidate.path === '/storage-s3-generate-signed-url',
    )
    expect(endpoint).toBeDefined()

    const request = {
      json: async () => ({
        collectionSlug: 'media',
        filename: 'pool.jpg',
        filesize: 6_000_000,
        mimeType: 'image/jpeg',
      }),
      payload: { config: { upload: {} } },
      user: null,
    } as unknown as PayloadRequest

    await expect(endpoint!.handler(request)).rejects.toMatchObject({ status: 403 })
  })
})
