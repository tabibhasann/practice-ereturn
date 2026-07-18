create table if not exists public.admin_credentials (
  username text primary key,
  password_hash text not null check (password_hash ~ '^[a-f0-9]{64}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.admin_credentials enable row level security;

revoke all on public.admin_credentials from public, anon, authenticated;
grant select on public.admin_credentials to service_role;

insert into public.admin_credentials (username, password_hash)
values ('admin-nbr-edae54c24d9f', 'fb641a8c731b43c909cec8ff283b576eb47e4e320603ac87e6e18df8a723e5d6')
on conflict (username) do update
set password_hash = excluded.password_hash,
    updated_at = now();
