import { corsHeaders, createAdminClient, guardRequest, jsonResponse, readJson, requestBodyError, requireAdmin } from '../_shared/helpers.ts'
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
  const supabase = createAdminClient()
  const adminError = await requireAdmin(supabase, body, req)
  if (adminError) return adminError
  let recovery = null
  if (body.legacyRecovery) {
    try {
      recovery = await recoverBrowserData(supabase, body.legacyRecovery, {
        allowCreateUsers: true,
        preserveAllAttempts: true,
      })
    } catch (error) {
      return jsonResponse({ error: error instanceof Error ? error.message : 'Could not synchronize data.' }, 500)
    }
  }
  const [usersResult, attemptsResult] = await Promise.all([
    supabase.from('trainee_users').select('*').order('created_at', { ascending: false }),
    supabase.from('return_attempts').select('*').order('submitted_at', { ascending: false }),
  ])

  if (usersResult.error || attemptsResult.error) {
    return jsonResponse({ error: usersResult.error?.message || attemptsResult.error?.message }, 500)
  }

  return jsonResponse({
    users: usersResult.data || [],
    attempts: attemptsResult.data || [],
    recovery,
  })
})
