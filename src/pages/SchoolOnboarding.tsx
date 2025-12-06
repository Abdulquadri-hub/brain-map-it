import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, School, BookOpen, Users, CreditCard, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import SchoolProfileStep from "@/components/onboarding/SchoolProfileStep";
import AcademicStructureStep from "@/components/onboarding/AcademicStructureStep";
import InstructorInvitesStep from "@/components/onboarding/InstructorInvitesStep";
import PaymentSetupStep from "@/components/onboarding/PaymentSetupStep";

const steps = [
  { id: 1, title: "School Profile", icon: School, description: "Basic information about your school" },
  { id: 2, title: "Academic Structure", icon: BookOpen, description: "Set up classes, grades, and subjects" },
  { id: 3, title: "Instructor Invites", icon: Users, description: "Invite teachers and staff" },
  { id: 4, title: "Payment Setup", icon: CreditCard, description: "Configure payment methods" },
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
  academicStructure: {
    grades: { id: string; name: string; subjects: string[] }[];
    academicYear: string;
    termSystem: string;
  };
  instructors: {
    id: string;
    email: string;
    name: string;
    role: string;
    subjects: string[];
  }[];
  payment: {
    currency: string;
    paymentMethods: string[];
    bankName: string;
    accountNumber: string;
    accountName: string;
    mobileMoneyProvider: string;
    mobileMoneyNumber: string;
  };
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
  academicStructure: {
    grades: [],
    academicYear: "",
    termSystem: "trimester",
  },
  instructors: [],
  payment: {
    currency: "NGN",
    paymentMethods: [],
    bankName: "",
    accountNumber: "",
    accountName: "",
    mobileMoneyProvider: "",
    mobileMoneyNumber: "",
  },
};

const SchoolOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = (currentStep / steps.length) * 100;

  const updateData = <K extends keyof OnboardingData>(
    section: K,
    updates: Partial<OnboardingData[K]>
  ) => {
    setData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...updates },
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // TODO: Replace with Inertia.js form submission
    // Example Laravel Inertia integration:
    // import { router } from '@inertiajs/react';
    // router.post('/school/onboarding', data, {
    //   onSuccess: () => { /* redirect to dashboard */ },
    //   onError: (errors) => { /* handle validation errors */ },
    // });
    
    console.log("Onboarding data to submit:", data);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    
    // Demo: Show success (replace with actual navigation)
    alert("Onboarding complete! In production, this would redirect to dashboard.");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <SchoolProfileStep
            data={data.schoolProfile}
            onUpdate={(updates) => updateData("schoolProfile", updates)}
          />
        );
      case 2:
        return (
          <AcademicStructureStep
            data={data.academicStructure}
            onUpdate={(updates) => updateData("academicStructure", updates)}
          />
        );
      case 3:
        return (
          <InstructorInvitesStep
            data={data.instructors}
            onUpdate={(instructors) => setData((prev) => ({ ...prev, instructors }))}
          />
        );
      case 4:
        return (
          <PaymentSetupStep
            data={data.payment}
            onUpdate={(updates) => updateData("payment", updates)}
          />
        );
      default:
        return null;
    }
  };

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
        <div className="max-w-4xl mx-auto mb-8">
          <Progress value={progress} className="h-2 mb-6" />
          
          <div className="flex justify-between">
            {steps.map((step) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              
              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center gap-2 transition-all ${
                    isCurrent ? "scale-105" : ""
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted
                        ? "bg-primary border-primary text-primary-foreground"
                        : isCurrent
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-muted bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <div className="hidden md:block text-center">
                    <p
                      className={`text-sm font-medium ${
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
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                {steps[currentStep - 1].title}
              </h2>
              <p className="text-muted-foreground">
                {steps[currentStep - 1].description}
              </p>
            </div>

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

              {currentStep === steps.length ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="gap-2 bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? "Submitting..." : "Complete Setup"}
                  <Check className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={handleNext} className="gap-2">
                  Next Step
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolOnboarding;
