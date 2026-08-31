export function isValidHttpUrl(value: unknown): true | string {
  if (!value) return true
  if (typeof value !== 'string') return 'Enter a valid URL.'

  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) || 'Use an http:// or https:// URL.'
  } catch {
    return 'Enter a complete URL beginning with http:// or https://.'
  }
}
