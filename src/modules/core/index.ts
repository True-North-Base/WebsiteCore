// Platform core — reusable across any business vertical.
// Rule: nothing in this module may import from src/modules/rentals (or any
// other business module). See docs/ARCHITECTURE.md §2.

import type { CollectionConfig, GlobalConfig } from 'payload'

import { Media } from './collections/media'
import { Users } from './collections/users'
import { SiteSettings } from './globals/siteSettings'

export const coreCollections: CollectionConfig[] = [Users, Media]

export const coreGlobals: GlobalConfig[] = [SiteSettings]

export { anyone, isAdmin, isLoggedIn, isLoggedInField } from './access'
export { seoFields } from './fields/seo'
export { isValidHttpUrl } from './validation'
export { Media, SiteSettings, Users }
