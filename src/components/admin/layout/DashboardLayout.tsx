import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRoles?: string[];
  staffRoles?: Array<{ name: string }>;
}

export function DashboardLayout({ children, userRoles = [], staffRoles = [] }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar userRoles={userRoles} staffRoles={staffRoles} />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader />
          <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}