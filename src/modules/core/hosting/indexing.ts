/** Only a canonical production build may advertise search-engine indexing. */
export function allowsIndexing(canonicalURL: string): boolean {
  const deploymentEnvironment = process.env.VERCEL_ENV
  if (deploymentEnvironment && deploymentEnvironment !== 'production') return false

  return process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/+$/, '') === canonicalURL
}
