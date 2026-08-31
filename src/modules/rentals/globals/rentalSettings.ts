import type { GlobalConfig } from 'payload'

import { anyone, isLoggedIn, isValidHttpUrl } from '@/modules/core'

import { publicProfileOptions } from '../fields/options'
import { revalidateRentalGlobal } from '../hooks/revalidateRentals'

export const RentalSettings: GlobalConfig = {
  slug: 'rental-settings',
  label: 'Rental settings',
  admin: {
    group: 'Rentals',
    description: 'Rental-specific links and wording shared across the public website.',
  },
  access: {
    read: anyone,
    update: isLoggedIn,
  },
  hooks: {
    afterChange: [revalidateRentalGlobal],
  },
  versions: {
    drafts: true,
    max: 30,
  },
  fields: [
    {
      name: 'marketplaceLinks',
      type: 'array',
      maxRows: 8,
      admin: {
        description:
          'Platforms shown in “Find us on”. A blank URL displays a clear placeholder until the owner approves the profile link.',
        initCollapsed: true,
      },
      fields: [
        { name: 'platform', type: 'select', required: true, options: [...publicProfileOptions] },
        {
          name: 'url',
          type: 'text',
          validate: isValidHttpUrl,
          admin: { description: 'Optional while awaiting owner review. Enter the complete approved profile URL.' },
        },
      ],
    },
    {
      name: 'directBookingNote',
      type: 'textarea',
      localized: true,
      required: true,
      admin: {
        description: 'Short truthful note explaining that dates and terms are confirmed personally.',
      },
    },
  ],
}
