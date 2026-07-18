import {
  corsHeaders,
  createAdminClient,
  guardRequest,
  jsonResponse,
  normalizeUsername,
  readJson,
  requestBodyError,
  requireAdmin,
} from '../_shared/helpers.ts'

const allowedActions = new Set(['deactivate', 'restore', 'delete'])

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
  const action = String(body.action || '').trim().toLowerCase()
  if (!username) return jsonResponse({ error: 'Username is required.' }, 400)
  if (!allowedActions.has(action)) return jsonResponse({ error: 'Invalid user action.' }, 400)

  const supabase = createAdminClient()
  const adminError = await requireAdmin(supabase, req)
  if (adminError) return adminError

  const { data: existingUser, error: lookupError } = await supabase
    .from('trainee_users')
    .select('*')
    .eq('username', username)
    .maybeSingle()

  if (lookupError) return jsonResponse({ error: lookupError.message }, 500)
  if (!existingUser) return jsonResponse({ error: 'Trainee username was not found.' }, 404)

  if (action === 'delete') {
    const { data: deleted, error: deleteError } = await supabase.rpc('delete_unused_trainee', {
      p_username: username,
    })
    if (deleteError) return jsonResponse({ error: deleteError.message }, 500)
    if (!deleted) {
      return jsonResponse({
        error: 'This username has activity and cannot be deleted. Deactivate it to preserve its records.',
      }, 409)
    }
    return jsonResponse({ username, deleted: true })
  }

  const disabledAt = action === 'deactivate' ? new Date().toISOString() : null
  const { data: user, error: updateError } = await supabase
    .from('trainee_users')
    .update({ disabled_at: disabledAt })
    .eq('id', existingUser.id)
    .select('*')
    .single()

  if (updateError) return jsonResponse({ error: updateError.message }, 500)
  return jsonResponse({ user })
})
