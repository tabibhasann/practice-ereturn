create extension if not exists pgcrypto;

create table if not exists public.trainee_users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  display_name text,
  created_at timestamptz not null default now(),
  disabled_at timestamptz
);

create table if not exists public.return_attempts (
  id uuid primary key default gen_random_uuid(),
  trainee_user_id uuid references public.trainee_users(id) on delete set null,
  username text not null,
  submitted_at timestamptz not null default now(),
  score numeric,
  mistakes jsonb not null default '[]'::jsonb,
  payload jsonb not null
);

create index if not exists return_attempts_username_submitted_idx
  on public.return_attempts (username, submitted_at desc);

alter table public.trainee_users enable row level security;
alter table public.return_attempts enable row level security;

drop policy if exists "anon can create trainee usernames" on public.trainee_users;
drop policy if exists "anon can read trainee usernames" on public.trainee_users;
drop policy if exists "anon can update trainee usernames" on public.trainee_users;
drop policy if exists "anon can read return attempts" on public.return_attempts;
drop policy if exists "anon can submit return attempts" on public.return_attempts;

revoke select, insert, update, delete on public.trainee_users from anon, authenticated;
revoke select, insert, update, delete on public.return_attempts from anon, authenticated;
