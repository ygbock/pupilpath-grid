import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StudentTable } from "@/components/students/StudentTable";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";

const Students = () => {
  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <div className="bg-gradient-subtle rounded-2xl p-8 border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Students</h1>
                <p className="text-muted-foreground">
                  Manage student enrollment and academic records
                </p>
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Enroll Student
            </Button>
          </div>
        </div>
        
        <StudentTable />
      </div>
    </DashboardLayout>
  );
};

export default Students;