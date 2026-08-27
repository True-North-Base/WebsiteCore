// Platform core — reusable across any business vertical.
// Rule: nothing in this module may import from src/modules/rentals (or any
// other business module). See docs/ARCHITECTURE.md §2.

import type { CollectionConfig, GlobalConfig } from 'payload'

import { Media } from './collections/media'
import { Users } from './collections/users'

export const coreCollections: CollectionConfig[] = [Users, Media]

export const coreGlobals: GlobalConfig[] = []

export { Media, Users }
