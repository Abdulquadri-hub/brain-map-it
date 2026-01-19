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

// Laravel Inertia.js Integration:
// import { useForm as useInertiaForm } from '@inertiajs/react'
// 
// Replace react-hook-form with Inertia's useForm:
// const { data, setData, errors, processing } = useInertiaForm({
//   name: '',
//   email: '',
//   phone: '',
//   date_of_birth: '',
//   password: '',
//   password_confirmation: '',
// })

const adultSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  const dob = new Date(data.dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  return age >= 18;
}, {
  message: "You must be 18 or older to register as an adult student",
  path: ["dateOfBirth"],
});

type AdultFormData = z.infer<typeof adultSchema>;

interface AdultRegistrationStepProps {
  data?: {
    name: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    password: string;
  };
  onUpdate: (data: AdultFormData) => void;
}

const AdultRegistrationStep = ({
  data,
  onUpdate,
}: AdultRegistrationStepProps) => {
  const form = useForm<AdultFormData>({
    resolver: zodResolver(adultSchema),
    defaultValues: {
      name: data?.name || "",
      email: data?.email || "",
      phone: data?.phone || "",
      dateOfBirth: data?.dateOfBirth || "",
      password: data?.password || "",
      confirmPassword: "",
    },
  });

  // Auto-save on blur
  const handleBlur = () => {
    const values = form.getValues();
    if (form.formState.isValid) {
      onUpdate(values);
    }
  };

  const handleFieldChange = () => {
    setTimeout(() => {
      const values = form.getValues();
      if (values.name && values.email && values.phone && values.dateOfBirth && values.password) {
        form.trigger().then((isValid) => {
          if (isValid) {
            onUpdate(values);
          }
        });
      }
    }, 0);
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Your Information</h2>
        <p className="text-muted-foreground mt-2">
          Create your student account
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your full name"
                    {...field}
                    onBlur={handleBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="student@example.com"
                    {...field}
                    onBlur={handleBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+234 801 234 5678"
                      {...field}
                      onBlur={handleBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                        handleFieldChange();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Create a password"
                    {...field}
                    onBlur={handleBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    {...field}
                    onBlur={handleBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default AdultRegistrationStep;
