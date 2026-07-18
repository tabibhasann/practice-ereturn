import { createClient, type SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0'

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'apikey, content-type, x-admin-session',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const MAX_REQUEST_BYTES = 2_000_000
const ALLOWED_BROWSER_ORIGINS = new Set([
  'https://ereturn.tabibhasan.com',
  'https://ereturn-sable.vercel.app',
  'http://127.0.0.1:5173',
  'http://localhost:5173',
])

export function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}

export async function readJson(req: Request) {
  const text = await req.text()
  if (new TextEncoder().encode(text).byteLength > MAX_REQUEST_BYTES) {
    throw new Error('REQUEST_TOO_LARGE')
  }
  try {
    return JSON.parse(text || '{}')
  } catch {
    return {}
  }
}

export function guardRequest(req: Request) {
  const origin = req.headers.get('origin')
  if (origin && !ALLOWED_BROWSER_ORIGINS.has(origin)) {
    return jsonResponse({ error: 'Origin not allowed.' }, 403)
  }

  const contentLength = Number(req.headers.get('content-length') || 0)
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return jsonResponse({ error: 'Request is too large.' }, 413)
  }

  return null
}

export function requestBodyError(error: unknown) {
  if (error instanceof Error && error.message === 'REQUEST_TOO_LARGE') {
    return jsonResponse({ error: 'Request is too large.' }, 413)
  }
  return jsonResponse({ error: 'Invalid request body.' }, 400)
}

export function normalizeUsername(value: unknown) {
  return String(value || '').trim().toUpperCase()
}

function getAdminKey() {
  const legacyServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (legacyServiceKey) return legacyServiceKey

  const secretKeys = Deno.env.get('SUPABASE_SECRET_KEYS')
  if (!secretKeys) return ''

  try {
    return JSON.parse(secretKeys).default || ''
  } catch {
    return ''
  }
}

export function createAdminClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
  const adminKey = getAdminKey()

  if (!supabaseUrl || !adminKey) {
    throw new Error('Supabase Edge Function secrets are not configured.')
  }

  return createClient(supabaseUrl, adminKey)
}

export async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) return false
  let difference = 0
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index)
  }
  return difference === 0
}

export async function requireAdmin(
  supabase: SupabaseClient,
  req: Request,
) {
  const supplied = req.headers.get('x-admin-session') || ''
  if (!supplied) {
    return jsonResponse({ error: 'Unauthorized admin request.' }, 401)
  }

  const tokenHash = await sha256(supplied)
  const { data, error } = await supabase
    .from('admin_sessions')
    .select('username, expires_at')
    .eq('token_hash', tokenHash)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()

  if (error || !data) return jsonResponse({ error: 'Unauthorized admin request.' }, 401)

  await supabase.from('admin_sessions').update({ last_used_at: new Date().toISOString() }).eq('token_hash', tokenHash)

  return null
}

export function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function hexBytes(value: string) {
  const matches = value.match(/.{1,2}/g) || []
  return new Uint8Array(matches.map((part) => Number.parseInt(part, 16)))
}

export async function pbkdf2(password: string, saltHex: string, iterations: number) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits'],
  )
  const bits = await crypto.subtle.deriveBits({
    name: 'PBKDF2',
    salt: hexBytes(saltHex),
    iterations,
    hash: 'SHA-256',
  }, key, 256)
  return Array.from(new Uint8Array(bits), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function makeUsername() {
  return `USR-${crypto.randomUUID().replaceAll('-', '').slice(0, 12).toUpperCase()}`
}
