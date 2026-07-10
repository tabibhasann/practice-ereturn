alter table public.return_attempts
  alter column trainee_user_id drop not null;

create or replace function public.enforce_trainee_attempt_limit()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  allowed_attempts integer;
  used_attempts integer;
begin
  if new.trainee_user_id is null then
    raise exception using errcode = '23502', message = 'TRAINEE_USER_REQUIRED';
  end if;

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
