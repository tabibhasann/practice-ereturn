import { corsHeaders, createAdminClient, guardRequest, jsonResponse, normalizeUsername, readJson, requestBodyError } from '../_shared/helpers.ts'
import { markAttempt } from '../_shared/scoring.js'

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

  const attemptLimit = Math.min(Number(user.attempt_limit || 1), 1)

  const { count: existingCount, error: existingCountError } = await supabase
    .from('return_attempts')
    .select('id', { count: 'exact', head: true })
    .eq('trainee_user_id', user.id)

  if (existingCountError) return jsonResponse({ error: existingCountError.message }, 500)
  if (Number(existingCount || 0) >= attemptLimit) {
    return jsonResponse({ error: 'Attempt 1 has already been submitted. Attempts 2-7 are currently locked.' }, 409)
  }

  const marking = markAttempt(submittedAttempt)

  const payload = {
    ...submittedAttempt,
    userName: user.display_name || user.username,
    userCode: String(user.username).toLowerCase(),
    status: 'submitted',
    score: marking.score,
    mistakes: marking.mistakes,
    marking: marking.summary,
  }

  const { data, error } = await supabase
    .from('return_attempts')
    .insert({
      trainee_user_id: user.id,
      username: user.username,
      score: marking.score,
      mistakes: marking.mistakes,
      payload,
    })
    .select('*')
    .single()

  if (error) {
    if (error.message?.includes('ATTEMPT_LIMIT_REACHED')) {
      return jsonResponse({ error: `You have used all ${attemptLimit} attempts.` }, 409)
    }
    return jsonResponse({ error: error.message }, 500)
  }

  const { count, error: countError } = await supabase
    .from('return_attempts')
    .select('id', { count: 'exact', head: true })
    .eq('trainee_user_id', user.id)

  if (countError) return jsonResponse({ error: countError.message }, 500)

  return jsonResponse({
    attempt: data,
    attemptCount: Number(count || 0),
    attemptLimit,
    attemptsRemaining: Math.max(attemptLimit - Number(count || 0), 0),
  })
})
