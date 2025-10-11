import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface UserPermission {
  permission: string;
  role: string;
}

export function useUserPermissions() {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    
    const loadPermissions = async () => {
      setLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (!cancelled) {
          setPermissions([]);
          setLoading(false);
        }
        return;
      }

      // Check if user has admin role (full access)
      const { data: adminRole } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (adminRole) {
        if (!cancelled) {
          setPermissions(["*"]); // Admin has all permissions
          setLoading(false);
        }
        return;
      }

      // Get staff permissions via role assignments
      const { data: staffData } = await supabase
        .from("staff")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!staffData) {
        if (!cancelled) {
          setPermissions([]);
          setLoading(false);
        }
        return;
      }

      // Get all permissions for this staff member
      const { data: rolePermissions, error: permError } = await supabase
        .from("staff_role_assignments")
        .select(`
          staff_roles (
            name,
            role_permissions (
              permissions (
                name
              )
            )
          )
        `)
        .eq("staff_id", staffData.id);

      if (permError) {
        if (!cancelled) {
          setError(permError.message);
          setLoading(false);
        }
        return;
      }

      // Check if user is Principal (full access)
      const isPrincipal = rolePermissions?.some(
        (ra: any) => ra.staff_roles?.name === "Principal"
      );

      if (isPrincipal) {
        if (!cancelled) {
          setPermissions(["*"]);
          setLoading(false);
        }
        return;
      }

      // Extract unique permissions
      const perms = new Set<string>();
      rolePermissions?.forEach((ra: any) => {
        ra.staff_roles?.role_permissions?.forEach((rp: any) => {
          if (rp.permissions?.name) {
            perms.add(rp.permissions.name);
          }
        });
      });

      if (!cancelled) {
        setPermissions(Array.from(perms));
        setLoading(false);
      }
    };

    loadPermissions();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadPermissions();
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  return { permissions, loading, error };
}

export function useHasPermission(requiredPermission: string | string[]) {
  const { permissions, loading, error } = useUserPermissions();
  
  const hasPermission = () => {
    if (permissions.includes("*")) return true;
    
    if (Array.isArray(requiredPermission)) {
      return requiredPermission.some(perm => permissions.includes(perm));
    }
    
    return permissions.includes(requiredPermission);
  };

  return { 
    hasPermission: hasPermission(), 
    loading, 
    error 
  };
}
import { useMemo } from "react";
import { useRoles } from "@/hooks/useRole";
import { ROLE_PERMISSIONS, type Permission } from "@/rbac/permissions";

export function usePermissions() {
  const { roles, loading, error } = useRoles();

  const perms = useMemo<Set<Permission>>(() => {
    const s = new Set<Permission>();
    if (!roles) return s;
    for (const r of roles) {
      const p = (ROLE_PERMISSIONS as any)[r] as Permission[] | undefined;
      if (p) {
        for (const perm of p) s.add(perm);
      }
    }
    return s;
  }, [roles]);

  const can = (permission: Permission) => perms.has(permission);
  const canAny = (list: Permission[]) => list.some((p) => perms.has(p));
  const canAll = (list: Permission[]) => list.every((p) => perms.has(p));

  return { permissions: perms, can, canAny, canAll, loading, error };
}


