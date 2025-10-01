import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Users, BookOpen, MapPin } from "lucide-react";

const timeSlots = [
  "8:00 - 8:45",
  "8:45 - 9:30", 
  "9:30 - 10:15",
  "10:15 - 10:30", // Break
  "10:30 - 11:15",
  "11:15 - 12:00",
  "12:00 - 12:45",
  "12:45 - 1:30", // Lunch
  "1:30 - 2:15",
  "2:15 - 3:00"
];

const timetableData = {
  Monday: [
    { subject: "Mathematics", teacher: "Mrs. Sarah Johnson", room: "Room 201" },
    { subject: "English", teacher: "Mrs. Emily Rodriguez", room: "Room 102" },
    { subject: "Physics", teacher: "Dr. Michael Chen", room: "Lab 1" },
    { subject: "Break", teacher: "", room: "" },
    { subject: "Chemistry", teacher: "Mr. David Wilson", room: "Lab 2" },
    { subject: "History", teacher: "Ms. Lisa Wang", room: "Room 301" },
    { subject: "Biology", teacher: "Dr. Robert Lee", room: "Lab 3" },
    { subject: "Lunch Break", teacher: "", room: "" },
    { subject: "Art", teacher: "Ms. Jennifer Brown", room: "Art Room" },
    { subject: "Physical Education", teacher: "Mr. James Smith", room: "Gym" }
  ],
  Tuesday: [
    { subject: "English", teacher: "Mrs. Emily Rodriguez", room: "Room 102" },
    { subject: "Mathematics", teacher: "Mrs. Sarah Johnson", room: "Room 201" },
    { subject: "Chemistry", teacher: "Mr. David Wilson", room: "Lab 2" },
    { subject: "Break", teacher: "", room: "" },
    { subject: "Physics", teacher: "Dr. Michael Chen", room: "Lab 1" },
    { subject: "Geography", teacher: "Mr. Thomas Green", room: "Room 205" },
    { subject: "History", teacher: "Ms. Lisa Wang", room: "Room 301" },
    { subject: "Lunch Break", teacher: "", room: "" },
    { subject: "Computer Science", teacher: "Mr. Alex Kumar", room: "Computer Lab" },
    { subject: "Music", teacher: "Ms. Anna Davis", room: "Music Room" }
  ]
};

export function TimetableManager() {
  const currentDay = "Monday";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 flex-wrap">
        <Select defaultValue="10A">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="9A">Class 9A</SelectItem>
            <SelectItem value="10A">Class 10A</SelectItem>
            <SelectItem value="11A">Class 11A</SelectItem>
            <SelectItem value="12A">Class 12A</SelectItem>
          </SelectContent>
        </Select>
        
        <Select defaultValue="monday">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select Day" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monday">Monday</SelectItem>
            <SelectItem value="tuesday">Tuesday</SelectItem>
            <SelectItem value="wednesday">Wednesday</SelectItem>
            <SelectItem value="thursday">Thursday</SelectItem>
            <SelectItem value="friday">Friday</SelectItem>
          </SelectContent>
        </Select>
        
        <Button>Edit Timetable</Button>
        <Button variant="outline">Print Schedule</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Class 10A - {currentDay} Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">Time</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeSlots.map((time, index) => {
                const scheduleItem = timetableData[currentDay][index];
                const isBreak = scheduleItem.subject.includes("Break");
                
                return (
                  <TableRow key={index} className={isBreak ? "bg-muted/50" : ""}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">{time}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {isBreak ? (
                        <Badge variant="outline" className="bg-muted">
                          {scheduleItem.subject}
                        </Badge>
                      ) : (
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-primary" />
                          <span className="font-medium">{scheduleItem.subject}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {scheduleItem.teacher && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-secondary" />
                          <span>{scheduleItem.teacher}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {scheduleItem.room && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-info" />
                          <span>{scheduleItem.room}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {!isBreak && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            Remove
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Teacher Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                <span>Mrs. Sarah Johnson</span>
                <Badge className="bg-success">Available</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                <span>Dr. Michael Chen</span>
                <Badge className="bg-warning">Busy</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                <span>Mrs. Emily Rodriguez</span>
                <Badge className="bg-success">Available</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Room Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                <span>Lab 1 (Physics)</span>
                <Badge className="bg-destructive">Occupied</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                <span>Room 205</span>
                <Badge className="bg-success">Available</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                <span>Art Room</span>
                <Badge className="bg-success">Available</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}