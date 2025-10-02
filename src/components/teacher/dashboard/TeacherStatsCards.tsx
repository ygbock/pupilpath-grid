import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, ClipboardList, CheckCircle } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

function StatCard({ title, value, subtitle, icon: Icon }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden bg-gradient-card border-0 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </CardContent>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary opacity-5 rounded-full transform translate-x-16 -translate-y-16" />
    </Card>
  );
}

export function TeacherStatsCards() {
  const stats = [
    {
      title: "Total Students",
      value: "156",
      subtitle: "Across 5 classes",
      icon: Users,
    },
    {
      title: "Classes Today",
      value: "4",
      subtitle: "2 more to go",
      icon: BookOpen,
    },
    {
      title: "Pending Assignments",
      value: "23",
      subtitle: "To grade this week",
      icon: ClipboardList,
    },
    {
      title: "Attendance Rate",
      value: "96.5%",
      subtitle: "This month",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
