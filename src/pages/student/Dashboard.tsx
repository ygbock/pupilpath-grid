import { DashboardLayout } from "@/components/admin/layout/DashboardLayout";
import { StudentStatsCards } from "@/components/student/dashboard/StudentStatsCards";
import { MySchedule } from "@/components/student/dashboard/MySchedule";
import { MyGrades } from "@/components/student/dashboard/MyGrades";
import { MyAssignments } from "@/components/student/dashboard/MyAssignments";

export default function StudentDashboard() {
  return (
    <DashboardLayout userRoles={["student"]} staffRoles={[]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your academic overview.</p>
        </div>

        <StudentStatsCards />

        <div className="grid gap-6 md:grid-cols-2">
          <MySchedule />
          <MyAssignments />
        </div>

        <MyGrades />
      </div>
    </DashboardLayout>
  );
}
