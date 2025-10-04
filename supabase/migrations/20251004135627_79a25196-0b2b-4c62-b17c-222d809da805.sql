-- Update RLS policies for teacher access control based on assigned classes

-- Teachers can only view students in their classes
DROP POLICY IF EXISTS "Teachers can view their students" ON public.students;
CREATE POLICY "Teachers can view their students" 
ON public.students 
FOR SELECT 
USING (
  id IN (
    SELECT e.student_id 
    FROM public.enrollments e
    JOIN public.classes c ON e.class_id = c.id
    JOIN public.teachers t ON c.teacher_id = t.id
    WHERE t.user_id = auth.uid()
  )
);

-- Teachers can only view grades for their classes
DROP POLICY IF EXISTS "Teachers can view grades for their classes" ON public.grades;
CREATE POLICY "Teachers can view grades for their classes" 
ON public.grades 
FOR SELECT 
USING (
  assignment_id IN (
    SELECT a.id 
    FROM public.assignments a
    JOIN public.classes c ON a.class_id = c.id
    JOIN public.teachers t ON c.teacher_id = t.id
    WHERE t.user_id = auth.uid()
  )
);

-- Teachers can only insert/update grades for their classes
DROP POLICY IF EXISTS "Teachers can manage grades for their classes" ON public.grades;
CREATE POLICY "Teachers can manage grades for their classes" 
ON public.grades 
FOR ALL 
USING (
  assignment_id IN (
    SELECT a.id 
    FROM public.assignments a
    JOIN public.classes c ON a.class_id = c.id
    JOIN public.teachers t ON c.teacher_id = t.id
    WHERE t.user_id = auth.uid()
  )
);

-- Teachers can only view attendance for their classes
DROP POLICY IF EXISTS "Teachers can view attendance for their classes" ON public.attendance;
CREATE POLICY "Teachers can view attendance for their classes" 
ON public.attendance 
FOR SELECT 
USING (
  class_id IN (
    SELECT c.id 
    FROM public.classes c
    JOIN public.teachers t ON c.teacher_id = t.id
    WHERE t.user_id = auth.uid()
  )
);

-- Teachers can only manage attendance for their classes
DROP POLICY IF EXISTS "Teachers can manage attendance for their classes" ON public.attendance;
CREATE POLICY "Teachers can manage attendance for their classes" 
ON public.attendance 
FOR ALL 
USING (
  class_id IN (
    SELECT c.id 
    FROM public.classes c
    JOIN public.teachers t ON c.teacher_id = t.id
    WHERE t.user_id = auth.uid()
  )
);

-- Teachers can only view/manage assignments for their classes
DROP POLICY IF EXISTS "Teachers can manage assignments for their classes" ON public.assignments;
CREATE POLICY "Teachers can manage assignments for their classes" 
ON public.assignments 
FOR ALL 
USING (
  class_id IN (
    SELECT c.id 
    FROM public.classes c
    JOIN public.teachers t ON c.teacher_id = t.id
    WHERE t.user_id = auth.uid()
  )
);

-- Teachers can view their own classes
DROP POLICY IF EXISTS "Teachers can view their classes" ON public.classes;
CREATE POLICY "Teachers can view their classes" 
ON public.classes 
FOR SELECT 
USING (
  teacher_id IN (
    SELECT id FROM public.teachers WHERE user_id = auth.uid()
  )
);

-- Teachers can view enrollments for their classes
DROP POLICY IF EXISTS "Teachers can view enrollments for their classes" ON public.enrollments;
CREATE POLICY "Teachers can view enrollments for their classes" 
ON public.enrollments 
FOR SELECT 
USING (
  class_id IN (
    SELECT c.id 
    FROM public.classes c
    JOIN public.teachers t ON c.teacher_id = t.id
    WHERE t.user_id = auth.uid()
  )
);