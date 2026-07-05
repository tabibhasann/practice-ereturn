alter table public.trainee_users enable row level security;
alter table public.return_attempts enable row level security;

drop policy if exists "anon can create trainee usernames" on public.trainee_users;
drop policy if exists "anon can read trainee usernames" on public.trainee_users;
drop policy if exists "anon can update trainee usernames" on public.trainee_users;
drop policy if exists "anon can read return attempts" on public.return_attempts;
drop policy if exists "anon can submit return attempts" on public.return_attempts;

revoke select, insert, update, delete on public.trainee_users from anon, authenticated;
revoke select, insert, update, delete on public.return_attempts from anon, authenticated;
