-- Enable RLS and allow authenticated users to select roles
begin;

alter table if exists public.roles enable row level security;

-- Limit select to authenticated users only
create policy if not exists "Authenticated can view roles"
  on public.roles for select
  using (auth.role() = 'authenticated');

commit;
