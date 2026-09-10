import type { GlobalConfig } from 'payload'

import { anyone, isLoggedIn, seoFields } from '@/modules/core'

import { revalidateRentalGlobal } from '../hooks/revalidateRentals'

export const PropertiesPage: GlobalConfig = {
  slug: 'properties-page',
  label: 'Properties page',
  admin: { group: 'Pages' },
  access: { read: anyone, update: isLoggedIn },
  hooks: { afterChange: [revalidateRentalGlobal] },
  versions: { drafts: true, max: 30 },
  fields: [
    {
      name: 'heading',
      type: 'text',
      localized: true,
      required: true,
      admin: {
        description:
          'Use {count} where the current number of published properties should appear. The original “Fourteen homes” / “Catorce casas” copy is also kept count-aware.',
      },
    },
    { name: 'introduction', type: 'textarea', localized: true, required: true },
    { name: 'seo', type: 'group', label: 'SEO', fields: seoFields },
  ],
}
