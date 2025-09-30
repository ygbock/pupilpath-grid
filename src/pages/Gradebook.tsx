import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GradebookView } from "@/components/gradebook/GradebookView";
import { BookOpen } from "lucide-react";

const Gradebook = () => {
  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <div className="bg-gradient-subtle rounded-2xl p-8 border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-success" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Gradebook</h1>
              <p className="text-muted-foreground">
                Monitor student performance and manage grades across all subjects
              </p>
            </div>
          </div>
        </div>
        
        <GradebookView />
      </div>
    </DashboardLayout>
  );
};

export default Gradebook;