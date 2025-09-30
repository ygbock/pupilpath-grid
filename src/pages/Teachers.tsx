import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TeachersTable } from "@/components/teachers/TeachersTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Teachers = () => {
  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Teachers</h1>
            <p className="text-muted-foreground mt-1">
              Manage teaching staff and their assignments
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Teacher
          </Button>
        </div>
        
        <TeachersTable />
      </div>
    </DashboardLayout>
  );
};

export default Teachers;