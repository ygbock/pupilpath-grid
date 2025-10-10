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
      const fullName = `${studentData.firstName} ${studentData.lastName}`.trim();

      if (studentData.createLogin) {
        // Create auth user via Edge Function (admin-only) and use returned user_id
        const { data: created, error: fnErr } = await supabase.functions.invoke("create-user", {
          body: {
            email: studentData.email,
            password: studentData.tempPassword,
            role: "student",
            full_name: fullName,
            phone: studentData.parentPhone,
            require_reset: !!studentData.requireReset,
          },
        } as any);
        if (fnErr) throw fnErr;
        const newUserId = (created as any)?.user_id;
        if (!newUserId) throw new Error("create-user failed: missing user_id");

        const { data, error } = await supabase
          .from("students")
          .insert({
            user_id: newUserId,
            student_id: studentData.admissionNo,
            grade_level: studentData.class,
            guardian_name: studentData.parentName,
            guardian_phone: studentData.parentPhone,
            date_of_birth: studentData.dateOfBirth,
          })
          .select()
          .single();
        if (error) throw error;

        // Optionally notify credentials
        if (studentData.shareEmail || studentData.shareSms) {
          const { error: notifyErr } = await supabase.functions.invoke("notify-credentials", {
            body: {
              email: studentData.email,
              phone: studentData.parentPhone,
              full_name: fullName,
              password: studentData.tempPassword,
              role: "student",
              send_email: !!studentData.shareEmail,
              send_sms: !!studentData.shareSms,
            },
          } as any);
          if (notifyErr) {
            toast({ title: "Notify failed", description: notifyErr.message || String(notifyErr), variant: "destructive" });
          }
        }

        // Optionally issue ID Card
        if (studentData.issueIdCard && studentData.idCardTemplateId) {
          const raw = supabase as any;
          const expiresAt = studentData.idCardExpires ? new Date(studentData.idCardExpires).toISOString() : null;
          const { error: issueErr } = await raw
            .from("id_card_issuance")
            .insert({
              subject_type: "student",
              student_id: data.id,
              template_id: studentData.idCardTemplateId,
              expires_at: expiresAt,
              qr_payload: null,
              card_data: {},
            });
          if (issueErr) {
            toast({ title: "ID Card issue failed", description: issueErr.message || String(issueErr), variant: "destructive" });
          }
        }

        return data;
      } else {
        // Legacy path: create local profile first, then student row
        const newId = crypto.randomUUID();
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: newId,
            full_name: fullName,
            email: studentData.email,
            phone: studentData.parentPhone,
            address: studentData.address,
          })
          .select()
          .single();
        if (profileError) throw profileError;

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

        // Optionally issue ID Card (legacy path)
        if (studentData.issueIdCard && studentData.idCardTemplateId) {
          const raw = supabase as any;
          const expiresAt = studentData.idCardExpires ? new Date(studentData.idCardExpires).toISOString() : null;
          const { error: issueErr } = await raw
            .from("id_card_issuance")
            .insert({
              subject_type: "student",
              student_id: data.id,
              template_id: studentData.idCardTemplateId,
              expires_at: expiresAt,
              qr_payload: null,
              card_data: {},
            });
          if (issueErr) {
            toast({ title: "ID Card issue failed", description: issueErr.message || String(issueErr), variant: "destructive" });
          }
        }

        return data;
      }
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
