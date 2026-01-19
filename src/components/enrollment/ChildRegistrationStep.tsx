import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
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

// Laravel Inertia.js Integration:
// import { useForm as useInertiaForm } from '@inertiajs/react'
// 
// Replace react-hook-form with Inertia's useForm:
// const { data, setData, errors } = useInertiaForm({
//   name: '',
//   date_of_birth: '',
//   gender: '',
//   grade: '',
// })

const childSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Please select gender"),
  grade: z.string().min(1, "Please select grade level"),
});

type ChildFormData = z.infer<typeof childSchema>;

interface ChildRegistrationStepProps {
  data?: {
    name: string;
    dateOfBirth: string;
    gender: string;
    grade: string;
  };
  onUpdate: (data: ChildFormData) => void;
}

const grades = [
  "Nursery 1",
  "Nursery 2",
  "Primary 1",
  "Primary 2",
  "Primary 3",
  "Primary 4",
  "Primary 5",
  "Primary 6",
  "JSS 1",
  "JSS 2",
  "JSS 3",
  "SSS 1",
  "SSS 2",
  "SSS 3",
];

const ChildRegistrationStep = ({
  data,
  onUpdate,
}: ChildRegistrationStepProps) => {
  const form = useForm<ChildFormData>({
    resolver: zodResolver(childSchema),
    defaultValues: {
      name: data?.name || "",
      dateOfBirth: data?.dateOfBirth || "",
      gender: data?.gender || "",
      grade: data?.grade || "",
    },
  });

  // Auto-save on blur or select change
  const handleChange = () => {
    const values = form.getValues();
    if (values.name && values.dateOfBirth && values.gender && values.grade) {
      onUpdate(values);
    }
  };

  return (
    <div className="border-t pt-6 mt-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold">Child's Information</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Enter details about your child
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Child's Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter child's full name"
                    {...field}
                    onBlur={handleChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleChange();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleChange();
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Grade Level</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleChange();
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default ChildRegistrationStep;
