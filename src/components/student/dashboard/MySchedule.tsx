import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function MySchedule() {
  const { data: todaySchedule, isLoading } = useQuery({
    queryKey: ["today-schedule"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: studentData } = await supabase
        .from("students")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!studentData) return [];

      const { data: enrollments } = await supabase
        .from("enrollments")
        .select("class_id")
        .eq("student_id", studentData.id)
        .eq("status", "active");

      if (!enrollments || enrollments.length === 0) return [];

      const classIds = enrollments.map(e => e.class_id);
      const today = new Date().getDay() || 7; // 1-7, Sunday is 7

      const { data, error } = await supabase
        .from("timetable")
        .select(`
          *,
          classes:class_id (
            name,
            subject,
            room_number,
            teachers:teacher_id (
              profiles:user_id (
                full_name
              )
            )
          )
        `)
        .in("class_id", classIds)
        .eq("day_of_week", today)
        .order("start_time", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Today's Classes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : todaySchedule && todaySchedule.length > 0 ? (
          <div className="space-y-3">
            {todaySchedule.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-foreground">
                      {item.classes?.subject || item.classes?.name}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    {item.start_time} - {item.end_time} • {item.classes?.teachers?.profiles?.full_name}
                    {item.classes?.room_number && ` • Room ${item.classes.room_number}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">No classes today</div>
        )}
      </CardContent>
    </Card>
  );
}
