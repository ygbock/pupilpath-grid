import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Copy, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/admin/layout/DashboardLayout";
import { AdminRoute } from "@/components/AdminRoute";

interface InviteRow {
  id: string;
  email: string;
  role: string;
  token: string;
  expires_at: string;
  created_at: string;
  used_at: string | null;
}

const Invites = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("staff");
  const [ttl, setTtl] = useState(60);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [invites, setInvites] = useState<InviteRow[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  const inviteUrl = useMemo(() => token ? `${window.location.origin}/invite/accept?token=${encodeURIComponent(token)}` : "", [token]);

  const loadInvites = async () => {
    setLoadingList(true);
    const { data, error } = await (supabase as any)
      .from("invites")
      .select("id,email,role,token,expires_at,created_at,used_at")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      setInvites(data as any);
    }
    setLoadingList(false);
  };

  useEffect(() => { loadInvites(); }, []);

  const createInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToken(null);
    try {
      const { data, error } = await (supabase as any).rpc("create_invite", {
        target_email: email,
        target_role: role,
        ttl_minutes: ttl,
      } as any);
      if (error) throw error;
      setToken(data as string);
      toast({ title: "Invite created", description: "Share the invite link securely." });
      setEmail("");
      await loadInvites();
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    toast({ title: "Copied", description: "Invite link copied to clipboard" });
  };

  return (
    <AdminRoute>
      <DashboardLayout userRole="admin">
        <Card className="bg-gradient-card border-0 shadow-md mb-6">
          <CardHeader>
            <CardTitle>Create Invite</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={createInvite} className="grid gap-4 sm:grid-cols-3 items-end">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Expires (minutes)</Label>
                <Input type="number" min={5} max={1440} value={ttl} onChange={(e) => setTtl(parseInt(e.target.value || "60", 10))} />
              </div>
              <div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Invite
                </Button>
              </div>
            </form>

            {token && (
              <div className="mt-4 p-3 rounded border flex items-center justify-between">
                <div className="truncate mr-2 text-sm">{inviteUrl}</div>
                <Button variant="outline" size="sm" onClick={copyLink}><Copy className="w-4 h-4 mr-1" />Copy</Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-md">
          <CardHeader>
            <CardTitle>Recent Invites</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingList ? (
              <div className="py-8 text-center">
                <Loader2 className="inline h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      <th className="p-2">Email</th>
                      <th className="p-2">Role</th>
                      <th className="p-2">Expires</th>
                      <th className="p-2">Status</th>
                      <th className="p-2">Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invites.map((inv) => (
                      <tr key={inv.id} className="border-t">
                        <td className="p-2">{inv.email}</td>
                        <td className="p-2 capitalize">{inv.role}</td>
                        <td className="p-2">{new Date(inv.expires_at).toLocaleString()}</td>
                        <td className="p-2">{inv.used_at ? "Used" : "Pending"}</td>
                        <td className="p-2">
                          {!inv.used_at && (
                            <Button variant="outline" size="sm" onClick={() => { setToken(inv.token); copyLink(); }}>Copy</Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </DashboardLayout>
    </AdminRoute>
  );
};

export default Invites;
