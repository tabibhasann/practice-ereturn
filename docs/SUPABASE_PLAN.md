# Supabase Setup

Supabase project created for this app:

```text
project_id: mgkiqmupnjazaegqwpqy
url: https://mgkiqmupnjazaegqwpqy.supabase.co
region: ap-southeast-1
```

Local environment file:

```text
.env.local
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

`.env.local` is intentionally not committed.

## Tables Created

### trainee_users

Stores admin-created trainee usernames.

Columns:

- `id`
- `username`
- `display_name`
- `created_at`
- `disabled_at`

### return_attempts

Stores every submitted attempt.

Columns:

- `id`
- `trainee_user_id`
- `username`
- `submitted_at`
- `score`
- `mistakes`
- `payload`

## Current Behavior

- Admin creates a unique username such as `USR-ABC123`.
- Trainee logs in with that username only.
- Unknown usernames are blocked.
- Submitted attempts are inserted into Supabase.
- Admin dashboard reads usernames and attempts from Supabase.
- If Supabase env vars are missing, the app falls back to localStorage for local demo use.

## Security Note

This is currently a frontend-only Supabase integration. To make the demo work from the browser, the public anon role can read/create trainee usernames and read/insert attempts through RLS policies.

Before using this as a real public exam system, harden it with one of these:

- Supabase Auth for admin and restricted admin-only username creation.
- Edge Functions for admin-only create-user and review-attempt operations.
- Tighter RLS policies so trainees can only submit under their own assigned username and cannot read all attempts.

## Remaining Product Work

- Final scoring rules.
- Detailed mistake detection.
- Full official-style preview if required by examiners.
- Production-grade admin authentication.
