import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useHasRole } from "@/hooks/useRole";
import { ProtectedRoute } from "@/components/ProtectedRoute";

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  // Ensure authenticated first
  return (
    <ProtectedRoute>
      <AdminOnly>{children}</AdminOnly>
    </ProtectedRoute>
  );
};

const AdminOnly = ({ children }: { children: React.ReactNode }) => {
  const { has, loading } = useHasRole("admin");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!has) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};
