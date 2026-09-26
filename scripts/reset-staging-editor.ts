import { randomBytes } from 'node:crypto'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'

import { config as loadEnvironment } from 'dotenv'

loadEnvironment({ path: path.resolve('.env.netlify.local') })
loadEnvironment({ path: path.resolve('.env.staging-admin.local'), override: true })

const baseURL = (process.env.NEXT_PUBLIC_SERVER_URL || '').replace(/\/+$/, '')
const adminEmail = process.env.STAGING_ADMIN_EMAIL || ''
const adminPassword = process.env.STAGING_ADMIN_PASSWORD || ''
const editorEmail = process.env.CLIENT_EDITOR_EMAIL || 'mariposacrtravel@gmail.com'

if (!baseURL || !adminEmail || !adminPassword) {
  throw new Error('Missing staging URL or administrator credentials in ignored local env files.')
}
if (!new URL(baseURL).hostname.endsWith('.netlify.app')) {
  throw new Error('Safety check failed: this script only resets an editor on a Netlify staging URL.')
}

async function jsonRequest<T>(pathname: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${baseURL}${pathname}`, init)
  if (!response.ok) {
    const body = await response.text()
    throw new Error(`${init.method || 'GET'} ${pathname} failed (${response.status}): ${body}`)
  }
  return (await response.json()) as T
}

const adminLogin = await jsonRequest<{ token: string }>('/api/users/login', {
  body: JSON.stringify({ email: adminEmail, password: adminPassword }),
  headers: { 'content-type': 'application/json' },
  method: 'POST',
})
const authorization = { Authorization: `JWT ${adminLogin.token}` }
const users = await jsonRequest<{ docs: { email: string; id: string; role: string }[] }>(
  `/api/users?limit=1&where[email][equals]=${encodeURIComponent(editorEmail)}`,
  { headers: authorization },
)
const editor = users.docs[0]
if (!editor || editor.email.toLowerCase() !== editorEmail.toLowerCase()) {
  throw new Error(`Editor account ${editorEmail} was not found.`)
}
if (editor.role !== 'editor') {
  throw new Error(`Safety check failed: ${editorEmail} is not an editor account.`)
}

const temporaryPassword = `Mariposa-${randomBytes(15).toString('base64url')}!`
await jsonRequest(`/api/users/${editor.id}`, {
  body: JSON.stringify({ password: temporaryPassword }),
  headers: { ...authorization, 'content-type': 'application/json' },
  method: 'PATCH',
})

await jsonRequest('/api/users/login', {
  body: JSON.stringify({ email: editorEmail, password: temporaryPassword }),
  headers: { 'content-type': 'application/json' },
  method: 'POST',
})

const credentialPath = path.resolve('.env.client-editor.local')
await writeFile(
  credentialPath,
  [
    `CLIENT_EDITOR_LOGIN_URL=${baseURL}/admin/login`,
    `CLIENT_EDITOR_EMAIL=${editorEmail}`,
    `CLIENT_EDITOR_PASSWORD=${temporaryPassword}`,
    '',
  ].join('\n'),
  { encoding: 'utf8', mode: 0o600 },
)

console.log(`Verified editor login for ${editorEmail}.`)
console.log(`Credentials saved only to ignored local file: ${credentialPath}`)
