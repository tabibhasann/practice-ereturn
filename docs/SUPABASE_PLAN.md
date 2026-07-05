# Supabase Plan

Supabase is not connected in the current app. The current implementation stores data in `localStorage`, which is only suitable for local demo/testing.

## Required Tables

### trainee_users

Stores admin-created trainee access codes.

```sql
create table trainee_users (
  id uuid primary key default gen_random_uuid(),
  access_code text unique not null,
  display_name text,
  created_at timestamptz not null default now(),
  disabled_at timestamptz
);
```

### return_attempts

Stores each submitted attempt.

```sql
create table return_attempts (
  id uuid primary key default gen_random_uuid(),
  trainee_user_id uuid references trainee_users(id),
  access_code text not null,
  submitted_at timestamptz not null default now(),
  score numeric,
  mistakes jsonb not null default '[]'::jsonb,
  payload jsonb not null
);
```

## Required App Changes

1. Replace `readUsers` / `writeUsers` with Supabase reads/writes to `trainee_users`.
2. Replace `readAttempts` / `writeAttempts` with Supabase reads/writes to `return_attempts`.
3. On trainee login, look up `access_code`; allow login only if the code exists and is not disabled.
4. On save return, insert one row into `return_attempts` with the full attempt payload.
5. Admin dashboard should query all `trainee_users` and their attempts.

## What I Need To Connect It

- Supabase project URL.
- Supabase anon key for the frontend.
- Confirmation whether this will be hosted publicly or only used locally.
- Final admin auth approach: keep the current hardcoded admin for demo, or move admin login to Supabase Auth.

## Storage Estimate

For about 500 attempts with JSON-only form payloads, expected database usage is small, usually a few MB. If screenshots, PDFs, or attachments are saved later, those should use Supabase Storage and will increase usage separately.
