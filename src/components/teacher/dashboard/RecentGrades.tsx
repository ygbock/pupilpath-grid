import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

const gradesData = [
  { class: "Calculus", avgGrade: "85%", trend: "up", change: "+3%", students: 30 },
  { class: "Algebra II", avgGrade: "78%", trend: "up", change: "+2%", students: 32 },
  { class: "Geometry", avgGrade: "82%", trend: "down", change: "-1%", students: 28 },
  { class: "Statistics", avgGrade: "88%", trend: "up", change: "+5%", students: 25 },
  { class: "Mathematics 101", avgGrade: "80%", trend: "up", change: "+1%", students: 35 },
];

export function RecentGrades() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Class Performance Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Average Grade</TableHead>
              <TableHead>Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gradesData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.class}</TableCell>
                <TableCell>{item.students}</TableCell>
                <TableCell>{item.avgGrade}</TableCell>
                <TableCell>
                  <Badge
                    variant={item.trend === "up" ? "default" : "outline"}
                    className="text-xs"
                  >
                    {item.change}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
