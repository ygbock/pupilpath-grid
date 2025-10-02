import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Clock, BookOpen, TrendingUp } from "lucide-react";

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

export function StudentStatsCards() {
  const stats = [
    {
      title: "Overall GPA",
      value: "3.85",
      subtitle: "Top 10% of class",
      icon: Award,
    },
    {
      title: "Attendance",
      value: "95%",
      subtitle: "This semester",
      icon: Clock,
    },
    {
      title: "Active Courses",
      value: "6",
      subtitle: "Current semester",
      icon: BookOpen,
    },
    {
      title: "Grade Trend",
      value: "+5%",
      subtitle: "Compared to last semester",
      icon: TrendingUp,
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
