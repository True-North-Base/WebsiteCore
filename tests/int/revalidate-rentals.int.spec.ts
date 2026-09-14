import { beforeEach, describe, expect, it, vi } from 'vitest'

const cacheMocks = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
}))

vi.mock('next/cache.js', () => cacheMocks)

import {
  revalidateProperty,
  revalidatePropertyDelete,
} from '../../src/modules/rentals/hooks/revalidateRentals'

function changeProperty(
  doc: { _status: 'draft' | 'published'; slug: string },
  previousDoc?: { _status: 'draft' | 'published'; slug: string },
) {
  return revalidateProperty({
    doc,
    previousDoc,
    req: { context: {} },
  } as never)
}

function deleteProperty(doc: { _status: 'draft' | 'published'; slug: string }) {
  return revalidatePropertyDelete({ doc, req: { context: {} } } as never)
}

describe('property cache revalidation', () => {
  beforeEach(() => {
    cacheMocks.revalidatePath.mockReset()
  })

  it('refreshes catalogue, sitemap, homepage, and detail routes when a property is published', () => {
    changeProperty({ _status: 'published', slug: 'new-home' })

    expect(cacheMocks.revalidatePath.mock.calls).toEqual([
      ['/en'],
      ['/es'],
      ['/en/properties'],
      ['/es/properties'],
      ['/sitemap.xml'],
      ['/en/properties/new-home'],
      ['/es/properties/new-home'],
      ['/en/properties/new-home/photos'],
      ['/es/properties/new-home/photos'],
    ])
  })

  it('refreshes both old and new detail routes after a published slug changes', () => {
    changeProperty(
      { _status: 'published', slug: 'new-slug' },
      { _status: 'published', slug: 'old-slug' },
    )

    expect(cacheMocks.revalidatePath).toHaveBeenCalledWith('/sitemap.xml')
    expect(cacheMocks.revalidatePath).toHaveBeenCalledWith('/en/properties/old-slug')
    expect(cacheMocks.revalidatePath).toHaveBeenCalledWith('/es/properties/old-slug/photos')
    expect(cacheMocks.revalidatePath).toHaveBeenCalledWith('/en/properties/new-slug')
  })

  it('refreshes catalogue and sitemap when a property is deleted', () => {
    deleteProperty({ _status: 'published', slug: 'retired-home' })

    expect(cacheMocks.revalidatePath).toHaveBeenCalledWith('/en/properties')
    expect(cacheMocks.revalidatePath).toHaveBeenCalledWith('/es/properties')
    expect(cacheMocks.revalidatePath).toHaveBeenCalledWith('/sitemap.xml')
    expect(cacheMocks.revalidatePath).toHaveBeenCalledWith('/en/properties/retired-home')
  })

  it('does not revalidate a draft-only change', () => {
    changeProperty(
      { _status: 'draft', slug: 'draft-home' },
      { _status: 'draft', slug: 'draft-home' },
    )

    expect(cacheMocks.revalidatePath).not.toHaveBeenCalled()
  })

  it.each([
    ['published', 'draft'],
    ['draft', 'published'],
  ] as const)('refreshes every public route on %s to %s', (previous, next) => {
    changeProperty({ _status: next, slug: 'existing-home' }, { _status: previous, slug: 'existing-home' })

    for (const locale of ['en', 'es']) {
      expect(cacheMocks.revalidatePath).toHaveBeenCalledWith(`/${locale}`)
      expect(cacheMocks.revalidatePath).toHaveBeenCalledWith(`/${locale}/properties`)
      expect(cacheMocks.revalidatePath).toHaveBeenCalledWith(`/${locale}/properties/existing-home`)
      expect(cacheMocks.revalidatePath).toHaveBeenCalledWith(`/${locale}/properties/existing-home/photos`)
    }
    expect(cacheMocks.revalidatePath).toHaveBeenCalledWith('/sitemap.xml')
  })
})
