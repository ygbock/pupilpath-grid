import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import { RoleBasedRoute } from "@/components/RoleBasedRoute";
import Auth from "./pages/Auth";
import Index from "./pages/admin/Index";
import Students from "./pages/admin/Students";
import Teachers from "./pages/admin/Teachers";
import Classes from "./pages/admin/Classes";
import Attendance from "./pages/admin/Attendance";
import Gradebook from "./pages/admin/Gradebook";
import Assessments from "./pages/admin/Assessments";
import FeeManagement from "./pages/admin/FeeManagement";
import Timetable from "./pages/admin/Timetable";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";
import NotFound from "./pages/admin/NotFound";
import AdminInvites from "./pages/admin/Invites";
import AcceptInvite from "./pages/AcceptInvite";
import CreateUser from "./pages/admin/CreateUser";
import { INVITES_ENABLED } from "@/lib/config";
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherClasses from "./pages/teacher/Classes";
import TeacherAttendance from "./pages/teacher/Attendance";
import TeacherGradebook from "./pages/teacher/Gradebook";
import TeacherAssessments from "./pages/teacher/Assessments";
import TeacherTimetable from "./pages/teacher/Timetable";
import TeacherStudents from "./pages/teacher/Students";
import StudentDashboard from "./pages/student/Dashboard";
import StudentClasses from "./pages/student/Classes";
import StudentGrades from "./pages/student/Grades";
import StudentAttendance from "./pages/student/Attendance";
import StudentTimetable from "./pages/student/Timetable";
import StudentAssignments from "./pages/student/Assignments";
import Dashboard from "@/pages/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          {INVITES_ENABLED && (
            <Route path="/invite/accept" element={<AcceptInvite />} />
          )}
          
          {/* Unified adaptive dashboard */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Routes */}
          <Route path="/" element={<AdminRoute><Index /></AdminRoute>} />
          <Route path="/students" element={<AdminRoute><Students /></AdminRoute>} />
          <Route path="/teachers" element={<AdminRoute><Teachers /></AdminRoute>} />
          <Route path="/classes" element={<AdminRoute><Classes /></AdminRoute>} />
          <Route path="/attendance" element={<AdminRoute><Attendance /></AdminRoute>} />
          <Route path="/gradebook" element={<AdminRoute><Gradebook /></AdminRoute>} />
          <Route path="/assessments" element={<AdminRoute><Assessments /></AdminRoute>} />
          <Route path="/fees" element={<AdminRoute><FeeManagement /></AdminRoute>} />
          <Route path="/timetable" element={<AdminRoute><Timetable /></AdminRoute>} />
          <Route path="/reports" element={<AdminRoute><Reports /></AdminRoute>} />
          <Route path="/settings" element={<AdminRoute><Settings /></AdminRoute>} />
          {INVITES_ENABLED && (
            <Route path="/admin/invites" element={<AdminRoute><AdminInvites /></AdminRoute>} />
          )}
          <Route path="/admin/create-user" element={<AdminRoute><CreateUser /></AdminRoute>} />
          
          {/* Teacher Routes */}
          <Route path="/teacher/dashboard" element={<ProtectedRoute><TeacherDashboard /></ProtectedRoute>} />
          <Route path="/teacher/classes" element={<ProtectedRoute><TeacherClasses /></ProtectedRoute>} />
          <Route path="/teacher/attendance" element={<ProtectedRoute><TeacherAttendance /></ProtectedRoute>} />
          <Route path="/teacher/gradebook" element={<ProtectedRoute><TeacherGradebook /></ProtectedRoute>} />
          <Route path="/teacher/assessments" element={<ProtectedRoute><TeacherAssessments /></ProtectedRoute>} />
          <Route path="/teacher/timetable" element={<ProtectedRoute><TeacherTimetable /></ProtectedRoute>} />
          <Route path="/teacher/students" element={<ProtectedRoute><TeacherStudents /></ProtectedRoute>} />
          
          {/* Student Routes */}
            <Route path="/student/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/classes" element={<ProtectedRoute><StudentClasses /></ProtectedRoute>} />
            <Route path="/student/grades" element={<ProtectedRoute><StudentGrades /></ProtectedRoute>} />
            <Route path="/student/attendance" element={<ProtectedRoute><StudentAttendance /></ProtectedRoute>} />
            <Route path="/student/timetable" element={<ProtectedRoute><StudentTimetable /></ProtectedRoute>} />
            <Route path="/student/assignments" element={<ProtectedRoute><StudentAssignments /></ProtectedRoute>} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
