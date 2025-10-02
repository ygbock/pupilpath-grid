import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const assignmentsData = [
  { title: "Math Problem Set 15", subject: "Mathematics", dueDate: "Today", status: "pending" },
  { title: "English Essay", subject: "English Literature", dueDate: "Tomorrow", status: "pending" },
  { title: "Physics Lab Report", subject: "Physics", dueDate: "Dec 20", status: "submitted" },
  { title: "History Research Paper", subject: "History", dueDate: "Dec 22", status: "pending" },
  { title: "Chemistry Homework", subject: "Chemistry", dueDate: "Dec 23", status: "submitted" },
];

export function MyAssignments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          My Assignments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {assignmentsData.map((assignment, index) => (
            <div key={index} className="p-3 rounded-lg border bg-card hover:bg-accent transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-foreground">{assignment.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{assignment.subject}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={assignment.status === "submitted" ? "default" : "outline"}
                    className="text-xs"
                  >
                    {assignment.status === "submitted" ? "Submitted" : assignment.dueDate}
                  </Badge>
                </div>
              </div>
              {assignment.status === "pending" && (
                <Button size="sm" className="mt-2 w-full" variant="outline">
                  Submit Assignment
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
