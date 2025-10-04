import { DashboardLayout } from "@/components/admin/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useClasses } from "@/hooks/useClasses";
import { School, Users, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TeacherClasses() {
  const { classes, isLoading } = useClasses();

  return (
    <DashboardLayout userRole="teacher">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Classes</h1>
          <p className="text-muted-foreground mt-1">Manage and view your assigned classes</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading classes...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {classes?.map((classItem) => (
              <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <School className="w-5 h-5 text-primary" />
                    {classItem.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {classItem.grade_level && (
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="outline">{classItem.grade_level}</Badge>
                        {classItem.section && <Badge variant="secondary">{classItem.section}</Badge>}
                      </div>
                    )}
                    {classItem.subject && (
                      <p className="text-sm text-muted-foreground">
                        Subject: <span className="text-foreground font-medium">{classItem.subject}</span>
                      </p>
                    )}
                    {classItem.room_number && (
                      <p className="text-sm text-muted-foreground">
                        Room: <span className="text-foreground font-medium">{classItem.room_number}</span>
                      </p>
                    )}
                    {classItem.max_students && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>Max: {classItem.max_students} students</span>
                      </div>
                    )}
                    {classItem.academic_year && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{classItem.academic_year}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && classes?.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <School className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No classes assigned yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
