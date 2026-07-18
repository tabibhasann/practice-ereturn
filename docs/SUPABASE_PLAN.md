# Supabase Setup

Production project:

```text
project_id: wiqtbrexjjqzdtyvbwdm
name: practice-ereturn
region: ap-south-1
```

The frontend uses only the publishable key. `.env.local` is intentionally not committed.

## Data Model

- `trainee_users` stores admin-created usernames, Assessment 1 limit, practice count, and last-practiced timestamp.
- `return_attempts` stores only submitted assessments, including the complete payload, server score, and exact mistakes.
- `admin_credentials` stores the one-way salted admin password hash.
- `admin_sessions` stores hashed, expiring admin session tokens.
- `admin_login_attempts` provides brute-force throttling.

## Security

- All exposed tables use RLS and deny direct `anon` and `authenticated` access.
- Client table privileges are revoked; browser work is routed through Edge Functions.
- Admin functions require an expiring server-side session; logout revokes it.
- Practice completion is an atomic database increment and stores no form payload.
- Assessment scoring is authoritative on the server; browser-supplied score data is ignored.
- Missing Supabase configuration fails closed.

## Remaining Product Input

- Changes to accepted answers, weights, or tolerances if the examiner revises the marking policy.
- Unlock rules and answer keys for Assessments 2-7 when those assessments are supplied.
