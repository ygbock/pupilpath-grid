-- Phase 2: Implement Comprehensive RBAC System for School Management

-- Step 1: Create permissions table
CREATE TABLE IF NOT EXISTS public.permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamp with time zone DEFAULT now()
);

-- Step 2: Create role_permissions junction table
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid REFERENCES public.staff_roles(id) ON DELETE CASCADE NOT NULL,
  permission_id uuid REFERENCES public.permissions(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(role_id, permission_id)
);

-- Step 3: Create departments table
CREATE TABLE IF NOT EXISTS public.departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Step 4: Create subjects table
CREATE TABLE IF NOT EXISTS public.subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE,
  department_id uuid REFERENCES public.departments(id) ON DELETE SET NULL,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Step 5: Create teacher_subject_assignments table (for subject teachers)
CREATE TABLE IF NOT EXISTS public.teacher_subject_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES public.teachers(id) ON DELETE CASCADE NOT NULL,
  subject_id uuid REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  class_id uuid REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  academic_year text,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(teacher_id, subject_id, class_id, academic_year)
);

-- Step 6: Create hod_assignments table (for HODs)
CREATE TABLE IF NOT EXISTS public.hod_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES public.teachers(id) ON DELETE CASCADE NOT NULL,
  department_id uuid REFERENCES public.departments(id) ON DELETE CASCADE NOT NULL,
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(department_id, start_date)
);

-- Step 7: Add form_teacher_id to classes table if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'classes' 
    AND column_name = 'form_teacher_id'
  ) THEN
    ALTER TABLE public.classes ADD COLUMN form_teacher_id uuid REFERENCES public.teachers(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Step 8: Insert all permissions
INSERT INTO public.permissions (name, description) VALUES
  -- Subject Teacher Permissions
  ('view_students', 'View students in assigned classes'),
  ('record_subject_attendance', 'Record attendance for subject periods'),
  ('manage_assessments', 'Enter and update CA and exam scores'),
  ('view_results', 'View student performance summaries'),
  ('view_timetable', 'View own timetable'),
  
  -- Form Master Permissions
  ('manage_class_attendance', 'Record daily class attendance'),
  ('approve_assessments', 'Approve continuous assessment entries'),
  ('generate_reports', 'Generate class reports and term summaries'),
  ('message_parents', 'Communicate with parents'),
  
  -- HOD Permissions
  ('view_department_teachers', 'View all teachers in department'),
  ('approve_scores', 'Approve and moderate scores'),
  ('assign_subjects', 'Assign subjects to teachers'),
  ('view_department_reports', 'View departmental performance reports'),
  ('moderate_assessments', 'Moderate assessments'),
  
  -- Exam Officer Permissions
  ('manage_exam_results', 'Upload and validate exam results'),
  ('lock_results', 'Lock results after approval'),
  ('view_performance_trends', 'View overall performance trends'),
  ('manage_exam_timetable', 'Manage exam timetables'),
  
  -- Vice Principal Permissions
  ('view_all_reports', 'View all classes and staff reports'),
  ('approve_department_reports', 'Approve HOD and exam officer activities'),
  ('manage_discipline', 'Handle student discipline records'),
  ('approve_results', 'Approve term reports'),
  ('view_dashboard', 'Access analytics dashboards'),
  ('manage_timetable', 'Manage timetables'),
  
  -- Principal Permissions (full access indicated by wildcard)
  ('full_access', 'Full access to all features')
ON CONFLICT (name) DO NOTHING;

-- Step 9: Insert staff roles
INSERT INTO public.staff_roles (name, description) VALUES
  ('Subject Teacher', 'Teaches specific subjects in assigned classes'),
  ('Form Master', 'Oversees class administration and student welfare'),
  ('Head of Department', 'Supervises teachers within a department'),
  ('Exam Officer', 'Manages exam and result operations'),
  ('Vice Principal', 'Deputy to principal - manages operations and academics'),
  ('Principal', 'Top-level administrator with full access')
ON CONFLICT (name) DO NOTHING;

-- Step 10: Assign permissions to roles
-- Subject Teacher permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT sr.id, p.id
FROM public.staff_roles sr
CROSS JOIN public.permissions p
WHERE sr.name = 'Subject Teacher'
AND p.name IN ('view_students', 'record_subject_attendance', 'manage_assessments', 'view_results', 'view_timetable')
ON CONFLICT DO NOTHING;

-- Form Master permissions (includes subject teacher permissions)
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT sr.id, p.id
FROM public.staff_roles sr
CROSS JOIN public.permissions p
WHERE sr.name = 'Form Master'
AND p.name IN ('view_students', 'manage_class_attendance', 'approve_assessments', 'generate_reports', 'message_parents', 'view_timetable', 'view_results')
ON CONFLICT DO NOTHING;

-- HOD permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT sr.id, p.id
FROM public.staff_roles sr
CROSS JOIN public.permissions p
WHERE sr.name = 'Head of Department'
AND p.name IN ('view_department_teachers', 'approve_scores', 'assign_subjects', 'view_department_reports', 'moderate_assessments', 'view_students', 'view_results', 'view_timetable')
ON CONFLICT DO NOTHING;

-- Exam Officer permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT sr.id, p.id
FROM public.staff_roles sr
CROSS JOIN public.permissions p
WHERE sr.name = 'Exam Officer'
AND p.name IN ('manage_exam_results', 'lock_results', 'generate_reports', 'view_performance_trends', 'manage_exam_timetable', 'view_results', 'view_all_reports')
ON CONFLICT DO NOTHING;

-- Vice Principal permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT sr.id, p.id
FROM public.staff_roles sr
CROSS JOIN public.permissions p
WHERE sr.name = 'Vice Principal'
AND p.name IN ('view_all_reports', 'approve_department_reports', 'manage_discipline', 'approve_results', 'view_dashboard', 'manage_timetable', 'approve_scores', 'generate_reports')
ON CONFLICT DO NOTHING;

-- Principal permissions (full access)
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT sr.id, p.id
FROM public.staff_roles sr
CROSS JOIN public.permissions p
WHERE sr.name = 'Principal'
AND p.name = 'full_access'
ON CONFLICT DO NOTHING;

-- Step 11: Enable RLS on new tables
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_subject_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hod_assignments ENABLE ROW LEVEL SECURITY;

-- Step 12: Create RLS policies for new tables

-- Permissions table
CREATE POLICY "Admins can manage permissions"
  ON public.permissions FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can view permissions"
  ON public.permissions FOR SELECT
  USING (true);

-- Role permissions table
CREATE POLICY "Admins can manage role permissions"
  ON public.role_permissions FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can view role permissions"
  ON public.role_permissions FOR SELECT
  USING (true);

-- Departments table
CREATE POLICY "Admins can manage departments"
  ON public.departments FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can view departments"
  ON public.departments FOR SELECT
  USING (true);

-- Subjects table
CREATE POLICY "Admins can manage subjects"
  ON public.subjects FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "HODs can manage subjects in their department"
  ON public.subjects FOR ALL
  USING (
    department_id IN (
      SELECT ha.department_id
      FROM public.hod_assignments ha
      JOIN public.teachers t ON ha.teacher_id = t.id
      WHERE t.user_id = auth.uid()
      AND (ha.end_date IS NULL OR ha.end_date >= CURRENT_DATE)
    )
  );

CREATE POLICY "Authenticated users can view subjects"
  ON public.subjects FOR SELECT
  USING (true);

-- Teacher subject assignments table
CREATE POLICY "Admins can manage teacher subject assignments"
  ON public.teacher_subject_assignments FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "HODs can manage assignments in their department"
  ON public.teacher_subject_assignments FOR ALL
  USING (
    subject_id IN (
      SELECT s.id
      FROM public.subjects s
      JOIN public.hod_assignments ha ON s.department_id = ha.department_id
      JOIN public.teachers t ON ha.teacher_id = t.id
      WHERE t.user_id = auth.uid()
      AND (ha.end_date IS NULL OR ha.end_date >= CURRENT_DATE)
    )
  );

CREATE POLICY "Teachers can view their own assignments"
  ON public.teacher_subject_assignments FOR SELECT
  USING (
    teacher_id IN (
      SELECT id FROM public.teachers WHERE user_id = auth.uid()
    )
  );

-- HOD assignments table
CREATE POLICY "Admins can manage HOD assignments"
  ON public.hod_assignments FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "HODs can view their own assignments"
  ON public.hod_assignments FOR SELECT
  USING (
    teacher_id IN (
      SELECT id FROM public.teachers WHERE user_id = auth.uid()
    )
  );

-- Step 13: Create helper function to check if user has a specific permission
CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _permission text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Check if user is admin (has full access)
  SELECT CASE
    WHEN EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = _user_id AND role = 'admin'
    ) THEN true
    -- Check if user has Principal role (full access)
    WHEN EXISTS (
      SELECT 1
      FROM public.staff_role_assignments sra
      JOIN public.staff s ON sra.staff_id = s.id
      JOIN public.staff_roles sr ON sra.role_id = sr.id
      WHERE s.user_id = _user_id
      AND sr.name = 'Principal'
    ) THEN true
    -- Check specific permission
    ELSE EXISTS (
      SELECT 1
      FROM public.staff_role_assignments sra
      JOIN public.role_permissions rp ON sra.role_id = rp.role_id
      JOIN public.permissions p ON rp.permission_id = p.id
      JOIN public.staff s ON sra.staff_id = s.id
      WHERE s.user_id = _user_id
      AND p.name = _permission
    )
  END
$$;

-- Step 14: Create trigger for updated_at on new tables
CREATE TRIGGER update_departments_updated_at
  BEFORE UPDATE ON public.departments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subjects_updated_at
  BEFORE UPDATE ON public.subjects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();