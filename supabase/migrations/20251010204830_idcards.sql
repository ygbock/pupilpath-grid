-- ID Cards: templates, issuance, permissions, and RLS
begin;

-- Ensure required extension for gen_random_uuid
create extension if not exists pgcrypto;

-- Helper trigger function to auto-update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 0) Ensure new permissions exist and map to roles
insert into public.permissions(key, description) values
  ('idcards.view','View ID card templates and issued cards'),
  ('idcards.manage','Manage ID card templates and issue/revoke cards')
on conflict (key) do nothing;

insert into public.role_permissions(role, permission) values
  ('admin','idcards.view'),
  ('admin','idcards.manage'),
  ('principal','idcards.view'),
  ('staff','idcards.view')
on conflict (role, permission) do nothing;

-- 1) Templates table
create table if not exists public.id_card_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  target_type text not null check (target_type in ('student','staff')),
  design jsonb not null default '{}', -- stores layout, colors, fields, logo urls
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at_idct
before update on public.id_card_templates
for each row execute function public.set_updated_at();

-- 2) Issuance table
create table if not exists public.id_card_issuance (
  id uuid primary key default gen_random_uuid(),
  subject_type text not null check (subject_type in ('student','staff')),
  student_id uuid references public.students(id) on delete cascade,
  teacher_id uuid references public.teachers(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null, -- may mirror students.user_id / teachers.user_id
  template_id uuid not null references public.id_card_templates(id) on delete restrict,
  qr_payload text, -- payload encoded into QR (e.g. verification URL or signed token)
  card_data jsonb not null default '{}', -- resolved fields used on the card
  issued_at timestamptz not null default now(),
  expires_at timestamptz,
  revoked boolean not null default false
);

-- Validity: either student OR teacher required, consistent with subject_type
alter table public.id_card_issuance
  add constraint idci_subject_consistency
  check ((subject_type = 'student' and student_id is not null and teacher_id is null)
      or (subject_type = 'staff' and teacher_id is not null and student_id is null));

-- 3) Indexes
create index if not exists idx_idct_target on public.id_card_templates(target_type);
create index if not exists idx_idci_student on public.id_card_issuance(student_id);
create index if not exists idx_idci_teacher on public.id_card_issuance(teacher_id);
create index if not exists idx_idci_user on public.id_card_issuance(user_id);
create index if not exists idx_idci_template on public.id_card_issuance(template_id);

-- 4) RLS policies
alter table public.id_card_templates enable row level security;
alter table public.id_card_issuance enable row level security;

-- Templates: view if has idcards.view; manage if idcards.manage
create policy if not exists "idct_view_by_permission"
  on public.id_card_templates for select
  using (public.has_permission(auth.uid(), 'idcards.view'));

create policy if not exists "idct_manage_by_permission"
  on public.id_card_templates for all
  using (public.has_permission(auth.uid(), 'idcards.manage'))
  with check (public.has_permission(auth.uid(), 'idcards.manage'));

-- Issuance: manage by permission; view by permission or subject can view their own card
create policy if not exists "idci_manage_by_permission"
  on public.id_card_issuance for all
  using (public.has_permission(auth.uid(), 'idcards.manage'))
  with check (public.has_permission(auth.uid(), 'idcards.manage'));

create policy if not exists "idci_view_by_permission_or_owner"
  on public.id_card_issuance for select
  using (
    public.has_permission(auth.uid(), 'idcards.view')
    or user_id = auth.uid()
    or (
      subject_type = 'student' and exists(
        select 1 from public.students s where s.id = student_id and s.user_id = auth.uid()
      )
    )
    or (
      subject_type = 'staff' and exists(
        select 1 from public.teachers t where t.id = teacher_id and t.user_id = auth.uid()
      )
    )
  );

commit;
