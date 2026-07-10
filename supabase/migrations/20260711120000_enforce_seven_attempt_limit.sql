alter table public.trainee_users
  add column if not exists attempt_limit smallint not null default 7;

alter table public.trainee_users
  drop constraint if exists trainee_users_attempt_limit_check;

alter table public.trainee_users
  add constraint trainee_users_attempt_limit_check
  check (attempt_limit between 1 and 100);

alter table public.return_attempts
  alter column trainee_user_id set not null;

create index if not exists return_attempts_trainee_user_id_idx
  on public.return_attempts (trainee_user_id);

create or replace function public.enforce_trainee_attempt_limit()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  allowed_attempts integer;
  used_attempts integer;
begin
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(new.trainee_user_id::text, 0)
  );

  select trainee.attempt_limit
    into allowed_attempts
    from public.trainee_users as trainee
    where trainee.id = new.trainee_user_id;

  if allowed_attempts is null then
    raise exception using errcode = '23503', message = 'TRAINEE_USER_NOT_FOUND';
  end if;

  select count(*)::integer
    into used_attempts
    from public.return_attempts as attempt
    where attempt.trainee_user_id = new.trainee_user_id;

  if used_attempts >= allowed_attempts then
    raise exception using errcode = 'P0001', message = 'ATTEMPT_LIMIT_REACHED';
  end if;

  return new;
end;
$$;

revoke execute on function public.enforce_trainee_attempt_limit() from public, anon, authenticated;

drop trigger if exists enforce_trainee_attempt_limit_before_insert on public.return_attempts;

create trigger enforce_trainee_attempt_limit_before_insert
before insert on public.return_attempts
for each row execute function public.enforce_trainee_attempt_limit();
