import { createClient, type SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0'

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'apikey, content-type, x-admin-password',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

export function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

export async function readJson(req: Request) {
  try {
    return await req.json()
  } catch {
    return {}
  }
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
