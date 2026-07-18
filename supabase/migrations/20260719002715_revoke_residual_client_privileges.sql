revoke all privileges on public.trainee_users from anon, authenticated;
revoke all privileges on public.return_attempts from anon, authenticated;
revoke all privileges on public.admin_credentials from anon, authenticated;

grant select, insert, update, delete on public.trainee_users to service_role;
grant select, insert, update, delete on public.return_attempts to service_role;
grant select on public.admin_credentials to service_role;
