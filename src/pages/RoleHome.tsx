import { Loader2 } from "lucide-react";
import AdminIndex from "./admin/Index";
import TeacherDashboard from "./teacher/Dashboard";
import StudentDashboard from "./student/Dashboard";
import { useRoles } from "@/hooks/useRole";
import { getPrimaryRole } from "@/lib/roles";

const RoleHome = () => {
  const { roles, loading } = useRoles();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const primary = getPrimaryRole(roles);

  switch (primary) {
    case "principal":
    case "vice_principal":
    case "hod":
    case "exam_officer":
    case "form_master":
    case "assistant_teacher":
    case "admin":
    case "staff":
      // For now, route these roles to the admin dashboard shell
      return <AdminIndex />;
    case "subject_teacher":
    case "teacher":
      return <TeacherDashboard />;
    case "student":
      return <StudentDashboard />;
    case "parent":
      // Parent dashboard not implemented; fallback to student view if available
      return <StudentDashboard />;
    default:
      // Fallback to admin for unknown roles
      return <AdminIndex />;
  }
};

export default RoleHome;
