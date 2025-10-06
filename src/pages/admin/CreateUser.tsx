import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { AdminRoute } from "@/components/AdminRoute";
import { DashboardLayout } from "@/components/admin/layout/DashboardLayout";

const CreateUser = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("staff");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [requireReset, setRequireReset] = useState(true);
  const [sendEmail, setSendEmail] = useState(true);
  const [sendSms, setSendSms] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast({ variant: "destructive", title: "Weak password", description: "Use at least 8 characters." });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-user", {
        body: { email, password, role, full_name: fullName, phone, require_reset: requireReset },
      } as any);
      if (error) throw error;
      toast({ title: "User created", description: `User ID: ${data?.user_id || "created"}` });

      // Optionally notify via email/SMS with the temporary credentials
      if (sendEmail || sendSms) {
        const { error: notifyErr } = await supabase.functions.invoke("notify-credentials", {
          body: {
            email,
            phone,
            full_name: fullName,
            password,
            role,
            send_email: sendEmail,
            send_sms: sendSms,
          },
        } as any);
        if (notifyErr) {
          toast({ variant: "destructive", title: "Notify failed", description: notifyErr.message || String(notifyErr) });
        } else {
          toast({ title: "Credentials shared", description: `${sendEmail ? "Email" : ""}${sendEmail && sendSms ? " & " : ""}${sendSms ? "SMS" : ""} sent.` });
        }
      }
      setEmail("");
      setFullName("");
      setPassword("");
      setRole("staff");
      setRequireReset(true);
      setPhone("");
      setSendEmail(true);
      setSendSms(false);
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message || String(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminRoute>
      <DashboardLayout userRoles={["admin"]} staffRoles={[]}>
        <Card className="bg-gradient-card border-0 shadow-md max-w-2xl">
          <CardHeader>
            <CardTitle>Create User (Admin)</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="full-name">Full name</Label>
                <Input id="full-name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 123 4567" />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Temporary password</Label>
                <Input id="password" type="text" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Generate & paste a strong password" />
                <p className="text-xs text-muted-foreground">Share this password securely with the user.</p>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="require-reset" checked={requireReset} onCheckedChange={(c) => setRequireReset(!!c)} />
                <Label htmlFor="require-reset" className="text-sm">Require user to change password on first login</Label>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Checkbox id="send-email" checked={sendEmail} onCheckedChange={(c) => setSendEmail(!!c)} />
                  <Label htmlFor="send-email" className="text-sm">Share via Email</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="send-sms" checked={sendSms} onCheckedChange={(c) => setSendSms(!!c)} />
                  <Label htmlFor="send-sms" className="text-sm">Share via SMS</Label>
                </div>
                <p className="sm:col-span-2 text-xs text-muted-foreground">Email uses Resend; SMS uses Twilio. Configure secrets in Supabase. Do not share credentials in insecure channels.</p>
              </div>
              <div>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create User
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DashboardLayout>
    </AdminRoute>
  );
};

export default CreateUser;
