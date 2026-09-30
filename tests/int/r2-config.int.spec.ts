import { describe, expect, it } from 'vitest'

import {
  getR2Config,
  getR2ImageRemotePattern,
  getR2ObjectKey,
  getR2PublicFileURL,
  materializeR2MediaURLs,
  normalizeR2MediaStorageKeys,
} from '../../src/modules/core/storage/r2'

const completeEnvironment = {
  R2_ACCESS_KEY_ID: 'access-key',
  R2_BUCKET: 'cr-mariposa-media',
  R2_ENDPOINT: 'https://account-id.r2.cloudflarestorage.com',
  R2_PUBLIC_URL: 'https://media.example.com/assets/',
  R2_SECRET_ACCESS_KEY: 'secret-key',
}

describe('R2 configuration', () => {
  it('keeps local storage when no R2 values are set', () => {
    expect(getR2Config({})).toBeNull()
  })

  it('rejects a partial configuration instead of silently using local storage', () => {
    expect(() => getR2Config({ R2_BUCKET: 'cr-mariposa-media' })).toThrow(
      'Incomplete R2 configuration',
    )
  })

  it('normalizes a complete HTTPS configuration', () => {
    expect(getR2Config(completeEnvironment)).toEqual({
      accessKeyId: 'access-key',
      bucket: 'cr-mariposa-media',
      clientUploads: false,
      endpoint: 'https://account-id.r2.cloudflarestorage.com',
      publicURL: 'https://media.example.com/assets',
      secretAccessKey: 'secret-key',
    })
  })

  it('enables direct uploads only when explicitly requested', () => {
    expect(getR2Config({ ...completeEnvironment, R2_CLIENT_UPLOADS: 'true' })?.clientUploads).toBe(
      true,
    )
    expect(getR2Config({ ...completeEnvironment, R2_CLIENT_UPLOADS: 'false' })?.clientUploads).toBe(
      false,
    )
    expect(getR2Config({ ...completeEnvironment, R2_CLIENT_UPLOADS: '' })?.clientUploads).toBe(
      false,
    )
  })

  it('rejects invalid direct-upload settings instead of silently using server uploads', () => {
    expect(() => getR2Config({ ...completeEnvironment, R2_CLIENT_UPLOADS: 'yes' })).toThrow(
      'R2_CLIENT_UPLOADS must be true or false',
    )
  })

  it('requires cloud storage before direct uploads can be enabled', () => {
    expect(() => getR2Config({ R2_CLIENT_UPLOADS: 'true' })).toThrow(
      'R2_CLIENT_UPLOADS requires a complete R2 configuration',
    )
    expect(getR2Config({ R2_CLIENT_UPLOADS: 'false' })).toBeNull()
  })

  it('rejects endpoint paths and non-HTTPS public URLs', () => {
    expect(() =>
      getR2Config({
        ...completeEnvironment,
        R2_ENDPOINT: `${completeEnvironment.R2_ENDPOINT}/bucket`,
      }),
    ).toThrow('R2_ENDPOINT must be the account endpoint origin without a path')

    expect(() =>
      getR2Config({ ...completeEnvironment, R2_PUBLIC_URL: 'http://media.example.com' }),
    ).toThrow('R2_PUBLIC_URL must use https')
  })

  it('creates a strict Next image pattern and keeps the object key provider-neutral', () => {
    expect(getR2ImageRemotePattern(completeEnvironment.R2_PUBLIC_URL)).toEqual({
      protocol: 'https',
      hostname: 'media.example.com',
      port: '',
      pathname: '/assets/**',
      search: '',
    })
    expect(
      getR2PublicFileURL(
        'https://media.example.com/',
        'hero image.png',
        '/properties/penthouse-lago/',
      ),
    ).toBe('https://media.example.com/properties/penthouse-lago/hero image.png')
    expect(getR2ObjectKey('hero image.png', '/properties/penthouse-lago/')).toBe(
      'properties/penthouse-lago/hero image.png',
    )
  })

  it('materializes public URLs at read time without changing object keys', () => {
    const stored = {
      url: 'properties/penthouse-lago/hero.jpg',
      thumbnailURL: 'properties/penthouse-lago/hero-320x180.jpg',
      sizes: {
        thumbnail: { url: 'properties/penthouse-lago/hero-320x180.jpg' },
        card: { url: 'properties/penthouse-lago/hero-900x900.jpg' },
      },
    }

    expect(materializeR2MediaURLs(stored, 'https://media.example.com')).toEqual({
      url: 'https://media.example.com/properties/penthouse-lago/hero.jpg',
      thumbnailURL: 'https://media.example.com/properties/penthouse-lago/hero-320x180.jpg',
      sizes: {
        thumbnail: {
          url: 'https://media.example.com/properties/penthouse-lago/hero-320x180.jpg',
        },
        card: {
          url: 'https://media.example.com/properties/penthouse-lago/hero-900x900.jpg',
        },
      },
    })
    expect(stored.url).toBe('properties/penthouse-lago/hero.jpg')
  })

  it('removes the delivery origin before media URLs are persisted', () => {
    const publicDocument = {
      url: 'https://media.example.com/properties/penthouse-lago/hero.jpg',
      thumbnailURL: 'https://media.example.com/properties/penthouse-lago/hero-320x180.jpg',
      sizes: {
        thumbnail: {
          url: 'https://media.example.com/properties/penthouse-lago/hero-320x180.jpg',
        },
        card: { url: 'properties/penthouse-lago/hero-900x900.jpg' },
      },
    }

    expect(normalizeR2MediaStorageKeys(publicDocument, 'https://media.example.com/')).toEqual({
      url: 'properties/penthouse-lago/hero.jpg',
      thumbnailURL: 'properties/penthouse-lago/hero-320x180.jpg',
      sizes: {
        thumbnail: { url: 'properties/penthouse-lago/hero-320x180.jpg' },
        card: { url: 'properties/penthouse-lago/hero-900x900.jpg' },
      },
    })
  })
})
