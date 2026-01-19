import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Mail, BookOpen, Calendar } from "lucide-react";
import { EnrollmentData } from "@/pages/enrollment/EnrollmentPage";

// Laravel Inertia.js Integration:
// import { Link } from '@inertiajs/react'
// 
// The success data would come from the server response:
// const { enrollment, courses, accessDetails } = usePage<{
//   enrollment: Enrollment,
//   courses: Course[],
//   accessDetails: AccessDetails
// }>().props

interface EnrollmentSuccessStepProps {
  enrollmentData: EnrollmentData;
  schoolSlug: string;
}

const EnrollmentSuccessStep = ({
  enrollmentData,
  schoolSlug,
}: EnrollmentSuccessStepProps) => {
  const studentName =
    enrollmentData.enrollmentType === "parent"
      ? enrollmentData.child?.name
      : enrollmentData.adult?.name;

  const contactEmail =
    enrollmentData.enrollmentType === "parent"
      ? enrollmentData.parent?.email
      : enrollmentData.adult?.email;

  return (
    <div className="text-center space-y-6">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
      </div>

      {/* Success Message */}
      <div>
        <h2 className="text-2xl font-bold text-green-600">
          Enrollment Successful!
        </h2>
        <p className="text-muted-foreground mt-2">
          {studentName} has been successfully enrolled in{" "}
          {enrollmentData.selectedCourses.length} course(s)
        </p>
      </div>

      {/* Enrollment Details */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Check Your Email</h3>
              <p className="text-sm text-muted-foreground text-center">
                We've sent login details and course access instructions to{" "}
                <span className="font-medium">{contactEmail}</span>
              </p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Access Your Courses</h3>
              <p className="text-sm text-muted-foreground text-center">
                Log in to your student portal to access course materials and
                start learning
              </p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Join Live Classes</h3>
              <p className="text-sm text-muted-foreground text-center">
                Check your class schedule and join upcoming live sessions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Reference */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h3 className="font-medium mb-4">Quick Reference</h3>
          <div className="grid grid-cols-2 gap-4 text-left text-sm">
            <div>
              <span className="text-muted-foreground">Student Portal:</span>
              <div className="font-medium">student.teach.com</div>
            </div>
            <div>
              <span className="text-muted-foreground">Support Email:</span>
              <div className="font-medium">support@teach.com</div>
            </div>
            <div>
              <span className="text-muted-foreground">Enrollment ID:</span>
              <div className="font-medium">ENR-{Date.now().toString(36).toUpperCase()}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Payment Status:</span>
              <div className="font-medium text-green-600">Confirmed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Button asChild>
          <Link to="/student/dashboard">Go to Student Portal</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to={`/school/${schoolSlug}`}>Back to School Page</Link>
        </Button>
      </div>

      {/* Help Note */}
      <p className="text-sm text-muted-foreground">
        Need help? Contact us at{" "}
        <a href="mailto:support@teach.com" className="text-primary hover:underline">
          support@teach.com
        </a>{" "}
        or call <span className="font-medium">+234 801 234 5678</span>
      </p>
    </div>
  );
};

export default EnrollmentSuccessStep;
