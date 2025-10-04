import { DashboardLayout } from "@/components/admin/layout/DashboardLayout";
import { AssessmentsManager } from "@/components/admin/assessments/AssessmentsManager";

export default function TeacherAssessments() {
  return (
    <DashboardLayout userRole="teacher">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assessments</h1>
          <p className="text-muted-foreground mt-1">Create and manage assessments for your classes</p>
        </div>
        
        <AssessmentsManager />
      </div>
    </DashboardLayout>
  );
}
