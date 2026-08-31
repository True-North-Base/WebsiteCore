import type { Locale } from '@/i18n'

type PropertyMapProps = {
  areaLabel: string
  center: { latitude?: number; longitude?: number; query: string }
  locale: Locale
  openLabel: string
}

function mapQuery(center: PropertyMapProps['center']): string {
  if (center.latitude !== undefined && center.longitude !== undefined) {
    return `${center.latitude},${center.longitude}`
  }
  return center.query
}

export function getGoogleMapsURLs({
  apiKey,
  center,
  locale,
}: Pick<PropertyMapProps, 'center' | 'locale'> & { apiKey?: string }) {
  const query = mapQuery(center)
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
  const hasCoordinates = center.latitude !== undefined && center.longitude !== undefined
  const embedHref = apiKey
    ? hasCoordinates
      ? `https://www.google.com/maps/embed/v1/view?key=${encodeURIComponent(apiKey)}&center=${center.latitude},${center.longitude}&zoom=14&maptype=roadmap&language=${locale}&region=CR`
      : `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(apiKey)}&q=${encodeURIComponent(query)}&zoom=14&language=${locale}&region=CR`
    : undefined

  return { embedHref, mapsHref }
}

export function PropertyMap({ areaLabel, center, locale, openLabel }: PropertyMapProps) {
  const apiKey = process.env.GOOGLE_MAPS_EMBED_API_KEY?.trim()
  const { embedHref, mapsHref } = getGoogleMapsURLs({ apiKey, center, locale })

  return (
    <div className="property-map">
      <div className={`neighborhood-map${embedHref ? ' neighborhood-map--google' : ''}`}>
        {embedHref ? (
          <iframe
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            src={embedHref}
            title={areaLabel}
          />
        ) : (
          <>
            <span>{areaLabel}</span>
            <i aria-hidden="true" />
          </>
        )}
      </div>
      <a href={mapsHref} rel="noreferrer" target="_blank">
        {openLabel} <span aria-hidden="true">↗</span>
      </a>
    </div>
  )
}
