import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useRoles() {
  const [roles, setRoles] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (!cancelled) {
          setRoles(null);
          setLoading(false);
        }
        return;
      }
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      if (error) {
        if (!cancelled) {
          setError(error.message);
          setLoading(false);
        }
        return;
      }
      if (!cancelled) {
        setRoles((data || []).map(r => r.role));
        setLoading(false);
      }
    };
    load();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => load());
    return () => { cancelled = true; subscription.unsubscribe(); };
  }, []);

  return { roles, loading, error };
}

export function useHasRole(target: string) {
  const { roles, loading, error } = useRoles();
  const has = !!roles?.includes(target);
  return { has, loading, error };
}
