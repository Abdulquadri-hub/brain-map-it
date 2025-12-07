import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, School, CreditCard, ArrowRight, ArrowLeft, Crown, ClipboardCheck, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import SchoolProfileStep from "@/components/onboarding/SchoolProfileStep";
import SubscriptionPlanStep from "@/components/onboarding/SubscriptionPlanStep";
import PaymentSetupStep from "@/components/onboarding/PaymentSetupStep";
import ReviewStep from "@/components/onboarding/ReviewStep";
import ProcessingStep from "@/components/onboarding/ProcessingStep";
import {
  schoolProfileSchema,
  subscriptionPlanSchema,
  paymentSetupSchema,
} from "@/lib/onboarding-schemas";

const steps = [
  { id: 1, title: "School Profile", icon: School, description: "Basic information about your school" },
  { id: 2, title: "Select Plan", icon: Crown, description: "Choose the right plan for your school" },
  { id: 3, title: "Payment", icon: CreditCard, description: "Set up your payment method" },
  { id: 4, title: "Review", icon: ClipboardCheck, description: "Review and confirm your information" },
  { id: 5, title: "Setup", icon: Rocket, description: "Creating your school platform" },
];

export interface OnboardingData {
  schoolProfile: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    description: string;
    logo: File | null;
    website: string;
    established: string;
    schoolType: string;
  };
  subscriptionPlan: {
    planId: string;
    billingCycle: "monthly" | "yearly";
  };
  payment: {
    paymentMethod: string;
    cardNumber: string;
    cardExpiry: string;
    cardCvv: string;
    cardName: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

interface StepErrors {
  [key: string]: string | undefined;
}

const initialData: OnboardingData = {
  schoolProfile: {
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    description: "",
    logo: null,
    website: "",
    established: "",
    schoolType: "",
  },
  subscriptionPlan: {
    planId: "",
    billingCycle: "monthly",
  },
  payment: {
    paymentMethod: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardName: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
  },
};

const SchoolOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [errors, setErrors] = useState<StepErrors>({});
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const progress = (currentStep / steps.length) * 100;
  const isFreeplan = data.subscriptionPlan.planId === "free";

  const updateData = <K extends keyof OnboardingData>(
    section: K,
    updates: Partial<OnboardingData[K]>
  ) => {
    setData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...updates },
    }));
    setErrors({});
  };

  const validateCurrentStep = (): boolean => {
    let result;
    
    switch (currentStep) {
      case 1:
        result = schoolProfileSchema.safeParse(data.schoolProfile);
        break;
      case 2:
        result = subscriptionPlanSchema.safeParse(data.subscriptionPlan);
        break;
      case 3:
        // Skip payment validation for free plan
        if (isFreeplan) return true;
        result = paymentSetupSchema.safeParse(data.payment);
        break;
      case 4:
        // Review step - no validation needed
        return true;
      default:
        return true;
    }

    if (!result?.success) {
      const newErrors: StepErrors = {};
      result?.error.errors.forEach((err) => {
        const path = err.path.join(".");
        newErrors[path] = err.message;
      });
      setErrors(newErrors);
      
      const firstError = result?.error.errors[0];
      if (firstError) {
        toast.error(firstError.message);
      }
      return false;
    }

    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      // Mark current step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps((prev) => [...prev, currentStep]);
      }

      // Skip payment step for free plan
      if (currentStep === 2 && isFreeplan) {
        // Set payment method to "none" for free plans
        updateData("payment", { paymentMethod: "none" });
        setCurrentStep(4); // Skip to review
        return;
      }

      if (currentStep < steps.length) {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    // From review, go back to payment (or plan selection if free)
    if (currentStep === 4 && isFreeplan) {
      setCurrentStep(2);
      return;
    }

    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setErrors({});
    }
  };

  const handleStepClick = (stepId: number) => {
    // Only allow clicking on completed steps
    if (completedSteps.includes(stepId) && stepId < currentStep) {
      setCurrentStep(stepId);
    }
  };

  const handleEditStep = (stepId: number) => {
    setCurrentStep(stepId);
  };

  const handleCompleteSetup = () => {
    if (validateCurrentStep()) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps((prev) => [...prev, currentStep]);
      }
      setCurrentStep(5);
    }
  };

  const handleProcessingComplete = () => {
    // TODO: Replace with Inertia.js navigation
    // router.visit('/dashboard');
    toast.success("Redirecting to dashboard...");
    console.log("Navigate to dashboard");
  };

  const handleRetry = () => {
    setCurrentStep(4); // Go back to review
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <SchoolProfileStep
            data={data.schoolProfile}
            onUpdate={(updates) => updateData("schoolProfile", updates)}
            errors={errors}
          />
        );
      case 2:
        return (
          <SubscriptionPlanStep
            data={data.subscriptionPlan}
            onUpdate={(updates) => updateData("subscriptionPlan", updates)}
            errors={errors}
          />
        );
      case 3:
        return (
          <PaymentSetupStep
            data={data.payment}
            planInfo={data.subscriptionPlan}
            onUpdate={(updates) => updateData("payment", updates)}
            errors={errors}
          />
        );
      case 4:
        return (
          <ReviewStep
            data={data}
            onEditStep={handleEditStep}
          />
        );
      case 5:
        return (
          <ProcessingStep
            schoolName={data.schoolProfile.name}
            onComplete={handleProcessingComplete}
            onRetry={handleRetry}
          />
        );
      default:
        return null;
    }
  };

  // Don't show navigation for processing step
  const showNavigation = currentStep < 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Welcome to EduConnect Africa
          </h1>
          <p className="text-muted-foreground">
            Let's set up your school in just a few steps
          </p>
        </div>

        {/* Progress */}
        <div className="max-w-5xl mx-auto mb-8">
          <Progress value={progress} className="h-2 mb-6" />
          
          <div className="flex justify-between">
            {steps.map((step) => {
              const Icon = step.icon;
              const isCompleted = completedSteps.includes(step.id) || currentStep > step.id;
              const isCurrent = currentStep === step.id;
              const isClickable = completedSteps.includes(step.id) && step.id < currentStep;
              
              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center gap-2 transition-all ${
                    isCurrent ? "scale-105" : ""
                  } ${isClickable ? "cursor-pointer" : ""}`}
                  onClick={() => handleStepClick(step.id)}
                >
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted
                        ? "bg-primary border-primary text-primary-foreground"
                        : isCurrent
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-muted bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    {isCompleted && !isCurrent ? (
                      <Check className="w-4 h-4 md:w-5 md:h-5" />
                    ) : (
                      <Icon className="w-4 h-4 md:w-5 md:h-5" />
                    )}
                  </div>
                  <div className="hidden md:block text-center">
                    <p
                      className={`text-xs font-medium ${
                        isCurrent ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl border shadow-lg p-6 md:p-8">
            {currentStep < 5 && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  {steps[currentStep - 1].title}
                </h2>
                <p className="text-muted-foreground">
                  {steps[currentStep - 1].description}
                </p>
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            {showNavigation && (
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>

                {currentStep === 4 ? (
                  <Button
                    onClick={handleCompleteSetup}
                    className="gap-2 bg-primary hover:bg-primary/90"
                  >
                    Complete Setup
                    <Check className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button onClick={handleNext} className="gap-2">
                    Next Step
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolOnboarding;