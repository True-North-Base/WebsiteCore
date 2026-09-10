import type { CollectionConfig } from 'payload'

import { isAdmin, isLoggedIn, isLoggedInField, isValidHttpUrl } from '@/modules/core'

import { publishedOrLoggedIn } from '../access'
import { platformOptions } from '../fields/options'
import { revalidateReviewDelete, revalidateReviews } from '../hooks/revalidateRentals'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  labels: { singular: 'Guest review', plural: 'Guest reviews' },
  admin: {
    group: 'Rentals',
    useAsTitle: 'guestName',
    defaultColumns: ['guestName', 'platform', 'rating', 'featured', '_status'],
    description: 'Only publish genuine guest reviews that CR Mariposa is permitted to reuse.',
  },
  access: {
    create: isLoggedIn,
    read: publishedOrLoggedIn,
    update: isLoggedIn,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [revalidateReviews],
    afterDelete: [revalidateReviewDelete],
  },
  versions: {
    drafts: true,
    maxPerDoc: 50,
  },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      localized: true,
      required: true,
      admin: { description: 'Original review plus an owner-approved translation in the other locale.' },
    },
    {
      type: 'row',
      fields: [
        { name: 'guestName', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'guestCountry', type: 'text', localized: true, admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'rating', type: 'number', required: true, min: 1, max: 5, admin: { width: '50%', step: 0.1 } },
        { name: 'platform', type: 'select', required: true, options: [...platformOptions], admin: { width: '50%' } },
      ],
    },
    {
      name: 'property',
      type: 'relationship',
      relationTo: 'properties',
      admin: { description: 'Leave empty for a general testimonial used only on the homepage.' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Surface this review on the homepage.' },
    },
    {
      name: 'sourceUrl',
      type: 'text',
      validate: isValidHttpUrl,
      access: { read: isLoggedInField },
      admin: { description: 'Private provenance for editors. Never exposed through the public API.' },
    },
  ],
}
