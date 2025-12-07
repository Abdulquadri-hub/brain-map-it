import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { School, Crown, CreditCard, Edit2, MapPin, Mail, Phone, Globe, Building } from "lucide-react";

interface ReviewStepProps {
  data: {
    schoolProfile: {
      name: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      country: string;
      schoolType: string;
      website: string;
    };
    subscriptionPlan: {
      planId: string;
      billingCycle: "monthly" | "yearly";
    };
    payment: {
      paymentMethod: string;
      cardNumber?: string;
      bankName?: string;
      accountNumber?: string;
      accountName?: string;
    };
  };
  onEditStep: (step: number) => void;
}

const plans = [
  { id: "free", name: "Free", monthlyPrice: 0, yearlyPrice: 0 },
  { id: "starter", name: "Starter", monthlyPrice: 29, yearlyPrice: 290 },
  { id: "professional", name: "Professional", monthlyPrice: 79, yearlyPrice: 790 },
  { id: "enterprise", name: "Enterprise", monthlyPrice: 199, yearlyPrice: 1990 },
];

const ReviewStep = ({ data, onEditStep }: ReviewStepProps) => {
  const selectedPlan = plans.find((p) => p.id === data.subscriptionPlan.planId);
  const isYearly = data.subscriptionPlan.billingCycle === "yearly";
  const price = isYearly ? selectedPlan?.yearlyPrice : selectedPlan?.monthlyPrice;
  const isFree = selectedPlan?.id === "free";

  const formatCardNumber = (number: string) => {
    if (!number) return "";
    return `•••• •••• •••• ${number.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Review Your Information
        </h3>
        <p className="text-muted-foreground">
          Please verify all details before completing setup
        </p>
      </div>

      {/* School Profile Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <School className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-semibold text-lg">School Profile</h4>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditStep(1)}
            className="gap-2 text-primary hover:text-primary"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <Building className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-muted-foreground">School Name</p>
              <p className="font-medium">{data.schoolProfile.name || "—"}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{data.schoolProfile.email || "—"}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-muted-foreground">Phone</p>
              <p className="font-medium">{data.schoolProfile.phone || "—"}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-muted-foreground">Location</p>
              <p className="font-medium">
                {data.schoolProfile.city && data.schoolProfile.country
                  ? `${data.schoolProfile.city}, ${data.schoolProfile.country}`
                  : "—"}
              </p>
            </div>
          </div>
          {data.schoolProfile.website && (
            <div className="flex items-start gap-2">
              <Globe className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-muted-foreground">Website</p>
                <p className="font-medium">{data.schoolProfile.website}</p>
              </div>
            </div>
          )}
          <div className="flex items-start gap-2">
            <School className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-muted-foreground">School Type</p>
              <p className="font-medium capitalize">{data.schoolProfile.schoolType || "—"}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Selected Plan Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Crown className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-semibold text-lg">Selected Plan</h4>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditStep(2)}
            className="gap-2 text-primary hover:text-primary"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </Button>
        </div>
        <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-lg">{selectedPlan?.name} Plan</p>
              {selectedPlan?.id === "professional" && (
                <Badge className="bg-primary text-primary-foreground">Popular</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Billed {isYearly ? "annually" : "monthly"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">${price}</p>
            <p className="text-sm text-muted-foreground">
              {isFree ? "forever" : isYearly ? "per year" : "per month"}
            </p>
          </div>
        </div>
      </Card>

      {/* Payment Info Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-semibold text-lg">Payment Information</h4>
          </div>
          {!isFree && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditStep(3)}
              className="gap-2 text-primary hover:text-primary"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </Button>
          )}
        </div>
        
        {isFree ? (
          <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
            <p className="text-green-700 dark:text-green-400 font-medium">
              No payment required for the Free plan
            </p>
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            {data.payment.paymentMethod === "credit_card" && (
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Credit Card</p>
                  <p className="font-medium">
                    {formatCardNumber(data.payment.cardNumber || "")}
                  </p>
                </div>
              </div>
            )}
            {data.payment.paymentMethod === "bank_transfer" && (
              <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Building className="w-5 h-5 text-muted-foreground" />
                  <p className="font-medium">Bank Transfer</p>
                </div>
                <div className="grid md:grid-cols-2 gap-3 pl-7">
                  <div>
                    <p className="text-muted-foreground">Bank Name</p>
                    <p className="font-medium">{data.payment.bankName || "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Account Number</p>
                    <p className="font-medium">{data.payment.accountNumber || "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Account Name</p>
                    <p className="font-medium">{data.payment.accountName || "—"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Terms Note */}
      <p className="text-xs text-center text-muted-foreground">
        By completing setup, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
};

export default ReviewStep;