import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FeesOverview } from "@/components/fees/FeesOverview";
import { CreditCard } from "lucide-react";

const FeeManagement = () => {
  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <div className="bg-gradient-subtle rounded-2xl p-8 border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Fee Management</h1>
              <p className="text-muted-foreground">
                Handle fee collection, invoicing, and payment tracking
              </p>
            </div>
          </div>
        </div>
        
        <FeesOverview />
      </div>
    </DashboardLayout>
  );
};

export default FeeManagement;