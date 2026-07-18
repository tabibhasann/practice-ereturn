import { corsHeaders, createAdminClient, guardRequest, jsonResponse, normalizeUsername, readJson, requestBodyError } from '../_shared/helpers.ts'

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
  const { data, error } = await supabase.rpc('record_practice_submission', { p_username: username }).maybeSingle()
  if (error) return jsonResponse({ error: error.message }, 500)
  if (!data) return jsonResponse({ error: 'This username was not created by admin.' }, 404)

  return jsonResponse({
    practiceSubmissionCount: Number(data.practice_submission_count || 0),
    lastPracticedAt: data.last_practiced_at,
  })
})
