import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";

const gradesData = [
  { subject: "Mathematics", grade: "A", score: "92%", credits: 4, teacher: "Mr. Johnson" },
  { subject: "English Literature", grade: "A-", score: "88%", credits: 3, teacher: "Ms. Davis" },
  { subject: "Physics", grade: "B+", score: "85%", credits: 4, teacher: "Dr. Smith" },
  { subject: "History", grade: "A", score: "94%", credits: 3, teacher: "Mr. Brown" },
  { subject: "Chemistry", grade: "B", score: "82%", credits: 4, teacher: "Dr. Wilson" },
  { subject: "Physical Education", grade: "A", score: "95%", credits: 2, teacher: "Coach Martinez" },
];

const getGradeColor = (grade: string) => {
  if (grade.startsWith("A")) return "default";
  if (grade.startsWith("B")) return "secondary";
  return "outline";
};

export function MyGrades() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5" />
          Current Grades
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Credits</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gradesData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.subject}</TableCell>
                <TableCell className="text-muted-foreground">{item.teacher}</TableCell>
                <TableCell>{item.score}</TableCell>
                <TableCell>
                  <Badge variant={getGradeColor(item.grade)} className="text-xs">
                    {item.grade}
                  </Badge>
                </TableCell>
                <TableCell>{item.credits}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
