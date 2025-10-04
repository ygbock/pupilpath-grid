import { DashboardLayout } from "@/components/admin/layout/DashboardLayout";
import { TimetableManager } from "@/components/admin/timetable/TimetableManager";

export default function TeacherTimetable() {
  return (
    <DashboardLayout userRole="teacher">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Timetable</h1>
          <p className="text-muted-foreground mt-1">View your teaching schedule</p>
        </div>
        
        <TimetableManager />
      </div>
    </DashboardLayout>
  );
}
