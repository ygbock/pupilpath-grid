import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserCheck, BookOpen, CreditCard, AlertTriangle } from "lucide-react";

interface ActivityItem {
  id: string;
  type: 'attendance' | 'grade' | 'payment' | 'alert';
  title: string;
  description: string;
  time: string;
  user?: {
    name: string;
    avatar?: string;
  };
  status?: 'success' | 'warning' | 'error';
}

const activityIcons = {
  attendance: UserCheck,
  grade: BookOpen,
  payment: CreditCard,
  alert: AlertTriangle,
};

const statusColors = {
  success: 'bg-success text-success-foreground',
  warning: 'bg-warning text-warning-foreground',
  error: 'bg-destructive text-destructive-foreground',
};

export function RecentActivity() {
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'attendance',
      title: 'Class 5A Attendance Recorded',
      description: '28 out of 30 students present',
      time: '10 minutes ago',
      user: { name: 'Mrs. Sarah Johnson' },
      status: 'success',
    },
    {
      id: '2',
      type: 'grade',
      title: 'Math Test Grades Updated',
      description: 'Final grades for Chapter 7 test published',
      time: '1 hour ago',
      user: { name: 'Mr. David Wilson' },
      status: 'success',
    },
    {
      id: '3',
      type: 'payment',
      title: 'Fee Payment Received',
      description: 'John Smith - $250 term fee payment',
      time: '2 hours ago',
      status: 'success',
    },
    {
      id: '4',
      type: 'alert',
      title: 'Low Attendance Alert',
      description: 'Emma Davis - Below 75% attendance threshold',
      time: '3 hours ago',
      status: 'warning',
    },
    {
      id: '5',
      type: 'grade',
      title: 'Assignment Deadline Reminder',
      description: 'Science project due tomorrow for Class 8B',
      time: '4 hours ago',
      status: 'warning',
    },
  ];

  return (
    <Card className="bg-gradient-card border-0 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const Icon = activityIcons[activity.type];
          return (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground truncate">
                    {activity.title}
                  </p>
                  {activity.status && (
                    <Badge variant="secondary" className={`ml-2 text-xs ${statusColors[activity.status]}`}>
                      {activity.status}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <div className="flex items-center space-x-2 mt-1">
                  {activity.user && (
                    <>
                      <Avatar className="w-4 h-4">
                        <AvatarImage src={activity.user.avatar} />
                        <AvatarFallback className="text-xs bg-primary/20">
                          {activity.user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">{activity.user.name}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                    </>
                  )}
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}