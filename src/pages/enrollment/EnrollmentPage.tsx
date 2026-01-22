import { useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle } from "lucide-react";
import ParentRegistrationStep from "@/components/enrollment/ParentRegistrationStep";
import ChildRegistrationStep from "@/components/enrollment/ChildRegistrationStep";
import AdultRegistrationStep from "@/components/enrollment/AdultRegistrationStep";
import CourseSelectionStep from "@/components/enrollment/CourseSelectionStep";
import LearningTypeChoice from "@/components/enrollment/LearningTypeChoice";
import PaymentStep from "@/components/enrollment/PaymentStep";
import EnrollmentSuccessStep from "@/components/enrollment/EnrollmentSuccessStep";
import { LearningType } from "@/types/course";

// Laravel Inertia.js Integration:
// import { usePage, router } from '@inertiajs/react'
// 
// Replace mock data with:
// const { school, courses, preselectedCourse } = usePage<{
//   school: School,
//   courses: Course[],
//   preselectedCourse?: Course
// }>().props
//
// For form submission:
// router.post('/enrollment', enrollmentData, {
//   onSuccess: () => setCurrentStep('success'),
//   onError: (errors) => setErrors(errors)
// })

interface ParentData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword?: string;
}

interface ChildData {
  name: string;
  dateOfBirth: string;
  gender: string;
  grade: string;
}

interface AdultData {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  password: string;
  confirmPassword?: string;
}

export interface EnrollmentData {
  enrollmentType: "adult" | "parent" | null;
  parent?: Partial<ParentData>;
  child?: Partial<ChildData>;
  adult?: Partial<AdultData>;
  selectedCourses: string[];
  selectedLearningType: LearningType | null;
  paymentMethod: string;
  paymentReference?: string;
}

const defaultParent: ParentData = { name: "", email: "", phone: "", password: "" };
const defaultChild: ChildData = { name: "", dateOfBirth: "", gender: "", grade: "" };
const defaultAdult: AdultData = { name: "", email: "", phone: "", dateOfBirth: "", password: "" };

const steps = [
  { id: "type", label: "Account Type" },
  { id: "registration", label: "Registration" },
  { id: "courses", label: "Select Courses" },
  { id: "learning", label: "Learning Type" },
  { id: "payment", label: "Payment" },
  { id: "success", label: "Complete" },
];

const EnrollmentPage = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const preselectedCourseId = searchParams.get("course");

  const [currentStep, setCurrentStep] = useState(0);
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentData>({
    enrollmentType: null,
    selectedCourses: preselectedCourseId ? [preselectedCourseId] : [],
    selectedLearningType: null,
    paymentMethod: "",
  });

  // Mock course data for learning type pricing
  // In production, this comes from the selected courses
  const getHybridCourseSelected = () => {
    // Check if any selected course supports hybrid learning
    // For now, mock that courses with id "1" or "2" are hybrid
    return enrollmentData.selectedCourses.some(id => ["1", "2"].includes(id));
  };

  const getMockPricing = () => {
    // Calculate total based on selected courses and learning type
    const baseSelfPaced = enrollmentData.selectedCourses.length * 15000;
    const baseLive = enrollmentData.selectedCourses.length * 25000;
    return { selfPaced: baseSelfPaced, live: baseLive };
  };

  // Laravel Inertia.js Integration:
  // const { school, courses } = usePage().props

  const school = {
    slug: "brightstars",
    name: "Bright Stars Academy",
  };

  const updateEnrollmentData = (data: Partial<EnrollmentData>) => {
    setEnrollmentData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const getStepProgress = () => {
    return ((currentStep + 1) / steps.length) * 100;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        // Account Type Selection
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Who is enrolling?</h2>
              <p className="text-muted-foreground mt-2">
                Select the type of account you need
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card
                className={`cursor-pointer transition-all hover:border-primary ${
                  enrollmentData.enrollmentType === "adult"
                    ? "border-primary ring-2 ring-primary/20"
                    : ""
                }`}
                onClick={() => updateEnrollmentData({ enrollmentType: "adult" })}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">🎓</div>
                  <h3 className="font-semibold text-lg">I'm an Adult Student</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    I'm 18 years or older and enrolling for myself
                  </p>
                </CardContent>
              </Card>
              <Card
                className={`cursor-pointer transition-all hover:border-primary ${
                  enrollmentData.enrollmentType === "parent"
                    ? "border-primary ring-2 ring-primary/20"
                    : ""
                }`}
                onClick={() => updateEnrollmentData({ enrollmentType: "parent" })}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">👨‍👩‍👧</div>
                  <h3 className="font-semibold text-lg">I'm a Parent/Guardian</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    I'm enrolling my child (under 18)
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={nextStep}
                disabled={!enrollmentData.enrollmentType}
              >
                Continue
              </Button>
            </div>
          </div>
        );

      case 1:
        // Registration Step
        if (enrollmentData.enrollmentType === "parent") {
          return (
            <div className="space-y-6">
              <ParentRegistrationStep
                data={enrollmentData.parent || { name: "", email: "", phone: "", password: "" }}
                onUpdate={(parent) => updateEnrollmentData({ parent })}
                onNext={() => {
                  // After parent, go to child registration
                }}
              />
              {enrollmentData.parent && (
                <ChildRegistrationStep
                  data={enrollmentData.child || { name: "", dateOfBirth: "", gender: "", grade: "" }}
                  onUpdate={(child) => updateEnrollmentData({ child })}
                />
              )}
              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button
                  onClick={nextStep}
                  disabled={!enrollmentData.parent || !enrollmentData.child}
                >
                  Continue
                </Button>
              </div>
            </div>
          );
        } else {
          return (
            <div className="space-y-6">
              <AdultRegistrationStep
                data={enrollmentData.adult || { name: "", email: "", phone: "", dateOfBirth: "", password: "" }}
                onUpdate={(adult) => updateEnrollmentData({ adult })}
              />
              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button onClick={nextStep} disabled={!enrollmentData.adult}>
                  Continue
                </Button>
              </div>
            </div>
          );
        }

      case 2:
        // Course Selection
        return (
          <CourseSelectionStep
            selectedCourses={enrollmentData.selectedCourses}
            preselectedCourseId={preselectedCourseId}
            onUpdate={(selectedCourses) => updateEnrollmentData({ selectedCourses })}
            onNext={() => {
              // If hybrid courses selected, go to learning type step
              // Otherwise skip to payment
              if (getHybridCourseSelected()) {
                nextStep();
              } else {
                // Skip learning type step, set default to self_paced
                updateEnrollmentData({ selectedLearningType: "self_paced" });
                setCurrentStep(4); // Go directly to payment
              }
            }}
            onBack={prevStep}
          />
        );

      case 3:
        // Learning Type Selection (only for hybrid courses)
        const pricing = getMockPricing();
        return (
          <LearningTypeChoice
            courseName={enrollmentData.selectedCourses.length === 1 
              ? "this course" 
              : `${enrollmentData.selectedCourses.length} courses`}
            selfPacedPrice={pricing.selfPaced}
            liveClassPrice={pricing.live}
            selectedType={enrollmentData.selectedLearningType}
            onSelect={(type) => updateEnrollmentData({ selectedLearningType: type })}
            onNext={nextStep}
            onBack={prevStep}
          />
        );

      case 4:
        // Payment
        return (
          <PaymentStep
            enrollmentData={enrollmentData}
            onUpdate={(data) => updateEnrollmentData(data)}
            onNext={nextStep}
            onBack={() => {
              // Go back to learning type or courses depending on hybrid
              if (getHybridCourseSelected()) {
                prevStep();
              } else {
                setCurrentStep(2); // Go back to course selection
              }
            }}
          />
        );

      case 5:
        // Success
        return <EnrollmentSuccessStep enrollmentData={enrollmentData} schoolSlug={slug || ""} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/50 border-b">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to={`/school/${slug}`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {school.name}
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress */}
        {currentStep < steps.length - 1 && (
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {steps.slice(0, -1).map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-2 text-sm ${
                    index <= currentStep
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center h-6 w-6 rounded-full text-xs ${
                      index < currentStep
                        ? "bg-primary text-primary-foreground"
                        : index === currentStep
                        ? "border-2 border-primary text-primary"
                        : "border border-muted-foreground"
                    }`}
                  >
                    {index < currentStep ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span className="hidden sm:inline">{step.label}</span>
                </div>
              ))}
            </div>
            <Progress value={getStepProgress()} className="h-2" />
          </div>
        )}

        {/* Step Content */}
        <Card>
          <CardContent className="p-6 md:p-8">{renderStepContent()}</CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnrollmentPage;
