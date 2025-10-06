import { DashboardLayout } from "@/components/admin/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, isPast, isToday } from "date-fns";

export default function StudentAssignments() {
  const { data: assignmentsData, isLoading } = useQuery({
    queryKey: ["student-assignments"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: studentData } = await supabase
        .from("students")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!studentData) return [];

      // Get enrolled classes
      const { data: enrollments } = await supabase
        .from("enrollments")
        .select("class_id")
        .eq("student_id", studentData.id)
        .eq("status", "active");

      if (!enrollments || enrollments.length === 0) return [];

      const classIds = enrollments.map(e => e.class_id);

      // Get assignments for enrolled classes
      const { data: assignments, error } = await supabase
        .from("assignments")
        .select(`
          *,
          classes:class_id (
            name,
            subject,
            teachers:teacher_id (
              profiles:user_id (
                full_name
              )
            )
          ),
          grades!left (
            id,
            points_earned,
            feedback
          )
        `)
        .in("class_id", classIds)
        .order("due_date", { ascending: true });

      if (error) throw error;

      // Check if student has submitted each assignment
      const { data: studentGrades } = await supabase
        .from("grades")
        .select("assignment_id, id")
        .eq("student_id", studentData.id);

      const submittedIds = new Set(studentGrades?.map(g => g.assignment_id) || []);

      return assignments?.map((a: any) => ({
        ...a,
        isSubmitted: submittedIds.has(a.id)
      }));
    },
  });

  const getDueDateStatus = (dueDate: string) => {
    const date = new Date(dueDate);
    if (isPast(date) && !isToday(date)) return { text: "Overdue", variant: "destructive" };
    if (isToday(date)) return { text: "Due Today", variant: "default" };
    return { text: format(date, "MMM dd, yyyy"), variant: "outline" };
  };

  const pendingAssignments = assignmentsData?.filter((a: any) => !a.isSubmitted) || [];
  const submittedAssignments = assignmentsData?.filter((a: any) => a.isSubmitted) || [];

  return (
    <DashboardLayout userRoles={["student"]} staffRoles={[]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Assignments</h1>
          <p className="text-muted-foreground mt-1">View and submit your assignments</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignmentsData?.length || 0}</div>
              <p className="text-xs text-muted-foreground">All assignments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingAssignments.length}</div>
              <p className="text-xs text-muted-foreground">Not submitted</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Submitted</CardTitle>
              <FileText className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{submittedAssignments.length}</div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading assignments...</div>
        ) : (
          <>
            {pendingAssignments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Pending Assignments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingAssignments.map((assignment: any) => {
                      const dueStatus = getDueDateStatus(assignment.due_date);
                      return (
                        <div key={assignment.id} className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground mb-1">{assignment.title}</h4>
                              <p className="text-sm text-muted-foreground mb-2">
                                {assignment.classes?.subject} • {assignment.classes?.teachers?.profiles?.full_name}
                              </p>
                              {assignment.description && (
                                <p className="text-sm text-muted-foreground">{assignment.description}</p>
                              )}
                            </div>
                            <Badge variant={dueStatus.variant as any}>{dueStatus.text}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Total Points: {assignment.total_points}</span>
                            <span>•</span>
                            <span>{assignment.classes?.name}</span>
                          </div>
                          <Button size="sm" className="mt-3 w-full">
                            Submit Assignment
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {submittedAssignments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Submitted Assignments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {submittedAssignments.map((assignment: any) => {
                      const grade = assignment.grades?.[0];
                      return (
                        <div key={assignment.id} className="p-4 rounded-lg border bg-card">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground mb-1">{assignment.title}</h4>
                              <p className="text-sm text-muted-foreground mb-2">
                                {assignment.classes?.subject} • {assignment.classes?.teachers?.profiles?.full_name}
                              </p>
                              {grade && (
                                <div className="mt-2 p-2 bg-primary/10 rounded">
                                  <p className="text-sm font-medium">
                                    Score: {grade.points_earned}/{assignment.total_points}
                                  </p>
                                  {grade.feedback && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      Feedback: {grade.feedback}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                            <Badge variant="default">Submitted</Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {assignmentsData?.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No assignments yet</p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
