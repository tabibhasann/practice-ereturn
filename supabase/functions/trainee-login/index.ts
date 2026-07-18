import { corsHeaders, createAdminClient, guardRequest, jsonResponse, normalizeUsername, readJson, requestBodyError } from '../_shared/helpers.ts'
import { recoverBrowserData } from '../_shared/recovery.ts'

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

  let recovery = null
  if (body.legacyRecovery) {
    try {
      recovery = await recoverBrowserData(supabase, body.legacyRecovery, {
        allowCreateUsers: false,
        allowedUsername: username,
        preserveAllAttempts: false,
      })
    } catch (error) {
      return jsonResponse({ error: error instanceof Error ? error.message : 'Could not synchronize data.' }, 500)
    }
  }

  const { count, error: countError } = await supabase
    .from('return_attempts')
    .select('id', { count: 'exact', head: true })
    .eq('trainee_user_id', data.id)

  if (countError) return jsonResponse({ error: countError.message }, 500)

  const attemptLimit = Math.min(Number(data.attempt_limit || 1), 1)
  const attemptCount = Number(count || 0)

  return jsonResponse({
    user: data,
    attemptCount,
    attemptLimit,
    attemptsRemaining: Math.max(attemptLimit - attemptCount, 0),
    recovery,
  })
})
