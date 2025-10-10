import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface IdCardTemplate {
  id: string;
  name: string;
  target_type: "student" | "staff";
  design: any;
  created_at: string;
}

export interface IdCardIssuance {
  id: string;
  subject_type: "student" | "staff";
  student_id?: string | null;
  teacher_id?: string | null;
  user_id?: string | null;
  template_id: string;
  qr_payload?: string | null;
  card_data: any;
  issued_at: string;
  expires_at?: string | null;
  revoked: boolean;
}

export function useIdCardTemplates() {
  const queryClient = useQueryClient();
  const raw = supabase as any; // use untyped client for newly added tables until types are regenerated

  const templates = useQuery({
    queryKey: ["id_card_templates"],
    queryFn: async () => {
      const { data, error } = await raw
        .from("id_card_templates")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as IdCardTemplate[];
    },
  });

  const createTemplate = useMutation({
    mutationFn: async (payload: { name: string; target_type: "student" | "staff"; design?: any }) => {
      const { data, error } = await raw
        .from("id_card_templates")
        .insert({ name: payload.name, target_type: payload.target_type, design: payload.design ?? {} })
        .select()
        .single();
      if (error) throw error;
      return data as unknown as IdCardTemplate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["id_card_templates"] });
      toast({ title: "Template created" });
    },
    onError: (e: any) => toast({ title: "Failed to create template", description: e.message, variant: "destructive" })
  });

  const deleteTemplate = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await raw.from("id_card_templates").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["id_card_templates"] });
      toast({ title: "Template deleted" });
    },
    onError: (e: any) => toast({ title: "Failed to delete template", description: e.message, variant: "destructive" })
  });

  return { templates, createTemplate, deleteTemplate };
}

export function useIdCardIssuance() {
  const queryClient = useQueryClient();
  const raw = supabase as any; // use untyped client for newly added tables until types are regenerated

  const issued = useQuery({
    queryKey: ["id_card_issuance"],
    queryFn: async () => {
      const { data, error } = await raw
        .from("id_card_issuance")
        .select("*")
        .order("issued_at", { ascending: false });
      if (error) throw error;
      return data as unknown as IdCardIssuance[];
    },
  });

  const issueCard = useMutation({
    mutationFn: async (payload: {
      subject_type: "student" | "staff";
      subject_row_id: string; // students.id or teachers.id
      template_id: string;
      expires_at?: string | null;
      qr_payload?: string | null;
      card_data?: any;
    }) => {
      const insert: any = {
        subject_type: payload.subject_type,
        template_id: payload.template_id,
        expires_at: payload.expires_at ?? null,
        qr_payload: payload.qr_payload ?? null,
        card_data: payload.card_data ?? {},
      };
      if (payload.subject_type === "student") insert.student_id = payload.subject_row_id;
      else insert.teacher_id = payload.subject_row_id;

      const { data, error } = await raw
        .from("id_card_issuance")
        .insert(insert)
        .select()
        .single();
      if (error) throw error;
      return data as unknown as IdCardIssuance;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["id_card_issuance"] });
      toast({ title: "ID Card issued" });
    },
    onError: (e: any) => toast({ title: "Failed to issue ID Card", description: e.message, variant: "destructive" })
  });

  const revokeCard = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await raw
        .from("id_card_issuance")
        .update({ revoked: true } as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["id_card_issuance"] });
      toast({ title: "ID Card revoked" });
    },
    onError: (e: any) => toast({ title: "Failed to revoke ID Card", description: e.message, variant: "destructive" })
  });

  return { issued, issueCard, revokeCard };
}
