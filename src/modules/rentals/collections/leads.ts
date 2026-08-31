import { ValidationError, type CollectionBeforeValidateHook, type CollectionConfig } from 'payload'

import { isLoggedIn } from '@/modules/core'

const requireEmailOrPhone: CollectionBeforeValidateHook = ({ data, originalDoc, req }) => {
  const email = data && 'email' in data ? data.email : originalDoc?.email
  const phone = data && 'phone' in data ? data.phone : originalDoc?.phone

  if (!email && !phone) {
    throw new ValidationError(
      {
        collection: 'leads',
        errors: [
          { message: 'Provide an email address or phone number.', path: 'email' },
          { message: 'Provide a phone number or email address.', path: 'phone' },
        ],
        req,
      },
      req.t,
    )
  }

  return data
}

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Inquiry', plural: 'Inquiries' },
  admin: {
    group: 'Rentals',
    useAsTitle: 'name',
    defaultColumns: ['name', 'property', 'source', 'status', 'createdAt'],
    description: 'Contact requests submitted through the website. WhatsApp and call clicks are not stored here.',
  },
  access: {
    create: isLoggedIn,
    read: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  hooks: {
    beforeValidate: [requireEmailOrPhone],
  },
  fields: [
    { name: 'name', type: 'text', required: true, maxLength: 120 },
    {
      type: 'row',
      fields: [
        {
          name: 'email',
          type: 'email',
          admin: { width: '50%' },
        },
        {
          name: 'phone',
          type: 'text',
          maxLength: 40,
          admin: { width: '50%' },
        },
      ],
    },
    { name: 'message', type: 'textarea', maxLength: 3000 },
    {
      name: 'requestedDates',
      type: 'text',
      maxLength: 120,
      admin: { description: 'Guest-entered free text only. This is not availability data.' },
    },
    { name: 'property', type: 'relationship', relationTo: 'properties' },
    {
      name: 'locale',
      type: 'select',
      required: true,
      defaultValue: 'en',
      options: [
        { label: 'English', value: 'en' },
        { label: 'Español', value: 'es' },
      ],
    },
    {
      name: 'source',
      type: 'select',
      required: true,
      options: [
        { label: 'General contact form', value: 'contact-form' },
        { label: 'Property inquiry form', value: 'property-form' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
