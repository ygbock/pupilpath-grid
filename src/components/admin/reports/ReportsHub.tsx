import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Users, 
  GraduationCap, 
  TrendingUp, 
  Calendar,
  Download,
  Eye,
  BarChart3
} from "lucide-react";

const reportCategories = [
  {
    title: "Academic Reports",
    icon: GraduationCap,
    color: "text-primary",
    reports: [
      { name: "Student Performance Report", description: "Comprehensive academic performance analysis", lastGenerated: "2024-03-10" },
      { name: "Grade Distribution", description: "Subject-wise grade distribution across classes", lastGenerated: "2024-03-08" },
      { name: "Assessment Analytics", description: "Exam and test performance trends", lastGenerated: "2024-03-05" }
    ]
  },
  {
    title: "Attendance Reports",
    icon: Calendar,
    color: "text-success",
    reports: [
      { name: "Daily Attendance Summary", description: "Class-wise attendance for selected date range", lastGenerated: "2024-03-12" },
      { name: "Student Attendance History", description: "Individual student attendance patterns", lastGenerated: "2024-03-10" },
      { name: "Absenteeism Analysis", description: "Chronic absenteeism identification report", lastGenerated: "2024-03-07" }
    ]
  },
  {
    title: "Financial Reports",
    icon: TrendingUp,
    color: "text-warning",
    reports: [
      { name: "Fee Collection Report", description: "Monthly fee collection status and trends", lastGenerated: "2024-03-11" },
      { name: "Outstanding Dues", description: "List of pending fee payments by students", lastGenerated: "2024-03-12" },
      { name: "Revenue Analysis", description: "Financial overview and projections", lastGenerated: "2024-03-01" }
    ]
  },
  {
    title: "Administrative Reports",
    icon: Users,
    color: "text-info",
    reports: [
      { name: "Staff Directory", description: "Complete staff information and contact details", lastGenerated: "2024-03-09" },
      { name: "Student Enrollment Report", description: "Class-wise student enrollment statistics", lastGenerated: "2024-03-08" },
      { name: "Infrastructure Utilization", description: "Room and resource utilization analysis", lastGenerated: "2024-03-06" }
    ]
  }
];

export function ReportsHub() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reports</p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">23</p>
              </div>
              <BarChart3 className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <Calendar className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Downloads</p>
                <p className="text-2xl font-bold">1.2k</p>
              </div>
              <Download className="w-8 h-8 text-info" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        {reportCategories.map((category, categoryIndex) => (
          <Card key={categoryIndex}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl font-semibold text-foreground">
                <category.icon className={`w-6 h-6 ${category.color}`} />
                {category.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {category.reports.map((report, reportIndex) => (
                  <Card key={reportIndex} className="border-2 hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-foreground">{report.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {report.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            Last: {report.lastGenerated}
                          </Badge>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" className="flex-1">
                            <Download className="w-3 h-3 mr-1" />
                            Generate
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">Custom Report Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Build Custom Reports</h3>
            <p className="text-muted-foreground mb-6">
              Create personalized reports by selecting specific data points and criteria
            </p>
            <Button className="bg-primary hover:bg-primary/90">
              Start Building Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}