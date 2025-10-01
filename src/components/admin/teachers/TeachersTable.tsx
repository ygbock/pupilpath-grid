import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Search, Mail, Phone, Eye, Edit, Layers, Slash } from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TeacherForm } from "@/components/admin/forms/TeacherForm";

interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  classes: string[];
  experience: string;
  status: string;
}

const initialTeachers: Teacher[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@school.edu",
    phone: "+1 234-567-8901",
    subject: "Mathematics",
    classes: ["Class 10A", "Class 10B"],
    experience: "8 years",
    status: "Active"
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@school.edu",
    phone: "+1 234-567-8902",
    subject: "Physics",
    classes: ["Class 11A", "Class 12A"],
    experience: "12 years",
    status: "Active"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.rodriguez@school.edu",
    phone: "+1 234-567-8903",
    subject: "English Literature",
    classes: ["Class 9A", "Class 9B", "Class 10A"],
    experience: "6 years",
    status: "On Leave"
  },
  {
    id: 4,
    name: "David Wilson",
    email: "david.wilson@school.edu",
    phone: "+1 234-567-8904",
    subject: "Chemistry",
    classes: ["Class 11B", "Class 12B"],
    experience: "15 years",
    status: "Active"
  }
];

export function TeachersTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [teachersState, setTeachersState] = useState<Teacher[]>(initialTeachers);
  const navigate = useNavigate();

  // dialog & alert state
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [assigningTeacher, setAssigningTeacher] = useState<Teacher | null>(null);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [assignInput, setAssignInput] = useState("");

  const [suspendingTeacher, setSuspendingTeacher] = useState<Teacher | null>(null);
  const [isSuspendOpen, setIsSuspendOpen] = useState(false);

  const filtered = teachersState.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (teacher: Teacher) => {
    navigate(`/admin/teachers/${teacher.id}`);
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setIsEditOpen(true);
  };

  const handleAssign = (teacher: Teacher) => {
    setAssigningTeacher(teacher);
    setAssignInput(teacher.classes.join(', '));
    setIsAssignOpen(true);
  };

  const handleSuspend = (teacher: Teacher) => {
    setSuspendingTeacher(teacher);
    setIsSuspendOpen(true);
  };

  const confirmSuspend = () => {
    if (!suspendingTeacher) return;
    setTeachersState(prev => prev.map(t => t.id === suspendingTeacher.id ? { ...t, status: 'Suspended' } : t));
    setIsSuspendOpen(false);
    setSuspendingTeacher(null);
  };

  const handleUpdateTeacher = (data: any) => {
    if (!editingTeacher) return;
    const updated: Teacher = {
      ...editingTeacher,
      name: `${data.firstName} ${data.lastName}`,
      email: data.email ?? editingTeacher.email,
      phone: data.phone ?? editingTeacher.phone,
      subject: data.specialization ?? editingTeacher.subject,
    };
    setTeachersState(prev => prev.map(t => t.id === updated.id ? updated : t));
    setIsEditOpen(false);
    setEditingTeacher(null);
  };

  const handleAssignSubmit = () => {
    if (!assigningTeacher) return;
    const classes = assignInput.split(',').map(s => s.trim()).filter(Boolean);
    setTeachersState(prev => prev.map(t => t.id === assigningTeacher.id ? { ...t, classes } : t));
    setIsAssignOpen(false);
    setAssigningTeacher(null);
    setAssignInput("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder="Search teachers..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">Teaching Staff</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Classes</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">{teacher.name}</div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span>{teacher.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{teacher.phone}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{teacher.subject}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {teacher.classes.map((className) => (
                        <Badge key={className} variant="outline" className="text-xs">
                          {className}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{teacher.experience}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={teacher.status === "Active" ? "default" : "secondary"}
                      className={teacher.status === "Active" ? "bg-success text-success-foreground" : ""}
                    >
                      {teacher.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(teacher)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(teacher)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAssign(teacher)}>
                          <Layers className="w-4 h-4 mr-2" />
                          Assign Classes
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleSuspend(teacher)}>
                          <Slash className="w-4 h-4 mr-2" />
                          Suspend
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Teacher</DialogTitle>
          </DialogHeader>
          {editingTeacher && (
            <TeacherForm
              initialData={{
                firstName: editingTeacher.name.split(' ')[0] ?? '',
                lastName: editingTeacher.name.split(' ').slice(1).join(' ') ?? '',
                employeeId: String(editingTeacher.id),
                email: editingTeacher.email,
                phone: editingTeacher.phone,
                dateOfBirth: '',
                gender: 'male',
                qualification: '',
                specialization: editingTeacher.subject,
                joiningDate: '',
                designation: '',
                department: '',
                address: '',
                emergencyContact: '',
              }}
              onSubmit={handleUpdateTeacher}
              onCancel={() => { setIsEditOpen(false); setEditingTeacher(null); }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Assign Classes Dialog */}
      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Classes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Enter comma separated class names to assign to the teacher.</p>
            <Input value={assignInput} onChange={e => setAssignInput(e.target.value)} placeholder="Class 10A, Class 10B" />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setIsAssignOpen(false); setAssigningTeacher(null); setAssignInput(''); }}>Cancel</Button>
              <Button onClick={handleAssignSubmit}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Suspend Alert */}
      <AlertDialog open={isSuspendOpen} onOpenChange={setIsSuspendOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend teacher</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to suspend {suspendingTeacher?.name}? Suspended teachers will lose access to the system until reactivated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive" onClick={confirmSuspend}>Suspend</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}