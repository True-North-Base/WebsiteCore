const R2_ENV_KEYS = [
  'R2_BUCKET',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_ENDPOINT',
  'R2_PUBLIC_URL',
] as const

type R2EnvironmentKey = (typeof R2_ENV_KEYS)[number]
type R2Environment = Partial<Record<R2EnvironmentKey, string | undefined>>

export type R2Config = {
  accessKeyId: string
  bucket: string
  endpoint: string
  publicURL: string
  secretAccessKey: string
}

function parseHTTPSURL(name: 'R2_ENDPOINT' | 'R2_PUBLIC_URL', value: string): URL {
  let url: URL

  try {
    url = new URL(value)
  } catch {
    throw new Error(`${name} must be a valid absolute URL.`)
  }

  if (url.protocol !== 'https:') throw new Error(`${name} must use https.`)
  if (url.username || url.password) throw new Error(`${name} must not contain credentials.`)
  if (url.search || url.hash) throw new Error(`${name} must not contain a query string or fragment.`)

  return url
}

/**
 * R2 is optional for local development, but production configuration is all-or-none.
 * A partial configuration fails fast so a deploy cannot silently fall back to ephemeral disk.
 */
export function getR2Config(
  environment: R2Environment = process.env as R2Environment,
): R2Config | null {
  const values = Object.fromEntries(
    R2_ENV_KEYS.map((key) => [key, environment[key]?.trim() || '']),
  ) as Record<R2EnvironmentKey, string>

  const configuredKeys = R2_ENV_KEYS.filter((key) => values[key])
  if (configuredKeys.length === 0) return null

  const missingKeys = R2_ENV_KEYS.filter((key) => !values[key])
  if (missingKeys.length > 0) {
    throw new Error(`Incomplete R2 configuration. Missing: ${missingKeys.join(', ')}.`)
  }

  const endpoint = parseHTTPSURL('R2_ENDPOINT', values.R2_ENDPOINT)
  if (endpoint.pathname !== '/') {
    throw new Error('R2_ENDPOINT must be the account endpoint origin without a path.')
  }

  const publicURL = parseHTTPSURL('R2_PUBLIC_URL', values.R2_PUBLIC_URL)

  return {
    accessKeyId: values.R2_ACCESS_KEY_ID,
    bucket: values.R2_BUCKET,
    endpoint: endpoint.origin,
    publicURL: publicURL.toString().replace(/\/$/, ''),
    secretAccessKey: values.R2_SECRET_ACCESS_KEY,
  }
}

export function getR2ImageRemotePattern(publicURL: string) {
  const url = parseHTTPSURL('R2_PUBLIC_URL', publicURL)
  const basePath = url.pathname.replace(/\/+$/, '')

  return {
    protocol: 'https' as const,
    hostname: url.hostname,
    port: url.port,
    pathname: `${basePath}/**`,
    search: '',
  }
}

export function getR2ObjectKey(filename: string, prefix?: string): string {
  const normalizedPrefix = prefix?.replace(/^\/+|\/+$/g, '')
  const normalizedFilename = filename.replace(/^\/+/, '')

  return [normalizedPrefix, normalizedFilename].filter(Boolean).join('/')
}

export function getR2PublicFileURL(publicURL: string, filename: string, prefix?: string): string {
  const key = getR2ObjectKey(filename, prefix)

  return `${publicURL.replace(/\/+$/, '')}/${key}`
}

type MediaURLData = {
  sizes?: Record<string, { url?: string | null } | null | undefined> | null
  thumbnailURL?: string | null
  url?: string | null
}

/**
 * Removes only the configured delivery origin before a media document is
 * persisted. This keeps every stored reference provider-neutral, including
 * Payload's top-level thumbnailURL convenience field.
 */
export function normalizeR2MediaStorageKeys<T extends MediaURLData>(
  document: T,
  publicURL: string,
): T {
  const normalizedBaseURL = publicURL.replace(/\/+$/, '')
  const toObjectKey = (value: string | null | undefined) => {
    if (!value) return value

    const publicPrefix = `${normalizedBaseURL}/`
    return value.startsWith(publicPrefix) ? value.slice(publicPrefix.length) : value
  }

  const sizes = document.sizes
    ? Object.fromEntries(
        Object.entries(document.sizes).map(([name, size]) => [
          name,
          size ? { ...size, url: toObjectKey(size.url) } : size,
        ]),
      )
    : document.sizes

  return {
    ...document,
    sizes,
    thumbnailURL: toObjectKey(document.thumbnailURL),
    url: toObjectKey(document.url),
  }
}

/**
 * Payload persists the provider-neutral object key. Public delivery URLs are a
 * read-time projection so changing the asset host never requires a DB rewrite.
 */
export function materializeR2MediaURLs<T extends MediaURLData>(
  document: T,
  publicURL: string,
): T {
  const toPublicURL = (value: string | null | undefined) => {
    if (!value || /^https:\/\//i.test(value)) return value
    return getR2PublicFileURL(publicURL, value)
  }

  const sizes = document.sizes
    ? Object.fromEntries(
        Object.entries(document.sizes).map(([name, size]) => [
          name,
          size ? { ...size, url: toPublicURL(size.url) } : size,
        ]),
      )
    : document.sizes

  const thumbnailURL = sizes?.thumbnail?.url ?? toPublicURL(document.thumbnailURL)

  return {
    ...document,
    sizes,
    thumbnailURL,
    url: toPublicURL(document.url),
  }
}
