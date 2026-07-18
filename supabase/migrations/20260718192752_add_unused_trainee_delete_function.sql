create or replace function public.delete_unused_trainee(p_username text)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  deleted_count integer;
begin
  delete from public.trainee_users as trainee
  where trainee.username = upper(trim(p_username))
    and trainee.practice_submission_count = 0
    and not exists (
      select 1
      from public.return_attempts as attempt
      where attempt.trainee_user_id = trainee.id
    );

  get diagnostics deleted_count = row_count;
  return deleted_count = 1;
end;
$$;

revoke execute on function public.delete_unused_trainee(text) from public, anon, authenticated;
grant execute on function public.delete_unused_trainee(text) to service_role;
