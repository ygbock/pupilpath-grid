export type AppRole =
  | "principal"
  | "vice_principal"
  | "hod"
  | "exam_officer"
  | "form_master"
  | "subject_teacher"
  | "assistant_teacher"
  | "admin"
  | "staff"
  | "teacher"
  | "student"
  | "parent";

// Highest priority first
export const ROLE_PRIORITY: AppRole[] = [
  "principal",
  "vice_principal",
  "hod",
  "exam_officer",
  "form_master",
  "subject_teacher",
  "assistant_teacher",
  "admin",
  "staff",
  "teacher",
  "student",
  "parent",
];

export function getPrimaryRole(roles: string[] | null | undefined): AppRole | null {
  if (!roles || roles.length === 0) return null;
  for (const r of ROLE_PRIORITY) {
    if (roles.includes(r)) return r;
  }
  // fallback to first role if none in priority list
  return roles[0] as AppRole;
}
