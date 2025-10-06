import { DashboardLayout } from "@/components/admin/layout/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Users as UsersIcon } from "lucide-react";
import { useState } from "react";

export default function TeacherStudents() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: students, isLoading } = useQuery({
    queryKey: ["teacher-students"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Get teacher's classes
      const { data: teacherData } = await supabase
        .from("teachers")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!teacherData) return [];

      // Get classes taught by this teacher
      const { data: classes } = await supabase
        .from("classes")
        .select("id")
        .eq("teacher_id", teacherData.id);

      if (!classes || classes.length === 0) return [];

      const classIds = classes.map(c => c.id);

      // Get students enrolled in these classes
      const { data: enrollments } = await supabase
        .from("enrollments")
        .select(`
          student_id,
          students (
            *,
            profiles:user_id (
              full_name,
              email,
              phone,
              address,
              profile_image_url
            )
          )
        `)
        .in("class_id", classIds)
        .eq("status", "active");

      if (!enrollments) return [];

      // Extract unique students
      const uniqueStudents = Array.from(
        new Map(
          enrollments
            .map((e: any) => e.students)
            .filter(Boolean)
            .map((s: any) => [s.id, s])
        ).values()
      );

      return uniqueStudents;
    },
  });

  const filteredStudents = students?.filter((student: any) =>
    student?.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student?.student_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student?.grade_level?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <DashboardLayout userRoles={["teacher"]} staffRoles={[]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Students</h1>
          <p className="text-muted-foreground mt-1">View students in your classes</p>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Students List</CardTitle>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">Loading students...</div>
            ) : filteredStudents.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Grade Level</TableHead>
                    <TableHead>Guardian</TableHead>
                    <TableHead>Contact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student: any) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={student.profiles?.profile_image_url} />
                            <AvatarFallback>
                              {student.profiles?.full_name?.split(' ').map((n: string) => n[0]).join('') || 'ST'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{student.profiles?.full_name || 'N/A'}</div>
                            <div className="text-sm text-muted-foreground">{student.profiles?.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{student.student_id}</Badge>
                      </TableCell>
                      <TableCell>{student.grade_level || 'N/A'}</TableCell>
                      <TableCell>{student.guardian_name || 'N/A'}</TableCell>
                      <TableCell>{student.guardian_phone || student.profiles?.phone || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <UsersIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? "No students found matching your search" : "No students enrolled in your classes"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
