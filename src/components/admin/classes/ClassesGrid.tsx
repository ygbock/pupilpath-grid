import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { toast as defaultToast } from "@/hooks/use-toast";
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
  const navigate = useNavigate();
  const [items, setItems] = useState(() => classes);
  const [selectedClass, setSelectedClass] = useState<any | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [manageClass, setManageClass] = useState<any | null>(null);
  const [formValues, setFormValues] = useState({ name: '', teacher: '' });
  const [formErrors, setFormErrors] = useState<{ name?: string; teacher?: string }>({});
  // prefer a global toast if provided on window, otherwise use the imported default
  const toast = (window as any).__TOAST__?.toast ?? defaultToast;

  function handleViewDetails(cls: any) {
    setSelectedClass(cls);
    setIsViewOpen(true);
  }

  function handleEditClass(cls: any) {
    setSelectedClass(cls);
    setIsEditOpen(true);
  }

  function handleManageStudents(cls: any) {
    setManageClass(cls);
    setIsManageOpen(true);
  }

  function handleViewTimetable(cls: any) {
    navigate(`/admin/classes/${cls.id}/timetable`);
  }

  function handleDeleteClass(cls: any) {
    setDeletingClass(cls);
    setIsDeleteOpen(true);
  }

  const [deletingClass, setDeletingClass] = useState<any | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const confirmDeleteClass = () => {
    if (!deletingClass) return;
    setItems(prev => prev.filter(c => c.id !== deletingClass.id));
    setIsDeleteOpen(false);
    toast({ title: `${deletingClass.name} deleted` });
    setDeletingClass(null);
  };

  function handleViewStudentsButton(cls: any) {
    setSelectedClass(cls);
    setIsViewOpen(true);
  }

  function handleManageButton(cls: any) {
    setManageClass(cls);
    setIsManageOpen(true);
  }

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const selectAll = () => {
    setSelectedIds(items.map(i => i.id));
  };

  const clearSelection = () => setSelectedIds([]);

  const exportSelected = () => {
    const rows = items.filter(i => selectedIds.includes(i.id));
    if (rows.length === 0) return toast({ title: 'No items selected' });
    const headers = ['id', 'name', 'level', 'teacher', 'students', 'subjects', 'room'];
    const csv = [headers.join(',')].concat(rows.map(r => [r.id, r.name, r.level, r.teacher, r.students, r.subjects, r.room].map(v => String(v).includes(',') ? '"'+String(v).replace(/"/g,'""')+'"' : v).join(','))).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `classes_export_${new Date().toISOString().slice(0,10)}.csv`; a.click(); a.remove(); URL.revokeObjectURL(url);
    toast({ title: `Exported ${rows.length} classes` });
  };

  const confirmBulkDelete = () => setIsBulkDeleteOpen(true);

  const doBulkDelete = () => {
    setItems(prev => prev.filter(i => !selectedIds.includes(i.id)));
    setIsBulkDeleteOpen(false);
    toast({ title: `Deleted ${selectedIds.length} classes` });
    clearSelection();
  };

  const openEdit = (cls: any) => {
    setSelectedClass(cls);
    setFormValues({ name: cls.name, teacher: cls.teacher });
    setFormErrors({});
    setIsEditOpen(true);
  };

  const saveEdit = () => {
    const errors: any = {};
    if (!formValues.name) errors.name = 'Name is required';
    if (!formValues.teacher) errors.teacher = 'Teacher is required';
    setFormErrors(errors);
    if (Object.keys(errors).length) return;
    setItems(prev => prev.map(it => it.id === selectedClass.id ? { ...it, name: formValues.name, teacher: formValues.teacher } : it));
    setIsEditOpen(false);
    toast({ title: 'Class updated' });
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={selectAll}>Select all</Button>
          <Button variant="ghost" size="sm" onClick={clearSelection}>Clear</Button>
          <Button size="sm" onClick={exportSelected}>Export Selected</Button>
          <Button variant="destructive" size="sm" onClick={confirmBulkDelete} disabled={selectedIds.length===0}>Delete Selected</Button>
        </div>
        <div className="text-sm text-muted-foreground">{selectedIds.length} selected</div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((classItem) => (
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
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={selectedIds.includes(classItem.id)} onChange={() => toggleSelect(classItem.id)} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(classItem)}>
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openEdit(classItem)}>
                      Edit Class
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleManageStudents(classItem)}>
                      Manage Students
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleViewTimetable(classItem)}>
                      View Timetable
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClass(classItem)}>
                      Delete Class
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleViewStudentsButton(classItem)}>
                  View Students
                </Button>
                <Button size="sm" className="flex-1" onClick={() => handleManageButton(classItem)}>
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Class Details</DialogTitle>
          </DialogHeader>
          {selectedClass && (
            <div className="space-y-3">
              <div className="text-lg font-semibold">{selectedClass.name}</div>
              <div className="text-sm text-muted-foreground">Level: {selectedClass.level}</div>
              <div className="text-sm">Teacher: {selectedClass.teacher}</div>
              <div className="text-sm">Students: {selectedClass.students}</div>
              <div className="text-sm">Subjects: {selectedClass.subjects}</div>
              <div className="text-sm">Room: {selectedClass.room}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog (controlled form) */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
          </DialogHeader>
          {selectedClass && (
            <div className="space-y-3">
              <label className="block text-sm font-medium">Name</label>
              <input value={formValues.name} onChange={(e) => setFormValues(v => ({ ...v, name: e.target.value }))} className="input w-full" />
              {formErrors.name && <div className="text-xs text-destructive">{formErrors.name}</div>}
              <label className="block text-sm font-medium">Teacher</label>
              <input value={formValues.teacher} onChange={(e) => setFormValues(v => ({ ...v, teacher: e.target.value }))} className="input w-full" />
              {formErrors.teacher && <div className="text-xs text-destructive">{formErrors.teacher}</div>}
              <div className="flex gap-2 pt-2">
                <Button onClick={saveEdit}>Save</Button>
                <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Manage Modal */}
      <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Class</DialogTitle>
          </DialogHeader>
          {manageClass && (
            <div className="space-y-3">
              <div className="text-lg font-semibold">{manageClass.name}</div>
              <div className="text-sm">Teacher: {manageClass.teacher}</div>
              <div className="flex gap-2">
                <Button onClick={() => { navigate(`/admin/classes/${manageClass.id}/students`); setIsManageOpen(false); }}>Open Students</Button>
                <Button onClick={() => { navigate(`/admin/classes/${manageClass.id}/timetable`); setIsManageOpen(false); }}>Open Timetable</Button>
                <Button variant="ghost" onClick={() => { setIsManageOpen(false); setManageClass(null); }}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Dialog */}
      <AlertDialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete selected classes</AlertDialogTitle>
            <div className="text-sm text-muted-foreground">Are you sure you want to delete {selectedIds.length} selected classes?</div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive" onClick={doBulkDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete class</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete {deletingClass?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive" onClick={confirmDeleteClass}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}