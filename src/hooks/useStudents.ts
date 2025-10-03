import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Student {
  id: string;
  student_id: string;
  user_id: string;
  grade_level?: string;
  enrollment_date?: string;
  guardian_name?: string;
  guardian_phone?: string;
  date_of_birth?: string;
  medical_info?: string;
  profiles?: {
    full_name?: string;
    email?: string;
    phone?: string;
    address?: string;
    profile_image_url?: string;
  };
}

export function useStudents() {
  const queryClient = useQueryClient();

  const { data: students, isLoading } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("students")
        .select(`
          *,
          profiles:user_id (
            full_name,
            email,
            phone,
            address,
            profile_image_url
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Student[];
    },
  });

  const createStudent = useMutation({
    mutationFn: async (studentData: any) => {
      // First create user profile with a UUID
      const newId = crypto.randomUUID();
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: newId,
          full_name: `${studentData.firstName} ${studentData.lastName}`,
          email: studentData.email,
          phone: studentData.parentPhone,
          address: studentData.address,
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Then create student record
      const { data, error } = await supabase
        .from("students")
        .insert({
          user_id: profileData.id,
          student_id: studentData.admissionNo,
          grade_level: studentData.class,
          guardian_name: studentData.parentName,
          guardian_phone: studentData.parentPhone,
          date_of_birth: studentData.dateOfBirth,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({ title: "Student created successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating student",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateStudent = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase
        .from("students")
        .update({
          grade_level: data.class,
          guardian_name: data.parentName,
          guardian_phone: data.parentPhone,
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({ title: "Student updated successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating student",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteStudent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("students").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({ title: "Student deleted successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting student",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    students,
    isLoading,
    createStudent,
    updateStudent,
    deleteStudent,
  };
}
