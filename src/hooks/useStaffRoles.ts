import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface StaffRole {
  id: string;
  name: string;
  description: string | null;
}

export function useStaffRoles() {
  const [staffRoles, setStaffRoles] = useState<StaffRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadStaffRoles = async () => {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (!cancelled) {
          setStaffRoles([]);
          setLoading(false);
        }
        return;
      }

      // Get staff record
      const { data: staffData } = await supabase
        .from("staff")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!staffData) {
        if (!cancelled) {
          setStaffRoles([]);
          setLoading(false);
        }
        return;
      }

      // Get all roles assigned to this staff member
      const { data: roleAssignments, error: roleError } = await supabase
        .from("staff_role_assignments")
        .select(`
          staff_roles (
            id,
            name,
            description
          )
        `)
        .eq("staff_id", staffData.id);

      if (roleError) {
        if (!cancelled) {
          setError(roleError.message);
          setLoading(false);
        }
        return;
      }

      const roles = roleAssignments
        ?.map((ra: any) => ra.staff_roles)
        .filter(Boolean) || [];

      if (!cancelled) {
        setStaffRoles(roles);
        setLoading(false);
      }
    };

    loadStaffRoles();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadStaffRoles();
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  return { staffRoles, loading, error };
}

export function useHasStaffRole(targetRole: string | string[]) {
  const { staffRoles, loading, error } = useStaffRoles();
  
  const hasRole = () => {
    if (Array.isArray(targetRole)) {
      return targetRole.some(role => 
        staffRoles.some(sr => sr.name === role)
      );
    }
    return staffRoles.some(sr => sr.name === targetRole);
  };

  return { 
    hasRole: hasRole(), 
    loading, 
    error,
    staffRoles 
  };
}
