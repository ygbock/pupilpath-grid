import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Assignment {
  id: string;
  title: string;
  description?: string;
  class_id: string;
  due_date?: string;
  total_points?: number;
  created_at?: string;
}

export function useAssignments() {
  const queryClient = useQueryClient();

  const { data: assignments, isLoading } = useQuery({
    queryKey: ["assignments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assignments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Assignment[];
    },
  });

  const createAssignment = useMutation({
    mutationFn: async (assignmentData: any) => {
      const { data, error } = await supabase
        .from("assignments")
        .insert({
          title: assignmentData.title,
          description: assignmentData.description,
          class_id: assignmentData.classId,
          due_date: assignmentData.dueDate,
          total_points: assignmentData.totalPoints || 100,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      toast({ title: "Assignment created successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating assignment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateAssignment = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase
        .from("assignments")
        .update({
          title: data.title,
          description: data.description,
          due_date: data.dueDate,
          total_points: data.totalPoints,
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      toast({ title: "Assignment updated successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating assignment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteAssignment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("assignments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      toast({ title: "Assignment deleted successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting assignment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    assignments,
    isLoading,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  };
}
