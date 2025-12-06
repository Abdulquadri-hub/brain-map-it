import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Building, Smartphone, Wallet } from "lucide-react";

interface PaymentData {
  currency: string;
  paymentMethods: string[];
  bankName: string;
  accountNumber: string;
  accountName: string;
  mobileMoneyProvider: string;
  mobileMoneyNumber: string;
}

interface PaymentSetupStepProps {
  data: PaymentData;
  onUpdate: (updates: Partial<PaymentData>) => void;
  errors?: { [key: string]: string | undefined };
}

const currencies = [
  { value: "NGN", label: "Nigerian Naira (₦)" },
  { value: "KES", label: "Kenyan Shilling (KSh)" },
  { value: "GHS", label: "Ghanaian Cedi (₵)" },
  { value: "ZAR", label: "South African Rand (R)" },
  { value: "TZS", label: "Tanzanian Shilling (TSh)" },
  { value: "UGX", label: "Ugandan Shilling (USh)" },
  { value: "RWF", label: "Rwandan Franc (FRw)" },
  { value: "USD", label: "US Dollar ($)" },
];

const mobileMoneyProviders = [
  { value: "mpesa", label: "M-Pesa" },
  { value: "mtn", label: "MTN Mobile Money" },
  { value: "airtel", label: "Airtel Money" },
  { value: "vodafone", label: "Vodafone Cash" },
  { value: "orange", label: "Orange Money" },
  { value: "opay", label: "OPay" },
  { value: "palmpay", label: "PalmPay" },
];

const paymentMethodOptions = [
  { id: "bank_transfer", label: "Bank Transfer", icon: Building },
  { id: "mobile_money", label: "Mobile Money", icon: Smartphone },
  { id: "card", label: "Card Payments", icon: CreditCard },
  { id: "cash", label: "Cash Payments", icon: Wallet },
];

const PaymentSetupStep = ({ data, onUpdate, errors = {} }: PaymentSetupStepProps) => {
  const togglePaymentMethod = (methodId: string) => {
    const updated = data.paymentMethods.includes(methodId)
      ? data.paymentMethods.filter((m) => m !== methodId)
      : [...data.paymentMethods, methodId];
    onUpdate({ paymentMethods: updated });
  };

  const getError = (field: string) => errors[field];

  const showBankDetails = data.paymentMethods.includes("bank_transfer");
  const showMobileMoneyDetails = data.paymentMethods.includes("mobile_money");

  return (
    <div className="space-y-6">
      {/* Currency Selection */}
      <div className="space-y-2">
        <Label htmlFor="currency">Primary Currency *</Label>
        <Select
          value={data.currency}
          onValueChange={(value) => onUpdate({ currency: value })}
        >
          <SelectTrigger className={getError("currency") ? "border-destructive" : ""}>
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((currency) => (
              <SelectItem key={currency.value} value={currency.value}>
                {currency.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          This will be used for all fee collections and payments
        </p>
      </div>

      {/* Payment Methods */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-semibold">Accepted Payment Methods *</Label>
          <p className="text-sm text-muted-foreground">
            Select all payment methods you want to accept
          </p>
          {getError("paymentMethods") && (
            <p className="text-sm text-destructive mt-1">{getError("paymentMethods")}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {paymentMethodOptions.map((method) => {
            const Icon = method.icon;
            const isSelected = data.paymentMethods.includes(method.id);

            return (
              <div
                key={method.id}
                className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/50"
                }`}
                onClick={() => togglePaymentMethod(method.id)}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => togglePaymentMethod(method.id)}
                />
                <Icon className={`w-5 h-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                <span className="font-medium">{method.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bank Transfer Details */}
      {showBankDetails && (
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-primary" />
            <h4 className="font-semibold">Bank Account Details</h4>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
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

      {/* Mobile Money Details */}
      {showMobileMoneyDetails && (
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-primary" />
            <h4 className="font-semibold">Mobile Money Details</h4>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mobileMoneyProvider">Provider *</Label>
              <Select
                value={data.mobileMoneyProvider}
                onValueChange={(value) => onUpdate({ mobileMoneyProvider: value })}
              >
                <SelectTrigger className={getError("mobileMoneyProvider") ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {mobileMoneyProviders.map((provider) => (
                    <SelectItem key={provider.value} value={provider.value}>
                      {provider.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getError("mobileMoneyProvider") && (
                <p className="text-sm text-destructive">{getError("mobileMoneyProvider")}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobileMoneyNumber">Mobile Number *</Label>
              <Input
                id="mobileMoneyNumber"
                type="tel"
                placeholder="+234 800 000 0000"
                value={data.mobileMoneyNumber}
                onChange={(e) => onUpdate({ mobileMoneyNumber: e.target.value })}
                className={getError("mobileMoneyNumber") ? "border-destructive" : ""}
              />
              {getError("mobileMoneyNumber") && (
                <p className="text-sm text-destructive">{getError("mobileMoneyNumber")}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Card Payments Note */}
      {data.paymentMethods.includes("card") && (
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <h4 className="font-semibold">Card Payments</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Card payment integration will be set up after onboarding. We support Paystack,
            Flutterwave, and Stripe for secure online payments.
          </p>
        </div>
      )}

      {/* Security Note */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Security:</strong> Your payment information is encrypted and securely stored.
          We use industry-standard security measures to protect your financial data.
        </p>
      </div>
    </div>
  );
};

export default PaymentSetupStep;
