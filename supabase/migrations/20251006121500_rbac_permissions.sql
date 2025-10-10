-- RBAC Permissions Schema
-- Creates permissions and role_permissions tables and helper functions
-- Integrates with existing public.user_roles (user_id, role)

begin;

-- 1) Permissions catalog
create table if not exists public.permissions (
  key text primary key,
  description text
);

-- 2) Role-permission mapping
create table if not exists public.role_permissions (
  role text not null,
  permission text not null references public.permissions(key) on delete cascade,
  primary key (role, permission)
);

-- 3) Optional per-user overrides (not used by UI yet, but handy)
create table if not exists public.user_permissions (
  user_id uuid not null references auth.users(id) on delete cascade,
  permission text not null references public.permissions(key) on delete cascade,
  allow boolean not null default true,
  primary key (user_id, permission)
);

-- 4) Helper: has_permission(user, perm)
create or replace function public.has_permission(_user_id uuid, _permission text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.role_permissions rp
      on rp.role = ur.role
    where ur.user_id = _user_id
      and rp.permission = _permission
  )
  or exists (
    select 1
    from public.user_permissions up
    where up.user_id = _user_id
      and up.permission = _permission
      and up.allow is true
  );
$$;

-- 5) Helper: any_permission(user, perms[])
create or replace function public.any_permission(_user_id uuid, _permissions text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from unnest(_permissions) p(perm)
    where public.has_permission(_user_id, p.perm)
  );
$$;

-- 6) Seed permissions
insert into public.permissions(key, description) values
  ('dashboard.view', 'View dashboards'),
  ('users.manage', 'Create and manage users'),
  ('students.manage', 'Manage students'),
  ('teachers.manage', 'Manage teachers'),
  ('classes.manage', 'Manage classes and sections'),
  ('attendance.view', 'View attendance'),
  ('attendance.record', 'Record attendance'),
  ('gradebook.view', 'View gradebook'),
  ('gradebook.manage', 'Manage gradebook'),
  ('assessments.manage', 'Manage assessments/exams'),
  ('fees.manage', 'Manage fees & payments'),
  ('timetable.view', 'View timetables'),
  ('timetable.manage', 'Manage timetables'),
  ('reports.view', 'View reports & analytics'),
  ('settings.manage', 'Manage system settings'),
  ('invites.manage', 'Manage invites')
  on conflict (key) do nothing;

-- 7) Seed role permissions
-- NOTE: Only 'admin' receives 'users.manage' to satisfy: only admin can create other user accounts
insert into public.role_permissions(role, permission)
values
  -- admin
  ('admin','dashboard.view'),
  ('admin','users.manage'),
  ('admin','students.manage'),
  ('admin','teachers.manage'),
  ('admin','classes.manage'),
  ('admin','attendance.view'),
  ('admin','gradebook.view'),
  ('admin','assessments.manage'),
  ('admin','fees.manage'),
  ('admin','timetable.manage'),
  ('admin','reports.view'),
  ('admin','settings.manage'),
  ('admin','invites.manage'),

  -- principal (no users.manage per requirement)
  ('principal','dashboard.view'),
  ('principal','students.manage'),
  ('principal','teachers.manage'),
  ('principal','classes.manage'),
  ('principal','attendance.view'),
  ('principal','gradebook.view'),
  ('principal','assessments.manage'),
  ('principal','fees.manage'),
  ('principal','timetable.manage'),
  ('principal','reports.view'),
  ('principal','settings.manage'),

  -- vice_principal
  ('vice_principal','dashboard.view'),
  ('vice_principal','students.manage'),
  ('vice_principal','teachers.manage'),
  ('vice_principal','classes.manage'),
  ('vice_principal','attendance.view'),
  ('vice_principal','gradebook.view'),
  ('vice_principal','assessments.manage'),
  ('vice_principal','timetable.view'),
  ('vice_principal','reports.view'),
  ('vice_principal','settings.manage'),

  -- hod
  ('hod','dashboard.view'),
  ('hod','attendance.view'),
  ('hod','gradebook.view'),
  ('hod','gradebook.manage'),
  ('hod','assessments.manage'),
  ('hod','reports.view'),
  ('hod','timetable.view'),

  -- exam_officer
  ('exam_officer','dashboard.view'),
  ('exam_officer','assessments.manage'),
  ('exam_officer','gradebook.manage'),
  ('exam_officer','reports.view'),

  -- form_master
  ('form_master','dashboard.view'),
  ('form_master','attendance.record'),
  ('form_master','gradebook.manage'),
  ('form_master','timetable.view'),
  ('form_master','reports.view'),

  -- subject_teacher
  ('subject_teacher','dashboard.view'),
  ('subject_teacher','attendance.record'),
  ('subject_teacher','gradebook.manage'),
  ('subject_teacher','timetable.view'),

  -- assistant_teacher
  ('assistant_teacher','dashboard.view'),
  ('assistant_teacher','attendance.view'),
  ('assistant_teacher','gradebook.view'),
  ('assistant_teacher','timetable.view'),

  -- staff (generic)
  ('staff','dashboard.view'),
  ('staff','reports.view'),

  -- teacher alias
  ('teacher','dashboard.view'),
  ('teacher','attendance.record'),
  ('teacher','gradebook.manage'),
  ('teacher','timetable.view'),

  -- student
  ('student','dashboard.view'),
  ('student','timetable.view'),
  ('student','attendance.view'),
  ('student','gradebook.view'),

  -- parent
  ('parent','dashboard.view'),
  ('parent','timetable.view'),
  ('parent','attendance.view'),
  ('parent','gradebook.view')
  on conflict (role, permission) do nothing;

commit;
