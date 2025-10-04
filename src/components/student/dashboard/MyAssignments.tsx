import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, isPast, isToday } from "date-fns";

export function MyAssignments() {
  const { data: assignmentsData, isLoading } = useQuery({
    queryKey: ["upcoming-assignments"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: studentData } = await supabase
        .from("students")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!studentData) return [];

      const { data: enrollments } = await supabase
        .from("enrollments")
        .select("class_id")
        .eq("student_id", studentData.id)
        .eq("status", "active");

      if (!enrollments || enrollments.length === 0) return [];

      const classIds = enrollments.map(e => e.class_id);

      const { data: assignments, error } = await supabase
        .from("assignments")
        .select(`
          *,
          classes:class_id (
            subject
          )
        `)
        .in("class_id", classIds)
        .order("due_date", { ascending: true })
        .limit(5);

      if (error) throw error;

      const { data: grades } = await supabase
        .from("grades")
        .select("assignment_id")
        .eq("student_id", studentData.id);

      const submittedIds = new Set(grades?.map(g => g.assignment_id) || []);

      return assignments?.map((a: any) => ({
        ...a,
        isSubmitted: submittedIds.has(a.id)
      }));
    },
  });

  const getDueDateText = (dueDate: string) => {
    const date = new Date(dueDate);
    if (isToday(date)) return "Today";
    if (isPast(date)) return "Overdue";
    return format(date, "MMM dd");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          My Assignments
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : assignmentsData && assignmentsData.length > 0 ? (
          <div className="space-y-3">
            {assignmentsData.map((assignment: any) => (
              <div key={assignment.id} className="p-3 rounded-lg border bg-card hover:bg-accent transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-foreground">{assignment.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{assignment.classes?.subject}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={assignment.isSubmitted ? "default" : "outline"}
                      className="text-xs"
                    >
                      {assignment.isSubmitted ? "Submitted" : getDueDateText(assignment.due_date)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">No assignments</div>
        )}
      </CardContent>
    </Card>
  );
}
