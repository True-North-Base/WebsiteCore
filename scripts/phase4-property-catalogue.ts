export type LocalizedText = { en: string; es: string }

export type PropertyImageSeed = {
  alt: LocalizedText
  category: 'amenities' | 'bedroom' | 'exterior' | 'kitchen' | 'living-room' | 'other'
  url: string
}

export type PropertySeed = {
  amenities: string[]
  badge: LocalizedText
  bathrooms: number
  bedrooms: number
  beds?: number
  complexName?: string
  description: { en: string[]; es: string[] }
  displayOrder: number
  district: LocalizedText
  extraFacts: { en: string[]; es: string[] }
  featured: boolean
  images: PropertyImageSeed[]
  neighborhood: LocalizedText
  parking?: LocalizedText
  region: 'central-valley' | 'pacific-coast'
  shortDescription: LocalizedText
  sleeping: { bed: LocalizedText; image: number; room: LocalizedText }[]
  slug: string
  title: string
}

const sq = 'https://images.squarespace-cdn.com/content/v1/6a1f52446dcd774933433c94'

export const phase4Properties: PropertySeed[] = [
  {
    slug: 'terrazas-escazu',
    title: 'Terrazas Escazu',
    district: { en: 'Escazú, Guachipelín', es: 'Escazú, Guachipelín' },
    complexName: 'Infinity Terrace Condominium',
    region: 'central-valley',
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    badge: { en: 'Escazú', es: 'Escazú' },
    shortDescription: {
      en: 'A bright two-bedroom apartment in Guachipelín with a private balcony, a dedicated office area and quick access to Escazú shopping and medical services.',
      es: 'Un luminoso apartamento de dos habitaciones en Guachipelín, con balcón privado, área de oficina y acceso rápido a comercios y servicios médicos de Escazú.',
    },
    description: {
      en: [
        'The open living and dining area looks toward the hills and city lights. A fully equipped kitchen and dedicated study make the home practical for both short visits and remote work.',
        'Infinity Terrace offers a swimming pool, cardio gym, elevator, green common areas and controlled access with 24-hour security.',
      ],
      es: [
        'La sala y el comedor de concepto abierto miran hacia las colinas y las luces de la ciudad. La cocina equipada y el estudio hacen que la casa sea práctica para visitas cortas y trabajo remoto.',
        'Infinity Terrace ofrece piscina, gimnasio cardiovascular, elevador, áreas verdes y acceso controlado con seguridad las 24 horas.',
      ],
    },
    neighborhood: {
      en: 'Guachipelín places guests minutes from Multiplaza, Hospital CIMA, Avenida Escazú, supermarkets, cafés and Route 27.',
      es: 'Guachipelín está a pocos minutos de Multiplaza, Hospital CIMA, Avenida Escazú, supermercados, cafés y la Ruta 27.',
    },
    parking: { en: '2 covered spaces', es: '2 espacios cubiertos' },
    extraFacts: {
      en: ['Office area', 'Private balcony'],
      es: ['Área de oficina', 'Balcón privado'],
    },
    amenities: [
      'air-conditioning',
      'wifi',
      'full-kitchen',
      'workspace',
      'balcony',
      'pool',
      'gym',
      'security',
      'parking',
    ],
    sleeping: [
      {
        room: { en: 'Bedroom 1', es: 'Habitación 1' },
        bed: { en: '1 bed', es: '1 cama' },
        image: 1,
      },
      {
        room: { en: 'Bedroom 2', es: 'Habitación 2' },
        bed: { en: '1 bed', es: '1 cama' },
        image: 2,
      },
    ],
    displayOrder: 20,
    featured: true,
    images: [
      {
        category: 'living-room',
        alt: {
          en: 'Living room and balcony at Terrazas Escazu',
          es: 'Sala y balcón de Terrazas Escazu',
        },
        url: `${sq}/4553d09c-08e0-4a99-b06d-4ceb712bf23d/BC885B8A-B4BC-4108-B159-A36C6D15F883.PNG`,
      },
      {
        category: 'bedroom',
        alt: {
          en: 'Primary bedroom with large window',
          es: 'Habitación principal con ventana grande',
        },
        url: `${sq}/7630667c-e2b1-48c7-9857-f17c45780cff/6B60B26A-7D08-4810-A3CA-D9501B6B8781.PNG`,
      },
      {
        category: 'bedroom',
        alt: {
          en: 'Second bedroom with stone feature wall',
          es: 'Segunda habitación con pared de piedra',
        },
        url: `${sq}/7ecba0ca-b519-4044-ba36-a644bcae90db/458AEAF4-9239-4AB5-A39E-69EEEA188CFB.PNG`,
      },
      {
        category: 'other',
        alt: { en: 'Modern full bathroom', es: 'Baño completo moderno' },
        url: `${sq}/51d666c6-4c6c-4b6b-8a4a-6c5b3d6bbed4/D223E3CB-75D0-43B0-9AA3-F3E30616A755.PNG`,
      },
      {
        category: 'amenities',
        alt: { en: 'Infinity Terrace swimming pool', es: 'Piscina de Infinity Terrace' },
        url: `${sq}/286e3365-510c-476a-88bf-01c2d05b9174/IMG_1963+2.JPG`,
      },
      {
        category: 'exterior',
        alt: {
          en: 'Green views from Infinity Terrace',
          es: 'Vistas verdes desde Infinity Terrace',
        },
        url: `${sq}/312765a5-77f6-4624-ad8f-17088420e6c7/IMG_1964+2.JPG`,
      },
    ],
  },
  {
    slug: 'penthouse-oasis',
    title: 'Penthouse Oasis',
    district: { en: 'Santa Ana, Río Oro', es: 'Santa Ana, Río Oro' },
    complexName: 'Avalon Country Club',
    region: 'central-valley',
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    badge: { en: 'Spacious penthouse', es: 'Penthouse amplio' },
    shortDescription: {
      en: 'A spacious two-bedroom penthouse with two balconies and an air-conditioned mezzanine office at Avalon Country Club.',
      es: 'Un penthouse amplio de dos habitaciones con dos balcones y oficina con aire acondicionado en el mezanine de Avalon Country Club.',
    },
    description: {
      en: [
        'The 110 m² home has an open living area, a fully equipped kitchen and a mezzanine with two desks for remote work.',
        'Guests have access to the community pool, gym, coworking room, tennis courts, playground, restaurant and walking paths.',
      ],
      es: [
        'La casa de 110 m² tiene sala abierta, cocina equipada y un mezanine con dos escritorios para trabajo remoto.',
        'Los huéspedes tienen acceso a piscina, gimnasio, coworking, canchas de tenis, área de juegos, restaurante y senderos.',
      ],
    },
    neighborhood: {
      en: 'Río Oro offers quick access to Santa Ana shops, restaurants, supermarkets, Route 27 and the airport.',
      es: 'Río Oro ofrece acceso rápido a comercios, restaurantes y supermercados de Santa Ana, la Ruta 27 y el aeropuerto.',
    },
    parking: { en: 'Covered parking', es: 'Parqueo cubierto' },
    extraFacts: {
      en: ['Mezzanine office', '2 balconies'],
      es: ['Oficina en mezanine', '2 balcones'],
    },
    amenities: [
      'air-conditioning',
      'wifi',
      'full-kitchen',
      'workspace',
      'balcony',
      'pool',
      'gym',
      'tennis',
      'restaurant',
      'security',
      'parking',
    ],
    sleeping: [
      {
        room: { en: 'Primary bedroom', es: 'Habitación principal' },
        bed: { en: '1 king bed', es: '1 cama king' },
        image: 2,
      },
      {
        room: { en: 'Bedroom 2', es: 'Habitación 2' },
        bed: { en: '1 queen bed', es: '1 cama queen' },
        image: 3,
      },
    ],
    displayOrder: 30,
    featured: true,
    images: [
      {
        category: 'living-room',
        alt: {
          en: 'Open living and dining room at Penthouse Oasis',
          es: 'Sala y comedor abiertos de Penthouse Oasis',
        },
        url: `${sq}/2ebf41e7-21b0-4cb1-8d52-191919c97caf/727E8306-9248-4DF9-9235-30ED41DE2D36.PNG`,
      },
      {
        category: 'kitchen',
        alt: { en: 'Fully equipped kitchen', es: 'Cocina totalmente equipada' },
        url: `${sq}/170356c9-40f5-48ec-870d-977b657c14a4/FE7C8A8B-A69A-4CF4-9379-E3970BC8A16A.PNG`,
      },
      {
        category: 'bedroom',
        alt: {
          en: 'Primary bedroom with private balcony',
          es: 'Habitación principal con balcón privado',
        },
        url: `${sq}/45c1eca6-93a5-4ecf-8268-6f73e439fb85/4FE50F1F-5BEE-4C86-A6D9-AF92B3125358.PNG`,
      },
      {
        category: 'bedroom',
        alt: { en: 'Bright second bedroom', es: 'Segunda habitación luminosa' },
        url: `${sq}/9f8e7e8f-b9be-4580-a089-67eb44ff8590/B52A43C7-E492-4B5A-860F-C6F8A831F42C.PNG`,
      },
      {
        category: 'other',
        alt: {
          en: 'Mezzanine office with two desks',
          es: 'Oficina en mezanine con dos escritorios',
        },
        url: `${sq}/d9d74143-a023-4305-ad49-303d9e0189ad/BB24C42F-9DA1-4144-8135-D2B21C3119C8.PNG`,
      },
      {
        category: 'amenities',
        alt: {
          en: 'Avalon Country Club pool at sunset',
          es: 'Piscina de Avalon Country Club al atardecer',
        },
        url: `${sq}/ff047c87-d227-402d-9069-32f22dde4c1d/D78CA8A4-E9CB-4440-B924-20AE46E3A3AA.PNG`,
      },
    ],
  },
  {
    slug: 'terraza-downtown',
    title: 'Terraza Downtown',
    district: { en: 'Downtown Santa Ana', es: 'Centro de Santa Ana' },
    complexName: 'Condominio Avalon',
    region: 'central-valley',
    bedrooms: 2,
    beds: 3,
    bathrooms: 1,
    badge: { en: 'Large terrace', es: 'Terraza amplia' },
    shortDescription: {
      en: 'A second-floor two-bedroom apartment with a large terrace in walkable downtown Santa Ana.',
      es: 'Un apartamento de dos habitaciones en el segundo piso, con una amplia terraza en el centro caminable de Santa Ana.',
    },
    description: {
      en: [
        'The home includes a living room, equipped kitchen, laundry room, one full bathroom and a sofa bed in addition to the two bedrooms.',
        'The secure community has a pool, playground, shared ranch, small gym and riverside walking areas.',
      ],
      es: [
        'La casa incluye sala, cocina equipada, lavandería, un baño completo y un sofá cama además de las dos habitaciones.',
        'El condominio seguro cuenta con piscina, área de juegos, rancho compartido, gimnasio pequeño y zonas para caminar junto al río.',
      ],
    },
    neighborhood: {
      en: 'Downtown Santa Ana puts local cafés, restaurants, supermarkets, pharmacies and the Sunday farmers market within easy reach.',
      es: 'El centro de Santa Ana deja cafés, restaurantes, supermercados, farmacias y la feria del domingo al alcance.',
    },
    parking: { en: '1 parking space', es: '1 espacio de parqueo' },
    extraFacts: {
      en: ['Large terrace', 'Walk to town'],
      es: ['Terraza amplia', 'Cerca del centro'],
    },
    amenities: [
      'air-conditioning',
      'wifi',
      'full-kitchen',
      'laundry',
      'balcony',
      'pool',
      'gym',
      'security',
      'parking',
    ],
    sleeping: [
      {
        room: { en: 'Bedroom 1', es: 'Habitación 1' },
        bed: { en: '1 bed', es: '1 cama' },
        image: 2,
      },
      {
        room: { en: 'Bedroom 2', es: 'Habitación 2' },
        bed: { en: '1 bed', es: '1 cama' },
        image: 3,
      },
    ],
    displayOrder: 40,
    featured: true,
    images: [
      {
        category: 'living-room',
        alt: {
          en: 'Living and dining room at Terraza Downtown',
          es: 'Sala y comedor de Terraza Downtown',
        },
        url: `${sq}/77edf2a8-a64d-46a8-97c8-97c5fffb0481/D46B9DED-9147-421E-9EBE-ADD574C41AC7.PNG`,
      },
      {
        category: 'kitchen',
        alt: { en: 'Compact equipped kitchen', es: 'Cocina compacta equipada' },
        url: `${sq}/7036ffdc-6f29-4f15-8ffb-085e8d276e76/9921F69B-3F2A-45FF-9473-2AA4C52B0A98.PNG`,
      },
      {
        category: 'bedroom',
        alt: {
          en: 'Primary bedroom with balcony doors',
          es: 'Habitación principal con acceso al balcón',
        },
        url: `${sq}/819833c1-6656-43c0-9c7a-7183096adc14/F8AFC05E-513E-4AAC-8B1E-AE738FE09A8B.PNG`,
      },
      {
        category: 'bedroom',
        alt: {
          en: 'Second bedroom with garden view',
          es: 'Segunda habitación con vista al jardín',
        },
        url: `${sq}/76af3657-0d7c-41fe-8c46-a03d3d800d8b/1BF0B2ED-7BBE-4659-8632-586E06D43331.PNG`,
      },
      {
        category: 'exterior',
        alt: { en: 'Private furnished terrace', es: 'Terraza privada amueblada' },
        url: `${sq}/7aa36953-0e24-458b-8d19-8103efb47a66/A630C399-91A0-4542-8644-149A2C7C9320.PNG`,
      },
      {
        category: 'amenities',
        alt: { en: 'Community swimming pool', es: 'Piscina del condominio' },
        url: `${sq}/e6ff3f3d-7aa6-4a72-b510-2a16b0bb6972/6DB3DBFA-E07A-4100-BC49-F6B9DA2E894E.PNG`,
      },
    ],
  },
  {
    slug: 'riverpark-downtown',
    title: 'RiverPark Downtown',
    district: { en: 'Downtown Santa Ana', es: 'Centro de Santa Ana' },
    complexName: 'River Park by Avalon',
    region: 'central-valley',
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    badge: { en: 'First floor', es: 'Primer piso' },
    shortDescription: {
      en: 'A modern first-floor two-bedroom apartment near downtown Santa Ana, with a private patio and resort-style community amenities.',
      es: 'Un apartamento moderno de dos habitaciones en el primer piso, cerca del centro de Santa Ana, con patio privado y amenidades tipo resort.',
    },
    description: {
      en: [
        'The apartment has one king bed, one queen bed, a full kitchen and bright living spaces that open to the patio.',
        'The gated community offers pools, playgrounds, tennis, a gym and shared lounge areas.',
      ],
      es: [
        'El apartamento tiene una cama king, una cama queen, cocina completa y espacios sociales luminosos que se abren al patio.',
        'El condominio cerrado ofrece piscinas, áreas de juegos, tenis, gimnasio y salones compartidos.',
      ],
    },
    neighborhood: {
      en: 'The peaceful neighborhood is close to downtown cafés and restaurants, Lindora, Route 27 and Juan Santamaría International Airport.',
      es: 'El vecindario tranquilo está cerca de cafés y restaurantes del centro, Lindora, la Ruta 27 y el Aeropuerto Internacional Juan Santamaría.',
    },
    extraFacts: { en: ['First floor', 'Private patio'], es: ['Primer piso', 'Patio privado'] },
    amenities: [
      'air-conditioning',
      'wifi',
      'full-kitchen',
      'balcony',
      'pool',
      'gym',
      'tennis',
      'security',
    ],
    sleeping: [
      {
        room: { en: 'Primary bedroom', es: 'Habitación principal' },
        bed: { en: '1 king bed', es: '1 cama king' },
        image: 2,
      },
      {
        room: { en: 'Bedroom 2', es: 'Habitación 2' },
        bed: { en: '1 queen bed', es: '1 cama queen' },
        image: 3,
      },
    ],
    displayOrder: 50,
    featured: true,
    images: [
      {
        category: 'living-room',
        alt: {
          en: 'Living and dining area at RiverPark Downtown',
          es: 'Sala y comedor de RiverPark Downtown',
        },
        url: `${sq}/69943aff-3ace-4212-949a-28d3973ca271/B5D13243-373F-4FAB-8C45-74F41B735205.PNG`,
      },
      {
        category: 'living-room',
        alt: { en: 'Open living area and kitchen', es: 'Sala abierta y cocina' },
        url: `${sq}/1197b331-df2c-4b18-a687-07b5449af13e/4B6CB418-D7BC-48BA-8E57-A48504251683.PNG`,
      },
      {
        category: 'bedroom',
        alt: { en: 'Primary bedroom with workspace', es: 'Habitación principal con escritorio' },
        url: `${sq}/7301d9aa-4b9e-4f8b-8ea2-4c817595286a/CA753FFE-3E6A-4595-8F32-E93B56E2C05C.PNG`,
      },
      {
        category: 'bedroom',
        alt: {
          en: 'Second bedroom with desk and television',
          es: 'Segunda habitación con escritorio y televisión',
        },
        url: `${sq}/95de686f-1f5f-4e57-b37c-1834930e106d/8FB66144-0DAD-45C5-8BCB-BEE45641C0AA.PNG`,
      },
      {
        category: 'exterior',
        alt: { en: 'Private first-floor patio', es: 'Patio privado del primer piso' },
        url: `${sq}/1b215f11-d2ef-4592-892d-7b283e24f324/650A9C17-A97D-4297-A38F-9A8A470C4ED2.PNG`,
      },
      {
        category: 'amenities',
        alt: { en: 'River Park community pools', es: 'Piscinas de River Park' },
        url: `${sq}/0fc9b758-dd29-4cd9-908b-e20855617a86/unnamed.jpg`,
      },
    ],
  },
  {
    slug: 'apartment-paraiso',
    title: 'Apartment Paraiso',
    district: { en: 'Santa Ana', es: 'Santa Ana' },
    complexName: 'Santa Ana Park',
    region: 'central-valley',
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    badge: { en: 'Tropical gardens', es: 'Jardines tropicales' },
    shortDescription: {
      en: 'A comfortable two-bedroom apartment near downtown Santa Ana, surrounded by tropical gardens with a balcony and shared pool.',
      es: 'Un cómodo apartamento de dos habitaciones cerca del centro de Santa Ana, rodeado de jardines tropicales, con balcón y piscina compartida.',
    },
    description: {
      en: [
        'The apartment includes one king bed, one queen bed, a fully equipped kitchen, in-home laundry and a private balcony.',
        'Guests can use the shared pools, gardens, gym, playground and lounge areas within the gated community.',
      ],
      es: [
        'El apartamento incluye una cama king, una cama queen, cocina totalmente equipada, lavandería y balcón privado.',
        'Los huéspedes pueden usar las piscinas, jardines, gimnasio, área de juegos y salones del condominio cerrado.',
      ],
    },
    neighborhood: {
      en: 'Santa Ana Park is close to downtown restaurants, cafés and supermarkets, with convenient access to Route 27 and the airport.',
      es: 'Santa Ana Park está cerca de restaurantes, cafés y supermercados del centro, con acceso conveniente a la Ruta 27 y al aeropuerto.',
    },
    parking: { en: '2 parking spaces', es: '2 espacios de parqueo' },
    extraFacts: {
      en: ['Private balcony', 'Near downtown'],
      es: ['Balcón privado', 'Cerca del centro'],
    },
    amenities: [
      'air-conditioning',
      'wifi',
      'full-kitchen',
      'laundry',
      'balcony',
      'pool',
      'gym',
      'security',
      'parking',
    ],
    sleeping: [
      {
        room: { en: 'Primary bedroom', es: 'Habitación principal' },
        bed: { en: '1 king bed', es: '1 cama king' },
        image: 2,
      },
      {
        room: { en: 'Bedroom 2', es: 'Habitación 2' },
        bed: { en: '1 queen bed', es: '1 cama queen' },
        image: 3,
      },
    ],
    displayOrder: 60,
    featured: true,
    images: [
      {
        category: 'living-room',
        alt: {
          en: 'Colorful living and dining room at Apartment Paraiso',
          es: 'Sala y comedor coloridos de Apartment Paraiso',
        },
        url: `${sq}/4bdd897f-099b-47a9-a68f-9cd9f91a2a97/IMG_2243.JPG`,
      },
      {
        category: 'kitchen',
        alt: { en: 'Fully equipped open kitchen', es: 'Cocina abierta totalmente equipada' },
        url: `${sq}/4b4be06a-d0e5-4856-a763-dc570efc4a3b/IMG_2246.JPG`,
      },
      {
        category: 'bedroom',
        alt: {
          en: 'Primary bedroom with blue feature wall',
          es: 'Habitación principal con pared azul',
        },
        url: `${sq}/2d4e5bcb-d623-4cfc-b5e9-03978ecd8818/IMG_2253.JPG`,
      },
      {
        category: 'bedroom',
        alt: {
          en: 'Second bedroom opening to the balcony',
          es: 'Segunda habitación con acceso al balcón',
        },
        url: `${sq}/5a7b4e88-18cb-4ceb-be61-ee0b538fe66e/IMG_2250.JPG`,
      },
      {
        category: 'other',
        alt: { en: 'Full bathroom with glass shower', es: 'Baño completo con ducha de vidrio' },
        url: `${sq}/011b5c82-68be-44c5-9753-fe67733a7503/IMG_2255.JPG`,
      },
      {
        category: 'amenities',
        alt: { en: 'Pool among tropical gardens', es: 'Piscina entre jardines tropicales' },
        url: `${sq}/3c06b0e6-c663-4d67-adcd-157dd6910782/IMG_2244.JPG`,
      },
    ],
  },
  {
    slug: 'apartment-roca',
    title: 'Apartment Roca',
    district: { en: 'Santa Ana, Río Oro', es: 'Santa Ana, Río Oro' },
    complexName: 'Avalon Country Club',
    region: 'central-valley',
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    badge: { en: 'Penthouse', es: 'Penthouse' },
    shortDescription: {
      en: 'A modern third-floor penthouse with two bedrooms, a mezzanine workspace and immediate access to the Avalon pool and gym.',
      es: 'Un penthouse moderno en el tercer piso, con dos habitaciones, espacio de trabajo en el mezanine y acceso cercano a la piscina y el gimnasio de Avalon.',
    },
    description: {
      en: [
        'The apartment combines an open living room, full kitchen and two full bathrooms with a mezzanine dedicated to work or study.',
        'The building has elevator access and sits close to the heated pool, gym, restaurant, tennis courts, coworking room and trails.',
      ],
      es: [
        'El apartamento combina sala abierta, cocina completa y dos baños con un mezanine dedicado al trabajo o estudio.',
        'El edificio tiene elevador y está cerca de la piscina climatizada, gimnasio, restaurante, tenis, coworking y senderos.',
      ],
    },
    neighborhood: {
      en: 'Avalon Country Club is in Río Oro, near Santa Ana supermarkets and services with an easy connection to Route 27.',
      es: 'Avalon Country Club está en Río Oro, cerca de supermercados y servicios de Santa Ana, con conexión fácil a la Ruta 27.',
    },
    extraFacts: {
      en: ['Mezzanine workspace', 'Third floor'],
      es: ['Área de trabajo en mezanine', 'Tercer piso'],
    },
    amenities: [
      'air-conditioning',
      'wifi',
      'full-kitchen',
      'workspace',
      'pool',
      'gym',
      'tennis',
      'restaurant',
      'security',
    ],
    sleeping: [
      {
        room: { en: 'Bedroom 1', es: 'Habitación 1' },
        bed: { en: '1 bed', es: '1 cama' },
        image: 2,
      },
      {
        room: { en: 'Bedroom 2', es: 'Habitación 2' },
        bed: { en: '1 bed', es: '1 cama' },
        image: 3,
      },
    ],
    displayOrder: 70,
    featured: false,
    images: [
      {
        category: 'living-room',
        alt: {
          en: 'Double-height living room at Apartment Roca',
          es: 'Sala de doble altura de Apartment Roca',
        },
        url: `${sq}/a48c8513-1e18-4dc1-8cf0-4d25b73d8cd2/501553B6-6C14-42FB-BAB2-9BEFE157300F.PNG`,
      },
      {
        category: 'kitchen',
        alt: {
          en: 'Modern kitchen with granite counters',
          es: 'Cocina moderna con sobres de granito',
        },
        url: `${sq}/9b9401d3-e17a-4390-a2e5-af55f052ba5f/E5E37D6A-6A3E-4331-AA6B-1A6FD30650CC.PNG`,
      },
      {
        category: 'bedroom',
        alt: { en: 'Bedroom with neutral linens', es: 'Habitación con ropa de cama neutra' },
        url: `${sq}/0b6caf4e-4a65-4d0b-9a1e-fa2342374370/37EE9F1E-7A07-43FE-870E-38A57D51F43A.PNG`,
      },
      {
        category: 'bedroom',
        alt: {
          en: 'Second bedroom with colorful artwork',
          es: 'Segunda habitación con arte colorido',
        },
        url: `${sq}/139269f3-0cce-4281-835d-d9d9cae17f48/47109BD8-8E2B-4935-BFC5-BE2F7169AA9B.PNG`,
      },
      {
        category: 'other',
        alt: { en: 'Modern full bathroom', es: 'Baño completo moderno' },
        url: `${sq}/e601773f-68e6-432c-a395-7e5201cebc3a/9AE5F0CA-43E2-4D8B-89FE-6C1A4E48DC4D.PNG`,
      },
      {
        category: 'amenities',
        alt: {
          en: 'Avalon swimming pool and mountain view',
          es: 'Piscina de Avalon con vista a las montañas',
        },
        url: `${sq}/5082ef9d-c97f-44ec-b730-974192d0365b/E6B7FAE9-F9F8-48B1-A397-C08B240B13F0.PNG`,
      },
    ],
  },
  {
    slug: 'apartment-montana',
    title: 'Apartment Montana',
    district: { en: 'Santa Ana, Río Oro', es: 'Santa Ana, Río Oro' },
    complexName: 'Avalon Country Club',
    region: 'central-valley',
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    badge: { en: 'Mountain view', es: 'Vista a la montaña' },
    shortDescription: {
      en: 'A third-floor two-bedroom apartment with a furnished balcony and mountain views at Avalon Country Club.',
      es: 'Un apartamento de dos habitaciones en el tercer piso, con balcón amueblado y vista a las montañas en Avalon Country Club.',
    },
    description: {
      en: [
        'The home has a comfortable living room, equipped kitchen, one full bathroom and a balcony for enjoying the green outlook.',
        'Elevator access connects guests to the community pool, gym, restaurant, tennis, coworking room, playground and trails.',
      ],
      es: [
        'La casa tiene sala cómoda, cocina equipada, un baño completo y un balcón para disfrutar la vista verde.',
        'El elevador conecta a los huéspedes con piscina, gimnasio, restaurante, tenis, coworking, área de juegos y senderos.',
      ],
    },
    neighborhood: {
      en: 'Río Oro is a convenient Santa Ana base near supermarkets, restaurants, cafés and Route 27.',
      es: 'Río Oro es una base conveniente en Santa Ana, cerca de supermercados, restaurantes, cafés y la Ruta 27.',
    },
    extraFacts: {
      en: ['Mountain view', 'Furnished balcony'],
      es: ['Vista a la montaña', 'Balcón amueblado'],
    },
    amenities: [
      'air-conditioning',
      'wifi',
      'full-kitchen',
      'balcony',
      'pool',
      'gym',
      'tennis',
      'restaurant',
      'security',
    ],
    sleeping: [
      {
        room: { en: 'Bedroom 1', es: 'Habitación 1' },
        bed: { en: '1 bed', es: '1 cama' },
        image: 2,
      },
      {
        room: { en: 'Bedroom 2', es: 'Habitación 2' },
        bed: { en: '1 bed', es: '1 cama' },
        image: 3,
      },
    ],
    displayOrder: 80,
    featured: false,
    images: [
      {
        category: 'living-room',
        alt: { en: 'Living room opening to the balcony', es: 'Sala con acceso al balcón' },
        url: `${sq}/9cc0ff93-f0b0-4131-94c3-09453db7162e/2C8A5153-FC74-49AB-97ED-C8B2B5D3DC36.PNG`,
      },
      {
        category: 'kitchen',
        alt: {
          en: 'Compact kitchen with stainless appliances',
          es: 'Cocina compacta con electrodomésticos de acero',
        },
        url: `${sq}/b027c218-1c09-4a67-aa1c-29714cf5c13f/C562716F-A8DF-433C-B0E0-9E0FD52942B4.PNG`,
      },
      {
        category: 'bedroom',
        alt: {
          en: 'Primary bedroom with mountain views',
          es: 'Habitación principal con vista a la montaña',
        },
        url: `${sq}/807fd7d1-9406-464b-8c09-19d38d12409f/42038774-AAA5-47DC-83B8-C5D1BC15C8B9.PNG`,
      },
      {
        category: 'bedroom',
        alt: {
          en: 'Second bedroom with balcony access',
          es: 'Segunda habitación con acceso al balcón',
        },
        url: `${sq}/9a39e561-f000-4d6b-a020-82febfdc5685/DD79F254-A1DD-4EB8-B5EC-C28159497E4A.PNG`,
      },
      {
        category: 'living-room',
        alt: { en: 'Open living room and kitchen', es: 'Sala abierta y cocina' },
        url: `${sq}/e0c7beb5-d7de-4b88-90dc-748cdb76b236/C24A8F03-73E4-48CF-9695-82E4A26E16C5.PNG`,
      },
      {
        category: 'amenities',
        alt: {
          en: 'Avalon pool with mountain backdrop',
          es: 'Piscina de Avalon con montañas al fondo',
        },
        url: `${sq}/5082ef9d-c97f-44ec-b730-974192d0365b/E6B7FAE9-F9F8-48B1-A397-C08B240B13F0.PNG`,
      },
    ],
  },
  {
    slug: 'vista-and-jacuzzi',
    title: 'Vista & Jacuzzi',
    district: { en: 'Santa Ana, Río Oro', es: 'Santa Ana, Río Oro' },
    complexName: 'Avalon Country Club',
    region: 'central-valley',
    bedrooms: 2,
    beds: 2,
    bathrooms: 2.5,
    badge: { en: 'Private jacuzzi', es: 'Jacuzzi privado' },
    shortDescription: {
      en: 'A two-story penthouse with mountain and city views, plus a private jacuzzi on the terrace.',
      es: 'Un penthouse de dos niveles con vista a las montañas y la ciudad, además de jacuzzi privado en la terraza.',
    },
    description: {
      en: [
        'The home has one king bed, one queen bed, an open living and dining room and a fully equipped kitchen.',
        'Its private terrace and jacuzzi complement Avalon Country Club amenities including pools, gym, tennis, restaurant and walking trails.',
      ],
      es: [
        'La casa tiene una cama king, una cama queen, sala y comedor abiertos y cocina totalmente equipada.',
        'La terraza y el jacuzzi privados complementan las amenidades de Avalon Country Club: piscinas, gimnasio, tenis, restaurante y senderos.',
      ],
    },
    neighborhood: {
      en: 'The Río Oro setting combines a peaceful residential atmosphere with easy access to Santa Ana services and Route 27.',
      es: 'Río Oro combina un ambiente residencial tranquilo con acceso fácil a los servicios de Santa Ana y la Ruta 27.',
    },
    extraFacts: { en: ['Private jacuzzi', 'Two stories'], es: ['Jacuzzi privado', 'Dos niveles'] },
    amenities: [
      'air-conditioning',
      'wifi',
      'full-kitchen',
      'balcony',
      'private-jacuzzi',
      'pool',
      'gym',
      'tennis',
      'restaurant',
      'security',
    ],
    sleeping: [
      {
        room: { en: 'Primary bedroom', es: 'Habitación principal' },
        bed: { en: '1 king bed', es: '1 cama king' },
        image: 2,
      },
      {
        room: { en: 'Bedroom 2', es: 'Habitación 2' },
        bed: { en: '1 queen bed', es: '1 cama queen' },
        image: 3,
      },
    ],
    displayOrder: 90,
    featured: true,
    images: [
      {
        category: 'living-room',
        alt: {
          en: 'Living room with green views at Vista and Jacuzzi',
          es: 'Sala con vistas verdes de Vista y Jacuzzi',
        },
        url: `${sq}/aae982b6-a236-47c9-92bf-379c8ede7648/DEA03AB6-EFBC-43A5-A686-F65639346205.PNG`,
      },
      {
        category: 'kitchen',
        alt: {
          en: 'Kitchen with granite counters and garden view',
          es: 'Cocina con sobres de granito y vista al jardín',
        },
        url: `${sq}/cadf7e4e-5123-440e-b937-7e950fb266fe/74E1D065-77A7-47C1-A6E1-5972BD13FE1B.PNG`,
      },
      {
        category: 'bedroom',
        alt: { en: 'Bedroom overlooking the mountains', es: 'Habitación con vista a las montañas' },
        url: `${sq}/0bffde7b-3d1f-4fe5-8fa8-d0aabf28c053/FEFBD7DE-E114-4002-93EC-5BDE4F3C9F4C.PNG`,
      },
      {
        category: 'bedroom',
        alt: {
          en: 'Second bedroom opening to greenery',
          es: 'Segunda habitación con vista a la vegetación',
        },
        url: `${sq}/e8c71d6e-3dea-43df-99e8-82d4fc9db9dc/4FEB47C1-3B8E-49EF-AB9A-47060FC99277.PNG`,
      },
      {
        category: 'amenities',
        alt: { en: 'Private terrace with jacuzzi', es: 'Terraza privada con jacuzzi' },
        url: `${sq}/066920bc-14d1-4878-b503-17633b7b0ae5/57EB41DD-A7D0-4F4E-B45B-7B87D9234969.PNG`,
      },
      {
        category: 'amenities',
        alt: { en: 'Avalon community swimming pool', es: 'Piscina de Avalon Country Club' },
        url: `${sq}/5082ef9d-c97f-44ec-b730-974192d0365b/E6B7FAE9-F9F8-48B1-A397-C08B240B13F0.PNG`,
      },
    ],
  },
  {
    slug: 'apartment-brisa',
    title: 'Apartment Brisa',
    district: { en: 'Santa Ana, Río Oro', es: 'Santa Ana, Río Oro' },
    complexName: 'Avalon Country Club',
    region: 'central-valley',
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    badge: { en: 'Bright balcony', es: 'Balcón luminoso' },
    shortDescription: {
      en: 'A bright second-floor two-bedroom apartment with a furnished balcony and full access to Avalon Country Club amenities.',
      es: 'Un apartamento luminoso de dos habitaciones en el segundo piso, con balcón amueblado y acceso completo a las amenidades de Avalon Country Club.',
    },
    description: {
      en: [
        'The primary bedroom has a king bed and the second bedroom a full-size bed. The apartment includes a full kitchen, washer and dryer, comfortable living room and balcony.',
        'Guests can enjoy the pool, gym, restaurant, playground, soccer field, tennis and walking trails in the secure community.',
      ],
      es: [
        'La habitación principal tiene cama king y la segunda una cama matrimonial. El apartamento incluye cocina completa, lavadora y secadora, sala cómoda y balcón.',
        'Los huéspedes pueden disfrutar piscina, gimnasio, restaurante, área de juegos, cancha de fútbol, tenis y senderos dentro del condominio seguro.',
      ],
    },
    neighborhood: {
      en: 'Avalon Country Club is in Río Oro, close to shops, dining and Santa Ana services with straightforward airport access.',
      es: 'Avalon Country Club está en Río Oro, cerca de comercios, restaurantes y servicios de Santa Ana, con acceso sencillo al aeropuerto.',
    },
    parking: { en: '1 parking space', es: '1 espacio de parqueo' },
    extraFacts: {
      en: ['Second floor', 'Furnished balcony'],
      es: ['Segundo piso', 'Balcón amueblado'],
    },
    amenities: [
      'air-conditioning',
      'wifi',
      'full-kitchen',
      'laundry',
      'balcony',
      'pool',
      'gym',
      'tennis',
      'restaurant',
      'security',
      'parking',
    ],
    sleeping: [
      {
        room: { en: 'Primary bedroom', es: 'Habitación principal' },
        bed: { en: '1 king bed', es: '1 cama king' },
        image: 2,
      },
      {
        room: { en: 'Bedroom 2', es: 'Habitación 2' },
        bed: { en: '1 full bed', es: '1 cama matrimonial' },
        image: 3,
      },
    ],
    displayOrder: 100,
    featured: false,
    images: [
      {
        category: 'living-room',
        alt: {
          en: 'Bright living and dining room at Apartment Brisa',
          es: 'Sala y comedor luminosos de Apartment Brisa',
        },
        url: `${sq}/13b7d091-b07d-4f85-bc4e-21e0402d4180/E312D6CF-9406-41E8-980F-8F19EBB25B54.PNG`,
      },
      {
        category: 'kitchen',
        alt: {
          en: 'Equipped kitchen with black granite counters',
          es: 'Cocina equipada con sobres de granito negro',
        },
        url: `${sq}/36b9a9f9-c9a8-45ea-b265-cbfed7ce3da2/B68F3772-534C-4704-96E3-FD29AC1EE464.PNG`,
      },
      {
        category: 'bedroom',
        alt: {
          en: 'Primary bedroom with green feature wall',
          es: 'Habitación principal con pared verde',
        },
        url: `${sq}/37b0101c-8b55-4a47-b8bd-12829d058714/30F255D3-EFD9-4053-B51A-B46924871719.PNG`,
      },
      {
        category: 'bedroom',
        alt: {
          en: 'Second bedroom with botanical artwork',
          es: 'Segunda habitación con arte botánico',
        },
        url: `${sq}/c2bb852b-1f0a-4b4f-841f-147a7ba4fad0/1F0A470D-0A55-44D5-A505-DFFC17F89EF1.PNG`,
      },
      {
        category: 'exterior',
        alt: { en: 'Furnished private balcony', es: 'Balcón privado amueblado' },
        url: `${sq}/5819c402-0f56-49ae-a8d8-03560affda49/F0646FA6-CDA8-438E-A7F7-C5E311B2418A.PNG`,
      },
      {
        category: 'amenities',
        alt: {
          en: 'Avalon swimming pool with mountain view',
          es: 'Piscina de Avalon con vista a las montañas',
        },
        url: `${sq}/5082ef9d-c97f-44ec-b730-974192d0365b/E6B7FAE9-F9F8-48B1-A397-C08B240B13F0.PNG`,
      },
    ],
  },
  {
    slug: 'penthouse-laguna',
    title: 'Penthouse Laguna',
    district: { en: 'Santa Ana, Río Oro', es: 'Santa Ana, Río Oro' },
    complexName: 'Avalon Country Club',
    region: 'central-valley',
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    badge: { en: 'Lake view', es: 'Vista al lago' },
    shortDescription: {
      en: 'A third-floor lake-view penthouse with two bedrooms, a mezzanine workspace and private balcony at Avalon Country Club.',
      es: 'Un penthouse con vista al lago en el tercer piso, dos habitaciones, área de trabajo en el mezanine y balcón privado en Avalon Country Club.',
    },
    description: {
      en: [
        'The home has one king bed, one queen bed, a full kitchen and an airy mezzanine with a sofa and dedicated workspace.',
        'Elevator access and community amenities include pools, gym, restaurant, coworking, tennis, playground and nature trails.',
      ],
      es: [
        'La casa tiene una cama king, una cama queen, cocina completa y un mezanine abierto con sofá y espacio de trabajo.',
        'El elevador y las amenidades incluyen piscinas, gimnasio, restaurante, coworking, tenis, área de juegos y senderos.',
      ],
    },
    neighborhood: {
      en: 'Río Oro gives guests a quiet lakefront setting close to Santa Ana conveniences and Route 27.',
      es: 'Río Oro ofrece un entorno tranquilo junto al lago, cerca de las comodidades de Santa Ana y la Ruta 27.',
    },
    extraFacts: {
      en: ['Lake view', 'Mezzanine office'],
      es: ['Vista al lago', 'Oficina en mezanine'],
    },
    amenities: [
      'air-conditioning',
      'wifi',
      'full-kitchen',
      'workspace',
      'balcony',
      'pool',
      'gym',
      'tennis',
      'restaurant',
      'security',
    ],
    sleeping: [
      {
        room: { en: 'Primary bedroom', es: 'Habitación principal' },
        bed: { en: '1 king bed', es: '1 cama king' },
        image: 2,
      },
      {
        room: { en: 'Bedroom 2', es: 'Habitación 2' },
        bed: { en: '1 queen bed', es: '1 cama queen' },
        image: 3,
      },
    ],
    displayOrder: 110,
    featured: false,
    images: [
      {
        category: 'living-room',
        alt: {
          en: 'Lake-view living room at Penthouse Laguna',
          es: 'Sala con vista al lago de Penthouse Laguna',
        },
        url: `${sq}/d1155b4d-cb02-43e3-827c-bcf7a2a906d5/F3AEC55D-75FE-4F2E-91D1-66AAE448C772.PNG`,
      },
      {
        category: 'kitchen',
        alt: { en: 'Fully equipped kitchen', es: 'Cocina totalmente equipada' },
        url: `${sq}/d1207d4d-5888-4eba-8cb8-8aa9ca29192c/E5C99365-B49D-4F28-A26C-5281A0107640.PNG`,
      },
      {
        category: 'bedroom',
        alt: {
          en: 'Primary bedroom with air conditioning',
          es: 'Habitación principal con aire acondicionado',
        },
        url: `${sq}/977117b8-5d4a-40ee-8bc0-cabaacd09286/A814C48A-4EDF-4F84-B54C-1272901E3B3C.PNG`,
      },
      {
        category: 'bedroom',
        alt: {
          en: 'Second bedroom overlooking the lake',
          es: 'Segunda habitación con vista al lago',
        },
        url: `${sq}/f7f49fba-8b40-41fd-b4ec-582fa630a399/80EC4635-5F05-4803-A01C-B407BE7DAF8F.PNG`,
      },
      {
        category: 'other',
        alt: {
          en: 'Full bathroom with vessel sink',
          es: 'Baño completo con lavamanos de sobreponer',
        },
        url: `${sq}/3a0cfd85-bb6c-4926-bff1-300032f778e8/93D1C16D-C9E8-4471-AC86-BA23B899BED9.PNG`,
      },
      {
        category: 'exterior',
        alt: {
          en: 'Balcony overlooking Avalon gardens and lake',
          es: 'Balcón con vista a los jardines y el lago de Avalon',
        },
        url: `${sq}/0b744393-aeb3-4727-b7d9-a56a5aaf8b2e/DAB14D0B-B7DE-4C42-BD8F-83B7A62D67B7.PNG`,
      },
    ],
  },
  {
    slug: 'bosques-de-carao',
    title: 'Bosques de Carao',
    district: { en: 'Santa Ana, Lindora', es: 'Santa Ana, Lindora' },
    complexName: 'Condominio Bosques de Carao',
    region: 'central-valley',
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    badge: { en: 'Lindora', es: 'Lindora' },
    shortDescription: {
      en: 'A spacious two-bedroom apartment in Lindora with a balcony, tropical gardens and a shared swimming pool.',
      es: 'Un espacioso apartamento de dos habitaciones en Lindora, con balcón, jardines tropicales y piscina compartida.',
    },
    description: {
      en: [
        'The air-conditioned apartment includes two full bathrooms, an equipped kitchen, dining area, living room and private balcony.',
        'Guests have access to the condominium garden, swimming pool, sun terrace, children’s play area and secure parking.',
      ],
      es: [
        'El apartamento con aire acondicionado incluye dos baños completos, cocina equipada, comedor, sala y balcón privado.',
        'Los huéspedes tienen acceso al jardín, piscina, terraza, área de juegos infantil y parqueo seguro del condominio.',
      ],
    },
    neighborhood: {
      en: 'Lindora is close to the Forum office parks and Santa Ana services, approximately 7 km from Juan Santamaría International Airport.',
      es: 'Lindora está cerca de los parques empresariales Forum y de los servicios de Santa Ana, aproximadamente a 7 km del Aeropuerto Internacional Juan Santamaría.',
    },
    parking: { en: 'Free private parking', es: 'Parqueo privado gratuito' },
    extraFacts: {
      en: ['Near Forum offices', 'Private balcony'],
      es: ['Cerca de oficinas Forum', 'Balcón privado'],
    },
    amenities: [
      'air-conditioning',
      'wifi',
      'full-kitchen',
      'balcony',
      'pool',
      'security',
      'parking',
    ],
    sleeping: [],
    displayOrder: 120,
    featured: false,
    images: [
      {
        category: 'living-room',
        alt: {
          en: 'Living and dining room at Bosques de Carao',
          es: 'Sala y comedor de Bosques de Carao',
        },
        url: `${sq}/3ecfb93c-f398-4177-ab46-1c2a9cc64851/eliteproperties-14.JPG`,
      },
      {
        category: 'kitchen',
        alt: { en: 'Open kitchen and living area', es: 'Cocina abierta y sala' },
        url: `${sq}/14ed89ce-b09e-4654-aafb-629c2a7d11c0/7B55AAAB-ED32-4E1E-ACA6-6472737BE2DE.PNG`,
      },
      {
        category: 'bedroom',
        alt: {
          en: 'Bedroom with television and garden view',
          es: 'Habitación con televisión y vista al jardín',
        },
        url: `${sq}/2a7df1f3-db2f-43fd-902c-a5614e79e47f/EE54548A-4DBF-4FCF-99AE-58A1DDD56EAD.PNG`,
      },
      {
        category: 'living-room',
        alt: {
          en: 'Spacious living room with garden outlook',
          es: 'Sala amplia con vista al jardín',
        },
        url: `${sq}/8d1d8ee6-1933-41aa-8f4c-70e19ae7bc0d/eliteproperties-25.JPG`,
      },
      {
        category: 'other',
        alt: { en: 'Modern bathroom with walk-in shower', es: 'Baño moderno con ducha' },
        url: `${sq}/0ee74f3e-578d-4626-afa6-4044c5c66865/eliteproperties-23.JPG`,
      },
      {
        category: 'amenities',
        alt: {
          en: 'Bosques de Carao pool and sun terrace',
          es: 'Piscina y terraza de Bosques de Carao',
        },
        url: `${sq}/bb2a9654-ef0d-4b30-ad09-eaaa63011a31/eliteproperties-58.jpg`,
      },
    ],
  },
  {
    slug: 'playa-langosta',
    title: 'Playa Langosta',
    district: { en: 'Playa Langosta, Tamarindo', es: 'Playa Langosta, Tamarindo' },
    complexName: 'Gated beach community',
    region: 'pacific-coast',
    bedrooms: 3,
    beds: 3,
    bathrooms: 3,
    badge: { en: 'Walk to the beach', es: 'A pasos de la playa' },
    shortDescription: {
      en: 'A two-story three-bedroom villa with a private pool inside a gated community, a short walk from Playa Langosta.',
      es: 'Una villa de dos niveles y tres habitaciones con piscina privada dentro de una comunidad cerrada, a pocos pasos de Playa Langosta.',
    },
    description: {
      en: [
        'Bright living spaces connect the equipped kitchen and indoor dining area to a private terrace and swimming pool.',
        'The secure residential setting offers privacy while keeping Tamarindo restaurants, cafés, shops and activities within a few minutes.',
      ],
      es: [
        'Los espacios luminosos conectan la cocina equipada y el comedor interior con una terraza privada y la piscina.',
        'La comunidad residencial segura ofrece privacidad y mantiene restaurantes, cafés, tiendas y actividades de Tamarindo a pocos minutos.',
      ],
    },
    neighborhood: {
      en: 'Playa Langosta is known for a quieter atmosphere, sunsets and surfing, just south of lively Tamarindo.',
      es: 'Playa Langosta es conocida por su ambiente tranquilo, atardeceres y surf, justo al sur de la animada Tamarindo.',
    },
    extraFacts: {
      en: ['Private pool', 'Walk to beach'],
      es: ['Piscina privada', 'A pasos de la playa'],
    },
    amenities: [
      'air-conditioning',
      'wifi',
      'full-kitchen',
      'private-pool',
      'beach-access',
      'security',
    ],
    sleeping: [
      {
        room: { en: 'Bedroom 1', es: 'Habitación 1' },
        bed: { en: '1 bed', es: '1 cama' },
        image: 2,
      },
      {
        room: { en: 'Bedroom 2', es: 'Habitación 2' },
        bed: { en: '1 bed', es: '1 cama' },
        image: 3,
      },
    ],
    displayOrder: 130,
    featured: true,
    images: [
      {
        category: 'exterior',
        alt: { en: 'Two-story Playa Langosta villa', es: 'Villa de dos niveles en Playa Langosta' },
        url: `${sq}/1d554e85-d8bf-4cde-9fe7-a2c43a382d77/02319EBF-0539-425A-8988-E5337EE56715.PNG`,
      },
      {
        category: 'living-room',
        alt: {
          en: 'Vaulted open living room and kitchen',
          es: 'Sala abierta con techo alto y cocina',
        },
        url: `${sq}/4083d4db-e522-4ee3-994d-b765883a00c3/9E09AF92-9FD4-4D4D-A8B2-84D311D1544E.PNG`,
      },
      {
        category: 'bedroom',
        alt: { en: 'Bedroom with private balcony', es: 'Habitación con balcón privado' },
        url: `${sq}/45d0c2db-6719-45fc-aea1-565bf436bb5a/E9D35552-82FC-4D42-BF4D-507EEC3E1926.PNG`,
      },
      {
        category: 'bedroom',
        alt: {
          en: 'Bedroom with wooden ceiling and garden view',
          es: 'Habitación con techo de madera y vista al jardín',
        },
        url: `${sq}/4fa7b285-cd81-42b3-827c-4932759b4ff2/DE9423B1-AD24-458E-B7A0-98BB7E04C973.PNG`,
      },
      {
        category: 'amenities',
        alt: { en: 'Private tropical swimming pool', es: 'Piscina tropical privada' },
        url: `${sq}/d651d43b-8b91-46e0-abe4-d732b73a854a/DC07B171-1DC0-4EA1-838D-4B137108C3CD.PNG`,
      },
      {
        category: 'kitchen',
        alt: {
          en: 'Modern kitchen overlooking the patio',
          es: 'Cocina moderna con vista al patio',
        },
        url: `${sq}/5ce7fa30-1b53-434f-8b8c-f5ad405c0595/30FEAC00-2D23-4A01-8B6F-0B1BCAAD2C46.PNG`,
      },
    ],
  },
  {
    slug: 'beachfront-villa',
    title: 'Luxury Beachfront Villa',
    district: { en: 'Playa Tivives, Puntarenas', es: 'Playa Tivives, Puntarenas' },
    complexName: 'Gated beachfront community',
    region: 'pacific-coast',
    bedrooms: 3,
    beds: 4,
    bathrooms: 2.5,
    badge: { en: 'Beachfront', es: 'Frente al mar' },
    shortDescription: {
      en: 'A new two-story beachfront villa with three king bedrooms, a private pool, ocean-view terraces and direct beach access in Playa Tivives.',
      es: 'Una villa nueva de dos niveles frente al mar, con tres habitaciones king, piscina privada, terrazas con vista al océano y acceso directo a Playa Tivives.',
    },
    description: {
      en: [
        'The open living space and island kitchen connect to covered outdoor sitting and dining terraces. Two oceanfront bedrooms have private terraces, and a sofa bed adds flexibility in the living room.',
        'The tropical backyard includes a private pool, sun loungers and fire pit, while the gated community provides 24-hour security.',
      ],
      es: [
        'La sala abierta y la cocina con isla se conectan con terrazas cubiertas para sentarse y comer. Dos habitaciones frente al mar tienen terrazas privadas y la sala incluye sofá cama.',
        'El jardín tropical tiene piscina privada, tumbonas y fogata, mientras la comunidad cerrada ofrece seguridad las 24 horas.',
      ],
    },
    neighborhood: {
      en: 'Playa Tivives is a peaceful Pacific community about one hour from San José, with supermarkets and services in Esparza and Puntarenas.',
      es: 'Playa Tivives es una comunidad tranquila del Pacífico, aproximadamente a una hora de San José, con supermercados y servicios en Esparza y Puntarenas.',
    },
    parking: { en: '2-car garage plus parking', es: 'Garaje para 2 autos y parqueo adicional' },
    extraFacts: {
      en: ['Direct beach access', 'Private pool'],
      es: ['Acceso directo a la playa', 'Piscina privada'],
    },
    amenities: [
      'air-conditioning',
      'wifi',
      'full-kitchen',
      'laundry',
      'balcony',
      'private-pool',
      'beach-access',
      'security',
      'parking',
    ],
    sleeping: [
      {
        room: { en: 'Oceanfront bedroom 1', es: 'Habitación 1 frente al mar' },
        bed: { en: '1 king bed', es: '1 cama king' },
        image: 2,
      },
      {
        room: { en: 'Oceanfront bedroom 2', es: 'Habitación 2 frente al mar' },
        bed: { en: '1 king bed', es: '1 cama king' },
        image: 3,
      },
    ],
    displayOrder: 140,
    featured: true,
    images: [
      {
        category: 'amenities',
        alt: {
          en: 'Private pool in the tropical backyard',
          es: 'Piscina privada en el jardín tropical',
        },
        url: `${sq}/fd395053-de9a-4785-951c-e146a59baab4/CD3D052A-6647-4E22-90B4-DB5EA3C789B4.PNG`,
      },
      {
        category: 'living-room',
        alt: {
          en: 'Open living and dining room facing the garden',
          es: 'Sala y comedor abiertos hacia el jardín',
        },
        url: `${sq}/7f89e63b-ab6c-4ea7-a97e-feb4429f323a/507272D6-9E70-4705-ADC3-B7466420AEDE.PNG`,
      },
      {
        category: 'bedroom',
        alt: {
          en: 'King bedroom with oceanfront balcony',
          es: 'Habitación king con balcón frente al mar',
        },
        url: `${sq}/6dcfcca9-6d54-48de-a0eb-c1938ff75045/51F34B52-9DCF-4F54-9432-9C2C669D2539.PNG`,
      },
      {
        category: 'bedroom',
        alt: {
          en: 'Second king bedroom with tropical view',
          es: 'Segunda habitación king con vista tropical',
        },
        url: `${sq}/f02e88ed-0333-40ed-9f43-b5a7428f2551/E1B023E6-AA15-4817-BC2F-E78E072963B2.PNG`,
      },
      {
        category: 'kitchen',
        alt: { en: 'Island kitchen with black cabinets', es: 'Cocina con isla y gabinetes negros' },
        url: `${sq}/1cc27de0-6ea1-49c7-b1ac-91420f8280ff/7ABC5C09-2B16-4A48-8FD6-1D02A223CA0B.PNG`,
      },
      {
        category: 'exterior',
        alt: {
          en: 'Luxury Beachfront Villa in Playa Tivives',
          es: 'Luxury Beachfront Villa en Playa Tivives',
        },
        url: `${sq}/fda3b833-51f1-4af6-af77-979c4c2031fe/29A7645B-D3CA-4645-8F82-CEA78741FAEB+2.PNG`,
      },
    ],
  },
]
