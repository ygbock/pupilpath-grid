import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { StudentTable } from "@/components/students/StudentTable";
import { AttendanceTracker } from "@/components/attendance/AttendanceTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-hero rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Administrator</h1>
          <p className="text-white/90 text-lg">
            Here's what's happening at your school today
          </p>
        </div>

        {/* Statistics Overview */}
        <StatsCards />

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="grades">Grades</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <StudentTable />
              </div>
              <div>
                <RecentActivity />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="students">
            <StudentTable />
          </TabsContent>

          <TabsContent value="attendance">
            <AttendanceTracker />
          </TabsContent>

          <TabsContent value="grades">
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">Gradebook Coming Soon</h3>
              <p className="text-muted-foreground">
                Advanced gradebook and assessment management features will be available here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Index;
