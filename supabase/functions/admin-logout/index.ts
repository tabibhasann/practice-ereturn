import { corsHeaders, createAdminClient, guardRequest, jsonResponse, requireAdmin, sha256 } from '../_shared/helpers.ts'

Deno.serve(async (req: Request) => {
  const requestError = guardRequest(req)
  if (requestError) return requestError
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed.' }, 405)

  const supabase = createAdminClient()
  const adminError = await requireAdmin(supabase, req)
  if (adminError) return adminError

  const token = req.headers.get('x-admin-session') || ''
  const { error } = await supabase
    .from('admin_sessions')
    .delete()
    .eq('token_hash', await sha256(token))

  if (error) return jsonResponse({ error: 'Could not end the admin session.' }, 500)
  return jsonResponse({ success: true })
})
