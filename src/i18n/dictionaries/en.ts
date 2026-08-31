// UI chrome strings (English). Content itself comes localized from Payload.
// Keep flat and typed; es.ts must satisfy this same shape.
export const en = {
  siteName: 'CR Mariposa',
  tagline: 'Find your happy place in Costa Rica',
  underConstruction: 'Our new site is under construction.',
  nav: {
    properties: 'All homes',
    about: 'About us',
    propertyManagement: 'Property management',
    contact: 'Contact',
    menu: 'Menu',
  },
  cta: {
    whatsapp: 'WhatsApp',
    call: 'Call',
    explore: 'Explore',
    inquiry: 'Send an inquiry',
    whatsappHome: 'WhatsApp about this home',
  },
  discovery: {
    where: 'Where',
    guests: 'Guests',
    locationSummary: 'Santa Ana & Pacific coast',
    guestSummary: '2–6 guests',
  },
  carousel: {
    previous: 'Previous homes',
    next: 'Next homes',
  },
  catalogue: {
    all: 'All',
    santaAna: 'Santa Ana',
    escazu: 'Escazú',
    beach: 'Beach',
    filters: 'Filter homes by location',
    results: 'Showing {visible} of {total} homes',
    showMore: 'Show {count} more homes',
    ctaHeading: 'Not sure which home suits your stay?',
    ctaBody:
      'Tell us your preferred dates, group size and priorities. The family will recommend the best fit.',
  },
  inquiryForm: {
    name: 'Name',
    email: 'Email',
    phone: 'Phone / WhatsApp',
    dates: 'Preferred dates',
    datesPlaceholder: 'For example, March 10–17',
    message: 'What kind of stay are you planning?',
    submit: 'Send inquiry',
    sending: 'Sending…',
    contactRequirement: 'Include either an email address or phone number so we can reply.',
    open: 'Prefer a form? Send an inquiry',
  },
  language: {
    current: 'English',
    switchTo: 'Español',
  },
}

export type Dictionary = typeof en
