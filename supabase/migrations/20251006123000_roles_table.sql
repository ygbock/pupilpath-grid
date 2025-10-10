-- Roles table and user_roles constraint update to support extended roles
begin;

-- 1) Roles catalog
create table if not exists public.roles (
  key text primary key,
  category text,
  description text
);

-- 2) Seed roles
insert into public.roles(key, category, description) values
  ('admin','system','System administrator'),
  ('staff','system','Internal administrative staff'),
  ('student','learner','Student account'),
  ('parent','guardian','Parent/guardian account'),
  ('teacher','faculty','Generic teacher role (alias)'),
  ('principal','leadership','Head of school'),
  ('vice_principal','leadership','Deputy head'),
  ('hod','leadership','Head of department'),
  ('exam_officer','academics','Exam management officer'),
  ('form_master','academics','Class form teacher'),
  ('subject_teacher','academics','Subject teacher'),
  ('assistant_teacher','academics','Assistant teacher')
  on conflict (key) do nothing;

-- 3) Drop old CHECK constraint limiting roles to ('admin','staff','student') if it exists
DO $$
DECLARE
  chk_name text := 'user_roles_role_check';
  exists_chk boolean;
BEGIN
  select exists(
    select 1 from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    where n.nspname = 'public'
      and t.relname = 'user_roles'
      and c.conname = chk_name
  ) into exists_chk;
  IF exists_chk THEN
    execute 'alter table public.user_roles drop constraint ' || chk_name;
  END IF;
END $$;

-- 4) Add FK to roles if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    select 1 from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    where t.relname = 'user_roles' and c.conname = 'user_roles_role_fkey'
  ) THEN
    alter table public.user_roles
      add constraint user_roles_role_fkey
      foreign key (role) references public.roles(key) on update cascade on delete restrict;
  END IF;
END $$;

commit;
