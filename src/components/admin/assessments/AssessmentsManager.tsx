import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Users, FileText } from "lucide-react";

const upcomingAssessments = [
  {
    id: 1,
    title: "Mathematics Mid-Term Exam",
    class: "Class 10A",
    subject: "Mathematics",
    date: "2024-03-15",
    time: "09:00 AM",
    duration: "2 hours",
    students: 28,
    status: "Scheduled"
  },
  {
    id: 2,
    title: "English Literature Quiz",
    class: "Class 9B",
    subject: "English",
    date: "2024-03-12",
    time: "11:00 AM", 
    duration: "1 hour",
    students: 30,
    status: "Scheduled"
  },
  {
    id: 3,
    title: "Physics Lab Test",
    class: "Class 11A",
    subject: "Physics",
    date: "2024-03-18",
    time: "02:00 PM",
    duration: "1.5 hours",
    students: 25,
    status: "Draft"
  }
];

const completedAssessments = [
  {
    id: 4,
    title: "Chemistry Unit Test",
    class: "Class 12A", 
    subject: "Chemistry",
    date: "2024-02-28",
    avgScore: "78%",
    submitted: 24,
    total: 24,
    status: "Graded"
  },
  {
    id: 5,
    title: "History Assignment",
    class: "Class 10A",
    subject: "History", 
    date: "2024-02-25",
    avgScore: "82%",
    submitted: 26,
    total: 28,
    status: "Pending Review"
  }
];

export function AssessmentsManager() {
  return (
    <Tabs defaultValue="upcoming" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">Upcoming Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assessment</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingAssessments.map((assessment) => (
                  <TableRow key={assessment.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-foreground">{assessment.title}</div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline">{assessment.class}</Badge>
                          <span>•</span>
                          <span>{assessment.subject}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="w-3 h-3" />
                          <span>{assessment.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{assessment.time} ({assessment.duration})</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-primary" />
                        <span>{assessment.students}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={assessment.status === "Scheduled" ? "default" : "secondary"}
                        className={assessment.status === "Scheduled" ? "bg-success" : ""}
                      >
                        {assessment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button size="sm">Start</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="completed" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">Completed Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assessment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Results</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedAssessments.map((assessment) => (
                  <TableRow key={assessment.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-foreground">{assessment.title}</div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline">{assessment.class}</Badge>
                          <span>•</span>
                          <span>{assessment.subject}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{assessment.date}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">Avg: {assessment.avgScore}</div>
                        <div className="text-sm text-muted-foreground">
                          {assessment.submitted}/{assessment.total} submitted
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={assessment.status === "Graded" ? "default" : "secondary"}
                        className={assessment.status === "Graded" ? "bg-success" : "bg-warning"}
                      >
                        {assessment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <FileText className="w-3 h-3 mr-1" />
                          Report
                        </Button>
                        <Button size="sm">Review</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="analytics" className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Assessments</p>
                  <p className="text-2xl font-bold">127</p>
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
                  <p className="text-2xl font-bold">15</p>
                </div>
                <Calendar className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Score</p>
                  <p className="text-2xl font-bold">82%</p>
                </div>
                <Badge className="bg-success">+3%</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Reviews</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <Clock className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}