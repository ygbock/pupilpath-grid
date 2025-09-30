import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const gradebookData = [
  {
    id: 1,
    student: "Alice Johnson",
    admissionNo: "ST001",
    class: "10A",
    mathematics: { score: 85, grade: "A" },
    english: { score: 78, grade: "B+" },
    science: { score: 92, grade: "A+" },
    history: { score: 74, grade: "B" },
    overall: "A-"
  },
  {
    id: 2,
    student: "Bob Smith",
    admissionNo: "ST002",
    class: "10A",
    mathematics: { score: 76, grade: "B+" },
    english: { score: 82, grade: "A-" },
    science: { score: 79, grade: "B+" },
    history: { score: 88, grade: "A" },
    overall: "B+"
  },
  {
    id: 3,
    student: "Carol Davis",
    admissionNo: "ST003",
    class: "10A",
    mathematics: { score: 94, grade: "A+" },
    english: { score: 91, grade: "A+" },
    science: { score: 87, grade: "A" },
    history: { score: 85, grade: "A" },
    overall: "A+"
  }
];

export function GradebookView() {
  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "bg-success text-success-foreground";
    if (grade.startsWith("B")) return "bg-warning text-warning-foreground";
    if (grade.startsWith("C")) return "bg-info text-info-foreground";
    return "bg-destructive text-destructive-foreground";
  };

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
        
        <Select defaultValue="term1">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select Term" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="term1">Term 1</SelectItem>
            <SelectItem value="term2">Term 2</SelectItem>
            <SelectItem value="term3">Term 3</SelectItem>
          </SelectContent>
        </Select>
        
        <Input placeholder="Search students..." className="max-w-sm" />
        
        <Button>Export Grades</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">Grade Overview - Class 10A</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Mathematics</TableHead>
                <TableHead>English</TableHead>
                <TableHead>Science</TableHead>
                <TableHead>History</TableHead>
                <TableHead>Overall Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gradebookData.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-foreground">{student.student}</div>
                      <div className="text-sm text-muted-foreground">{student.admissionNo}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge className={getGradeColor(student.mathematics.grade)}>
                        {student.mathematics.grade}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {student.mathematics.score}%
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge className={getGradeColor(student.english.grade)}>
                        {student.english.grade}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {student.english.score}%
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge className={getGradeColor(student.science.grade)}>
                        {student.science.grade}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {student.science.score}%
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge className={getGradeColor(student.history.grade)}>
                        {student.history.grade}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {student.history.score}%
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getGradeColor(student.overall)} variant="secondary">
                      {student.overall}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}