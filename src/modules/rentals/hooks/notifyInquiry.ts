import type { CollectionAfterChangeHook } from 'payload'

import type { Lead, Property } from '@/payload-types'

import { deliverInquiryNotification } from '../lib/inquiry-delivery'

function relationshipId(value: Lead['property']): string | undefined {
  if (typeof value === 'string') return value
  return value?.id
}

export const notifyInquiryAfterCreate: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== 'create') return doc

  const inquiry = doc as Lead
  let propertyTitle: string | undefined
  const propertyId = relationshipId(inquiry.property)

  if (typeof inquiry.property === 'object' && inquiry.property) {
    propertyTitle = inquiry.property.title
  } else if (propertyId) {
    try {
      const property = (await req.payload.findByID({
        collection: 'properties',
        depth: 0,
        id: propertyId,
        locale: inquiry.locale,
        overrideAccess: true,
      })) as Property
      propertyTitle = property.title
    } catch (error) {
      req.payload.logger.warn({
        err: error,
        msg: '[inquiry] Property title lookup failed; sending a general notification',
      })
    }
  }

  try {
    await deliverInquiryNotification({ ...inquiry, propertyTitle })
  } catch (error) {
    // The saved Lead is the source of truth. Notification outages must not make
    // the visitor retry and create a duplicate inquiry.
    req.payload.logger.error({ err: error, msg: '[inquiry] Email notification failed' })
  }

  return doc
}
