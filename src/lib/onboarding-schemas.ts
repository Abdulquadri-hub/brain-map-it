import { z } from "zod";

// School Profile Schema
export const schoolProfileSchema = z.object({
  name: z.string().min(2, "School name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter a valid address"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(1, "Please select a country"),
  description: z.string().optional(),
  logo: z.any().optional(),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  established: z.string().optional(),
  schoolType: z.string().min(1, "Please select a school type"),
});

// Subscription Plan Schema
export const subscriptionPlanSchema = z.object({
  planId: z.string().min(1, "Please select a subscription plan"),
  billingCycle: z.enum(["monthly", "yearly"]),
});

// Academic Structure Schema
export const academicStructureSchema = z.object({
  grades: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      subjects: z.array(z.string()),
    })
  ).min(1, "Please add at least one grade/class"),
  academicYear: z.string().min(1, "Academic year is required"),
  termSystem: z.string().min(1, "Please select a term system"),
});

// Instructor Schema
export const instructorSchema = z.object({
  id: z.string(),
  email: z.string().email("Please enter a valid email"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(1, "Please select a role"),
  subjects: z.array(z.string()),
});

// Instructors array is optional - can proceed without inviting anyone
export const instructorsArraySchema = z.array(instructorSchema);

// Payment Setup Schema
export const paymentSetupSchema = z.object({
  currency: z.string().min(1, "Please select a currency"),
  paymentMethods: z.array(z.string()).min(1, "Please select at least one payment method"),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mobileMoneyProvider: z.string().optional(),
  mobileMoneyNumber: z.string().optional(),
}).refine(
  (data) => {
    if (data.paymentMethods.includes("bank_transfer")) {
      return data.bankName && data.accountNumber && data.accountName;
    }
    return true;
  },
  {
    message: "Bank details are required when bank transfer is selected",
    path: ["bankName"],
  }
).refine(
  (data) => {
    if (data.paymentMethods.includes("mobile_money")) {
      return data.mobileMoneyProvider && data.mobileMoneyNumber;
    }
    return true;
  },
  {
    message: "Mobile money details are required when mobile money is selected",
    path: ["mobileMoneyProvider"],
  }
);

export type SchoolProfileData = z.infer<typeof schoolProfileSchema>;
export type SubscriptionPlanData = z.infer<typeof subscriptionPlanSchema>;
export type AcademicStructureData = z.infer<typeof academicStructureSchema>;
export type InstructorData = z.infer<typeof instructorSchema>;
export type PaymentSetupData = z.infer<typeof paymentSetupSchema>;
