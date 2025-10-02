import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

const scheduleData = [
  { time: "08:00 - 09:00", class: "Mathematics 101", room: "Room 204", status: "completed" },
  { time: "09:30 - 10:30", class: "Algebra II", room: "Room 204", status: "completed" },
  { time: "11:00 - 12:00", class: "Calculus", room: "Room 301", status: "current" },
  { time: "13:00 - 14:00", class: "Geometry", room: "Room 204", status: "upcoming" },
  { time: "14:30 - 15:30", class: "Statistics", room: "Room 205", status: "upcoming" },
];

export function TodaySchedule() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Today's Schedule
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
                  <span className="font-medium text-sm text-foreground">{item.class}</span>
                  {item.status === "current" && (
                    <Badge variant="default" className="text-xs">Now</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.time} • {item.room}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
