import { DashboardLayout } from "@/components/admin/layout/DashboardLayout";
import { AttendanceTracker } from "@/components/admin/attendance/AttendanceTracker";

export default function TeacherAttendance() {
  return (
    <DashboardLayout userRoles={["teacher"]} staffRoles={[]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Attendance</h1>
          <p className="text-muted-foreground mt-1">Track and manage student attendance for your classes</p>
        </div>
        
        <AttendanceTracker />
      </div>
    </DashboardLayout>
  );
}
