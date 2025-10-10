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
