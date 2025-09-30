import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AssessmentsManager } from "@/components/assessments/AssessmentsManager";
import { Button } from "@/components/ui/button";
import { Plus, ClipboardList } from "lucide-react";

const Assessments = () => {
  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <div className="bg-gradient-subtle rounded-2xl p-8 border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-warning" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Assessments</h1>
                <p className="text-muted-foreground">
                  Create and manage exams, tests, and evaluations
                </p>
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Create Assessment
            </Button>
          </div>
        </div>
        
        <AssessmentsManager />
      </div>
    </DashboardLayout>
  );
};

export default Assessments;