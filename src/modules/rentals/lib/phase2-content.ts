import type { Locale } from '@/i18n'

const imageRoot = '/images/mariposa'

export const mariposaContact = {
  email: 'mariposacrtravel@gmail.com',
  phoneDisplay: '+506 8825-5888',
  phoneHref: 'tel:+50688255888',
  whatsappNumber: '50688255888',
} as const

export type SiteContactContent = {
  email: string
  phoneDisplay: string
  phoneHref: string
  whatsappNumber: string
}

export type PropertyCardContent = {
  alt: string
  badge: string
  bathrooms: string
  bedrooms: string
  href?: string
  image: string
  location: string
  name: string
  rating?: string
}

export type PropertyCatalogueArea = 'beach' | 'escazu' | 'santa-ana'

export type CataloguePropertyCardContent = PropertyCardContent & {
  area: PropertyCatalogueArea
}

export type PropertiesPageContent = {
  heading: string
  introduction: string
  properties: CataloguePropertyCardContent[]
  seo?: SeoContent
  whatsappHref: string
}

export type ReviewContent = { attribution: string; quote: string }
export type FeatureIconName = 'calendar' | 'home' | 'location' | 'message' | 'shield' | 'wifi'

export type FooterContent = {
  company: { href: string; label: string }[]
  companyHeading: string
  contact: SiteContactContent
  copyright: string
  findUsOn: string
  intro: string
  location: string
  platformPlaceholder: string
  platforms: { href?: string; label: string }[]
  stay: { href: string; label: string }[]
  stayHeading: string
  tagline: string
  touchHeading: string
}

export type HomeContent = {
  contact: { body: string; heading: string }
  difference: {
    eyebrow: string
    features: { body: string; icon: FeatureIconName; title: string }[]
    image: string
    imageAlt: string
    title: string
    titleMuted: string
  }
  hospitalityDifference: {
    eyebrow: string
    features: { body: string; icon: FeatureIconName; title: string }[]
    image: string
    imageAlt: string
    title: string
    titleMuted: string
  }
  featured: { properties: PropertyCardContent[]; title: string }
  hero: {
    image: string
    imageAlt: string
    mobileImage: string
    mobileImageAlt: string
    subtitle: string
    title: string
  }
  pacific: { intro: string; properties: PropertyCardContent[]; title: string }
  reviews: { proof: string; reviews: ReviewContent[]; title: string }
  whatsappHref: string
  seo?: SeoContent
}

export type SeoContent = {
  canonical?: string
  description?: string
  image?: GalleryImage
  title?: string
}

export type GalleryCategory =
  'amenities' | 'bedroom' | 'exterior' | 'kitchen' | 'living-room' | 'other'

export type GalleryImage = {
  alt: string
  category: GalleryCategory
  showcase: boolean
  src: string
}

export type SleepingArrangement = {
  bedSummary: string
  image: GalleryImage
  roomName: string
}

export type KnowledgeIconName =
  'calendar' | 'check' | 'clock' | 'events' | 'guests' | 'pets' | 'smoking'

export type ThingsToKnowContent = {
  cancellation: { details?: string; summary: string; title: string }
  readMore: string
  rules: {
    details?: string
    items: { icon: KnowledgeIconName; text: string }[]
    title: string
  }
  stay: { items: { icon: KnowledgeIconName; text: string }[]; title: string }
}

export type PropertyDetailContent = {
  amenities: { items: string[]; label: string }[]
  complexAndLocation: string
  description: string[]
  facts: string[]
  gallery: GalleryImage[]
  inquiry: { body: string; heading: string; platformNote: string }
  labels: {
    allHomes: string
    amenities: string
    approximateArea: string
    backToProperty: string
    closeGallery: string
    gallery: string
    locationNote: string
    openInGoogleMaps: string
    neighborhood: string
    nextPhoto: string
    photoCategories: Record<'showcase' | GalleryCategory, string>
    photoShowcase: string
    previousPhoto: string
    reviews: string
    showAllPhotos: string
    thingsToKnow: string
    viewPhotos: string
    whereYouSleep: string
  }
  name: string
  neighborhood: string
  map: { latitude?: number; longitude?: number; query: string }
  reviews: ReviewContent[]
  shortDescription: string
  slug: string
  seo?: SeoContent
  thingsToKnow: ThingsToKnowContent
  sleepingArrangements: SleepingArrangement[]
  whatsappHref: string
}

const sharedProperties = {
  penthouseLago: {
    name: 'Penthouse Lago',
    image: `${imageRoot}/photos-1787785697942-gu8s.png`,
    rating: '5.0',
  },
  vistaJacuzzi: {
    name: 'Vista & Jacuzzi',
    image: `${imageRoot}/photos-1787785697880-3xzc.png`,
    rating: '5.0',
  },
  terrazaDowntown: {
    name: 'Terraza Downtown',
    image: `${imageRoot}/photos-1787785697870-6vtr.png`,
    rating: '5.0',
  },
  terrazasEscazu: {
    name: 'Terrazas Escazú',
    image: `${imageRoot}/photos-1787785696851-363u.png`,
    rating: '4.9',
  },
  bosquesCarao: {
    name: 'Bosques de Carao',
    image: `${imageRoot}/photos-1787785691236-7d8c.png`,
    rating: '4.9',
  },
  beachfrontVilla: {
    name: 'Beachfront Villa',
    image: `${imageRoot}/photos-1787785691269-ev2k.png`,
    rating: '5.0',
  },
  playaLangosta: {
    name: 'Playa Langosta',
    image: `${imageRoot}/photos-1787785691303-146o.png`,
    rating: '4.9',
  },
} as const

function whatsappHref(message: string): string {
  return `https://wa.me/50688255888?text=${encodeURIComponent(message)}`
}

const homeContent: Record<Locale, HomeContent> = {
  en: {
    hero: {
      title: 'Find your happy place in Costa Rica',
      subtitle: 'Family-run for twenty years. Booked direct — no platform fees.',
      image: `${imageRoot}/photos-1787785691269-ev2k.png`,
      imageAlt: 'Pools and gardens overlooking Costa Rica’s Central Valley at sunset',
      mobileImage: `${imageRoot}/photos-1787785691269-ev2k.png`,
      mobileImageAlt: 'Pools and gardens overlooking Costa Rica’s Central Valley at sunset',
    },
    featured: {
      title: 'Homes our guests love',
      properties: [
        {
          ...sharedProperties.penthouseLago,
          href: '/en/properties/penthouse-lago',
          badge: 'Lakeview',
          bedrooms: '2 bedrooms',
          bathrooms: '2 baths',
          location: 'Santa Ana, Río Oro',
          alt: 'Mountain-view swimming pool at Avalon Country Club',
        },
        {
          ...sharedProperties.vistaJacuzzi,
          badge: 'Jacuzzi',
          bedrooms: '2 bedrooms',
          bathrooms: '2 baths',
          location: 'Santa Ana, Pozos',
          alt: 'Bright furnished living room opening onto a private balcony',
        },
        {
          ...sharedProperties.terrazaDowntown,
          badge: 'Walk to park',
          bedrooms: '2 bedrooms',
          bathrooms: '1 bath',
          location: 'Santa Ana Downtown',
          alt: 'Sunlit living and dining room with a garden view',
        },
        {
          ...sharedProperties.terrazasEscazu,
          badge: 'Escazú',
          bedrooms: '2 bedrooms',
          bathrooms: '2 baths',
          location: 'Guachipelín, Escazú',
          alt: 'Fully equipped kitchen with light wood cabinetry',
        },
        {
          ...sharedProperties.bosquesCarao,
          badge: 'Quiet retreat',
          bedrooms: '2 bedrooms',
          bathrooms: '2 baths',
          location: 'Santa Ana',
          alt: 'Calm bedroom with a green feature wall and garden view',
        },
      ],
    },
    pacific: {
      title: 'On the Pacific',
      intro: 'Two coastal homes for slower days by the water',
      properties: [
        {
          ...sharedProperties.beachfrontVilla,
          badge: 'Beachfront',
          bedrooms: '3 bedrooms',
          bathrooms: '2.5 baths',
          location: 'Playa Tivives',
          alt: 'Resort pool and palms glowing at sunset',
        },
        {
          ...sharedProperties.playaLangosta,
          badge: 'Steps to sand',
          bedrooms: '2 bedrooms',
          bathrooms: '2 baths',
          location: 'Playa Langosta',
          alt: 'Green Costa Rican landscape beneath a bright blue sky',
        },
      ],
    },
    reviews: {
      title: 'What guests say',
      proof: 'Highly rated across Airbnb, Booking.com, Vrbo and Expedia',
      reviews: [
        {
          quote:
            '“Perfect location near San José Airport and excellent communication. Santa Ana downtown is such a cute town with lots of restaurants and a nice park.”',
          attribution: 'Sarah — United States',
        },
        {
          quote:
            '“Beautiful apartment and very responsive hosts. The complex has amazing common grounds and it’s near La Chimba coffee plantation.”',
          attribution: 'Martin and Heike — Germany',
        },
        {
          quote:
            '“Ideal for our medical trip to Costa Rica. We stayed in a two-storey penthouse and loved it.”',
          attribution: 'Andrea — Canada',
        },
      ],
    },
    difference: {
      eyebrow: 'The Mariposa difference',
      title: 'Booked direct.',
      titleMuted: 'Managed by the family who owns it.',
      image: `${imageRoot}/photos-1787785697864-u83k.png`,
      imageAlt: 'Flowering trees and shared gardens at a CR Mariposa community',
      features: [
        {
          icon: 'home',
          title: 'Only fourteen homes',
          body: 'A small portfolio, each apartment chosen and furnished by us — not an open marketplace.',
        },
        {
          icon: 'wifi',
          title: 'Work-ready amenities',
          body: 'Fiber internet, full kitchens, air conditioning and laundry make longer stays easy.',
        },
        {
          icon: 'message',
          title: 'You reach the owner',
          body: 'WhatsApp goes to the family in English or Spanish. Replies are personal and practical.',
        },
        {
          icon: 'shield',
          title: 'Trusted across platforms',
          body: 'The same carefully managed homes are reviewed across four established travel platforms.',
        },
        {
          icon: 'location',
          title: 'Ideal locations',
          body: 'Close to the airport, Escazú, private hospitals and the everyday life of Santa Ana.',
        },
        {
          icon: 'calendar',
          title: 'Daily to monthly',
          body: 'Ask the family directly about the length and terms that fit your stay.',
        },
      ],
    },
    hospitalityDifference: {
      eyebrow: 'Hospitality, the Mariposa way',
      title: 'The stay you hoped for.',
      titleMuted: 'Beautiful homes, thoughtful care and honest value.',
      image: `${imageRoot}/photos-1787785691293-pk7i.png`,
      imageAlt: 'Swimming pool and clubhouse overlooking Costa Rica’s Central Valley',
      features: [
        {
          icon: 'home',
          title: 'Homes chosen with care',
          body: 'A small, personally managed collection — never an open marketplace.',
        },
        {
          icon: 'wifi',
          title: 'Everything for a real stay',
          body: 'Fiber Wi-Fi, full kitchens, laundry, air conditioning and welcoming shared spaces.',
        },
        {
          icon: 'message',
          title: 'A family, not a call center',
          body: 'Reach the people who know every home, in English or Spanish.',
        },
        {
          icon: 'calendar',
          title: 'Prepared before you arrive',
          body: 'Each home is cleaned, checked and ready so you can settle in from day one.',
        },
        {
          icon: 'location',
          title: 'Costa Rica outside your door',
          body: 'Central Valley convenience or slower days by the Pacific — choose the setting that fits.',
        },
        {
          icon: 'shield',
          title: 'Peace of mind',
          body: 'Established communities, practical local guidance and support throughout your stay.',
        },
      ],
    },
    contact: {
      heading: 'Planning your stay?',
      body: 'Share your dates and preferences. The family will personally confirm which home is the right fit.',
    },
    whatsappHref: whatsappHref(
      'Hello CR Mariposa, I would like to ask about a stay in Costa Rica.',
    ),
  },
  es: {
    hero: {
      title: 'Encuentra tu lugar feliz en Costa Rica',
      subtitle:
        'Una familia anfitriona por veinte años. Reserva directa, sin comisiones de plataforma.',
      image: `${imageRoot}/photos-1787785691269-ev2k.png`,
      imageAlt: 'Piscinas y jardines con vista al Valle Central de Costa Rica al atardecer',
      mobileImage: `${imageRoot}/photos-1787785691269-ev2k.png`,
      mobileImageAlt: 'Piscinas y jardines con vista al Valle Central de Costa Rica al atardecer',
    },
    featured: {
      title: 'Las casas favoritas de nuestros huéspedes',
      properties: [
        {
          ...sharedProperties.penthouseLago,
          href: '/es/properties/penthouse-lago',
          badge: 'Vista al lago',
          bedrooms: '2 habitaciones',
          bathrooms: '2 baños',
          location: 'Santa Ana, Río Oro',
          alt: 'Piscina con vista a las montañas en Avalon Country Club',
        },
        {
          ...sharedProperties.vistaJacuzzi,
          badge: 'Jacuzzi',
          bedrooms: '2 habitaciones',
          bathrooms: '2 baños',
          location: 'Santa Ana, Pozos',
          alt: 'Sala amueblada y luminosa con acceso a un balcón privado',
        },
        {
          ...sharedProperties.terrazaDowntown,
          badge: 'Cerca del parque',
          bedrooms: '2 habitaciones',
          bathrooms: '1 baño',
          location: 'Centro de Santa Ana',
          alt: 'Sala y comedor iluminados con vista al jardín',
        },
        {
          ...sharedProperties.terrazasEscazu,
          badge: 'Escazú',
          bedrooms: '2 habitaciones',
          bathrooms: '2 baños',
          location: 'Guachipelín, Escazú',
          alt: 'Cocina totalmente equipada con gabinetes de madera clara',
        },
        {
          ...sharedProperties.bosquesCarao,
          badge: 'Retiro tranquilo',
          bedrooms: '2 habitaciones',
          bathrooms: '2 baños',
          location: 'Santa Ana',
          alt: 'Habitación tranquila con pared verde y vista al jardín',
        },
      ],
    },
    pacific: {
      title: 'En el Pacífico',
      intro: 'Dos casas costeras para disfrutar días tranquilos junto al mar',
      properties: [
        {
          ...sharedProperties.beachfrontVilla,
          badge: 'Frente al mar',
          bedrooms: '3 habitaciones',
          bathrooms: '2.5 baños',
          location: 'Playa Tivives',
          alt: 'Piscina y palmeras iluminadas por el atardecer',
        },
        {
          ...sharedProperties.playaLangosta,
          badge: 'Cerca de la arena',
          bedrooms: '2 habitaciones',
          bathrooms: '2 baños',
          location: 'Playa Langosta',
          alt: 'Paisaje verde de Costa Rica bajo un cielo azul brillante',
        },
      ],
    },
    reviews: {
      title: 'Lo que dicen nuestros huéspedes',
      proof: 'Excelentes calificaciones en Airbnb, Booking.com, Vrbo y Expedia',
      reviews: [
        {
          quote:
            '“Ubicación perfecta cerca del aeropuerto de San José y excelente comunicación. El centro de Santa Ana tiene muchos restaurantes y un parque precioso.”',
          attribution: 'Sarah — Estados Unidos',
        },
        {
          quote:
            '“Apartamento hermoso y anfitriones muy atentos. El complejo tiene áreas comunes increíbles y está cerca de la plantación de café La Chimba.”',
          attribution: 'Martin y Heike — Alemania',
        },
        {
          quote:
            '“Ideal para nuestro viaje médico a Costa Rica. Nos hospedamos en un penthouse de dos niveles y nos encantó.”',
          attribution: 'Andrea — Canadá',
        },
      ],
    },
    difference: {
      eyebrow: 'La diferencia Mariposa',
      title: 'Reserva directa.',
      titleMuted: 'Administrado por la familia propietaria.',
      image: `${imageRoot}/photos-1787785697864-u83k.png`,
      imageAlt: 'Árboles floreados y jardines compartidos en una comunidad de CR Mariposa',
      features: [
        {
          icon: 'home',
          title: 'Solo catorce casas',
          body: 'Un portafolio pequeño: cada apartamento fue elegido y amueblado por nosotros.',
        },
        {
          icon: 'wifi',
          title: 'Listas para trabajar',
          body: 'Internet de fibra, cocina completa, aire acondicionado y lavandería facilitan estadías largas.',
        },
        {
          icon: 'message',
          title: 'Hablas con el propietario',
          body: 'WhatsApp llega a la familia en español o inglés. Las respuestas son personales y prácticas.',
        },
        {
          icon: 'shield',
          title: 'Confianza comprobada',
          body: 'Las mismas casas, cuidadosamente administradas, reciben reseñas en cuatro plataformas reconocidas.',
        },
        {
          icon: 'location',
          title: 'Ubicaciones ideales',
          body: 'Cerca del aeropuerto, Escazú, hospitales privados y la vida cotidiana de Santa Ana.',
        },
        {
          icon: 'calendar',
          title: 'De días a meses',
          body: 'Consulta directamente con la familia sobre la duración y los términos de tu estadía.',
        },
      ],
    },
    hospitalityDifference: {
      eyebrow: 'Hospitalidad al estilo Mariposa',
      title: 'La estadía que imaginabas.',
      titleMuted: 'Casas hermosas, atención cercana y un valor honesto.',
      image: `${imageRoot}/photos-1787785691293-pk7i.png`,
      imageAlt: 'Piscina y casa club con vista al Valle Central de Costa Rica',
      features: [
        {
          icon: 'home',
          title: 'Casas elegidas con cuidado',
          body: 'Una colección pequeña y administrada personalmente; nunca un mercado abierto.',
        },
        {
          icon: 'wifi',
          title: 'Todo para una estadía real',
          body: 'Wi-Fi de fibra, cocina completa, lavandería, aire acondicionado y agradables áreas comunes.',
        },
        {
          icon: 'message',
          title: 'Una familia, no un centro de llamadas',
          body: 'Habla con quienes conocen cada casa, en español o inglés.',
        },
        {
          icon: 'calendar',
          title: 'Todo listo antes de tu llegada',
          body: 'Cada casa se limpia, revisa y prepara para que te instales cómodamente desde el primer día.',
        },
        {
          icon: 'location',
          title: 'Costa Rica a tu alrededor',
          body: 'La conveniencia del Valle Central o días más tranquilos junto al Pacífico: elige tu ambiente.',
        },
        {
          icon: 'shield',
          title: 'Tranquilidad',
          body: 'Comunidades consolidadas, orientación local práctica y apoyo durante toda tu estadía.',
        },
      ],
    },
    contact: {
      heading: '¿Planeas tu estadía?',
      body: 'Comparte tus fechas y preferencias. La familia confirmará personalmente cuál casa es ideal para ti.',
    },
    whatsappHref: whatsappHref(
      'Hola CR Mariposa, quisiera consultar sobre una estadía en Costa Rica.',
    ),
  },
}

const footerContent: Record<Locale, FooterContent> = {
  en: {
    contact: mariposaContact,
    findUsOn: 'Find us on',
    platformPlaceholder: 'Link pending',
    platforms: ['Airbnb', 'Booking.com', 'Vrbo', 'Expedia', 'Instagram', 'Facebook'].map(
      (label) => ({ label }),
    ),
    intro: 'Family-run furnished rentals in Costa Rica for over twenty years.',
    stayHeading: 'Stay',
    stay: [
      { label: 'All homes', href: '/properties' },
      { label: 'Santa Ana', href: '#homes' },
      { label: 'Beach homes', href: '#pacific' },
      { label: 'Monthly stays', href: '/contact' },
    ],
    companyHeading: 'Company',
    company: [
      { label: 'About us', href: '/about' },
      {
        label: 'Property management',
        href: '/property-management',
      },
      { label: 'Guest reviews', href: '#reviews' },
      { label: 'Contact', href: '/contact' },
    ],
    touchHeading: 'Get in touch',
    location: 'Santa Ana, Costa Rica',
    tagline: 'Find your happy place in Costa Rica',
    copyright: '© 2026 CR Mariposa Rentals',
  },
  es: {
    contact: mariposaContact,
    findUsOn: 'Encuéntranos en',
    platformPlaceholder: 'Enlace pendiente',
    platforms: ['Airbnb', 'Booking.com', 'Vrbo', 'Expedia', 'Instagram', 'Facebook'].map(
      (label) => ({ label }),
    ),
    intro:
      'Alquileres amueblados administrados por una familia en Costa Rica desde hace más de veinte años.',
    stayHeading: 'Hospédate',
    stay: [
      { label: 'Todas las casas', href: '/properties' },
      { label: 'Santa Ana', href: '#homes' },
      { label: 'Casas de playa', href: '#pacific' },
      { label: 'Estadías mensuales', href: '/contact' },
    ],
    companyHeading: 'Compañía',
    company: [
      { label: 'Sobre nosotros', href: '#difference' },
      {
        label: 'Administración de propiedades',
        href: '/property-management',
      },
      { label: 'Reseñas', href: '#reviews' },
      { label: 'Contacto', href: '/contact' },
    ],
    touchHeading: 'Contáctanos',
    location: 'Santa Ana, Costa Rica',
    tagline: 'Encuentra tu lugar feliz en Costa Rica',
    copyright: '© 2026 CR Mariposa Rentals',
  },
}

const gallerySources = [
  'photos-1787785691293-pk7i.png',
  'photos-1787785691164-cuw2.png',
  'photos-1787785697850-pz84.png',
  'photos-1787785696851-363u.png',
  'photos-1787785691236-7d8c.png',
  'photos-1787785691207-p6vg.png',
  'photos-1787785697880-3xzc.png',
  'photos-1787785697870-6vtr.png',
  'photos-1787785697872-9y68.png',
  'photos-1787785697942-gu8s.png',
  'photos-1787785691269-ev2k.png',
  'photos-1787785697864-u83k.png',
  'photos-1787785691303-146o.png',
] as const

const galleryAlts: Record<Locale, string[]> = {
  en: [
    'Main swimming pool at Avalon Country Club',
    'Living room opening onto the private balcony',
    'Guest bedroom with garden and mountain views',
    'Fully equipped kitchen',
    'Primary bedroom with a green feature wall',
    'Entry hall leading into the open living space',
    'Dining area and furnished living room',
    'Open-plan living room with balcony view',
    'Private balcony beneath a bright Costa Rican sky',
    'Lap pool framed by green mountains',
    'Pools overlooking the Central Valley at sunset',
    'Flowering trees and the shared play area',
    'Covered resident parking surrounded by greenery',
  ],
  es: [
    'Piscina principal de Avalon Country Club',
    'Sala con acceso al balcón privado',
    'Habitación de huéspedes con vista al jardín y las montañas',
    'Cocina totalmente equipada',
    'Habitación principal con pared verde',
    'Pasillo de entrada hacia la sala abierta',
    'Comedor y sala amueblada',
    'Sala de concepto abierto con vista al balcón',
    'Balcón privado bajo un cielo brillante de Costa Rica',
    'Piscina de natación rodeada de montañas verdes',
    'Piscinas con vista al Valle Central al atardecer',
    'Árboles floreados y área de juegos compartida',
    'Estacionamiento cubierto rodeado de vegetación',
  ],
}

const galleryMetadata: { category: GalleryCategory; showcase: boolean }[] = [
  { category: 'amenities', showcase: true },
  { category: 'living-room', showcase: true },
  { category: 'bedroom', showcase: true },
  { category: 'kitchen', showcase: true },
  { category: 'bedroom', showcase: true },
  { category: 'living-room', showcase: false },
  { category: 'living-room', showcase: true },
  { category: 'living-room', showcase: false },
  { category: 'exterior', showcase: true },
  { category: 'amenities', showcase: true },
  { category: 'amenities', showcase: false },
  { category: 'exterior', showcase: false },
  { category: 'exterior', showcase: false },
]

function gallery(locale: Locale): GalleryImage[] {
  return gallerySources.map((src, index) => ({
    alt: galleryAlts[locale][index],
    category: galleryMetadata[index]?.category || 'other',
    showcase: galleryMetadata[index]?.showcase || false,
    src: `${imageRoot}/${src}`,
  }))
}

function sleepingArrangements(locale: Locale): SleepingArrangement[] {
  const images = gallery(locale)
  return [
    {
      bedSummary: locale === 'en' ? '1 bed' : '1 cama',
      image: images[4],
      roomName: locale === 'en' ? 'Bedroom 1' : 'Habitación 1',
    },
    {
      bedSummary: locale === 'en' ? '1 bed' : '1 cama',
      image: images[2],
      roomName: locale === 'en' ? 'Bedroom 2' : 'Habitación 2',
    },
  ]
}

const propertyContent: Record<Locale, PropertyDetailContent> = {
  en: {
    slug: 'penthouse-lago',
    name: 'Penthouse Lago',
    complexAndLocation: 'Avalon Country Club · Santa Ana, Río Oro',
    facts: ['2 bedrooms', '2 baths', 'Mezzanine', 'Lakeview'],
    gallery: gallery('en'),
    sleepingArrangements: sleepingArrangements('en'),
    shortDescription:
      'A two-level penthouse at Avalon Country Club with a mezzanine and views across the lake, ten minutes from Santa Ana’s restaurants and twenty-five from the airport.',
    description: [
      'Bright social spaces open onto a private balcony, while two comfortable bedrooms give couples, families or business travellers room to settle in.',
      'The full kitchen, in-home laundry and reliable fiber connection make the apartment equally comfortable for a short visit or an extended stay.',
    ],
    amenities: [
      { label: 'Home', items: ['Air conditioning', 'Washer & dryer', 'Workspace'] },
      { label: 'Kitchen', items: ['Full kitchen', 'Coffee maker', 'Dishwasher'] },
      { label: 'Comfort', items: ['Mezzanine', 'Private balcony', 'Lake view'] },
      { label: 'Connectivity', items: ['Fiber Wi-Fi', 'Smart TV'] },
      { label: 'Community', items: ['Swimming pools', '24-hour security', 'Gym'] },
      { label: 'Parking', items: ['Covered space', 'Visitor parking'] },
    ],
    reviews: [
      {
        quote:
          '“Ideal for our medical trip to Costa Rica. The apartment was comfortable, peaceful and close to everything we needed.”',
        attribution: 'Andrea — Canada',
      },
      {
        quote:
          '“Beautiful apartment and very responsive hosts. The complex has amazing common grounds.”',
        attribution: 'Martin and Heike — Germany',
      },
    ],
    neighborhood:
      'Río Oro is a peaceful part of Santa Ana with quick access to restaurants, private hospitals, Escazú and Juan Santamaría International Airport.',
    map: { query: 'Santa Ana, Río Oro, Costa Rica' },
    thingsToKnow: {
      cancellation: {
        title: 'Cancellation & terms',
        summary: 'Cancellation terms are confirmed personally before your stay.',
        details:
          'Because stay lengths vary, the terms that apply to your inquiry are shared clearly before you confirm.',
      },
      readMore: 'Read more',
      rules: {
        title: 'Property rules',
        items: [
          { icon: 'pets', text: 'Pets on request' },
          { icon: 'smoking', text: 'No smoking' },
          { icon: 'events', text: 'Ask before planning events' },
        ],
        details:
          'Please discuss any special use of the home with the family before confirming your stay.',
      },
      stay: {
        title: 'Stay details',
        items: [
          { icon: 'clock', text: 'Check-in after 3:00 pm' },
          { icon: 'clock', text: 'Check-out before 11:00 am' },
          { icon: 'guests', text: '4 guests maximum' },
        ],
      },
    },
    inquiry: {
      heading: 'Ask about Penthouse Lago',
      body: 'Message the family that manages it. Dates are confirmed personally, usually within the hour.',
      platformNote:
        'Also listed on Airbnb, Booking.com, Vrbo and Expedia. Contacting us directly avoids platform fees.',
    },
    labels: {
      allHomes: 'All homes',
      viewPhotos: 'View all photos',
      showAllPhotos: 'Show all photos',
      closeGallery: 'Close gallery',
      backToProperty: 'Back to property',
      previousPhoto: 'Previous photo',
      nextPhoto: 'Next photo',
      gallery: 'Property gallery',
      photoShowcase: 'Photo showcase',
      photoCategories: {
        showcase: 'Showcase',
        exterior: 'Exterior',
        'living-room': 'Living room',
        kitchen: 'Kitchen',
        bedroom: 'Bedrooms',
        amenities: 'Amenities',
        other: 'More',
      },
      amenities: 'Amenities',
      whereYouSleep: 'Where you’ll sleep',
      reviews: 'Guest reviews',
      neighborhood: 'The neighbourhood',
      approximateArea: 'Approximate area · Santa Ana, Río Oro',
      locationNote: 'Shown at district level. The exact address is shared after confirmation.',
      openInGoogleMaps: 'Open in Google Maps',
      thingsToKnow: 'Things to know',
    },
    whatsappHref: whatsappHref('Hello CR Mariposa, I would like to ask about Penthouse Lago.'),
  },
  es: {
    slug: 'penthouse-lago',
    name: 'Penthouse Lago',
    complexAndLocation: 'Avalon Country Club · Santa Ana, Río Oro',
    facts: ['2 habitaciones', '2 baños', 'Mezanine', 'Vista al lago'],
    gallery: gallery('es'),
    sleepingArrangements: sleepingArrangements('es'),
    shortDescription:
      'Un penthouse de dos niveles en Avalon Country Club, con mezanine y vistas al lago, a diez minutos de los restaurantes de Santa Ana y veinticinco del aeropuerto.',
    description: [
      'Los espacios sociales iluminados se abren a un balcón privado, mientras dos cómodas habitaciones ofrecen espacio para parejas, familias o viajeros de negocios.',
      'La cocina completa, la lavandería dentro del apartamento y la conexión de fibra lo hacen cómodo tanto para una visita corta como para una estadía prolongada.',
    ],
    amenities: [
      { label: 'Hogar', items: ['Aire acondicionado', 'Lavadora y secadora', 'Área de trabajo'] },
      { label: 'Cocina', items: ['Cocina completa', 'Cafetera', 'Lavaplatos'] },
      { label: 'Comodidad', items: ['Mezanine', 'Balcón privado', 'Vista al lago'] },
      { label: 'Conectividad', items: ['Wi-Fi de fibra', 'Smart TV'] },
      { label: 'Comunidad', items: ['Piscinas', 'Seguridad 24 horas', 'Gimnasio'] },
      { label: 'Parqueo', items: ['Espacio cubierto', 'Parqueo para visitas'] },
    ],
    reviews: [
      {
        quote:
          '“Ideal para nuestro viaje médico a Costa Rica. El apartamento era cómodo, tranquilo y cerca de todo lo que necesitábamos.”',
        attribution: 'Andrea — Canadá',
      },
      {
        quote:
          '“Apartamento hermoso y anfitriones muy atentos. El complejo tiene áreas comunes increíbles.”',
        attribution: 'Martin y Heike — Alemania',
      },
    ],
    neighborhood:
      'Río Oro es una zona tranquila de Santa Ana con acceso rápido a restaurantes, hospitales privados, Escazú y el Aeropuerto Internacional Juan Santamaría.',
    map: { query: 'Santa Ana, Río Oro, Costa Rica' },
    thingsToKnow: {
      cancellation: {
        title: 'Cancelación y condiciones',
        summary: 'Las condiciones de cancelación se confirman personalmente antes de tu estadía.',
        details:
          'Como la duración de cada estadía varía, compartimos claramente las condiciones aplicables antes de que confirmes.',
      },
      readMore: 'Leer más',
      rules: {
        title: 'Reglas de la propiedad',
        items: [
          { icon: 'pets', text: 'Mascotas previa consulta' },
          { icon: 'smoking', text: 'No se permite fumar' },
          { icon: 'events', text: 'Consulta antes de planificar eventos' },
        ],
        details:
          'Conversa con la familia sobre cualquier uso especial de la casa antes de confirmar tu estadía.',
      },
      stay: {
        title: 'Detalles de la estadía',
        items: [
          { icon: 'clock', text: 'Llegada después de las 3:00 pm' },
          { icon: 'clock', text: 'Salida antes de las 11:00 am' },
          { icon: 'guests', text: 'Máximo 4 huéspedes' },
        ],
      },
    },
    inquiry: {
      heading: 'Consulta sobre Penthouse Lago',
      body: 'Escribe a la familia que lo administra. Las fechas se confirman personalmente, normalmente en menos de una hora.',
      platformNote:
        'También está publicado en Airbnb, Booking.com, Vrbo y Expedia. El contacto directo evita comisiones de plataforma.',
    },
    labels: {
      allHomes: 'Todas las casas',
      viewPhotos: 'Ver todas las fotos',
      showAllPhotos: 'Ver todas las fotos',
      closeGallery: 'Cerrar galería',
      backToProperty: 'Volver a la propiedad',
      previousPhoto: 'Foto anterior',
      nextPhoto: 'Foto siguiente',
      gallery: 'Galería de la propiedad',
      photoShowcase: 'Galería de fotos',
      photoCategories: {
        showcase: 'Selección',
        exterior: 'Exterior',
        'living-room': 'Sala',
        kitchen: 'Cocina',
        bedroom: 'Habitaciones',
        amenities: 'Comodidades',
        other: 'Más',
      },
      amenities: 'Comodidades',
      whereYouSleep: 'Dónde dormirás',
      reviews: 'Reseñas de huéspedes',
      neighborhood: 'El vecindario',
      approximateArea: 'Zona aproximada · Santa Ana, Río Oro',
      locationNote:
        'Se muestra la zona general. La dirección exacta se comparte después de confirmar.',
      openInGoogleMaps: 'Abrir en Google Maps',
      thingsToKnow: 'Información importante',
    },
    whatsappHref: whatsappHref('Hola CR Mariposa, quisiera consultar sobre Penthouse Lago.'),
  },
}

export function getHomeContent(locale: Locale): HomeContent {
  return homeContent[locale]
}

export function getFooterContent(locale: Locale): FooterContent {
  return footerContent[locale]
}

export function getPropertyContent(
  locale: Locale,
  slug: string,
): PropertyDetailContent | undefined {
  const property = propertyContent[locale]
  return property.slug === slug ? property : undefined
}
