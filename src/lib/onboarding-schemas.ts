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

// Payment Setup Schema
export const paymentSetupSchema = z.object({
  paymentMethod: z.string().min(1, "Please select a payment method"),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
  cardName: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
}).refine(
  (data) => {
    if (data.paymentMethod === "credit_card") {
      return (
        data.cardName &&
        data.cardName.length >= 2 &&
        data.cardNumber &&
        data.cardNumber.replace(/\s/g, "").length >= 15 &&
        data.cardExpiry &&
        data.cardExpiry.length === 5 &&
        data.cardCvv &&
        data.cardCvv.length >= 3
      );
    }
    return true;
  },
  {
    message: "Please fill in all card details",
    path: ["cardNumber"],
  }
).refine(
  (data) => {
    if (data.paymentMethod === "bank_transfer") {
      return data.bankName && data.accountNumber && data.accountName;
    }
    return true;
  },
  {
    message: "Please fill in all bank details",
    path: ["bankName"],
  }
);

export type SchoolProfileData = z.infer<typeof schoolProfileSchema>;
export type SubscriptionPlanData = z.infer<typeof subscriptionPlanSchema>;
export type PaymentSetupData = z.infer<typeof paymentSetupSchema>;