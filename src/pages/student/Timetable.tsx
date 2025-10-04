import { DashboardLayout } from "@/components/admin/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function StudentTimetable() {
  const { data: timetableData, isLoading } = useQuery({
    queryKey: ["student-timetable"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: studentData } = await supabase
        .from("students")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!studentData) return [];

      // Get enrolled classes
      const { data: enrollments } = await supabase
        .from("enrollments")
        .select("class_id")
        .eq("student_id", studentData.id)
        .eq("status", "active");

      if (!enrollments || enrollments.length === 0) return [];

      const classIds = enrollments.map(e => e.class_id);

      // Get timetable for enrolled classes
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
        .order("day_of_week", { ascending: true })
        .order("start_time", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const groupByDay = () => {
    if (!timetableData) return {};
    
    return timetableData.reduce((acc: any, item: any) => {
      const day = daysOfWeek[item.day_of_week - 1];
      if (!acc[day]) acc[day] = [];
      acc[day].push(item);
      return acc;
    }, {});
  };

  const groupedData = groupByDay();

  return (
    <DashboardLayout userRole="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Timetable</h1>
          <p className="text-muted-foreground mt-1">View your weekly class schedule</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading timetable...</div>
        ) : Object.keys(groupedData).length > 0 ? (
          <div className="grid gap-6">
            {daysOfWeek.map((day) => {
              const dayClasses = groupedData[day];
              if (!dayClasses || dayClasses.length === 0) return null;

              return (
                <Card key={day}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      {day}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {dayClasses.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-foreground">
                                {item.classes?.subject || item.classes?.name}
                              </h4>
                              <Badge variant="outline">{item.classes?.name}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {item.start_time} - {item.end_time}
                                </span>
                              </div>
                              <span>•</span>
                              <span>{item.classes?.teachers?.profiles?.full_name || "N/A"}</span>
                              {item.classes?.room_number && (
                                <>
                                  <span>•</span>
                                  <span>Room {item.classes.room_number}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No timetable available</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
