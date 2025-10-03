-- Add RLS policies for all tables

-- Students table policies
CREATE POLICY "Admins can manage students"
ON public.students FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can view their own data"
ON public.students FOR SELECT
USING (auth.uid() = user_id);

-- Teachers table policies
CREATE POLICY "Admins can manage teachers"
ON public.teachers FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can view their own data"
ON public.teachers FOR SELECT
USING (auth.uid() = user_id);

-- Classes table policies
CREATE POLICY "Admins can manage classes"
ON public.classes FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can view classes"
ON public.classes FOR SELECT
TO authenticated
USING (true);

-- Assignments table policies
CREATE POLICY "Admins can manage assignments"
ON public.assignments FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can view assignments"
ON public.assignments FOR SELECT
TO authenticated
USING (true);

-- Attendance table policies
CREATE POLICY "Admins can manage attendance"
ON public.attendance FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can view their own attendance"
ON public.attendance FOR SELECT
USING (
  student_id IN (
    SELECT id FROM public.students WHERE user_id = auth.uid()
  )
);

-- Grades table policies
CREATE POLICY "Admins can manage grades"
ON public.grades FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can view their own grades"
ON public.grades FOR SELECT
USING (
  student_id IN (
    SELECT id FROM public.students WHERE user_id = auth.uid()
  )
);

-- Fees table policies
CREATE POLICY "Admins can manage fees"
ON public.fees FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can view their own fees"
ON public.fees FOR SELECT
USING (
  student_id IN (
    SELECT id FROM public.students WHERE user_id = auth.uid()
  )
);

-- Enrollments table policies
CREATE POLICY "Admins can manage enrollments"
ON public.enrollments FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can view their own enrollments"
ON public.enrollments FOR SELECT
USING (
  student_id IN (
    SELECT id FROM public.students WHERE user_id = auth.uid()
  )
);

-- Timetable table policies
CREATE POLICY "Admins can manage timetable"
ON public.timetable FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can view timetable"
ON public.timetable FOR SELECT
TO authenticated
USING (true);

-- Profiles table policies  
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Parents table policies
CREATE POLICY "Admins can manage parents"
ON public.parents FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Staff table policies
CREATE POLICY "Admins can manage staff"
ON public.staff FOR ALL
USING (public.has_role(auth.uid(), 'admin'));