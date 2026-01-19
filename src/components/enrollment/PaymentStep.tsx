import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Building2, Smartphone, Loader2 } from "lucide-react";
import { EnrollmentData } from "@/pages/enrollment/EnrollmentPage";

// Laravel Inertia.js Integration:
// import { router } from '@inertiajs/react'
// 
// For payment processing:
// router.post('/enrollment/payment', {
//   ...enrollmentData,
//   payment_method: paymentMethod,
// }, {
//   onSuccess: () => onNext(),
//   onError: (errors) => setErrors(errors)
// })
//
// For Paystack integration:
// Call backend endpoint that returns Paystack authorization URL
// then redirect: window.location.href = paystackAuthUrl

interface Course {
  id: string;
  title: string;
  price: number;
}

const mockCourses: Course[] = [
  { id: "1", title: "Advanced Mathematics", price: 25000 },
  { id: "2", title: "English Language & Literature", price: 20000 },
  { id: "3", title: "Physics Fundamentals", price: 22000 },
  { id: "4", title: "Chemistry Basics", price: 22000 },
  { id: "5", title: "Biology for Beginners", price: 20000 },
];

interface PaymentStepProps {
  enrollmentData: EnrollmentData;
  onUpdate: (data: Partial<EnrollmentData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const PaymentStep = ({
  enrollmentData,
  onUpdate,
  onNext,
  onBack,
}: PaymentStepProps) => {
  const [paymentMethod, setPaymentMethod] = useState(enrollmentData.paymentMethod || "card");
  const [isProcessing, setIsProcessing] = useState(false);

  // Laravel Inertia.js Integration:
  // const { courses } = usePage().props
  const courses = mockCourses;

  const selectedCourseDetails = enrollmentData.selectedCourses.map((id) =>
    courses.find((c) => c.id === id)
  ).filter(Boolean) as Course[];

  const subtotal = selectedCourseDetails.reduce((sum, course) => sum + course.price, 0);
  const processingFee = Math.round(subtotal * 0.015); // 1.5% processing fee
  const total = subtotal + processingFee;

  const handlePayment = async () => {
    setIsProcessing(true);
    onUpdate({ paymentMethod });

    // Laravel Inertia.js Integration:
    // router.post('/enrollment', {
    //   ...enrollmentData,
    //   payment_method: paymentMethod,
    // }, {
    //   onSuccess: () => onNext(),
    //   onError: (errors) => {
    //     setIsProcessing(false);
    //     setErrors(errors);
    //   }
    // })

    // Mock payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Payment</h2>
        <p className="text-muted-foreground mt-2">
          Complete your enrollment payment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Method Selection */}
        <div className="space-y-4">
          <h3 className="font-semibold">Select Payment Method</h3>
          <RadioGroup
            value={paymentMethod}
            onValueChange={setPaymentMethod}
            className="space-y-3"
          >
            <div>
              <Label
                htmlFor="card"
                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === "card"
                    ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                    : "hover:bg-muted/50"
                }`}
              >
                <RadioGroupItem value="card" id="card" />
                <CreditCard className="h-5 w-5" />
                <div className="flex-1">
                  <div className="font-medium">Card Payment</div>
                  <div className="text-sm text-muted-foreground">
                    Pay with Visa, Mastercard, or Verve
                  </div>
                </div>
              </Label>
            </div>

            <div>
              <Label
                htmlFor="bank"
                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === "bank"
                    ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                    : "hover:bg-muted/50"
                }`}
              >
                <RadioGroupItem value="bank" id="bank" />
                <Building2 className="h-5 w-5" />
                <div className="flex-1">
                  <div className="font-medium">Bank Transfer</div>
                  <div className="text-sm text-muted-foreground">
                    Pay directly from your bank account
                  </div>
                </div>
              </Label>
            </div>

            <div>
              <Label
                htmlFor="ussd"
                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === "ussd"
                    ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                    : "hover:bg-muted/50"
                }`}
              >
                <RadioGroupItem value="ussd" id="ussd" />
                <Smartphone className="h-5 w-5" />
                <div className="flex-1">
                  <div className="font-medium">USSD</div>
                  <div className="text-sm text-muted-foreground">
                    Pay using your phone's USSD code
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>

          {paymentMethod === "card" && (
            <Card className="mt-4">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label>Card Number</Label>
                  <Input placeholder="4000 0000 0000 0000" className="mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Expiry Date</Label>
                    <Input placeholder="MM/YY" className="mt-1" />
                  </div>
                  <div>
                    <Label>CVV</Label>
                    <Input placeholder="123" className="mt-1" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your card details are secured with Paystack. We don't store your card information.
                </p>
              </CardContent>
            </Card>
          )}

          {paymentMethod === "bank" && (
            <Card className="mt-4">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-4">
                  You will be redirected to complete the bank transfer. Please have your bank details ready.
                </p>
                <div className="bg-muted/50 rounded-lg p-4 text-sm">
                  <div className="font-medium">Account Details:</div>
                  <div className="mt-2 space-y-1 text-muted-foreground">
                    <p>Bank: GTBank</p>
                    <p>Account Number: 0123456789</p>
                    <p>Account Name: Bright Stars Academy</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedCourseDetails.map((course) => (
                <div key={course.id} className="flex justify-between text-sm">
                  <span>{course.title}</span>
                  <span>₦{course.price.toLocaleString()}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Processing Fee (1.5%)</span>
                <span>₦{processingFee.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₦{total.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Enrollee Info Summary */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Enrollee Details</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              {enrollmentData.enrollmentType === "parent" ? (
                <>
                  <div>
                    <span className="text-muted-foreground">Parent: </span>
                    {enrollmentData.parent?.name}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email: </span>
                    {enrollmentData.parent?.email}
                  </div>
                  <Separator className="my-2" />
                  <div>
                    <span className="text-muted-foreground">Student: </span>
                    {enrollmentData.child?.name}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Grade: </span>
                    {enrollmentData.child?.grade}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="text-muted-foreground">Name: </span>
                    {enrollmentData.adult?.name}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email: </span>
                    {enrollmentData.adult?.email}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isProcessing}>
          Back
        </Button>
        <Button onClick={handlePayment} disabled={isProcessing}>
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay ₦${total.toLocaleString()}`
          )}
        </Button>
      </div>
    </div>
  );
};

export default PaymentStep;
