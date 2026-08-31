export type LegacyRedirect = {
  destination: string
  source: string
  statusCode: 301
}

const pathMap = {
  '/apartmentbrisa': '/en/properties/apartment-brisa',
  '/apartmentmontana': '/en/properties/apartment-montana',
  '/apartmentparaiso': '/en/properties/apartment-paraiso',
  '/apartmentroca': '/en/properties/apartment-roca',
  '/beachfront': '/en/properties/beachfront-villa',
  '/bosquesdecarao': '/en/properties/bosques-de-carao',
  '/home': '/en',
  '/lago': '/en/properties/penthouse-lago',
  '/lago-1': '/en/properties/penthouse-laguna',
  '/lvistaandjacuzzi': '/en/properties/vista-and-jacuzzi',
  '/penthouseoasis': '/en/properties/penthouse-oasis',
  '/playalangosta': '/en/properties/playa-langosta',
  '/riverpark': '/en/properties/riverpark-downtown',
  '/terrazadowntown': '/en/properties/terraza-downtown',
  '/terrazasescazu': '/en/properties/terrazas-escazu',
} as const

export const legacyRedirects: LegacyRedirect[] = Object.entries(pathMap).map(
  ([source, destination]) => ({ destination, source, statusCode: 301 }),
)
