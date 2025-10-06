import { DashboardLayout } from "@/components/admin/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { School, Users, Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function StudentClasses() {
  const { data: enrolledClasses, isLoading } = useQuery({
    queryKey: ["student-classes"],
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
        .from("enrollments")
        .select(`
          *,
          classes:class_id (
            id,
            name,
            grade_level,
            section,
            subject,
            room_number,
            academic_year,
            teachers:teacher_id (
              profiles:user_id (
                full_name
              )
            )
          )
        `)
        .eq("student_id", studentData.id)
        .eq("status", "active");

      if (error) throw error;
      return data;
    },
  });

  return (
    <DashboardLayout userRoles={["student"]} staffRoles={[]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Classes</h1>
          <p className="text-muted-foreground mt-1">View your enrolled classes</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading classes...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {enrolledClasses?.map((enrollment: any) => (
              <Card key={enrollment.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <School className="w-5 h-5 text-primary" />
                    {enrollment.classes?.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {enrollment.classes?.grade_level && (
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="outline">{enrollment.classes.grade_level}</Badge>
                        {enrollment.classes?.section && (
                          <Badge variant="secondary">{enrollment.classes.section}</Badge>
                        )}
                      </div>
                    )}
                    {enrollment.classes?.subject && (
                      <p className="text-sm text-muted-foreground">
                        Subject: <span className="text-foreground font-medium">{enrollment.classes.subject}</span>
                      </p>
                    )}
                    {enrollment.classes?.teachers?.profiles?.full_name && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>{enrollment.classes.teachers.profiles.full_name}</span>
                      </div>
                    )}
                    {enrollment.classes?.room_number && (
                      <p className="text-sm text-muted-foreground">
                        Room: <span className="text-foreground font-medium">{enrollment.classes.room_number}</span>
                      </p>
                    )}
                    {enrollment.classes?.academic_year && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{enrollment.classes.academic_year}</span>
                      </div>
                    )}
                    <Badge variant={enrollment.status === "active" ? "default" : "secondary"}>
                      {enrollment.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && enrolledClasses?.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <School className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No enrolled classes yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
