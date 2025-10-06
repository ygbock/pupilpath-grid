import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useRoles } from "@/hooks/useRole";
import { useStaffRoles } from "@/hooks/useStaffRoles";
import { ProtectedRoute } from "@/components/ProtectedRoute";

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // User roles (admin, teacher, student, parent)
  allowedStaffRoles?: string[]; // Staff roles (Principal, HOD, etc.)
  requireAll?: boolean; // If true, user must have ALL roles. If false (default), ANY role is sufficient
}

export const RoleBasedRoute = ({ 
  children, 
  allowedRoles = [], 
  allowedStaffRoles = [],
  requireAll = false 
}: RoleBasedRouteProps) => {
  return (
    <ProtectedRoute>
      <RoleCheck 
        allowedRoles={allowedRoles} 
        allowedStaffRoles={allowedStaffRoles}
        requireAll={requireAll}
      >
        {children}
      </RoleCheck>
    </ProtectedRoute>
  );
};

const RoleCheck = ({ 
  children, 
  allowedRoles, 
  allowedStaffRoles,
  requireAll 
}: RoleBasedRouteProps) => {
  const { roles: userRoles, loading: userRolesLoading } = useRoles();
  const { staffRoles, loading: staffRolesLoading } = useStaffRoles();

  const loading = userRolesLoading || staffRolesLoading;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const hasUserRole = allowedRoles.length === 0 || (
    requireAll 
      ? allowedRoles.every(role => userRoles?.includes(role))
      : allowedRoles.some(role => userRoles?.includes(role))
  );

  const hasStaffRole = allowedStaffRoles.length === 0 || (
    requireAll
      ? allowedStaffRoles.every(role => staffRoles.some(sr => sr.name === role))
      : allowedStaffRoles.some(role => staffRoles.some(sr => sr.name === role))
  );

  const hasAccess = requireAll 
    ? hasUserRole && hasStaffRole 
    : hasUserRole || hasStaffRole;

  if (!hasAccess) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};
