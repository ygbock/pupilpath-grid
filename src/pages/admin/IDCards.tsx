import { DashboardLayout } from "@/components/admin/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useIdCardTemplates, useIdCardIssuance } from "@/hooks/useIdCards";
import { usePermissions } from "@/hooks/usePermissions";
import { Plus, IdCard as IdCardIcon, Users, GraduationCap } from "lucide-react";
import CardRenderer from "@/components/idcards/CardRenderer";

const IDCardsPage = () => {
  const { templates, createTemplate, deleteTemplate } = useIdCardTemplates();
  const { issued, issueCard, revokeCard } = useIdCardIssuance();
  const { can } = usePermissions();
  const canManage = can("idcards.manage");

  const [tmplOpen, setTmplOpen] = useState(false);
  const [tmplName, setTmplName] = useState("");
  const [tmplTarget, setTmplTarget] = useState<"student" | "staff">("student");

  const [issueOpen, setIssueOpen] = useState(false);
  const [subjectType, setSubjectType] = useState<"student" | "staff">("student");
  const [subjectRowId, setSubjectRowId] = useState("");
  const [templateId, setTemplateId] = useState("");

  const [filterTarget, setFilterTarget] = useState<"student" | "staff">("student");
  const sampleData = (target: "student" | "staff") => target === "student" ? {
    logo_url: "",
    photo_url: "",
    reg_no: "REG-2025-001",
    student_id: "STU-1234",
    student_name: "Jane Doe",
    guardian_name: "John Doe",
    class: "Grade 10",
    emergency_phone: "+1 555-123-4567",
    phone: "+1 555-123-4567",
    email: "info@school.edu",
    website: "school.edu",
    qr_payload: "https://school.edu/verify/STU-1234"
  } : {
    logo_url: "",
    photo_url: "",
    employee_id: "EMP-4321",
    staff_name: "Mr. Smith",
    department: "Science",
    designation: "Teacher",
    phone: "+1 555-987-6543",
    email: "staff@school.edu",
    website: "school.edu",
    qr_payload: "https://school.edu/verify/EMP-4321"
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <div className="bg-gradient-subtle rounded-2xl p-8 border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <IdCardIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">ID Cards</h1>
                <p className="text-muted-foreground">Templates and issuance for students and staff</p>
              </div>
            </div>
            {canManage && (
              <div className="flex gap-2">
                <Button onClick={() => setTmplOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Template
                </Button>
                <Button variant="secondary" onClick={() => setIssueOpen(true)}>
                  <IdCardIcon className="w-4 h-4 mr-2" />
                  Issue Card
                </Button>
              </div>
            )}
          </div>
        </div>

        <Tabs defaultValue="templates">
          <TabsList>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="issued">Issued</TabsTrigger>
          </TabsList>
          <TabsContent value="templates" className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-2">
                <Button variant={filterTarget === 'student' ? 'default' : 'secondary'} size="sm" onClick={() => setFilterTarget('student')}>Student</Button>
                <Button variant={filterTarget === 'staff' ? 'default' : 'secondary'} size="sm" onClick={() => setFilterTarget('staff')}>Staff</Button>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {(templates.data || []).filter((t) => t.target_type === filterTarget).map((t) => (
                <div key={t.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{t.name}</div>
                      <div className="text-xs text-muted-foreground uppercase">{t.target_type}</div>
                    </div>
                    {canManage && (
                      <Button size="sm" variant="destructive" onClick={() => deleteTemplate.mutate(t.id)}>Delete</Button>
                    )}
                  </div>
                  {/* Previews */}
                  <div className="flex gap-3">
                    <CardRenderer design={t.design as any} data={sampleData(t.target_type)} side="front" />
                    <CardRenderer design={t.design as any} data={sampleData(t.target_type)} side="back" />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="issued" className="mt-4">
            <div className="space-y-3">
              {(issued.data || []).map((c) => (
                <div key={c.id} className="border rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {c.subject_type === 'student' ? <GraduationCap className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                    <div>
                      <div className="text-sm">{c.subject_type.toUpperCase()} • Template {c.template_id.slice(0,8)}</div>
                      <div className="text-xs text-muted-foreground">Issued {new Date(c.issued_at).toLocaleString()} {c.expires_at ? `• Expires ${new Date(c.expires_at).toLocaleDateString()}` : ''}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {c.revoked ? (
                      <span className="text-xs text-red-600">Revoked</span>
                    ) : (
                      canManage && <Button size="sm" variant="destructive" onClick={() => revokeCard.mutate(c.id)}>Revoke</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Create Template Dialog */}
        <Dialog open={tmplOpen} onOpenChange={setTmplOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New ID Card Template</DialogTitle>
              <DialogDescription>Provide a name and choose whether this template is for students or staff.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={tmplName} onChange={(e) => setTmplName(e.target.value)} placeholder="e.g. Standard Student Card" />
              </div>
              <div className="space-y-2">
                <Label>Target</Label>
                <Select value={tmplTarget} onValueChange={(v) => setTmplTarget(v as any)}>
                  <SelectTrigger><SelectValue placeholder="Select target" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setTmplOpen(false)}>Cancel</Button>
                <Button onClick={async () => {
                  await createTemplate.mutateAsync({ name: tmplName, target_type: tmplTarget });
                  setTmplName("");
                  setTmplTarget("student");
                  setTmplOpen(false);
                }}>Create</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Issue Card Dialog (MVP - requires subject row id) */}
        <Dialog open={issueOpen} onOpenChange={setIssueOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Issue ID Card</DialogTitle>
              <DialogDescription>Select the subject type, paste the row ID, and choose a template.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Subject Type</Label>
                <Select value={subjectType} onValueChange={(v) => setSubjectType(v as any)}>
                  <SelectTrigger><SelectValue placeholder="Select subject type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{subjectType === 'student' ? 'Student Row ID' : 'Teacher Row ID'}</Label>
                <Input value={subjectRowId} onChange={(e) => setSubjectRowId(e.target.value)} placeholder="UUID of student/teacher row" />
              </div>
              <div className="space-y-2">
                <Label>Template</Label>
                <Select value={templateId} onValueChange={(v) => setTemplateId(v)}>
                  <SelectTrigger><SelectValue placeholder="Select template" /></SelectTrigger>
                  <SelectContent>
                    {(templates.data || []).map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.name} ({t.target_type})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setIssueOpen(false)}>Cancel</Button>
                <Button onClick={async () => {
                  if (!subjectRowId || !templateId) return;
                  const payload = {
                    subject_type: subjectType,
                    subject_row_id: subjectRowId,
                    template_id: templateId,
                    qr_payload: null as string | null,
                    card_data: {},
                  };
                  await issueCard.mutateAsync(payload);
                  setSubjectRowId("");
                  setTemplateId("");
                  setIssueOpen(false);
                }}>Issue</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default IDCardsPage;
