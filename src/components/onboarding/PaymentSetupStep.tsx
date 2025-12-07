import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Building, Check, Lock } from "lucide-react";

interface PaymentData {
  paymentMethod: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardName: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

interface PlanInfo {
  planId: string;
  billingCycle: "monthly" | "yearly";
}

interface PaymentSetupStepProps {
  data: PaymentData;
  planInfo: PlanInfo;
  onUpdate: (updates: Partial<PaymentData>) => void;
  errors?: { [key: string]: string | undefined };
}

const plans = [
  { id: "free", name: "Free", monthlyPrice: 0, yearlyPrice: 0 },
  { id: "starter", name: "Starter", monthlyPrice: 29, yearlyPrice: 290 },
  { id: "professional", name: "Professional", monthlyPrice: 79, yearlyPrice: 790 },
  { id: "enterprise", name: "Enterprise", monthlyPrice: 199, yearlyPrice: 1990 },
];

const PaymentSetupStep = ({ data, planInfo, onUpdate, errors = {} }: PaymentSetupStepProps) => {
  const selectedPlan = plans.find((p) => p.id === planInfo.planId);
  const isYearly = planInfo.billingCycle === "yearly";
  const price = isYearly ? selectedPlan?.yearlyPrice : selectedPlan?.monthlyPrice;
  const isFree = selectedPlan?.id === "free";

  const getError = (field: string) => errors[field];

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : v;
  };

  // Format expiry as MM/YY
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= 19) {
      onUpdate({ cardNumber: formatted });
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace("/", "");
    const formatted = formatExpiry(value);
    if (formatted.length <= 5) {
      onUpdate({ cardExpiry: formatted });
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/[^0-9]/gi, "");
    if (v.length <= 4) {
      onUpdate({ cardCvv: v });
    }
  };

  // Free plan - no payment required
  if (isFree) {
    return (
      <div className="space-y-6">
        {/* Plan Summary */}
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{selectedPlan?.name} Plan</p>
              <p className="text-sm text-muted-foreground">
                {isYearly ? "Billed annually" : "Billed monthly"}
              </p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-1">
              Free
            </Badge>
          </div>
        </Card>

        {/* No Payment Required Message */}
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No Payment Required
          </h3>
          <p className="text-muted-foreground max-w-md">
            You've selected the Free plan. No credit card or payment information is needed.
            You can upgrade to a paid plan anytime from your dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Plan Summary Card */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">{selectedPlan?.name} Plan</p>
            <p className="text-sm text-muted-foreground">
              {isYearly ? "Billed annually" : "Billed monthly"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">${price}</p>
            <p className="text-sm text-muted-foreground">
              {isYearly ? "per year" : "per month"}
            </p>
          </div>
        </div>
      </Card>

      {/* Payment Method Selection */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Payment Method</Label>
        {getError("paymentMethod") && (
          <p className="text-sm text-destructive">{getError("paymentMethod")}</p>
        )}

        <RadioGroup
          value={data.paymentMethod}
          onValueChange={(value) => onUpdate({ paymentMethod: value })}
          className="grid md:grid-cols-2 gap-4"
        >
          <Label
            htmlFor="credit_card"
            className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
              data.paymentMethod === "credit_card"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <RadioGroupItem value="credit_card" id="credit_card" />
            <CreditCard className={`w-5 h-5 ${data.paymentMethod === "credit_card" ? "text-primary" : "text-muted-foreground"}`} />
            <span className="font-medium">Credit Card</span>
          </Label>

          <Label
            htmlFor="bank_transfer"
            className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
              data.paymentMethod === "bank_transfer"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <RadioGroupItem value="bank_transfer" id="bank_transfer" />
            <Building className={`w-5 h-5 ${data.paymentMethod === "bank_transfer" ? "text-primary" : "text-muted-foreground"}`} />
            <span className="font-medium">Bank Transfer</span>
          </Label>
        </RadioGroup>
      </div>

      {/* Credit Card Form */}
      {data.paymentMethod === "credit_card" && (
        <div className="space-y-4 p-5 bg-muted/30 rounded-lg">
          <div className="space-y-2">
            <Label htmlFor="cardName">Name on Card *</Label>
            <Input
              id="cardName"
              placeholder="John Doe"
              value={data.cardName}
              onChange={(e) => onUpdate({ cardName: e.target.value })}
              className={getError("cardName") ? "border-destructive" : ""}
            />
            {getError("cardName") && (
              <p className="text-sm text-destructive">{getError("cardName")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number *</Label>
            <div className="relative">
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={data.cardNumber}
                onChange={handleCardNumberChange}
                className={`pl-10 ${getError("cardNumber") ? "border-destructive" : ""}`}
              />
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
            {getError("cardNumber") && (
              <p className="text-sm text-destructive">{getError("cardNumber")}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cardExpiry">Expiry Date *</Label>
              <Input
                id="cardExpiry"
                placeholder="MM/YY"
                value={data.cardExpiry}
                onChange={handleExpiryChange}
                className={getError("cardExpiry") ? "border-destructive" : ""}
              />
              {getError("cardExpiry") && (
                <p className="text-sm text-destructive">{getError("cardExpiry")}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardCvv">CVV *</Label>
              <Input
                id="cardCvv"
                type="password"
                placeholder="123"
                value={data.cardCvv}
                onChange={handleCvvChange}
                className={getError("cardCvv") ? "border-destructive" : ""}
              />
              {getError("cardCvv") && (
                <p className="text-sm text-destructive">{getError("cardCvv")}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bank Transfer Form */}
      {data.paymentMethod === "bank_transfer" && (
        <div className="space-y-4 p-5 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Building className="w-5 h-5 text-primary" />
            <h4 className="font-semibold">Bank Account Details</h4>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name *</Label>
            <Input
              id="bankName"
              placeholder="e.g., First Bank"
              value={data.bankName}
              onChange={(e) => onUpdate({ bankName: e.target.value })}
              className={getError("bankName") ? "border-destructive" : ""}
            />
            {getError("bankName") && (
              <p className="text-sm text-destructive">{getError("bankName")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number *</Label>
            <Input
              id="accountNumber"
              placeholder="0123456789"
              value={data.accountNumber}
              onChange={(e) => onUpdate({ accountNumber: e.target.value })}
              className={getError("accountNumber") ? "border-destructive" : ""}
            />
            {getError("accountNumber") && (
              <p className="text-sm text-destructive">{getError("accountNumber")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountName">Account Name *</Label>
            <Input
              id="accountName"
              placeholder="School Account Name"
              value={data.accountName}
              onChange={(e) => onUpdate({ accountName: e.target.value })}
              className={getError("accountName") ? "border-destructive" : ""}
            />
            {getError("accountName") && (
              <p className="text-sm text-destructive">{getError("accountName")}</p>
            )}
          </div>
        </div>
      )}

      {/* Security Note */}
      <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
        <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <p className="text-sm text-muted-foreground">
          Your payment information is encrypted and securely processed. We never store your full card details.
        </p>
      </div>
    </div>
  );
};

export default PaymentSetupStep;