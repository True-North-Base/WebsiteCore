import type { GlobalConfig } from 'payload'

import { anyone, isLoggedIn, seoFields } from '@/modules/core'

import { revalidateRentalGlobal } from '../hooks/revalidateRentals'

export const PropertyManagementPage: GlobalConfig = {
  slug: 'property-management-page',
  label: 'Property management page',
  admin: {
    group: 'Pages',
    description: 'Owner-approved content for the property-management service page.',
  },
  access: { read: anyone, update: isLoggedIn },
  hooks: { afterChange: [revalidateRentalGlobal] },
  versions: { drafts: true, max: 30 },
  fields: [
    { name: 'heading', type: 'text', localized: true, required: true },
    { name: 'body', type: 'richText', localized: true, required: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'ctaLabel', type: 'text', localized: true },
    { name: 'seo', type: 'group', label: 'SEO', fields: seoFields },
  ],
}
