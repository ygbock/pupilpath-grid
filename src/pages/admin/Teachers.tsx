import { useState } from "react";
import { DashboardLayout } from "@/components/admin/layout/DashboardLayout";
import { TeachersTable } from "@/components/admin/teachers/TeachersTable";
import { TeacherForm } from "@/components/admin/forms/TeacherForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useTeachers } from "@/hooks/useTeachers";

const Teachers = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { createTeacher } = useTeachers();

  const handleSubmit = async (data: any) => {
    await createTeacher.mutateAsync(data);
    setIsDialogOpen(false);
  };

  return (
    <DashboardLayout userRoles={["admin"]} staffRoles={[]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Teachers</h1>
            <p className="text-muted-foreground mt-1">
              Manage teaching staff and their assignments
            </p>
          </div>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Teacher
          </Button>
        </div>
        
        <TeachersTable />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Teacher</DialogTitle>
            </DialogHeader>
            <TeacherForm 
              onSubmit={handleSubmit} 
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Teachers;