import { DashboardLayout } from "@/components/admin/layout/DashboardLayout";
import { TeacherStatsCards } from "@/components/teacher/dashboard/TeacherStatsCards";
import { TodaySchedule } from "@/components/teacher/dashboard/TodaySchedule";
import { RecentGrades } from "@/components/teacher/dashboard/RecentGrades";
import { UpcomingAssignments } from "@/components/teacher/dashboard/UpcomingAssignments";

export default function TeacherDashboard() {
  return (
    <DashboardLayout userRole="teacher">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Teacher Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your overview for today.</p>
        </div>

        <TeacherStatsCards />

        <div className="grid gap-6 md:grid-cols-2">
          <TodaySchedule />
          <UpcomingAssignments />
        </div>

        <RecentGrades />
      </div>
    </DashboardLayout>
  );
}
