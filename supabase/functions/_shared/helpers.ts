import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0'

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

export function requireAdmin(body: Record<string, unknown>, req: Request) {
  const expectedUsername = Deno.env.get('ADMIN_USERNAME') || 'admin-nbr-7k4p9q'
  const expected = Deno.env.get('ADMIN_PASSWORD') || 'admin2026'
  const suppliedUsername = String(body.adminUsername || '')
  const supplied = req.headers.get('x-admin-password') || String(body.adminPassword || '')

  if (suppliedUsername !== expectedUsername || supplied !== expected) {
    return jsonResponse({ error: 'Unauthorized admin request.' }, 401)
  }

  return null
}

export function makeUsername() {
  return `USR-${crypto.randomUUID().replaceAll('-', '').slice(0, 6).toUpperCase()}`
}
