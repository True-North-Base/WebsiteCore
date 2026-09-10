import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminField, isLoggedIn, isValidHttpUrl, seoFields } from '@/modules/core'

import { publishedOrLoggedIn } from '../access'
import { platformOptions } from '../fields/options'
import { revalidateProperty, revalidatePropertyDelete } from '../hooks/revalidateRentals'
import { slugify } from '../lib/validation'

export const Properties: CollectionConfig = {
  slug: 'properties',
  labels: {
    singular: 'Property',
    plural: 'Properties',
  },
  admin: {
    group: 'Rentals',
    useAsTitle: 'title',
    defaultColumns: ['title', 'region', 'featured', 'displayOrder', '_status'],
    description:
      'The homes shown on the public website. Save unfinished work as a draft, and unpublish a home to hide it. Ask an administrator for permanent deletion.',
  },
  access: {
    create: isLoggedIn,
    read: publishedOrLoggedIn,
    update: isLoggedIn,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [revalidateProperty],
    afterDelete: [revalidatePropertyDelete],
  },
  versions: {
    drafts: true,
    maxPerDoc: 50,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basics',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: {
                description: 'Public property name. Brand names are shared across languages.',
              },
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              index: true,
              admin: {
                description:
                  'URL segment. Generated from the title when left empty; only an administrator can change it after creation.',
                position: 'sidebar',
              },
              access: {
                update: isAdminField,
              },
              hooks: {
                beforeValidate: [
                  ({ data, operation, originalDoc, overrideAccess, req, value }) => {
                    if (
                      operation === 'update' &&
                      !overrideAccess &&
                      req.user?.role !== 'admin' &&
                      typeof originalDoc?.slug === 'string'
                    ) {
                      return originalDoc.slug
                    }

                    return slugify(String(value || data?.title || ''))
                  },
                ],
              },
              validate: (value: null | string | undefined) =>
                Boolean(value && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) ||
                'Use lowercase letters, numbers, and single hyphens only.',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'region',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Central Valley', value: 'central-valley' },
                    { label: 'Pacific coast', value: 'pacific-coast' },
                  ],
                  admin: { width: '50%' },
                },
                {
                  name: 'district',
                  type: 'text',
                  localized: true,
                  required: true,
                  admin: {
                    width: '50%',
                    description: 'Public district only, never the exact street address.',
                  },
                },
              ],
            },
            {
              name: 'complexName',
              type: 'text',
              admin: { description: 'Optional condominium or community name.' },
            },
            {
              name: 'badge',
              type: 'text',
              localized: true,
              admin: { description: 'Short image badge, for example Lakeview or Beachfront.' },
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              localized: true,
              required: true,
              maxLength: 360,
              admin: {
                description:
                  'The lead paragraph on the property page. Aim for one or two sentences.',
              },
            },
            {
              name: 'description',
              type: 'richText',
              localized: true,
              required: true,
              admin: { description: 'Two to five useful paragraphs describing the stay.' },
            },
            {
              name: 'neighborhoodDescription',
              type: 'textarea',
              localized: true,
              admin: {
                description: 'Public district-level context. Do not include the exact address.',
              },
            },
          ],
        },
        {
          label: 'Photos',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: { description: 'Primary card and social image.' },
            },
            {
              name: 'gallery',
              type: 'array',
              minRows: 1,
              maxRows: 40,
              admin: {
                description: 'Drag to set display order. The first five create the desktop mosaic.',
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'category',
                      type: 'select',
                      required: true,
                      defaultValue: 'other',
                      admin: {
                        width: '50%',
                        description: 'Used to group photos on the public showcase page.',
                      },
                      options: [
                        { label: 'Exterior', value: 'exterior' },
                        { label: 'Living room', value: 'living-room' },
                        { label: 'Kitchen', value: 'kitchen' },
                        { label: 'Bedroom', value: 'bedroom' },
                        { label: 'Amenities', value: 'amenities' },
                        { label: 'Other', value: 'other' },
                      ],
                    },
                    {
                      name: 'featuredInShowcase',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: {
                        width: '50%',
                        description: 'Include this photo in the opening Showcase tab.',
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: 'mapImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Optional district-level map image. Never expose a private address.',
              },
            },
          ],
        },
        {
          label: 'Facts & amenities',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'bedrooms',
                  type: 'number',
                  required: true,
                  min: 0,
                  admin: { width: '25%' },
                },
                { name: 'beds', type: 'number', min: 0, admin: { width: '25%' } },
                {
                  name: 'bathrooms',
                  type: 'number',
                  required: true,
                  min: 0,
                  admin: { width: '25%', step: 0.5 },
                },
                {
                  name: 'maxGuests',
                  type: 'number',
                  min: 1,
                  admin: {
                    description: 'Leave blank until the owner confirms the permitted occupancy.',
                    width: '25%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'rating',
                  type: 'number',
                  min: 0,
                  max: 5,
                  admin: {
                    width: '50%',
                    step: 0.1,
                    description: 'Manual OTA average. Keep empty when it cannot be verified.',
                  },
                },
                {
                  name: 'parking',
                  type: 'text',
                  localized: true,
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'extraFacts',
              type: 'array',
              localized: true,
              maxRows: 2,
              admin: { description: 'Up to two short facts, for example Mezzanine or Lakeview.' },
              fields: [{ name: 'fact', type: 'text', required: true }],
            },
            {
              name: 'sleepingArrangements',
              type: 'array',
              maxRows: 12,
              admin: {
                description: 'Bedroom cards shown between the property description and amenities.',
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'roomName',
                      type: 'text',
                      localized: true,
                      required: true,
                      admin: { width: '50%' },
                    },
                    {
                      name: 'bedSummary',
                      type: 'text',
                      localized: true,
                      required: true,
                      admin: {
                        width: '50%',
                        description: 'Use verified wording, for example “1 queen bed”.',
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: 'amenityGroups',
              type: 'array',
              maxRows: 6,
              admin: {
                description: 'Group amenities into no more than six clear categories.',
                initCollapsed: true,
              },
              fields: [
                { name: 'label', type: 'text', localized: true, required: true },
                {
                  name: 'items',
                  type: 'array',
                  localized: true,
                  fields: [{ name: 'item', type: 'text', required: true }],
                },
              ],
            },
            {
              name: 'thingsToKnow',
              type: 'group',
              admin: {
                description:
                  'Cancellation terms, house rules, and stay details. Keep wording factual and avoid promises that have not been approved.',
              },
              fields: [
                {
                  name: 'cancellationSummary',
                  type: 'text',
                  localized: true,
                  admin: { description: 'Short public summary shown at first glance.' },
                },
                {
                  name: 'cancellationDetails',
                  type: 'textarea',
                  localized: true,
                  admin: { description: 'Optional explanation revealed by “Read more”.' },
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'checkInTime', type: 'text', admin: { width: '33%' } },
                    { name: 'checkOutTime', type: 'text', admin: { width: '33%' } },
                    { name: 'minStayNights', type: 'number', min: 1, admin: { width: '33%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'smoking', type: 'text', localized: true, admin: { width: '33%' } },
                    { name: 'pets', type: 'text', localized: true, admin: { width: '33%' } },
                    { name: 'events', type: 'text', localized: true, admin: { width: '33%' } },
                  ],
                },
                {
                  name: 'propertyRulesDetails',
                  type: 'textarea',
                  localized: true,
                  admin: { description: 'Optional explanation revealed by “Read more”.' },
                },
              ],
            },
          ],
        },
        {
          label: 'Links & SEO',
          fields: [
            {
              name: 'externalListings',
              type: 'array',
              maxRows: 5,
              fields: [
                { name: 'platform', type: 'select', required: true, options: [...platformOptions] },
                { name: 'url', type: 'text', required: true, validate: isValidHttpUrl },
              ],
            },
            {
              name: 'approxCoordinates',
              type: 'group',
              admin: {
                description: 'Optional approximate point for future map/structured data use.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'latitude',
                      type: 'number',
                      min: -90,
                      max: 90,
                      admin: { width: '50%' },
                    },
                    {
                      name: 'longitude',
                      type: 'number',
                      min: -180,
                      max: 180,
                      admin: { width: '50%' },
                    },
                  ],
                },
              ],
            },
            { name: 'seo', type: 'group', label: 'SEO', fields: seoFields },
          ],
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Show this property in “Homes our guests love”.' },
    },
    {
      name: 'displayOrder',
      type: 'number',
      required: true,
      defaultValue: 100,
      min: 0,
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
  ],
}
