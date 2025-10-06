import { DashboardLayout } from "@/components/admin/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Award, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function StudentGrades() {
  const { data: gradesData, isLoading } = useQuery({
    queryKey: ["student-grades"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: studentData } = await supabase
        .from("students")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!studentData) return [];

      const { data, error } = await supabase
        .from("grades")
        .select(`
          *,
          assignments:assignment_id (
            title,
            total_points,
            classes:class_id (
              name,
              subject,
              teachers:teacher_id (
                profiles:user_id (
                  full_name
                )
              )
            )
          )
        `)
        .eq("student_id", studentData.id)
        .order("graded_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const calculateGrade = (earned: number, total: number) => {
    const percentage = (earned / total) * 100;
    if (percentage >= 90) return { letter: "A", color: "default" };
    if (percentage >= 80) return { letter: "B", color: "secondary" };
    if (percentage >= 70) return { letter: "C", color: "outline" };
    if (percentage >= 60) return { letter: "D", color: "outline" };
    return { letter: "F", color: "destructive" };
  };

  const calculateOverallGPA = () => {
    if (!gradesData || gradesData.length === 0) return "0.00";
    const totalPercentage = gradesData.reduce((sum: number, grade: any) => {
      const percentage = (Number(grade.points_earned) / Number(grade.assignments.total_points)) * 100;
      return sum + percentage;
    }, 0);
    return ((totalPercentage / gradesData.length) / 25).toFixed(2);
  };

  return (
    <DashboardLayout userRoles={["student"]} staffRoles={[]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Grades</h1>
          <p className="text-muted-foreground mt-1">View your academic performance</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Overall GPA</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calculateOverallGPA()}</div>
              <p className="text-xs text-muted-foreground">Out of 4.0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{gradesData?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Graded assignments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {gradesData && gradesData.length > 0
                  ? Math.round(
                      gradesData.reduce(
                        (sum: number, g: any) =>
                          sum + (Number(g.points_earned) / Number(g.assignments.total_points)) * 100,
                        0
                      ) / gradesData.length
                    )
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">Across all subjects</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Grade Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">Loading grades...</div>
            ) : gradesData && gradesData.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assignment</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Feedback</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gradesData.map((grade: any) => {
                    const gradeInfo = calculateGrade(
                      Number(grade.points_earned),
                      Number(grade.assignments.total_points)
                    );
                    const percentage = Math.round(
                      (Number(grade.points_earned) / Number(grade.assignments.total_points)) * 100
                    );
                    return (
                      <TableRow key={grade.id}>
                        <TableCell className="font-medium">{grade.assignments.title}</TableCell>
                        <TableCell>{grade.assignments.classes?.subject || "N/A"}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {grade.assignments.classes?.teachers?.profiles?.full_name || "N/A"}
                        </TableCell>
                        <TableCell>
                          {grade.points_earned}/{grade.assignments.total_points} ({percentage}%)
                        </TableCell>
                        <TableCell>
                          <Badge variant={gradeInfo.color as any}>{gradeInfo.letter}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {grade.feedback || "-"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No grades available yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
