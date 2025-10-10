import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { usePermissions } from "@/hooks/usePermissions";
import type { Permission } from "@/rbac/permissions";

interface PermissionRouteProps {
  children: React.ReactNode;
  required: Permission | Permission[];
  fallbackTo?: string; // optional path to redirect if unauthorized
}

export const PermissionRoute = ({ children, required, fallbackTo = "/" }: PermissionRouteProps) => {
  return (
    <ProtectedRoute>
      <PermissionOnly required={required} fallbackTo={fallbackTo}>{children}</PermissionOnly>
    </ProtectedRoute>
  );
};

const PermissionOnly = ({ children, required, fallbackTo }: { children: React.ReactNode; required: Permission | Permission[]; fallbackTo: string; }) => {
  const { can, canAll, loading } = usePermissions();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const ok = Array.isArray(required) ? canAll(required) : can(required);
  if (!ok) return <Navigate to={fallbackTo} replace />;
  return <>{children}</>;
};
