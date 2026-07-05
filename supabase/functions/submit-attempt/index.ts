import { corsHeaders, createAdminClient, jsonResponse, normalizeUsername, readJson } from '../_shared/helpers.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed.' }, 405)

  const body = await readJson(req)
  const username = normalizeUsername(body.username)
  const submittedAttempt = body.attempt || {}
  if (!username) return jsonResponse({ error: 'Please enter your username.' }, 400)

  const supabase = createAdminClient()
  const { data: user, error: userError } = await supabase
    .from('trainee_users')
    .select('*')
    .eq('username', username)
    .maybeSingle()

  if (userError) return jsonResponse({ error: userError.message }, 500)
  if (!user) return jsonResponse({ error: 'This username was not created by admin.' }, 404)
  if (user.disabled_at) return jsonResponse({ error: 'This username is disabled.' }, 403)

  const payload = {
    ...submittedAttempt,
    userName: user.display_name || user.username,
    userCode: String(user.username).toLowerCase(),
    status: 'submitted',
  }

  const { data, error } = await supabase
    .from('return_attempts')
    .insert({
      trainee_user_id: user.id,
      username: user.username,
      score: Number(submittedAttempt.score || 0),
      mistakes: Array.isArray(submittedAttempt.mistakes) ? submittedAttempt.mistakes : [],
      payload,
    })
    .select('*')
    .single()

  if (error) return jsonResponse({ error: error.message }, 500)

  return jsonResponse({ attempt: data })
})
