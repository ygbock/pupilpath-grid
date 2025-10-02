import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

const scheduleData = [
  { time: "08:00 - 09:00", subject: "Mathematics", teacher: "Mr. Johnson", room: "204", status: "completed" },
  { time: "09:30 - 10:30", subject: "English Literature", teacher: "Ms. Davis", room: "105", status: "completed" },
  { time: "11:00 - 12:00", subject: "Physics", teacher: "Dr. Smith", room: "301", status: "current" },
  { time: "13:00 - 14:00", subject: "History", teacher: "Mr. Brown", room: "108", status: "upcoming" },
  { time: "14:30 - 15:30", subject: "Chemistry", teacher: "Dr. Wilson", room: "302", status: "upcoming" },
];

export function MySchedule() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Today's Classes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {scheduleData.map((item, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                item.status === "current"
                  ? "bg-primary/10 border-primary"
                  : "bg-card hover:bg-accent transition-colors"
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-foreground">{item.subject}</span>
                  {item.status === "current" && (
                    <Badge variant="default" className="text-xs">Now</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.time} • {item.teacher} • Room {item.room}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
