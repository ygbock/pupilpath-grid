import type { AppRole } from "@/lib/roles";

export type Permission =
  | "dashboard.view"
  | "users.manage"
  | "students.manage"
  | "teachers.manage"
  | "classes.manage"
  | "attendance.view"
  | "attendance.record"
  | "gradebook.view"
  | "gradebook.manage"
  | "assessments.manage"
  | "fees.manage"
  | "timetable.view"
  | "timetable.manage"
  | "reports.view"
  | "settings.manage"
  | "invites.manage"
  | "idcards.view"
  | "idcards.manage";

export const ROLE_PERMISSIONS: Record<AppRole, Permission[]> = {
  principal: [
    "dashboard.view",
    "students.manage",
    "teachers.manage",
    "classes.manage",
    "attendance.view",
    "gradebook.view",
    "assessments.manage",
    "fees.manage",
    "timetable.manage",
    "reports.view",
    "settings.manage",
    "idcards.view",
  ],
  vice_principal: [
    "dashboard.view",
    "students.manage",
    "teachers.manage",
    "classes.manage",
    "attendance.view",
    "gradebook.view",
    "assessments.manage",
    "timetable.view",
    "reports.view",
  ],
  hod: [
    "dashboard.view",
    "attendance.view",
    "gradebook.view",
    "gradebook.manage",
    "assessments.manage",
    "reports.view",
    "timetable.view",
  ],
  exam_officer: [
    "dashboard.view",
    "assessments.manage",
    "gradebook.manage",
    "reports.view",
  ],
  form_master: [
    "dashboard.view",
    "attendance.record",
    "gradebook.manage",
    "timetable.view",
    "reports.view",
  ],
  subject_teacher: [
    "dashboard.view",
    "attendance.record",
    "gradebook.manage",
    "timetable.view",
  ],
  assistant_teacher: [
    "dashboard.view",
    "attendance.view",
    "gradebook.view",
    "timetable.view",
  ],
  admin: [
    "dashboard.view",
    "users.manage",
    "students.manage",
    "teachers.manage",
    "classes.manage",
    "attendance.view",
    "gradebook.view",
    "assessments.manage",
    "fees.manage",
    "timetable.manage",
    "reports.view",
    "settings.manage",
    "invites.manage",
    "idcards.view",
    "idcards.manage",
  ],
  staff: [
    "dashboard.view",
    "reports.view",
    "idcards.view",
  ],
  teacher: [
    "dashboard.view",
    "attendance.record",
    "gradebook.manage",
    "timetable.view",
  ],
  student: [
    "dashboard.view",
    "timetable.view",
    "attendance.view",
    "gradebook.view",
  ],
  parent: [
    "dashboard.view",
    "timetable.view",
    "attendance.view",
    "gradebook.view",
  ],
}
