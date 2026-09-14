import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const cms = vi.hoisted(() => ({ find: vi.fn(), findGlobal: vi.fn() }))
vi.mock('payload', () => ({ getPayload: vi.fn(async () => cms) }))
vi.mock('@/payload.config', () => ({ default: {} }))

import { getPropertyPageContent, getPropertyStaticParams } from '../../src/modules/rentals/lib/cms-content'

describe('published property rendering', () => {
  beforeEach(() => {
    vi.stubEnv('DATABASE_URL', 'postgres://test.invalid/test')
    cms.find.mockReset()
    cms.findGlobal.mockReset()
  })
  afterEach(() => vi.unstubAllEnvs())

  it('pre-renders all published slugs with no inventory cap', async () => {
    cms.find.mockResolvedValue({ docs: [{ slug: 'existing-home' }, { slug: 'new-home' }] })
    expect(await getPropertyStaticParams()).toEqual([{ slug: 'existing-home' }, { slug: 'new-home' }])
    expect(cms.find).toHaveBeenCalledWith(expect.objectContaining({
      collection: 'properties',
      draft: false,
      depth: 0,
      limit: 0,
      overrideAccess: false,
      pagination: false,
      select: { slug: true },
      where: { _status: { equals: 'published' } },
    }))
  })

  it('allows an empty published portfolio without adding seed slugs', async () => {
    cms.find.mockResolvedValue({ docs: [] })
    expect(await getPropertyStaticParams()).toEqual([])
  })

  it('uses only the real local fallback page when no database is configured', async () => {
    vi.stubEnv('DATABASE_URL', '')
    expect(await getPropertyStaticParams()).toEqual([{ slug: 'penthouse-lago' }])
    expect(cms.find).not.toHaveBeenCalled()
  })

  it('refuses silent production seed rendering without a database', async () => {
    vi.stubEnv('DATABASE_URL', '')
    vi.stubEnv('NODE_ENV', 'production')
    await expect(getPropertyStaticParams()).rejects.toThrow('DATABASE_URL is required')
  })

  it.each(['penthouse-lago', 'new-home'])('does not resurrect missing or unpublished %s', async (slug) => {
    cms.find.mockResolvedValue({ docs: [] })
    cms.findGlobal.mockResolvedValue({ _status: 'published' })
    expect(await getPropertyPageContent('en', slug)).toBeUndefined()
  })
})
