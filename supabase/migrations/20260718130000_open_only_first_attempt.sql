update public.trainee_users
set attempt_limit = 1;

alter table public.trainee_users
  alter column attempt_limit set default 1;

alter table public.trainee_users
  drop constraint if exists trainee_users_attempt_limit_check;

alter table public.trainee_users
  add constraint trainee_users_attempt_limit_check
  check (attempt_limit between 1 and 7);

comment on column public.trainee_users.attempt_limit is
  'Number of currently unlocked attempt slots. Seven slots are shown; only slot 1 is open for this release.';
