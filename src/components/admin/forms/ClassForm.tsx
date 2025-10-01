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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const classFormSchema = z.object({
  name: z.string().min(2, "Class name must be at least 2 characters"),
  level: z.enum(["primary", "junior-secondary", "senior-secondary"]),
  classTeacher: z.string().min(1, "Class teacher is required"),
  room: z.string().min(1, "Room number is required"),
  capacity: z.string().min(1, "Capacity is required"),
});

type ClassFormValues = z.infer<typeof classFormSchema>;

interface ClassFormProps {
  initialData?: Partial<ClassFormValues>;
  onSubmit: (data: ClassFormValues) => void;
  onCancel?: () => void;
}

export function ClassForm({ initialData, onSubmit, onCancel }: ClassFormProps) {
  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues: initialData || {
      name: "",
      level: "junior-secondary",
      classTeacher: "",
      room: "",
      capacity: "",
    },
  });

  const handleSubmit = (data: ClassFormValues) => {
    onSubmit(data);
    toast.success(initialData ? "Class updated successfully" : "Class created successfully");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class Name</FormLabel>
              <FormControl>
                <Input placeholder="Class 9A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="junior-secondary">Junior Secondary</SelectItem>
                  <SelectItem value="senior-secondary">Senior Secondary</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="classTeacher"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class Teacher</FormLabel>
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="room"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Number</FormLabel>
                <FormControl>
                  <Input placeholder="201" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="35" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            {initialData ? "Update Class" : "Create Class"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
