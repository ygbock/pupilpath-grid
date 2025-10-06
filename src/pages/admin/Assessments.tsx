import { useState } from "react";
import { DashboardLayout } from "@/components/admin/layout/DashboardLayout";
import { AssessmentsManager } from "@/components/admin/assessments/AssessmentsManager";
import { AssignmentForm } from "@/components/admin/forms/AssignmentForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, ClipboardList } from "lucide-react";

const Assessments = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = (data: any) => {
    console.log("Assignment data:", data);
    setIsDialogOpen(false);
  };

  return (
    <DashboardLayout userRoles={["admin"]} staffRoles={[]}>
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
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Assessment
            </Button>
          </div>
        </div>
        
        <AssessmentsManager />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Assessment</DialogTitle>
            </DialogHeader>
            <AssignmentForm 
              onSubmit={handleSubmit} 
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Assessments;