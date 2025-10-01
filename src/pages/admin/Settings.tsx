import { DashboardLayout } from "@/components/admin/layout/DashboardLayout";
import { SettingsPanel } from "@/components/admin/settings/SettingsPanel";
import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <div className="bg-gradient-subtle rounded-2xl p-8 border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-muted/10 rounded-lg flex items-center justify-center">
              <SettingsIcon className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground">
                Configure system preferences and school information
              </p>
            </div>
          </div>
        </div>
        
        <SettingsPanel />
      </div>
    </DashboardLayout>
  );
};

export default Settings;