-- Phase 1: Fix Critical Security Issues

-- Step 1: Update security definer functions to include search_path
CREATE OR REPLACE FUNCTION public.assign_admin_role(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

CREATE OR REPLACE FUNCTION public.has_staff_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.staff_role_assignments sra
    JOIN public.staff st ON st.id = sra.staff_id
    JOIN public.staff_roles sr ON sr.id = sra.role_id
    WHERE st.user_id = _user_id AND sr.name = _role
  )
$$;

-- Step 2: Create security definer function to check teacher-student relationship
CREATE OR REPLACE FUNCTION public.is_teacher_of_student(_teacher_user_id uuid, _student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.enrollments e
    JOIN public.classes c ON e.class_id = c.id
    JOIN public.teachers t ON c.teacher_id = t.id
    WHERE t.user_id = _teacher_user_id
      AND e.student_id = _student_id
  )
$$;

-- Step 3: Create security definer function to check teacher-class relationship
CREATE OR REPLACE FUNCTION public.is_teacher_of_class(_teacher_user_id uuid, _class_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.classes c
    JOIN public.teachers t ON c.teacher_id = t.id
    WHERE t.user_id = _teacher_user_id
      AND c.id = _class_id
  )
$$;

-- Step 4: Fix infinite recursion - Drop and recreate students policies
DROP POLICY IF EXISTS "Teachers can view their students" ON public.students;

CREATE POLICY "Teachers can view their students"
  ON public.students
  FOR SELECT
  USING (public.is_teacher_of_student(auth.uid(), id));

-- Step 5: Fix infinite recursion - Drop and recreate enrollments policies
DROP POLICY IF EXISTS "Teachers can view enrollments for their classes" ON public.enrollments;

CREATE POLICY "Teachers can view enrollments for their classes"
  ON public.enrollments
  FOR SELECT
  USING (public.is_teacher_of_class(auth.uid(), class_id));