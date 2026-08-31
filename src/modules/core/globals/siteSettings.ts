import type { GlobalConfig } from 'payload'

import { anyone, isLoggedIn } from '../access'
import { seoFields } from '../fields/seo'
import { revalidateSite } from '../hooks/revalidateSite'
import { isValidHttpUrl } from '../validation'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: {
    group: 'Site',
  },
  access: {
    read: anyone,
    update: isLoggedIn,
  },
  hooks: {
    afterChange: [revalidateSite],
  },
  versions: {
    drafts: true,
    max: 30,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'CR Mariposa',
      admin: {
        description: 'Public business name shown in navigation and metadata.',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      localized: true,
      required: true,
      admin: {
        description: 'Short brand line used in the footer and default metadata.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'whatsappNumber',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
            description: 'International digits only, for example 50688255888.',
          },
          validate: (value: null | string | undefined) =>
            !value || /^\d{8,15}$/.test(value) || 'Use 8–15 digits with no spaces or punctuation.',
        },
        {
          name: 'phoneDisplay',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
            description: 'Human-readable format, for example +506 8825-5888.',
          },
        },
      ],
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'address',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Business-level location only. Never publish a private property address here.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'instagramUrl',
          type: 'text',
          admin: { width: '50%' },
          validate: isValidHttpUrl,
        },
        {
          name: 'facebookUrl',
          type: 'text',
          admin: { width: '50%' },
          validate: isValidHttpUrl,
        },
      ],
    },
    {
      name: 'whatsappDefaultMessage',
      type: 'textarea',
      localized: true,
      required: true,
      admin: {
        description: 'Prefilled message for a general stay inquiry. Guests can edit it before sending.',
      },
    },
    {
      name: 'defaultSeo',
      type: 'group',
      label: 'Default SEO',
      fields: seoFields,
    },
  ],
}
