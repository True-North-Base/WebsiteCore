import type { GlobalConfig } from 'payload'

import { anyone, isLoggedIn, seoFields } from '@/modules/core'

import { featureIconOptions } from '../fields/options'
import { revalidateRentalGlobal } from '../hooks/revalidateRentals'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home page',
  admin: {
    group: 'Pages',
    description: 'The approved homepage content. Property rows are selected from each Property document.',
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
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            { name: 'heroEyebrow', type: 'text', localized: true },
            { name: 'heroHeading', type: 'text', localized: true, required: true },
            { name: 'heroBody', type: 'textarea', localized: true, required: true },
            { name: 'heroImage', type: 'upload', relationTo: 'media', required: true },
            {
              name: 'heroMobileImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Optional portrait crop. Desktop image is used when empty.' },
            },
          ],
        },
        {
          label: 'Property rows',
          fields: [
            { name: 'featuredHeading', type: 'text', localized: true, required: true },
            { name: 'featuredIntro', type: 'textarea', localized: true },
            { name: 'pacificHeading', type: 'text', localized: true, required: true },
            { name: 'pacificIntro', type: 'textarea', localized: true, required: true },
          ],
        },
        {
          label: 'Reviews',
          fields: [
            { name: 'reviewsHeading', type: 'text', localized: true, required: true },
            { name: 'reviewsProof', type: 'text', localized: true, required: true },
          ],
        },
        {
          label: 'Why Mariposa',
          fields: [
            { name: 'trustEyebrow', type: 'text', localized: true, required: true },
            { name: 'trustHeading', type: 'text', localized: true, required: true },
            { name: 'trustHeadingMuted', type: 'text', localized: true, required: true },
            { name: 'trustImage', type: 'upload', relationTo: 'media', required: true },
            {
              name: 'trustFeatures',
              type: 'array',
              minRows: 1,
              maxRows: 6,
              admin: { initCollapsed: true },
              fields: [
                { name: 'icon', type: 'select', required: true, options: [...featureIconOptions] },
                { name: 'title', type: 'text', localized: true, required: true },
                { name: 'body', type: 'textarea', localized: true, required: true },
              ],
            },
          ],
        },
        {
          label: 'Owner comparison',
          description:
            'Temporary second homepage concept retained for owner feedback. It does not replace the existing Why Mariposa section.',
          fields: [
            { name: 'hospitalityEyebrow', type: 'text', localized: true, required: true },
            { name: 'hospitalityHeading', type: 'text', localized: true, required: true },
            { name: 'hospitalityHeadingMuted', type: 'text', localized: true, required: true },
            { name: 'hospitalityImage', type: 'upload', relationTo: 'media', required: true },
            {
              name: 'hospitalityFeatures',
              type: 'array',
              minRows: 1,
              maxRows: 6,
              admin: { initCollapsed: true },
              fields: [
                { name: 'icon', type: 'select', required: true, options: [...featureIconOptions] },
                { name: 'title', type: 'text', localized: true, required: true },
                { name: 'body', type: 'textarea', localized: true, required: true },
              ],
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            { name: 'contactHeading', type: 'text', localized: true, required: true },
            { name: 'contactBody', type: 'textarea', localized: true, required: true },
          ],
        },
        {
          label: 'SEO',
          fields: [{ name: 'seo', type: 'group', label: 'SEO', fields: seoFields }],
        },
      ],
    },
  ],
}
