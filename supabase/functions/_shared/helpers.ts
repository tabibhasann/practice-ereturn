import { createClient, type SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0'

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'apikey, content-type, x-admin-password',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const MAX_REQUEST_BYTES = 2_000_000
const ALLOWED_BROWSER_ORIGINS = new Set([
  'https://ereturn-sable.vercel.app',
  'http://127.0.0.1:5173',
  'http://localhost:5173',
])

export function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) return false
  let difference = 0
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index)
  }
  return difference === 0
}

export async function requireAdmin(
  supabase: SupabaseClient,
  body: Record<string, unknown>,
  req: Request,
) {
  const suppliedUsername = String(body.adminUsername || '')
  const supplied = req.headers.get('x-admin-password') || String(body.adminPassword || '')
  if (!suppliedUsername || !supplied) {
    return jsonResponse({ error: 'Unauthorized admin request.' }, 401)
  }

  const { data, error } = await supabase
    .from('admin_credentials')
    .select('password_hash')
    .eq('username', suppliedUsername)
    .maybeSingle()

  if (error || !data) return jsonResponse({ error: 'Unauthorized admin request.' }, 401)

  const suppliedHash = await sha256(supplied)

  if (!constantTimeEqual(suppliedHash, data.password_hash)) {
    return jsonResponse({ error: 'Unauthorized admin request.' }, 401)
  }

  return null
}

export function makeUsername() {
  return `USR-${crypto.randomUUID().replaceAll('-', '').slice(0, 12).toUpperCase()}`
}
