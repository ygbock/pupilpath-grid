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
import { useRoles } from "@/hooks/useRole";
import { usePermissions } from "@/hooks/usePermissions";
import type { Permission } from "@/rbac/permissions";
import { getNavItems } from "@/rbac/nav";

interface NavigationItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}
interface DashboardSidebarProps {
  rolesOverride?: string[];
}

// Navigation is now registry-driven via getNavItems()

export function DashboardSidebar({ rolesOverride }: DashboardSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const { roles: fetchedRoles } = useRoles();
  const { can } = usePermissions();
  const effectiveRoles = rolesOverride && rolesOverride.length > 0 ? rolesOverride : (fetchedRoles || ["admin"]);

  // Load registry-driven items
  const registry = getNavItems();
  // Filter by roles (if item.roles provided, intersects with effectiveRoles)
  const roleFiltered = registry.filter((it) => {
    if (!("roles" in it) || !it.roles || it.roles.length === 0) return true;
    return it.roles.some((r) => effectiveRoles.includes(r));
  });
  // Filter by permissions (if item.required provided)
  const permAllows = (req?: Permission | Permission[]) => {
    if (!req) return true;
    if (Array.isArray(req)) return req.every((p) => can(p));
    return can(req);
  };
  const permFiltered = roleFiltered.filter((it: any) => permAllows(it.required));
  // Dedupe by URL
  const dedup = new Set<string>();
  const merged = permFiltered.filter((it) => {
    if (dedup.has(it.url)) return false;
    dedup.add(it.url);
    return true;
  });

  // Collapse multiple dashboard-like entries into a single canonical Home at '/'
  const dashboardLike = (u: string, t: string) => t.toLowerCase().includes("dashboard") || u.endsWith("/dashboard");
  const withoutExtraDashboards = merged.filter((it) => !(it.url !== "/" && dashboardLike(it.url, it.title)));
  const rootIndex = withoutExtraDashboards.findIndex((it) => it.url === "/");
  if (rootIndex >= 0) {
    // Rename root item to Home
    withoutExtraDashboards[rootIndex] = { ...withoutExtraDashboards[rootIndex], title: "Home" };
  } else {
    // Ensure Home exists
    withoutExtraDashboards.unshift({ title: "Home", url: "/", icon: BarChart3 });
  }
  const items = withoutExtraDashboards;

  // Permission filter for admin-like routes
  const permByUrl: Record<string, Permission> = {
    "/students": "students.manage",
    "/teachers": "teachers.manage",
    "/classes": "classes.manage",
    "/attendance": "attendance.view",
    "/gradebook": "gradebook.view",
    "/assessments": "assessments.manage",
    "/fees": "fees.manage",
    "/timetable": "timetable.view",
    "/reports": "reports.view",
    "/settings": "settings.manage",
    "/admin/invites": "invites.manage",
    "/admin/create-user": "users.manage",
  };

  const filtered = items.filter((it) => {
    // Never hide Home
    if (it.url === "/") return true;
    // Only enforce perms for admin-like root routes
    const p = permByUrl[it.url];
    if (!p) return true; // routes like /teacher/* or /student/* pass
    return can(p);
  });

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
                  {effectiveRoles.join(", ")}
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
              {filtered.map((item) => (
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