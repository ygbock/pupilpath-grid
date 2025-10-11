import { DashboardLayout } from "@/components/admin/layout/DashboardLayout";
import { useRoles } from "@/hooks/useRole";
import { useStaffRoles } from "@/hooks/useStaffRoles";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Import role-specific dashboard sections
import { StudentStatsCards } from "@/components/student/dashboard/StudentStatsCards";
import { TeacherStatsCards } from "@/components/teacher/dashboard/TeacherStatsCards";
import { StatsCards } from "@/components/admin/dashboard/StatsCards";
import { RecentActivity } from "@/components/admin/dashboard/RecentActivity";
import { MySchedule } from "@/components/student/dashboard/MySchedule";
import { TodaySchedule } from "@/components/teacher/dashboard/TodaySchedule";

export default function Dashboard() {
  const { roles: userRoles, loading: userRolesLoading } = useRoles();
  const { staffRoles, loading: staffRolesLoading } = useStaffRoles();

  const loading = userRolesLoading || staffRolesLoading;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isAdmin = userRoles?.includes("admin") || false;
  const isTeacher = userRoles?.includes("teacher") || false;
  const isStudent = userRoles?.includes("student") || false;
  
  const isPrincipal = staffRoles.some(sr => sr.name === "Principal");
  const isVicePrincipal = staffRoles.some(sr => sr.name === "Vice Principal");
  const isHOD = staffRoles.some(sr => sr.name === "HOD");
  const isExamOfficer = staffRoles.some(sr => sr.name === "Exam Officer");
  const isFormMaster = staffRoles.some(sr => sr.name === "Form Master");
  const isSubjectTeacher = staffRoles.some(sr => sr.name === "Subject Teacher");

  // Determine primary role for greeting
  const getPrimaryRole = () => {
    if (isPrincipal) return "Principal";
    if (isVicePrincipal) return "Vice Principal";
    if (isAdmin) return "Administrator";
    if (isHOD) return "Head of Department";
    if (isExamOfficer) return "Exam Officer";
    if (isFormMaster) return "Form Master";
    if (isSubjectTeacher || isTeacher) return "Teacher";
    if (isStudent) return "Student";
    return "User";
  };

  const primaryRole = getPrimaryRole();
  const allRoles = [
    ...(userRoles || []),
    ...staffRoles.map(sr => sr.name)
  ].filter((v, i, a) => a.indexOf(v) === i); // Unique roles

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with role badges */}
        <div className="bg-gradient-subtle rounded-2xl p-8 border">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {primaryRole} Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's your overview.
            </p>
            {allRoles.length > 1 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {allRoles.map(role => (
                  <span
                    key={role}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                  >
                    {role}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Admin/Principal/VP Stats */}
        {(isAdmin || isPrincipal || isVicePrincipal) && <StatsCards />}

        {/* Teacher Stats - Show if teacher but NOT admin/principal */}
        {(isTeacher || isSubjectTeacher || isFormMaster || isHOD) && 
         !isAdmin && !isPrincipal && !isVicePrincipal && (
          <TeacherStatsCards />
        )}

        {/* Student Stats */}
        {isStudent && <StudentStatsCards />}

        {/* Schedule Sections */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Today's Schedule for Teachers */}
          {(isTeacher || isSubjectTeacher || isFormMaster) && (
            <TodaySchedule />
          )}

          {/* Student Schedule */}
          {isStudent && <MySchedule />}

          {/* Quick Actions for Admin/Principal */}
          {(isAdmin || isPrincipal || isVicePrincipal) && (
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <a 
                  href="/admin/students" 
                  className="block p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="font-medium">Manage Students</div>
                  <div className="text-sm text-muted-foreground">
                    Add, edit, or view student records
                  </div>
                </a>
                <a 
                  href="/admin/teachers" 
                  className="block p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="font-medium">Manage Teachers</div>
                  <div className="text-sm text-muted-foreground">
                    Manage staff and assignments
                  </div>
                </a>
                {(isPrincipal || isVicePrincipal || isExamOfficer) && (
                  <a 
                    href="/admin/reports" 
                    className="block p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="font-medium">Generate Reports</div>
                    <div className="text-sm text-muted-foreground">
                      Academic and administrative reports
                    </div>
                  </a>
                )}
              </CardContent>
            </Card>
          )}

          {/* HOD Quick Actions */}
          {isHOD && (
            <Card>
              <CardHeader>
                <CardTitle>Department Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <a 
                  href="/admin/teachers" 
                  className="block p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="font-medium">Department Teachers</div>
                  <div className="text-sm text-muted-foreground">
                    View and manage your department staff
                  </div>
                </a>
                <a 
                  href="/admin/reports" 
                  className="block p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="font-medium">Department Reports</div>
                  <div className="text-sm text-muted-foreground">
                    Performance and analytics
                  </div>
                </a>
              </CardContent>
            </Card>
          )}

          {/* Form Master Quick Actions */}
          {isFormMaster && (
            <Card>
              <CardHeader>
                <CardTitle>Class Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <a 
                  href="/admin/attendance" 
                  className="block p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="font-medium">Class Attendance</div>
                  <div className="text-sm text-muted-foreground">
                    Record daily attendance
                  </div>
                </a>
                <a 
                  href="/admin/students" 
                  className="block p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="font-medium">My Students</div>
                  <div className="text-sm text-muted-foreground">
                    View class roster and performance
                  </div>
                </a>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Activity - Admin and Management Roles */}
        {(isAdmin || isPrincipal || isVicePrincipal || isHOD || isExamOfficer) && (
          <RecentActivity />
        )}
      </div>
    </DashboardLayout>
  );
}
