import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ClassesGrid } from "@/components/classes/ClassesGrid";
import { Button } from "@/components/ui/button";
import { Plus, School } from "lucide-react";

const Classes = () => {
  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <div className="bg-gradient-subtle rounded-2xl p-8 border">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <School className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Classes & Sections</h1>
              <p className="text-muted-foreground">
                Organize your school structure and manage class assignments
              </p>
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Create New Class
          </Button>
        </div>
        
        <ClassesGrid />
      </div>
    </DashboardLayout>
  );
};

export default Classes;