// Rentals domain — CR Mariposa's business module.
// May import from src/modules/core; never the other way around.

import type { CollectionConfig, GlobalConfig } from 'payload'

import { Leads } from './collections/leads'
import { Properties } from './collections/properties'
import { Reviews } from './collections/reviews'
import { AboutPage } from './globals/aboutPage'
import { ContactPage } from './globals/contactPage'
import { HomePage } from './globals/homePage'
import { PropertiesPage } from './globals/propertiesPage'
import { PropertyManagementPage } from './globals/propertyManagementPage'
import { RentalSettings } from './globals/rentalSettings'

export const rentalsCollections: CollectionConfig[] = [Properties, Reviews, Leads]

export const rentalsGlobals: GlobalConfig[] = [
  RentalSettings,
  HomePage,
  PropertiesPage,
  AboutPage,
  PropertyManagementPage,
  ContactPage,
]

export {
  AboutPage,
  ContactPage,
  HomePage,
  Leads,
  Properties,
  PropertiesPage,
  PropertyManagementPage,
  RentalSettings,
  Reviews,
}
