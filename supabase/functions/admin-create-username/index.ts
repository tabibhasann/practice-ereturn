import { corsHeaders, createAdminClient, guardRequest, jsonResponse, makeUsername, readJson, requestBodyError, requireAdmin } from '../_shared/helpers.ts'

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
  const supabase = createAdminClient()
  const adminError = await requireAdmin(supabase, body, req)
  if (adminError) return adminError

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const username = makeUsername()
    const { data, error } = await supabase
      .from('trainee_users')
      .insert({ username, display_name: username, attempt_limit: 1 })
      .select('*')
      .single()

    if (!error && data) return jsonResponse({ user: data })
    if (error?.code !== '23505') return jsonResponse({ error: error?.message || 'Could not create username.' }, 500)
  }

  return jsonResponse({ error: 'Could not generate a unique username.' }, 500)
})
