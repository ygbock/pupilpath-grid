import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const getGradeColor = (percentage: number) => {
  if (percentage >= 90) return "default";
  if (percentage >= 80) return "secondary";
  return "outline";
};

export function MyGrades() {
  const { data: gradesData, isLoading } = useQuery({
    queryKey: ["recent-grades"],
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
        .order("graded_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5" />
          Current Grades
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : gradesData && gradesData.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assignment</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gradesData.map((item: any) => {
                const percentage = Math.round((Number(item.points_earned) / Number(item.assignments.total_points)) * 100);
                const grade = percentage >= 90 ? 'A' : percentage >= 80 ? 'B' : percentage >= 70 ? 'C' : percentage >= 60 ? 'D' : 'F';
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.assignments.title}</TableCell>
                    <TableCell className="text-muted-foreground">{item.assignments.classes?.subject}</TableCell>
                    <TableCell>{percentage}%</TableCell>
                    <TableCell>
                      <Badge variant={getGradeColor(percentage) as any} className="text-xs">
                        {grade}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">No grades yet</div>
        )}
      </CardContent>
    </Card>
  );
}
