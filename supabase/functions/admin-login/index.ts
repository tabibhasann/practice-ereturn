import {
  constantTimeEqual,
  corsHeaders,
  createAdminClient,
  guardRequest,
  jsonResponse,
  pbkdf2,
  randomToken,
  readJson,
  requestBodyError,
  sha256,
} from '../_shared/helpers.ts'

const MAX_FAILURES = 5
const WINDOW_MS = 15 * 60 * 1000
const SESSION_MS = 8 * 60 * 60 * 1000

function clientAddress(req: Request) {
  return (req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || req.headers.get('x-real-ip') || 'unknown')
    .split(',')[0]
    .trim()
}

Deno.serve(async (req: Request) => {
  const requestError = guardRequest(req)
  if (requestError) return requestError
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed.' }, 405)

  let body
  try {
    body = await readJson(req)
  } catch (error) {
    return requestBodyError(error)
  }

  const username = String(body.adminUsername || '').trim().toLowerCase()
  const password = String(body.adminPassword || '')
  if (!username || !password) return jsonResponse({ error: 'Invalid admin credentials.' }, 401)

  const supabase = createAdminClient()
  const identifierHash = await sha256(`${username}|${clientAddress(req)}`)
  const now = new Date()
  const { data: throttle } = await supabase
    .from('admin_login_attempts')
    .select('*')
    .eq('identifier_hash', identifierHash)
    .maybeSingle()

  if (throttle?.blocked_until && new Date(throttle.blocked_until) > now) {
    return jsonResponse({ error: 'Too many sign-in attempts. Please try again later.' }, 429)
  }

  const { data: credential, error: credentialError } = await supabase
    .from('admin_credentials')
    .select('username, password_hash, password_salt, password_iterations')
    .eq('username', username)
    .maybeSingle()

  let valid = false
  if (!credentialError && credential?.password_salt) {
    const suppliedHash = await pbkdf2(password, credential.password_salt, Number(credential.password_iterations))
    valid = constantTimeEqual(suppliedHash, credential.password_hash)
  }

  if (!valid) {
    const windowStarted = throttle?.window_started_at ? new Date(throttle.window_started_at) : null
    const insideWindow = Boolean(windowStarted && now.getTime() - windowStarted.getTime() < WINDOW_MS)
    const failedCount = insideWindow ? Number(throttle?.failed_count || 0) + 1 : 1
    const blockedUntil = failedCount >= MAX_FAILURES ? new Date(now.getTime() + WINDOW_MS).toISOString() : null
    await supabase.from('admin_login_attempts').upsert({
      identifier_hash: identifierHash,
      failed_count: failedCount,
      window_started_at: insideWindow ? windowStarted?.toISOString() : now.toISOString(),
      blocked_until: blockedUntil,
      updated_at: now.toISOString(),
    })
    return jsonResponse({ error: 'Invalid admin credentials.' }, 401)
  }

  await supabase.from('admin_login_attempts').delete().eq('identifier_hash', identifierHash)
  await supabase.from('admin_sessions').delete().lt('expires_at', now.toISOString())

  const token = randomToken()
  const expiresAt = new Date(now.getTime() + SESSION_MS).toISOString()
  const { error: sessionError } = await supabase.from('admin_sessions').insert({
    token_hash: await sha256(token),
    username,
    expires_at: expiresAt,
  })
  if (sessionError) return jsonResponse({ error: 'Could not start the admin session.' }, 500)

  return jsonResponse({ adminToken: token, expiresAt })
})
