import { corsHeaders, createAdminClient, jsonResponse, normalizeUsername, readJson } from '../_shared/helpers.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed.' }, 405)

  const body = await readJson(req)
  const username = normalizeUsername(body.username)
  if (!username) return jsonResponse({ error: 'Please enter your username.' }, 400)

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('trainee_users')
    .select('*')
    .eq('username', username)
    .maybeSingle()

  if (error) return jsonResponse({ error: error.message }, 500)
  if (!data) return jsonResponse({ error: 'This username was not created by admin.' }, 404)
  if (data.disabled_at) return jsonResponse({ error: 'This username is disabled.' }, 403)

  return jsonResponse({ user: data })
})
