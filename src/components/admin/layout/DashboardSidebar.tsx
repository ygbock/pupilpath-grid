import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Users,
  GraduationCap,
  Calendar,
  BookOpen,
  TrendingUp,
  Settings,
  FileText,
  CreditCard,
  BarChart3,
  UserCheck,
  School,
  ClipboardList,
  Clock,
  Award,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface NavigationItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface DashboardSidebarProps {
  userRole: 'admin' | 'teacher' | 'student' | 'parent';
}

const navigationItems: Record<string, NavigationItem[]> = {
  admin: [
    { title: "Dashboard", url: "/", icon: BarChart3 },
    { title: "Students", url: "/students", icon: Users },
    { title: "Teachers", url: "/teachers", icon: GraduationCap },
    { title: "Classes & Sections", url: "/classes", icon: School },
    { title: "Attendance", url: "/attendance", icon: UserCheck },
    { title: "Gradebook", url: "/gradebook", icon: BookOpen },
    { title: "Assessments", url: "/assessments", icon: ClipboardList },
    { title: "Fee Management", url: "/fees", icon: CreditCard },
    { title: "Timetable", url: "/timetable", icon: Calendar },
    { title: "Reports", url: "/reports", icon: FileText },
    { title: "Settings", url: "/settings", icon: Settings },
  ],
  teacher: [
    { title: "Dashboard", url: "/", icon: BarChart3 },
    { title: "My Classes", url: "/my-classes", icon: School },
    { title: "Attendance", url: "/attendance", icon: UserCheck },
    { title: "Gradebook", url: "/gradebook", icon: BookOpen },
    { title: "Assessments", url: "/assessments", icon: ClipboardList },
    { title: "Timetable", url: "/timetable", icon: Calendar },
    { title: "Students", url: "/students", icon: Users },
  ],
  student: [
    { title: "Dashboard", url: "/", icon: BarChart3 },
    { title: "My Grades", url: "/grades", icon: Award },
    { title: "Attendance", url: "/attendance", icon: Clock },
    { title: "Timetable", url: "/timetable", icon: Calendar },
    { title: "Assignments", url: "/assignments", icon: ClipboardList },
  ],
  parent: [
    { title: "Dashboard", url: "/", icon: BarChart3 },
    { title: "My Children", url: "/children", icon: Users },
    { title: "Attendance", url: "/attendance", icon: Clock },
    { title: "Grades", url: "/grades", icon: Award },
    { title: "Fee Payments", url: "/fees", icon: CreditCard },
    { title: "Timetable", url: "/timetable", icon: Calendar },
  ],
};

export function DashboardSidebar({ userRole }: DashboardSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const items = navigationItems[userRole] || navigationItems.admin;

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavClassName = (path: string) => {
    return isActive(path) 
      ? "bg-primary text-primary-foreground font-medium shadow-sm" 
      : "hover:bg-accent hover:text-accent-foreground transition-colors";
  };

  return (
    <Sidebar className="border-r">
      <SidebarContent className="p-4">
        {/* Logo/Brand */}
        <div className="mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <School className="w-5 h-5 text-white" />
            </div>
            {state === "expanded" && (
              <div>
                <h1 className="font-bold text-lg text-foreground">EduManager</h1>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {userRole}
                </p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${getNavClassName(item.url)}`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {state === "expanded" && (
                        <div className="flex items-center justify-between w-full">
                          <span className="text-sm">{item.title}</span>
                          {item.badge && (
                            <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}