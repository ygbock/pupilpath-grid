import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AttendanceTracker } from "@/components/attendance/AttendanceTracker";
import { UserCheck } from "lucide-react";

const Attendance = () => {
  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <div className="bg-gradient-subtle rounded-2xl p-8 border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-success" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Attendance</h1>
              <p className="text-muted-foreground">
                Track daily attendance and generate reports
              </p>
            </div>
          </div>
        </div>
        
        <AttendanceTracker />
      </div>
    </DashboardLayout>
  );
};

export default Attendance;