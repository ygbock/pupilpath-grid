import { DashboardLayout } from "@/components/admin/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export default function StudentAttendance() {
  const { data: attendanceData, isLoading } = useQuery({
    queryKey: ["student-attendance"],
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
        .from("attendance")
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
          )
        `)
        .eq("student_id", studentData.id)
        .order("date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "absent":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "late":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "present":
        return "default";
      case "absent":
        return "destructive";
      case "late":
        return "outline";
      default:
        return "secondary";
    }
  };

  const calculateAttendanceStats = () => {
    if (!attendanceData || attendanceData.length === 0) {
      return { present: 0, absent: 0, late: 0, percentage: 0 };
    }

    const present = attendanceData.filter((a: any) => a.status === "present").length;
    const absent = attendanceData.filter((a: any) => a.status === "absent").length;
    const late = attendanceData.filter((a: any) => a.status === "late").length;
    const percentage = Math.round(((present + late) / attendanceData.length) * 100);

    return { present, absent, late, percentage };
  };

  const stats = calculateAttendanceStats();

  return (
    <DashboardLayout userRoles={["student"]} staffRoles={[]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Attendance</h1>
          <p className="text-muted-foreground mt-1">Track your attendance records</p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.percentage}%</div>
              <p className="text-xs text-muted-foreground">Overall attendance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Present</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.present}</div>
              <p className="text-xs text-muted-foreground">Days present</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Absent</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.absent}</div>
              <p className="text-xs text-muted-foreground">Days absent</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Late</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.late}</div>
              <p className="text-xs text-muted-foreground">Days late</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Attendance Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">Loading attendance...</div>
            ) : attendanceData && attendanceData.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData.map((record: any) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {format(new Date(record.date), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>{record.classes?.name || "N/A"}</TableCell>
                      <TableCell>{record.classes?.subject || "N/A"}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {record.classes?.teachers?.profiles?.full_name || "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(record.status)}
                          <Badge variant={getStatusBadgeVariant(record.status) as any}>
                            {record.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {record.notes || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No attendance records yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
