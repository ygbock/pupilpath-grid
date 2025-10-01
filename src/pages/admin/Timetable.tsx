import { useState } from "react";
import { DashboardLayout } from "@/components/admin/layout/DashboardLayout";
import { TimetableManager } from "@/components/admin/timetable/TimetableManager";
import { TimetableForm } from "@/components/admin/forms/TimetableForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Plus } from "lucide-react";

const Timetable = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = (data: any) => {
    console.log("Timetable data:", data);
    setIsDialogOpen(false);
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <div className="bg-gradient-subtle rounded-2xl p-8 border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-info" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Timetable</h1>
                <p className="text-muted-foreground">
                  Manage class schedules and teacher assignments
                </p>
              </div>
            </div>
            <Button 
              className="bg-info hover:bg-info/90"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Period
            </Button>
          </div>
        </div>
        
        <TimetableManager />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Timetable Entry</DialogTitle>
            </DialogHeader>
            <TimetableForm 
              onSubmit={handleSubmit} 
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Timetable;