import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import TeacherDashboard from "./pages/teacher/Dashboard";
import StudentDashboard from "./pages/student/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/students" element={<Students />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/gradebook" element={<Gradebook />} />
          <Route path="/assessments" element={<Assessments />} />
          <Route path="/fees" element={<FeeManagement />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* Teacher Routes */}
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          
          {/* Student Routes */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
