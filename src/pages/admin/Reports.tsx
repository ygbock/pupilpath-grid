import { useState } from "react";
import { DashboardLayout } from "@/components/admin/layout/DashboardLayout";
import { ReportsHub } from "@/components/admin/reports/ReportsHub";
import { ReportGenerationForm } from "@/components/admin/forms/ReportGenerationForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, Plus } from "lucide-react";

const Reports = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleSubmit = (data: any) => {
    console.log("Report data:", data);
    setIsDialogOpen(false);
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <div className="bg-gradient-subtle rounded-2xl p-8 border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Reports</h1>
                <p className="text-muted-foreground">
                  Generate and export comprehensive school reports
                </p>
              </div>
            </div>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        <ReportsHub />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Generate New Report</DialogTitle>
            </DialogHeader>
            <ReportGenerationForm 
              onSubmit={handleSubmit} 
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
;

export default Reports;