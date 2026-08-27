// One-off: create the first admin user for local development.
// Run: pnpm tsx scripts/seed-admin.ts
// Dev-only credentials — create your real user in /admin and delete this one
// before any shared environment.
import 'dotenv/config'
import { getPayload } from 'payload'

import config from '../src/payload.config'

const email = 'dev@websitecore.local'
const password = 'devpassword'

const payload = await getPayload({ config })

const existing = await payload.find({ collection: 'users', limit: 1 })
if (existing.totalDocs > 0) {
  console.log('Users already exist — nothing to do.')
} else {
  await payload.create({
    collection: 'users',
    data: { email, password, role: 'admin', name: 'Dev Admin' },
  })
  console.log(`Created admin user ${email}`)
}

process.exit(0)
