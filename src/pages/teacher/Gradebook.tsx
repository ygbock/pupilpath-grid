import { DashboardLayout } from "@/components/admin/layout/DashboardLayout";
import { GradebookView } from "@/components/admin/gradebook/GradebookView";

export default function TeacherGradebook() {
  return (
    <DashboardLayout userRole="teacher">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gradebook</h1>
          <p className="text-muted-foreground mt-1">Manage grades and assessments for your classes</p>
        </div>
        
        <GradebookView />
      </div>
    </DashboardLayout>
  );
}
