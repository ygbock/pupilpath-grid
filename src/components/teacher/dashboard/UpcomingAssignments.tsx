import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList } from "lucide-react";

const assignmentsData = [
  { title: "Midterm Exam Grading", class: "Calculus", submissions: 28, total: 30, dueDate: "Today" },
  { title: "Chapter 5 Quiz", class: "Algebra II", submissions: 25, total: 32, dueDate: "Tomorrow" },
  { title: "Project Review", class: "Statistics", submissions: 18, total: 25, dueDate: "Dec 20" },
  { title: "Homework Set 12", class: "Geometry", submissions: 22, total: 28, dueDate: "Dec 22" },
];

export function UpcomingAssignments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5" />
          Assignments to Grade
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {assignmentsData.map((assignment, index) => (
            <div key={index} className="p-3 rounded-lg border bg-card hover:bg-accent transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-foreground">{assignment.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{assignment.class}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {assignment.dueDate}
                </Badge>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${(assignment.submissions / assignment.total) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {assignment.submissions}/{assignment.total}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
