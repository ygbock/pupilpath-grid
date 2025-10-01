import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StudentForm } from "@/components/admin/forms/StudentForm";
import { Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Plus, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Student {
  id: string;
  admissionNo: string;
  name: string;
  class: string;
  section: string;
  rollNo: string;
  attendance: number;
  status: 'active' | 'inactive' | 'transferred';
  guardian: string;
  phone: string;
  avatar?: string;
}

const mockStudents: Student[] = [
  {
    id: '1',
    admissionNo: 'ADM001',
    name: 'Alice Johnson',
    class: 'Grade 5',
    section: 'A',
    rollNo: '001',
    attendance: 95,
    status: 'active',
    guardian: 'Robert Johnson',
    phone: '+1 (555) 123-4567',
  },
  {
    id: '2',
    admissionNo: 'ADM002',
    name: 'Bob Smith',
    class: 'Grade 5',
    section: 'A',
    rollNo: '002',
    attendance: 87,
    status: 'active',
    guardian: 'Mary Smith',
    phone: '+1 (555) 234-5678',
  },
  {
    id: '3',
    admissionNo: 'ADM003',
    name: 'Charlie Brown',
    class: 'Grade 5',
    section: 'B',
    rollNo: '003',
    attendance: 92,
    status: 'active',
    guardian: 'David Brown',
    phone: '+1 (555) 345-6789',
  },
  {
    id: '4',
    admissionNo: 'ADM004',
    name: 'Diana Wilson',
    class: 'Grade 6',
    section: 'A',
    rollNo: '001',
    attendance: 78,
    status: 'active',
    guardian: 'Linda Wilson',
    phone: '+1 (555) 456-7890',
  },
  {
    id: '5',
    admissionNo: 'ADM005',
    name: 'Edward Davis',
    class: 'Grade 6',
    section: 'B',
    rollNo: '002',
    attendance: 89,
    status: 'inactive',
    guardian: 'Patricia Davis',
    phone: '+1 (555) 567-8901',
  },
];

const statusColors = {
  active: 'bg-success text-success-foreground',
  inactive: 'bg-warning text-warning-foreground',
  transferred: 'bg-destructive text-destructive-foreground',
};

export function StudentTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const navigate = useNavigate();

  // dialog & alert state
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (student: Student) => {
    // navigate to a details page (assumes route exists)
    navigate(`/admin/students/${student.id}`);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setIsEditOpen(true);
  };

  const handleDelete = (student: Student) => {
    setDeletingStudent(student);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!deletingStudent) return;
    setStudents(prev => prev.filter(s => s.id !== deletingStudent.id));
    setIsDeleteOpen(false);
    setDeletingStudent(null);
    toast({ title: "Student deleted", description: `Deleted ${deletingStudent.name}` });
  };

  const handleUpdateStudent = (data: any) => {
    if (!editingStudent) return;
    // For demo, merge fields into the name/admission/class/guardian/phone where applicable
    const updated = {
      ...editingStudent,
      name: `${data.firstName} ${data.lastName}`,
      admissionNo: data.admissionNo ?? editingStudent.admissionNo,
      class: data.class ?? editingStudent.class,
      guardian: data.parentName ?? editingStudent.guardian,
      phone: data.parentPhone ?? editingStudent.phone,
    } as Student;
    setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
    setIsEditOpen(false);
    setEditingStudent(null);
    toast({ title: "Student updated", description: `Updated ${updated.name}` });
  };

  const exportStudents = (items: Student[]) => {
    if (!items || items.length === 0) {
      toast({ title: "No students to export" });
      return;
    }

    const headers = [
      'id', 'admissionNo', 'name', 'class', 'section', 'rollNo', 'attendance', 'status', 'guardian', 'phone'
    ];

    const csvRows = [headers.join(',')];

    for (const s of items) {
      const row = [
        s.id,
        escapeCsv(s.admissionNo),
        escapeCsv(s.name),
        escapeCsv(s.class),
        escapeCsv(s.section),
        escapeCsv(s.rollNo),
        String(s.attendance),
        escapeCsv(s.status),
        escapeCsv(s.guardian),
        escapeCsv(s.phone),
      ];
      csvRows.push(row.join(','));
    }

    const csv = csvRows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_export_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    toast({ title: 'Exported students', description: `Exported ${items.length} students` });
  };

  const escapeCsv = (v: any) => {
    if (v === null || v === undefined) return '';
    const s = String(v);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 90) return 'text-success';
    if (attendance >= 75) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <Card className="bg-gradient-card border-0 shadow-md">
      <CardHeader>
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <CardTitle className="text-xl font-semibold">Student Management</CardTitle>
          <div className="flex gap-2">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border bg-background">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold">Student</TableHead>
                <TableHead className="font-semibold">Admission No.</TableHead>
                <TableHead className="font-semibold">Class</TableHead>
                <TableHead className="font-semibold">Roll No.</TableHead>
                <TableHead className="font-semibold">Attendance</TableHead>
                <TableHead className="font-semibold">Guardian</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id} className="hover:bg-accent/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">{student.phone}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{student.admissionNo}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{student.class}</div>
                      <div className="text-sm text-muted-foreground">Section {student.section}</div>
                    </div>
                  </TableCell>
                  <TableCell>{student.rollNo}</TableCell>
                  <TableCell>
                    <span className={`font-medium ${getAttendanceColor(student.attendance)}`}>
                      {student.attendance}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{student.guardian}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[student.status]}>
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => exportStudents(filteredStudents)}>
                          <Download className="w-4 h-4 mr-2" />
                          Export CSV
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleView(student)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(student)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Student
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(student)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>
          {editingStudent && (
            <StudentForm
              initialData={{
                firstName: editingStudent.name.split(' ')[0] ?? '',
                lastName: editingStudent.name.split(' ').slice(1).join(' ') ?? '',
                admissionNo: editingStudent.admissionNo,
                email: '',
                dateOfBirth: '',
                gender: 'male',
                bloodGroup: '',
                class: editingStudent.class,
                section: editingStudent.section,
                parentName: editingStudent.guardian,
                parentEmail: '',
                parentPhone: editingStudent.phone,
                address: '',
              }}
              onSubmit={handleUpdateStudent}
              onCancel={() => { setIsEditOpen(false); setEditingStudent(null); }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete {deletingStudent?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive" onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}