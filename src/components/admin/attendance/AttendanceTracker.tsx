import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Check, X, Clock, Save } from "lucide-react";

interface StudentAttendance {
  id: string;
  name: string;
  rollNo: string;
  avatar?: string;
  status: 'present' | 'absent' | 'late' | null;
}

const mockStudents: StudentAttendance[] = [
  { id: '1', name: 'Alice Johnson', rollNo: '001', status: null },
  { id: '2', name: 'Bob Smith', rollNo: '002', status: null },
  { id: '3', name: 'Charlie Brown', rollNo: '003', status: null },
  { id: '4', name: 'Diana Wilson', rollNo: '004', status: null },
  { id: '5', name: 'Edward Davis', rollNo: '005', status: null },
  { id: '6', name: 'Fiona Clark', rollNo: '006', status: null },
  { id: '7', name: 'George Miller', rollNo: '007', status: null },
  { id: '8', name: 'Hannah White', rollNo: '008', status: null },
];

const statusConfig = {
  present: { label: 'Present', color: 'bg-success text-success-foreground', icon: Check },
  absent: { label: 'Absent', color: 'bg-destructive text-destructive-foreground', icon: X },
  late: { label: 'Late', color: 'bg-warning text-warning-foreground', icon: Clock },
};

export function AttendanceTracker() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [students, setStudents] = useState<StudentAttendance[]>(mockStudents);
  const [selectedClass, setSelectedClass] = useState('Grade 5A');

  const updateAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setStudents(prev => prev.map(student => 
      student.id === studentId ? { ...student, status } : student
    ));
  };

  const markAllPresent = () => {
    setStudents(prev => prev.map(student => ({ ...student, status: 'present' as const })));
  };

  const getStatusCounts = () => {
    const present = students.filter(s => s.status === 'present').length;
    const absent = students.filter(s => s.status === 'absent').length;
    const late = students.filter(s => s.status === 'late').length;
    const unmarked = students.filter(s => s.status === null).length;
    
    return { present, absent, late, unmarked, total: students.length };
  };

  const counts = getStatusCounts();

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card className="bg-gradient-card border-0 shadow-md">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
            <div>
              <CardTitle className="text-xl font-semibold">Attendance Tracker</CardTitle>
              <p className="text-muted-foreground">Class: {selectedClass}</p>
            </div>
            <div className="flex gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("justify-start text-left font-normal")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Button onClick={markAllPresent} variant="outline">
                Mark All Present
              </Button>
              <Button className="bg-gradient-primary">
                <Save className="w-4 h-4 mr-2" />
                Save Attendance
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-card border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{counts.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">{counts.present}</div>
            <div className="text-sm text-muted-foreground">Present</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">{counts.absent}</div>
            <div className="text-sm text-muted-foreground">Absent</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">{counts.late}</div>
            <div className="text-sm text-muted-foreground">Late</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-muted-foreground">{counts.unmarked}</div>
            <div className="text-sm text-muted-foreground">Unmarked</div>
          </CardContent>
        </Card>
      </div>

      {/* Student List */}
      <Card className="bg-gradient-card border-0 shadow-md">
        <CardHeader>
          <CardTitle>Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-background hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={student.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{student.name}</div>
                    <div className="text-sm text-muted-foreground">Roll No: {student.rollNo}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {student.status && (
                    <Badge className={statusConfig[student.status].color}>
                      {statusConfig[student.status].label}
                    </Badge>
                  )}
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant={student.status === 'present' ? 'default' : 'outline'}
                      onClick={() => updateAttendance(student.id, 'present')}
                      className={student.status === 'present' ? 'bg-success hover:bg-success/90' : ''}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={student.status === 'late' ? 'default' : 'outline'}
                      onClick={() => updateAttendance(student.id, 'late')}
                      className={student.status === 'late' ? 'bg-warning hover:bg-warning/90' : ''}
                    >
                      <Clock className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={student.status === 'absent' ? 'default' : 'outline'}
                      onClick={() => updateAttendance(student.id, 'absent')}
                      className={student.status === 'absent' ? 'bg-destructive hover:bg-destructive/90' : ''}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}