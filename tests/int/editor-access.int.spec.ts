import { describe, expect, it } from 'vitest'

import { isAdmin, isAdminField, isLoggedIn } from '../../src/modules/core/access'
import { Media } from '../../src/modules/core/collections/media'
import { Users } from '../../src/modules/core/collections/users'
import { Leads } from '../../src/modules/rentals/collections/leads'
import { Properties } from '../../src/modules/rentals/collections/properties'
import { Reviews } from '../../src/modules/rentals/collections/reviews'

describe('client editor access', () => {
  it('keeps property and media creation and updates available to an authenticated editor', () => {
    expect(Properties.access).toMatchObject({
      create: isLoggedIn,
      update: isLoggedIn,
    })
    expect(Media.access).toMatchObject({
      create: isLoggedIn,
      update: isLoggedIn,
    })
  })

  it('reserves destructive content deletion for administrators', () => {
    expect(Properties.access?.delete).toBe(isAdmin)
    expect(Media.access?.delete).toBe(isAdmin)
    expect(Leads.access?.delete).toBe(isAdmin)
    expect(Reviews.access?.delete).toBe(isAdmin)
  })

  it('hides user management from editors while retaining it for administrators', () => {
    const hidden = Users.admin?.hidden
    expect(typeof hidden).toBe('function')
    if (typeof hidden !== 'function') return

    expect(hidden({ user: { role: 'editor' } as never })).toBe(true)
    expect(hidden({ user: { role: 'admin' } as never })).toBe(false)
  })

  it('prevents an editor from changing an established property slug', async () => {
    const tabsField = Properties.fields[0]
    expect(tabsField.type).toBe('tabs')
    if (tabsField.type !== 'tabs') return

    const basicsTab = tabsField.tabs[0]
    expect('fields' in basicsTab).toBe(true)
    if (!('fields' in basicsTab)) return

    const slugField = basicsTab.fields.find(
      (field) => 'name' in field && field.name === 'slug',
    )
    expect(slugField && 'access' in slugField ? slugField.access?.update : undefined).toBe(
      isAdminField,
    )
    if (!slugField || !('hooks' in slugField)) return

    const beforeValidate = slugField.hooks?.beforeValidate?.[0]
    expect(beforeValidate).toBeDefined()
    if (!beforeValidate) return

    const result = await beforeValidate({
      operation: 'update',
      originalDoc: { slug: 'established-home' },
      overrideAccess: false,
      req: { user: { role: 'editor' } },
      value: 'changed-home',
    } as never)

    expect(result).toBe('established-home')
  })
})
