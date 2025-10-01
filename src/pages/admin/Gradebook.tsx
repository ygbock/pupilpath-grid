import { useState } from "react";
import { DashboardLayout } from "@/components/admin/layout/DashboardLayout";
import { GradebookView } from "@/components/admin/gradebook/GradebookView";
import { GradeEntryForm } from "@/components/admin/forms/GradeEntryForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookOpen, Plus } from "lucide-react";

const Gradebook = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = (data: any) => {
    console.log("Grade data:", data);
    setIsDialogOpen(false);
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <div className="bg-gradient-subtle rounded-2xl p-8 border">
          <div className="flex items-center justify-between">
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
            <Button 
              className="bg-success hover:bg-success/90"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Enter Grade
            </Button>
          </div>
        </div>
        
        <GradebookView />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Enter Grade</DialogTitle>
            </DialogHeader>
            <GradeEntryForm 
              onSubmit={handleSubmit} 
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Gradebook;