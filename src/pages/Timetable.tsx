import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TimetableManager } from "@/components/timetable/TimetableManager";
import { Calendar } from "lucide-react";

const Timetable = () => {
  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <div className="bg-gradient-subtle rounded-2xl p-8 border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-info" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Timetable</h1>
              <p className="text-muted-foreground">
                Manage class schedules and teacher assignments
              </p>
            </div>
          </div>
        </div>
        
        <TimetableManager />
      </div>
    </DashboardLayout>
  );
};

export default Timetable;