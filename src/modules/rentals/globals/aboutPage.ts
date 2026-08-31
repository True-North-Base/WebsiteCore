import type { GlobalConfig } from 'payload'

import { anyone, isLoggedIn, seoFields } from '@/modules/core'

import { revalidateRentalGlobal } from '../hooks/revalidateRentals'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About page',
  admin: {
    group: 'Pages',
    description: 'Published bilingual story, image and search metadata for the About page.',
  },
  access: { read: anyone, update: isLoggedIn },
  hooks: { afterChange: [revalidateRentalGlobal] },
  versions: { drafts: true, max: 30 },
  fields: [
    { name: 'heading', type: 'text', localized: true, required: true },
    { name: 'body', type: 'richText', localized: true, required: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'seo', type: 'group', label: 'SEO', fields: seoFields },
  ],
}
