import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const timetableFormSchema = z.object({
  class: z.string().min(1, "Class is required"),
  day: z.enum(["monday", "tuesday", "wednesday", "thursday", "friday"]),
  period: z.string().min(1, "Period is required"),
  subject: z.string().min(1, "Subject is required"),
  teacher: z.string().min(1, "Teacher is required"),
  room: z.string().min(1, "Room is required"),
});

type TimetableFormValues = z.infer<typeof timetableFormSchema>;

interface TimetableFormProps {
  initialData?: Partial<TimetableFormValues>;
  onSubmit: (data: TimetableFormValues) => void;
  onCancel?: () => void;
}

export function TimetableForm({ initialData, onSubmit, onCancel }: TimetableFormProps) {
  const form = useForm<TimetableFormValues>({
    resolver: zodResolver(timetableFormSchema),
    defaultValues: initialData || {
      class: "",
      day: "monday",
      period: "",
      subject: "",
      teacher: "",
      room: "",
    },
  });

  const handleSubmit = (data: TimetableFormValues) => {
    onSubmit(data);
    toast.success("Timetable entry saved successfully");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="class"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="9a">Class 9A</SelectItem>
                  <SelectItem value="9b">Class 9B</SelectItem>
                  <SelectItem value="10a">Class 10A</SelectItem>
                  <SelectItem value="10b">Class 10B</SelectItem>
                  <SelectItem value="11a">Class 11A</SelectItem>
                  <SelectItem value="12a">Class 12A</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="day"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Day</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="monday">Monday</SelectItem>
                    <SelectItem value="tuesday">Tuesday</SelectItem>
                    <SelectItem value="wednesday">Wednesday</SelectItem>
                    <SelectItem value="thursday">Thursday</SelectItem>
                    <SelectItem value="friday">Friday</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Period</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Period 1 (8:00-9:00)</SelectItem>
                    <SelectItem value="2">Period 2 (9:00-10:00)</SelectItem>
                    <SelectItem value="3">Period 3 (10:00-11:00)</SelectItem>
                    <SelectItem value="4">Period 4 (11:30-12:30)</SelectItem>
                    <SelectItem value="5">Period 5 (12:30-1:30)</SelectItem>
                    <SelectItem value="6">Period 6 (1:30-2:30)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                  <SelectItem value="biology">Biology</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                  <SelectItem value="geography">Geography</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="teacher"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teacher</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Mrs. Emily Rodriguez</SelectItem>
                  <SelectItem value="2">Mr. James Smith</SelectItem>
                  <SelectItem value="3">Mrs. Sarah Johnson</SelectItem>
                  <SelectItem value="4">Dr. Michael Chen</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="room"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="101">Room 101</SelectItem>
                  <SelectItem value="102">Room 102</SelectItem>
                  <SelectItem value="201">Room 201</SelectItem>
                  <SelectItem value="202">Room 202</SelectItem>
                  <SelectItem value="lab1">Science Lab 1</SelectItem>
                  <SelectItem value="lab2">Computer Lab</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">Save Entry</Button>
        </div>
      </form>
    </Form>
  );
}
