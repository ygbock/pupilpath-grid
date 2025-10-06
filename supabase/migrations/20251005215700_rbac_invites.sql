-- RBAC core: roles table, helper, invites, secure functions

-- 1) user_roles: many-to-one roles per user
create table if not exists public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('admin','staff','student')),
  created_at timestamptz not null default now(),
  created_by uuid null,
  primary key (user_id, role)
);

-- 2) has_role helper
create or replace function public.has_role(u uuid, r text)
returns boolean
language sql
stable
as $$
  select exists(
    select 1 from public.user_roles ur
    where ur.user_id = u and ur.role = r
  );
$$;

-- 3) Guarded admin assignment
create or replace function public.assign_admin_role(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- allow if caller is already admin OR no admins exist yet
  if public.has_role(auth.uid(), 'admin')
     or not exists(select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles(user_id, role, created_by)
    values (target_user_id, 'admin', auth.uid())
    on conflict (user_id, role) do nothing;
  else
    raise exception 'not authorized to assign admin role';
  end if;
end;$$;

-- 4) Invites table
create table if not exists public.invites (
  id uuid primary key default gen_random_uuid(),
  email text not null check (position('@' in email) > 1),
  role text not null check (role in ('staff','student')),
  token text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  created_by uuid not null references auth.users(id) on delete cascade,
  used_at timestamptz,
  used_by uuid references auth.users(id),
  constraint invite_not_expired check (expires_at > now())
);

-- 5) RLS and policies
alter table public.user_roles enable row level security;
alter table public.invites enable row level security;

-- user_roles policies
create policy if not exists "Admins can manage user_roles"
  on public.user_roles for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy if not exists "Users can view their roles"
  on public.user_roles for select
  using (user_id = auth.uid());

-- invites policies: only admins can insert/select; updates only via claim function
create policy if not exists "Admins can create/view invites"
  on public.invites for select using (public.has_role(auth.uid(), 'admin'));
create policy if not exists "Admins can insert invites"
  on public.invites for insert with check (public.has_role(auth.uid(), 'admin'));

-- 6) Claim invite function: assigns role to caller and marks invite used
create or replace function public.claim_invite(invite_token text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
  v_role text;
  v_id uuid;
  v_expires timestamptz;
  caller_email text;
begin
  -- fetch invite
  select id, email, role, expires_at into v_id, v_email, v_role, v_expires
  from public.invites
  where token = invite_token and used_at is null
  for update;

  if v_id is null then
    raise exception 'invalid or already used invite';
  end if;
  if v_expires < now() then
    raise exception 'invite expired';
  end if;

  -- verify caller email matches invite email
  select email into caller_email from auth.users where id = auth.uid();
  if caller_email is null or lower(caller_email) <> lower(v_email) then
    raise exception 'invite email mismatch';
  end if;

  -- assign role to caller
  insert into public.user_roles(user_id, role, created_by)
  values (auth.uid(), v_role, v_id) on conflict do nothing;

  -- mark invite as used
  update public.invites
  set used_at = now(), used_by = auth.uid()
  where id = v_id;
end;$$;

-- 7) Utility to create invite token, returns token
create or replace function public.create_invite(target_email text, target_role text, ttl_minutes int default 60)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  t text := encode(gen_random_bytes(24), 'hex');
  exp timestamptz := now() + make_interval(mins => coalesce(ttl_minutes, 60));
  new_id uuid;
begin
  if not public.has_role(auth.uid(), 'admin') then
    raise exception 'only admins can create invites';
  end if;
  if target_role not in ('staff','student') then
    raise exception 'invalid role';
  end if;

  insert into public.invites(email, role, token, expires_at, created_by)
  values (target_email, target_role, t, exp, auth.uid())
  returning id into new_id;

  return t;
end;$$;

-- 8) Types and grants
revoke all on table public.invites from anon;
revoke all on table public.user_roles from anon;
-- Supabase will handle grants for authenticated via policies
