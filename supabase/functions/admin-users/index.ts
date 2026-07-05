import { corsHeaders, createAdminClient, jsonResponse, readJson, requireAdmin } from '../_shared/helpers.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed.' }, 405)

  const body = await readJson(req)
  const adminError = requireAdmin(body, req)
  if (adminError) return adminError

  const supabase = createAdminClient()
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
  })
})
