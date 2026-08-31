import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { config as loadEnvironment } from 'dotenv'
import { getPayload } from 'payload'

import type { Media } from '../src/payload-types'
import { getR2Config } from '../src/modules/core/storage/r2'
import { getHomeContent, getPropertyContent } from '../src/modules/rentals/lib/phase2-content'

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const REQUIRED_MEDIA_COUNT = 13

type Arguments = {
  apply: boolean
  environmentFiles: string[]
  help: boolean
}

function usage(): string {
  return [
    'Migrate the 13 approved Phase 3 media documents to Cloudflare R2.',
    '',
    'Dry run:',
    '  pnpm migrate:media:r2 -- --env-file .env.supabase.local --env-file .env.r2.local',
    '',
    'Apply after the dry run succeeds:',
    '  pnpm migrate:media:r2 -- --env-file .env.supabase.local --env-file .env.r2.local --apply',
  ].join('\n')
}

function parseArguments(args: string[]): Arguments {
  const parsed: Arguments = { apply: false, environmentFiles: [], help: false }

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]
    if (argument === '--') continue
    if (argument === '--apply') {
      parsed.apply = true
      continue
    }
    if (argument === '--help' || argument === '-h') {
      parsed.help = true
      continue
    }
    if (argument === '--env-file') {
      const value = args[index + 1]
      if (!value || value.startsWith('--')) throw new Error('--env-file requires a path.')
      parsed.environmentFiles.push(value)
      index += 1
      continue
    }
    if (argument.startsWith('--env-file=')) {
      const value = argument.slice('--env-file='.length)
      if (!value) throw new Error('--env-file requires a path.')
      parsed.environmentFiles.push(value)
      continue
    }

    throw new Error(`Unknown argument: ${argument}`)
  }

  return parsed
}

function loadEnvironmentFiles(environmentFiles: string[]) {
  const defaultEnvironmentPath = path.resolve(repositoryRoot, '.env')
  const files = [
    ...(fs.existsSync(defaultEnvironmentPath) ? [defaultEnvironmentPath] : []),
    ...environmentFiles.map((environmentFile) => path.resolve(repositoryRoot, environmentFile)),
  ]

  if (files.length === 0) throw new Error('No .env or --env-file configuration was found.')

  for (const resolvedPath of files) {
    const result = loadEnvironment({ override: true, path: resolvedPath })
    if (result.error) throw new Error(`Could not load environment file: ${resolvedPath}`)
  }
}

function expectedMediaSources(): string[] {
  const home = getHomeContent('en')
  const property = getPropertyContent('en', 'penthouse-lago')
  if (!property) throw new Error('Approved Penthouse Lago content is missing.')

  const sources = [
    home.hero.image,
    home.hero.mobileImage,
    home.difference.image,
    home.hospitalityDifference.image,
    ...property.gallery.map((image) => image.src),
  ]
  const uniqueSources = [...new Set(sources)]

  if (uniqueSources.length !== REQUIRED_MEDIA_COUNT) {
    throw new Error(
      `Expected ${REQUIRED_MEDIA_COUNT} unique approved media sources, found ${uniqueSources.length}.`,
    )
  }

  return uniqueSources
}

function publicFile(source: string): string {
  return path.join(repositoryRoot, 'public', ...source.split('/').filter(Boolean))
}

function isSourceFilename(candidate: string | null | undefined, source: string): boolean {
  if (!candidate) return false

  const filename = path.basename(source)
  if (candidate === filename) return true

  const extension = path.extname(filename)
  const stem = path.basename(filename, extension).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const escapedExtension = extension.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  return new RegExp(`^${stem}-\\d+${escapedExtension}$`).test(candidate)
}

function remoteURLs(document: Media, publicURL: string): string[] {
  const urls = [document.url]
  for (const size of Object.values(document.sizes || {})) {
    if (size?.filename) urls.push(size.url)
  }

  return urls.map((url) => {
    if (!url?.startsWith(`${publicURL}/`)) {
      throw new Error(`Media ${document.filename || document.id} did not resolve through R2_PUBLIC_URL.`)
    }
    return url
  })
}

async function verifyPublicObjects(urls: string[]) {
  for (const url of urls) {
    const response = await fetch(url, { method: 'HEAD' })
    if (!response.ok) throw new Error(`R2 public verification failed with HTTP ${response.status}: ${url}`)
  }
}

async function main() {
  const args = parseArguments(process.argv.slice(2))
  if (args.help) {
    console.log(usage())
    return
  }

  loadEnvironmentFiles(args.environmentFiles)

  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.')
  if (!process.env.PAYLOAD_SECRET) throw new Error('PAYLOAD_SECRET is required.')
  const r2 = getR2Config()
  if (!r2) throw new Error('The complete R2 environment configuration is required.')

  const sources = expectedMediaSources()
  const missingFiles = sources.filter((source) => !fs.existsSync(publicFile(source)))
  if (missingFiles.length > 0) {
    throw new Error(`Approved source files are missing: ${missingFiles.join(', ')}`)
  }

  const { default: payloadConfig } = await import('../src/payload.config')
  const payload = await getPayload({ config: payloadConfig })

  try {
    const media = await payload.find({
      collection: 'media',
      depth: 0,
      limit: 1000,
      overrideAccess: true,
    })

    if (media.totalDocs !== REQUIRED_MEDIA_COUNT || media.docs.length !== REQUIRED_MEDIA_COUNT) {
      throw new Error(
        `Guard failed: expected exactly ${REQUIRED_MEDIA_COUNT} media documents, found ${media.totalDocs}.`,
      )
    }

    const migrationPlan = sources.map((source) => {
      const matches = media.docs.filter((document) => isSourceFilename(document.filename, source))
      if (matches.length !== 1) {
        throw new Error(`Guard failed: ${source} matched ${matches.length} media documents instead of one.`)
      }
      return { document: matches[0], source }
    })
    const matchedIDs = new Set(migrationPlan.map(({ document }) => document.id))
    if (matchedIDs.size !== REQUIRED_MEDIA_COUNT) {
      throw new Error('Guard failed: more than one source resolved to the same media document.')
    }

    console.log(`Guard passed: ${REQUIRED_MEDIA_COUNT} database records and source files match one-to-one.`)
    migrationPlan.forEach(({ document, source }) =>
      console.log(`  ${document.filename} <= ${path.relative(repositoryRoot, publicFile(source))}`),
    )

    if (!args.apply) {
      console.log('\nDry run only. Re-run with --apply to upload and replace these files in place.')
      return
    }

    const verifiedURLs: string[] = []
    for (const { document, source } of migrationPlan) {
      const updated = await payload.update({
        collection: 'media',
        id: document.id,
        data: { alt: document.alt },
        filePath: publicFile(source),
        overwriteExistingFiles: true,
        overrideAccess: true,
      })
      verifiedURLs.push(...remoteURLs(updated, r2.publicURL))
      console.log(`Uploaded ${updated.filename}.`)
    }

    await verifyPublicObjects([...new Set(verifiedURLs)])
    console.log(
      `R2 migration complete: ${REQUIRED_MEDIA_COUNT} records retained their IDs and ${new Set(verifiedURLs).size} public objects passed HTTP verification.`,
    )
  } finally {
    await payload.destroy()
  }
}

main()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })
