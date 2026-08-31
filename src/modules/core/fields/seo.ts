import type { Field } from 'payload'

export const seoFields: Field[] = [
  {
    name: 'title',
    type: 'text',
    localized: true,
    maxLength: 70,
    admin: {
      description: 'Optional browser and search-result title. Keep it specific and under 70 characters.',
    },
  },
  {
    name: 'description',
    type: 'textarea',
    localized: true,
    maxLength: 170,
    admin: {
      description: 'Optional search-result summary. Aim for 120–160 characters.',
    },
  },
  {
    name: 'ogImage',
    type: 'upload',
    relationTo: 'media',
    admin: {
      description: 'Optional social-sharing image. The page hero is used when this is empty.',
    },
  },
  {
    name: 'canonical',
    type: 'text',
    localized: true,
    admin: {
      description: 'Leave empty unless this page should declare a different canonical URL.',
    },
  },
]
