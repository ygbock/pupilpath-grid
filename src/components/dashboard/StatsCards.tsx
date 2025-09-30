import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, GraduationCap, UserCheck, CreditCard } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<{ className?: string }>;
}

function StatCard({ title, value, change, trend, icon: Icon }: StatCardProps) {
  const trendColor = trend === 'up' ? 'text-success' : 'text-destructive';
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;

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
        <div className="flex items-center space-x-1 text-xs">
          <TrendIcon className={`h-3 w-3 ${trendColor}`} />
          <span className={trendColor}>{change}</span>
          <span className="text-muted-foreground">from last month</span>
        </div>
      </CardContent>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary opacity-5 rounded-full transform translate-x-16 -translate-y-16" />
    </Card>
  );
}

export function StatsCards() {
  const stats = [
    {
      title: "Total Students",
      value: "1,234",
      change: "+12%",
      trend: 'up' as const,
      icon: Users,
    },
    {
      title: "Total Teachers",
      value: "89",
      change: "+2%",
      trend: 'up' as const,
      icon: GraduationCap,
    },
    {
      title: "Today's Attendance",
      value: "94.2%",
      change: "+1.2%",
      trend: 'up' as const,
      icon: UserCheck,
    },
    {
      title: "Outstanding Fees",
      value: "$12,340",
      change: "-8%",
      trend: 'down' as const,
      icon: CreditCard,
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