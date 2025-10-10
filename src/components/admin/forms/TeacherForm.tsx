import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { usePermissions } from "@/hooks/usePermissions";
import { useIdCardTemplates } from "@/hooks/useIdCards";

const teacherFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  employeeId: z.string().min(3, "Employee ID is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"]),
  qualification: z.string().min(2, "Qualification is required"),
  specialization: z.string().min(2, "Specialization is required"),
  joiningDate: z.string().min(1, "Joining date is required"),
  designation: z.string().min(1, "Designation is required"),
  department: z.string().min(1, "Department is required"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  emergencyContact: z.string().min(10, "Emergency contact is required"),
  // Login creation (admin-only; validated client-side)
  createLogin: z.boolean().optional().default(false),
  accountRole: z.string().optional(),
  tempPassword: z.string().optional(),
  requireReset: z.boolean().optional().default(true),
  shareEmail: z.boolean().optional().default(true),
  shareSms: z.boolean().optional().default(false),
  // ID card issuing (admin-only; requires idcards.manage)
  issueIdCard: z.boolean().optional().default(false),
  idCardTemplateId: z.string().optional(),
  idCardExpires: z.string().optional(),
}).superRefine((vals, ctx) => {
  if (vals.createLogin) {
    if (!vals.tempPassword || vals.tempPassword.length < 8) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["tempPassword"], message: "Password must be at least 8 characters" });
    }
  }
  if (vals.issueIdCard && !vals.idCardTemplateId) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["idCardTemplateId"], message: "Select a template" });
  }
});

type TeacherFormValues = z.infer<typeof teacherFormSchema>;

interface TeacherFormProps {
  initialData?: Partial<TeacherFormValues>;
  onSubmit: (data: TeacherFormValues) => void;
  onCancel?: () => void;
  readOnly?: boolean;
}

export function TeacherForm({ initialData, onSubmit, onCancel, readOnly }: TeacherFormProps) {
  const [profileImage, setProfileImage] = useState<string>("");
  const { can } = usePermissions();
  const canCreateUsers = can("users.manage");
  const canIdManage = can("idcards.manage");
  const { templates } = useIdCardTemplates();
  
  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: initialData || {
      firstName: "",
      lastName: "",
      employeeId: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "male",
      qualification: "",
      specialization: "",
      joiningDate: "",
      designation: "",
      department: "",
      address: "",
      emergencyContact: "",
      createLogin: false,
      accountRole: "teacher",
      tempPassword: "",
      requireReset: true,
      shareEmail: true,
      shareSms: false,
      issueIdCard: false,
      idCardTemplateId: "",
      idCardExpires: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast.success("Profile photo selected");
    }
  };

  const handleSubmit = (data: TeacherFormValues) => {
    onSubmit(data);
    toast.success(initialData ? "Teacher updated successfully" : "Teacher added successfully");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="flex flex-col items-center gap-4 pb-6 border-b">
          <Avatar className="w-24 h-24">
            <AvatarImage src={profileImage} />
            <AvatarFallback className="bg-primary/10">
              <Upload className="w-8 h-8 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center gap-2">
            {!readOnly && (
              <label htmlFor="profile-upload" className="cursor-pointer">
                <Button type="button" variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </span>
                </Button>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
            <p className="text-xs text-muted-foreground">
              Recommended: 500x500px, max 2MB
            </p>
          </div>
        </div>

        {canCreateUsers && !readOnly && (
          <div className="border-t pt-4 space-y-4">
            <h3 className="text-lg font-semibold">Account & Login (optional)</h3>
            <div className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="createLogin"
                render={({ field }) => (
                  <>
                    <Checkbox id="t-createLogin" checked={!!field.value} onCheckedChange={(c) => field.onChange(!!c)} />
                    <label htmlFor="t-createLogin" className="text-sm">Create staff login now</label>
                  </>
                )}
              />
            </div>
            {form.getValues("createLogin") && (
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="accountRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="subject_teacher">Subject Teacher</SelectItem>
                          <SelectItem value="assistant_teacher">Assistant Teacher</SelectItem>
                          <SelectItem value="form_master">Form Master</SelectItem>
                          <SelectItem value="hod">Head of Department</SelectItem>
                          <SelectItem value="vice_principal">Vice Principal</SelectItem>
                          <SelectItem value="principal">Principal</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tempPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temporary Password</FormLabel>
                      <FormControl>
                        <Input type="text" minLength={8} placeholder="Min 8 chars" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-2 mt-8">
                  <FormField
                    control={form.control}
                    name="requireReset"
                    render={({ field }) => (
                      <>
                        <Checkbox id="t-requireReset" checked={!!field.value} onCheckedChange={(c) => field.onChange(!!c)} />
                        <label htmlFor="t-requireReset" className="text-sm">Require password change on first login</label>
                      </>
                    )}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name="shareEmail"
                    render={({ field }) => (
                      <>
                        <Checkbox id="t-shareEmail" checked={!!field.value} onCheckedChange={(c) => field.onChange(!!c)} />
                        <label htmlFor="t-shareEmail" className="text-sm">Share credentials via Email</label>
                      </>
                    )}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name="shareSms"
                    render={({ field }) => (
                      <>
                        <Checkbox id="t-shareSms" checked={!!field.value} onCheckedChange={(c) => field.onChange(!!c)} />
                        <label htmlFor="t-shareSms" className="text-sm">Share credentials via SMS</label>
                      </>
                    )}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {canIdManage && !readOnly && (
          <div className="border-t pt-4 space-y-4">
            <h3 className="text-lg font-semibold">ID Card (optional)</h3>
            <div className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="issueIdCard"
                render={({ field }) => (
                  <>
                    <Checkbox id="staffIssueIdCard" checked={!!field.value} onCheckedChange={(c) => field.onChange(!!c)} />
                    <label htmlFor="staffIssueIdCard" className="text-sm">Issue ID card after creating staff</label>
                  </>
                )}
              />
            </div>
            {form.getValues("issueIdCard") && (
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="idCardTemplateId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select template" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(templates.data || []).filter((t) => t.target_type === "staff").map((t) => (
                            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="idCardExpires"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expires (optional)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane" {...field} disabled={readOnly} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Smith" {...field} disabled={readOnly} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee ID</FormLabel>
                <FormControl>
                  <Input placeholder="EMP001" {...field} disabled={readOnly} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="teacher@school.com" {...field} disabled={readOnly} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+1234567890" {...field} disabled={readOnly} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" {...field} disabled={readOnly} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger disabled={!!readOnly}>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="qualification"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Qualification</FormLabel>
                <FormControl>
                  <Input placeholder="M.Sc. in Physics" {...field} disabled={readOnly} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="specialization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specialization</FormLabel>
                <FormControl>
                  <Input placeholder="Physics" {...field} disabled={readOnly} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="joiningDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Joining Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} disabled={readOnly} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="designation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Designation</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger disabled={!!readOnly}>
                      <SelectValue placeholder="Select designation" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="principal">Principal</SelectItem>
                    <SelectItem value="vice-principal">Vice Principal</SelectItem>
                    <SelectItem value="head-teacher">Head Teacher</SelectItem>
                    <SelectItem value="senior-teacher">Senior Teacher</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="assistant-teacher">Assistant Teacher</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger disabled={!!readOnly}>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="social-studies">Social Studies</SelectItem>
                    <SelectItem value="physical-education">Physical Education</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter full address" {...field} disabled={readOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="emergencyContact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Emergency Contact</FormLabel>
              <FormControl>
                <Input placeholder="+1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          {readOnly ? (
            onCancel && (
              <Button type="button" onClick={onCancel}>
                Close
              </Button>
            )
          ) : (
            <>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit">
                {initialData ? "Update Teacher" : "Add Teacher"}
              </Button>
            </>
          )}
        </div>
      </form>
    </Form>
  );
}
