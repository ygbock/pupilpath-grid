import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, User, BookOpen, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const classes = [
  {
    id: 1,
    name: "Class 9A",
    level: "Junior Secondary",
    teacher: "Mrs. Emily Rodriguez",
    students: 32,
    subjects: 8,
    room: "Room 201"
  },
  {
    id: 2,
    name: "Class 9B",
    level: "Junior Secondary", 
    teacher: "Mr. James Smith",
    students: 30,
    subjects: 8,
    room: "Room 202"
  },
  {
    id: 3,
    name: "Class 10A",
    level: "Junior Secondary",
    teacher: "Mrs. Sarah Johnson",
    students: 28,
    subjects: 9,
    room: "Room 301"
  },
  {
    id: 4,
    name: "Class 10B",
    level: "Junior Secondary",
    teacher: "Mr. Robert Lee",
    students: 31,
    subjects: 9,
    room: "Room 302"
  },
  {
    id: 5,
    name: "Class 11A",
    level: "Senior Secondary",
    teacher: "Dr. Michael Chen",
    students: 25,
    subjects: 6,
    room: "Room 401"
  },
  {
    id: 6,
    name: "Class 12A",
    level: "Senior Secondary",
    teacher: "Mrs. Lisa Wang",
    students: 24,
    subjects: 6,
    room: "Room 501"
  }
];

export function ClassesGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {classes.map((classItem) => (
        <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">
                {classItem.name}
              </CardTitle>
              <Badge variant="outline" className="mt-1">
                {classItem.level}
              </Badge>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Edit Class</DropdownMenuItem>
                <DropdownMenuItem>Manage Students</DropdownMenuItem>
                <DropdownMenuItem>View Timetable</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Delete Class
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>Class Teacher: {classItem.teacher}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <div>
                  <div className="font-medium text-foreground">{classItem.students}</div>
                  <div className="text-xs text-muted-foreground">Students</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-secondary" />
                <div>
                  <div className="font-medium text-foreground">{classItem.subjects}</div>
                  <div className="text-xs text-muted-foreground">Subjects</div>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              📍 {classItem.room}
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1">
                View Students
              </Button>
              <Button size="sm" className="flex-1">
                Manage
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}