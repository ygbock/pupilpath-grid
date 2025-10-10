import {
  Users,
  GraduationCap,
  Calendar,
  BookOpen,
  Settings as SettingsIcon,
  FileText,
  CreditCard,
  IdCard,
  BarChart3,
  UserCheck,
  School,
  ClipboardList,
  Clock,
  Award,
} from "lucide-react";
import type { Permission } from "@/rbac/permissions";
import { INVITES_ENABLED } from "@/lib/config";

export interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  required?: Permission | Permission[]; // permissions required to see the item
  roles?: string[]; // roles for which this item appears; if omitted, visible to all roles (subject to permissions)
  badge?: string; // optional small badge text for counts/labels
}

export function getNavItems(): NavItem[] {
  const items: NavItem[] = [
    // Admin-like root sections (permission-gated)
    { title: "Students", url: "/students", icon: Users, required: "students.manage" },
    { title: "Teachers", url: "/teachers", icon: GraduationCap, required: "teachers.manage" },
    { title: "Classes & Sections", url: "/classes", icon: School, required: "classes.manage" },
    { title: "Attendance", url: "/attendance", icon: UserCheck, required: "attendance.view" },
    { title: "Gradebook", url: "/gradebook", icon: BookOpen, required: "gradebook.view" },
    { title: "Assessments", url: "/assessments", icon: ClipboardList, required: "assessments.manage" },
    { title: "Fee Management", url: "/fees", icon: CreditCard, required: "fees.manage" },
    { title: "ID Cards", url: "/id-cards", icon: IdCard, required: "idcards.view" },
    { title: "Timetable", url: "/timetable", icon: Calendar, required: "timetable.view" },
    { title: "Reports", url: "/reports", icon: FileText, required: "reports.view" },
    { title: "Settings", url: "/settings", icon: SettingsIcon, required: "settings.manage" },
    { title: "Create User", url: "/admin/create-user", icon: Users, required: "users.manage" },
    // Optional invites
    ...(INVITES_ENABLED ? [{ title: "Invites", url: "/admin/invites", icon: ClipboardList, required: "invites.manage" } as NavItem] : []),

    // Teacher
    { title: "Dashboard", url: "/teacher/dashboard", icon: BarChart3, roles: ["teacher", "subject_teacher", "assistant_teacher", "form_master"] },
    { title: "My Classes", url: "/teacher/classes", icon: School, roles: ["teacher", "subject_teacher", "assistant_teacher", "form_master"] },
    { title: "Attendance", url: "/teacher/attendance", icon: UserCheck, roles: ["teacher", "subject_teacher", "assistant_teacher", "form_master"] },
    { title: "Gradebook", url: "/teacher/gradebook", icon: BookOpen, roles: ["teacher", "subject_teacher", "assistant_teacher", "form_master"] },
    { title: "Assessments", url: "/teacher/assessments", icon: ClipboardList, roles: ["teacher", "subject_teacher", "assistant_teacher", "form_master"] },
    { title: "Timetable", url: "/teacher/timetable", icon: Calendar, roles: ["teacher", "subject_teacher", "assistant_teacher", "form_master"] },
    { title: "Students", url: "/teacher/students", icon: Users, roles: ["teacher", "subject_teacher", "assistant_teacher", "form_master"] },

    // Student
    { title: "Dashboard", url: "/student/dashboard", icon: BarChart3, roles: ["student"] },
    { title: "My Classes", url: "/student/classes", icon: School, roles: ["student"] },
    { title: "My Grades", url: "/student/grades", icon: Award, roles: ["student"] },
    { title: "Attendance", url: "/student/attendance", icon: Clock, roles: ["student"] },
    { title: "Timetable", url: "/student/timetable", icon: Calendar, roles: ["student"] },
    { title: "Assignments", url: "/student/assignments", icon: ClipboardList, roles: ["student"] },

    // Parent
    { title: "Dashboard", url: "/", icon: BarChart3, roles: ["parent"] },
    { title: "My Children", url: "/children", icon: Users, roles: ["parent"] },
    { title: "Attendance", url: "/attendance", icon: Clock, roles: ["parent"] },
    { title: "Grades", url: "/grades", icon: Award, roles: ["parent"] },
    { title: "Fee Payments", url: "/fees", icon: CreditCard, roles: ["parent"] },
    { title: "Timetable", url: "/timetable", icon: Calendar, roles: ["parent"] },
  ];

  return items;
}
