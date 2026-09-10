import type { Locale } from '@/i18n'

export function resolveCatalogueHeading(locale: Locale, heading: string, propertyCount: number) {
  if (heading.includes('{count}')) return heading.replaceAll('{count}', String(propertyCount))

  const legacyHeading = locale === 'en' ? 'Fourteen homes' : 'Catorce casas'
  if (
    propertyCount === 14 ||
    heading.trim().toLocaleLowerCase(locale) !== legacyHeading.toLocaleLowerCase(locale)
  ) {
    return heading
  }

  const noun =
    locale === 'en'
      ? propertyCount === 1
        ? 'home'
        : 'homes'
      : propertyCount === 1
        ? 'casa'
        : 'casas'
  return `${propertyCount} ${noun}`
}
