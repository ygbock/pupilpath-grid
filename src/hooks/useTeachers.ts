import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Teacher {
  id: string;
  teacher_id: string;
  user_id: string;
  department?: string;
  qualification?: string;
  specialization?: string;
  join_date?: string;
  profiles?: {
    full_name?: string;
    email?: string;
    phone?: string;
    address?: string;
    profile_image_url?: string;
  };
}

export function useTeachers() {
  const queryClient = useQueryClient();

  const { data: teachers, isLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teachers")
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
      return data as Teacher[];
    },
  });

  const createTeacher = useMutation({
    mutationFn: async (teacherData: any) => {
      // First create user profile with a UUID
      const newId = crypto.randomUUID();
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: newId,
          full_name: `${teacherData.firstName} ${teacherData.lastName}`,
          email: teacherData.email,
          phone: teacherData.phone,
          address: teacherData.address,
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Then create teacher record
      const { data, error } = await supabase
        .from("teachers")
        .insert({
          user_id: profileData.id,
          teacher_id: teacherData.employeeId,
          department: teacherData.department,
          qualification: teacherData.qualification,
          specialization: teacherData.specialization,
          join_date: teacherData.joiningDate,
        })
        .select()
        .single();

      if (error) throw error;

      // Optionally issue ID Card for staff
      if (teacherData.issueIdCard && teacherData.idCardTemplateId && data?.id) {
        const raw = supabase as any;
        const expiresAt = teacherData.idCardExpires ? new Date(teacherData.idCardExpires).toISOString() : null;
        const { error: issueErr } = await raw
          .from("id_card_issuance")
          .insert({
            subject_type: "staff",
            teacher_id: data.id,
            template_id: teacherData.idCardTemplateId,
            expires_at: expiresAt,
            qr_payload: null,
            card_data: {},
          });
        if (issueErr) {
          toast({ title: "ID Card issue failed", description: issueErr.message || String(issueErr), variant: "destructive" });
        }
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast({ title: "Teacher created successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating teacher",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateTeacher = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase
        .from("teachers")
        .update({
          department: data.department,
          qualification: data.qualification,
          specialization: data.specialization,
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast({ title: "Teacher updated successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating teacher",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTeacher = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("teachers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast({ title: "Teacher deleted successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting teacher",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    teachers,
    isLoading,
    createTeacher,
    updateTeacher,
    deleteTeacher,
  };
}
