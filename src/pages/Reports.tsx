import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ReportsHub } from "@/components/reports/ReportsHub";
import { FileText } from "lucide-react";

const Reports = () => {
  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <div className="bg-gradient-subtle rounded-2xl p-8 border">
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
        </div>
        
        <ReportsHub />
      </div>
    </DashboardLayout>
  );
};

export default Reports;