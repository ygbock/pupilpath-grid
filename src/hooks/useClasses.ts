import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Class {
  id: string;
  name: string;
  grade_level?: string;
  section?: string;
  subject?: string;
  room_number?: string;
  max_students?: number;
  teacher_id?: string;
  academic_year?: string;
}

export function useClasses() {
  const queryClient = useQueryClient();

  const { data: classes, isLoading } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("classes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Class[];
    },
  });

  const createClass = useMutation({
    mutationFn: async (classData: any) => {
      const { data, error } = await supabase
        .from("classes")
        .insert({
          name: classData.name,
          grade_level: classData.level,
          room_number: classData.room,
          max_students: classData.capacity,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      toast({ title: "Class created successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating class",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateClass = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase
        .from("classes")
        .update({
          name: data.name,
          grade_level: data.level,
          room_number: data.room,
          max_students: data.capacity,
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      toast({ title: "Class updated successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating class",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteClass = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("classes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      toast({ title: "Class deleted successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting class",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    classes,
    isLoading,
    createClass,
    updateClass,
    deleteClass,
  };
}
