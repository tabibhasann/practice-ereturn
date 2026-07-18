create policy "deny direct client access"
  on public.admin_credentials
  as restrictive
  for all
  to anon, authenticated
  using (false)
  with check (false);

create policy "deny direct client access"
  on public.trainee_users
  as restrictive
  for all
  to anon, authenticated
  using (false)
  with check (false);

create policy "deny direct client access"
  on public.return_attempts
  as restrictive
  for all
  to anon, authenticated
  using (false)
  with check (false);
