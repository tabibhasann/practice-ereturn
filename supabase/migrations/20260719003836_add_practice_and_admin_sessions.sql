alter table public.trainee_users
  add column if not exists practice_submission_count integer not null default 0,
  add column if not exists last_practiced_at timestamptz;

alter table public.trainee_users
  drop constraint if exists trainee_users_practice_submission_count_check;

alter table public.trainee_users
  add constraint trainee_users_practice_submission_count_check
  check (practice_submission_count >= 0);

alter table public.admin_credentials
  add column if not exists password_salt text,
  add column if not exists password_iterations integer not null default 210000;

alter table public.admin_credentials
  drop constraint if exists admin_credentials_password_salt_check;

alter table public.admin_credentials
  add constraint admin_credentials_password_salt_check
  check (password_salt is null or password_salt ~ '^[a-f0-9]{32}$');

delete from public.admin_credentials
where username <> 'admin-nbr-7k4p9q';

insert into public.admin_credentials (username, password_hash, password_salt, password_iterations)
values (
  'admin-nbr-7k4p9q',
  '46c441768ae09a6c36e0e786ed844777fd76712f54cc770b7a4cb57c9e513ab1',
  'a842c7ae8e878c8a76abf9d354d4c506',
  210000
)
on conflict (username) do update
set password_hash = excluded.password_hash,
    password_salt = excluded.password_salt,
    password_iterations = excluded.password_iterations,
    updated_at = now();

create table if not exists public.admin_sessions (
  token_hash text primary key check (token_hash ~ '^[a-f0-9]{64}$'),
  username text not null references public.admin_credentials(username) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  last_used_at timestamptz not null default now()
);

create index if not exists admin_sessions_expires_at_idx
  on public.admin_sessions (expires_at);

create table if not exists public.admin_login_attempts (
  identifier_hash text primary key check (identifier_hash ~ '^[a-f0-9]{64}$'),
  failed_count integer not null default 0 check (failed_count >= 0),
  window_started_at timestamptz not null default now(),
  blocked_until timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.admin_sessions enable row level security;
alter table public.admin_login_attempts enable row level security;

create policy "deny direct client access"
  on public.admin_sessions
  as restrictive for all to anon, authenticated
  using (false) with check (false);

create policy "deny direct client access"
  on public.admin_login_attempts
  as restrictive for all to anon, authenticated
  using (false) with check (false);

revoke all privileges on public.admin_sessions from public, anon, authenticated;
revoke all privileges on public.admin_login_attempts from public, anon, authenticated;
grant select, insert, update, delete on public.admin_sessions to service_role;
grant select, insert, update, delete on public.admin_login_attempts to service_role;

create or replace function public.record_practice_submission(p_username text)
returns setof public.trainee_users
language sql
security invoker
set search_path = ''
as $$
  update public.trainee_users
  set practice_submission_count = practice_submission_count + 1,
      last_practiced_at = now()
  where username = upper(trim(p_username))
    and disabled_at is null
  returning *;
$$;

revoke execute on function public.record_practice_submission(text) from public, anon, authenticated;
grant execute on function public.record_practice_submission(text) to service_role;
