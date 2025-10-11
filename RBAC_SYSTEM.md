# Role-Based Access Control (RBAC) System

## Overview
This application implements a modular, adaptive dashboard system that supports multiple overlapping roles per user with dynamic UI sections, routes, and actions based on role permissions.

## Role Hierarchy

### 1. **Principal** (Highest Authority)
- **Description**: Head of school with top-level administrative access
- **Permissions**: Full access (`*`)
- **Access**: All features across the entire system

### 2. **Vice Principal**
- **Description**: Assists principal with partial admin access
- **Key Permissions**:
  - `view_all_reports`
  - `approve_department_reports`
  - `manage_discipline`
  - `approve_results`
  - `view_dashboard`
  - `manage_timetable`

### 3. **HOD (Head of Department)**
- **Description**: Supervises teachers within a specific department
- **Key Permissions**:
  - `view_department_teachers`
  - `approve_scores`
  - `assign_subjects`
  - `view_department_reports`
  - `moderate_assessments`
- **Scope**: Limited to their assigned department

### 4. **Exam Officer**
- **Description**: Manages exam setup and results school-wide
- **Key Permissions**:
  - `manage_exam_results`
  - `lock_results`
  - `generate_reports`
  - `view_performance_trends`
  - `manage_exam_timetable`

### 5. **Form Master/Class Teacher**
- **Description**: Oversees a specific class
- **Key Permissions**:
  - `view_students`
  - `manage_class_attendance`
  - `approve_assessments`
  - `generate_reports`
  - `message_parents`
- **Scope**: Limited to their assigned class

### 6. **Subject Teacher**
- **Description**: Teaches specific subjects in one or more classes
- **Key Permissions**:
  - `view_students`
  - `record_subject_attendance`
  - `manage_assessments`
  - `view_results`
  - `view_timetable`

### 7. **Admin (System Role)**
- **Description**: System-level administrator
- **Permissions**: Full system access
- **Type**: User role (not staff role)

### 8. **Teacher (Base Role)**
- **Description**: General teacher access
- **Type**: User role that can be combined with staff roles

### 9. **Student**
- **Description**: Student access to view own data
- **Permissions**: View own grades, attendance, timetable, assignments

### 10. **Parent**
- **Description**: Parent/guardian access to view children's data
- **Permissions**: View children's attendance, grades, fees

## Technical Implementation

### Hooks

#### `useRoles()`
Returns user roles from the `user_roles` table (admin, teacher, student, parent).

```typescript
const { roles, loading, error } = useRoles();
```

#### `useStaffRoles()`
Returns staff roles from the `staff_role_assignments` table (Principal, VP, HOD, etc.).

```typescript
const { staffRoles, loading, error } = useStaffRoles();
```

#### `usePermissions()`
Returns all permissions for the current user based on their roles.

```typescript
const { permissions, loading, error } = usePermissions();
```

#### `useHasPermission(permission)`
Checks if user has a specific permission (or any from an array).

```typescript
const { hasPermission, loading, error } = useHasPermission('manage_assessments');
// or multiple permissions
const { hasPermission, loading, error } = useHasPermission(['view_students', 'manage_grades']);
```

### Route Guards

#### `<RoleBasedRoute>`
Protects routes based on user roles and/or staff roles.

```tsx
<RoleBasedRoute 
  allowedRoles={['admin', 'teacher']} 
  allowedStaffRoles={['Principal', 'HOD']}
  requireAll={false} // If true, user must have ALL roles. Default: false (ANY role)
>
  <ComponentToProtect />
</RoleBasedRoute>
```

### Dashboard Components

#### Adaptive Dashboard (`/dashboard`)
The unified dashboard that adapts to show relevant sections based on user's roles:
- Shows admin stats for admins/principals/VPs
- Shows teacher stats for teachers/subject teachers/form masters
- Shows student stats for students
- Quick actions based on role permissions
- Role badges showing all active roles

#### `DashboardLayout`
Accepts multiple roles and dynamically shows appropriate navigation:

```tsx
<DashboardLayout 
  userRoles={["admin", "teacher"]} 
  staffRoles={[{ name: "HOD" }, { name: "Subject Teacher" }]}
>
  {/* content */}
</DashboardLayout>
```

#### `DashboardSidebar`
Combines navigation items from all user's roles:
- Deduplicates navigation items
- Shows all accessible routes
- Displays primary role in sidebar header

## Database Structure

### Tables

#### `user_roles`
Maps users to base roles (admin, teacher, student, parent).

#### `staff`
Links users to staff records.

#### `staff_roles`
Defines staff role types (Principal, VP, HOD, etc.).

#### `staff_role_assignments`
Maps staff members to their staff roles (many-to-many).

#### `permissions`
Defines all available permissions in the system.

#### `role_permissions`
Maps staff roles to their permissions (many-to-many).

### Security Functions

#### `has_role(_user_id, _role)`
Security definer function to check if user has a specific user role.

#### `has_permission(_user_id, _permission)`
Security definer function to check if user has a specific permission through their staff roles.

## Usage Examples

### Example 1: Teacher with Multiple Roles
A teacher who is also a Form Master and Subject Teacher:
- **User Role**: `teacher`
- **Staff Roles**: `Form Master`, `Subject Teacher`
- **Dashboard Shows**: Teacher stats, class management tools, subject-specific tools
- **Navigation**: All teacher routes + class-specific routes
- **Permissions**: Combined permissions from both staff roles

### Example 2: Admin who is also Principal
- **User Role**: `admin`
- **Staff Role**: `Principal`
- **Permissions**: `*` (full access) from both roles
- **Dashboard**: Shows comprehensive admin dashboard with all stats

### Example 3: HOD who teaches
- **User Role**: `teacher`
- **Staff Role**: `HOD`, `Subject Teacher`
- **Dashboard**: Shows teacher stats + department management tools
- **Special Access**: Can view/approve department teachers, assign subjects
- **Navigation**: Teacher routes + department-specific routes

## Adding New Roles

1. Add the role to `staff_roles` table
2. Define permissions in `permissions` table
3. Map permissions to role in `role_permissions`
4. Update `DashboardSidebar` if new navigation items needed
5. Update `Dashboard.tsx` to show role-specific sections
6. Add route guards as needed

## Security Notes

- All role checks use security definer functions to prevent RLS recursion
- Permissions are checked server-side via RLS policies
- Multiple role support prevents privilege escalation
- Each user can have multiple overlapping roles
- Permissions are additive (union of all role permissions)
