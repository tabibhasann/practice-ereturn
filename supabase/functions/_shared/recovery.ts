import { createAdminClient, normalizeUsername } from './helpers.ts'
import { markAttempt } from './scoring.js'

const MAX_USERS = 1000
const MAX_ATTEMPTS = 1000

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {}
}

function validUsername(value: unknown) {
  const username = normalizeUsername(value)
  return /^[A-Z0-9][A-Z0-9_-]{2,63}$/.test(username) ? username : ''
}

function attemptUsername(attempt: Record<string, unknown>) {
  return validUsername(attempt.userCode || attempt.userName || attempt.username)
}

function validTimestamp(value: unknown) {
  const date = new Date(String(value || ''))
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString()
}

async function sourceAttemptId(attempt: Record<string, unknown>) {
  const existingId = String(attempt.id || '').trim()
  if (existingId) return `browser:${existingId}`.slice(0, 200)

  const bytes = new TextEncoder().encode(JSON.stringify(attempt))
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  const hash = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
  return `browser:${hash}`
}

export async function recoverBrowserData(
  supabase: ReturnType<typeof createAdminClient>,
  input: unknown,
  options: { allowCreateUsers: boolean; allowedUsername?: string; preserveAllAttempts?: boolean },
) {
  const recovery = asRecord(input)
  const rawUsers = asRecord(recovery.users)
  const rawAttempts = Array.isArray(recovery.attempts)
    ? recovery.attempts.slice(0, MAX_ATTEMPTS).map(asRecord)
    : []
  const allowedUsername = validUsername(options.allowedUsername)
  const recoveredUsers = new Map<string, string>()
  const recoverySource = String(recovery.sourceOrigin || 'browser-local').slice(0, 200)

  if (options.allowCreateUsers) {
    for (const [key, value] of Object.entries(rawUsers).slice(0, MAX_USERS)) {
      const user = asRecord(value)
      const username = validUsername(user.username || user.userName || key)
      if (username) recoveredUsers.set(username, validTimestamp(user.createdAt))
    }
    for (const attempt of rawAttempts) {
      const username = attemptUsername(attempt)
      if (username && !recoveredUsers.has(username)) {
        recoveredUsers.set(username, validTimestamp(attempt.createdAt || attempt.submittedAt))
      }
    }

    if (recoveredUsers.size) {
      const { error } = await supabase.from('trainee_users').upsert(
        Array.from(recoveredUsers, ([username, createdAt]) => ({
          username,
          display_name: username,
          attempt_limit: 1,
          created_at: createdAt,
          recovered_at: new Date().toISOString(),
          recovery_source: recoverySource,
        })),
        { onConflict: 'username', ignoreDuplicates: true },
      )
      if (error) throw error
    }
  } else if (allowedUsername) {
    recoveredUsers.set(allowedUsername, new Date().toISOString())
  }

  if (!recoveredUsers.size) return { processed: true, userCount: 0, attemptCount: 0 }

  const { data: userRows, error: usersError } = await supabase
    .from('trainee_users')
    .select('id, username')
    .in('username', Array.from(recoveredUsers.keys()))
  if (usersError) throw usersError

  const usersByUsername = new Map((userRows || []).map((user) => [user.username, user]))
  const candidates = rawAttempts.filter((attempt) => {
    const username = attemptUsername(attempt)
    return usersByUsername.has(username) && (!allowedUsername || username === allowedUsername)
  })
  const attemptsToRecover = options.preserveAllAttempts ? candidates : candidates.slice(0, 1)

  const rows = []
  for (const attempt of attemptsToRecover) {
    const username = attemptUsername(attempt)
    const user = usersByUsername.get(username)
    if (!user) continue

    const marking = markAttempt(attempt)
    rows.push({
      trainee_user_id: user.id,
      username,
      submitted_at: validTimestamp(attempt.submittedAt || attempt.createdAt),
      score: marking.score,
      mistakes: marking.mistakes,
      payload: {
        ...attempt,
        userName: username,
        userCode: username.toLowerCase(),
        status: 'submitted',
        score: marking.score,
        mistakes: marking.mistakes,
        marking: marking.summary,
      },
      source_attempt_id: await sourceAttemptId(attempt),
      recovered_at: options.preserveAllAttempts ? new Date().toISOString() : null,
      recovery_source: recoverySource,
    })
  }

  if (rows.length) {
    const { error } = await supabase
      .from('return_attempts')
      .upsert(rows, { onConflict: 'source_attempt_id', ignoreDuplicates: true })
    if (error && !(!options.preserveAllAttempts && error.message?.includes('ATTEMPT_LIMIT_REACHED'))) {
      throw error
    }
  }

  return { processed: true, userCount: usersByUsername.size, attemptCount: rows.length }
}
