import { Check, Sparkles, Building2, Rocket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SubscriptionPlanData {
  planId: string;
  billingCycle: "monthly" | "yearly";
}

interface SubscriptionPlanStepProps {
  data: SubscriptionPlanData;
  onUpdate: (updates: Partial<SubscriptionPlanData>) => void;
  errors?: { planId?: string };
}

const plans = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for small schools just getting started",
    icon: Sparkles,
    monthlyPrice: 29,
    yearlyPrice: 290,
    features: [
      "Up to 100 students",
      "Up to 5 instructors",
      "Basic reporting",
      "Email support",
      "1 academic year",
    ],
    limits: {
      students: 100,
      instructors: 5,
    },
  },
  {
    id: "professional",
    name: "Professional",
    description: "For growing schools with more needs",
    icon: Building2,
    monthlyPrice: 79,
    yearlyPrice: 790,
    popular: true,
    features: [
      "Up to 500 students",
      "Up to 25 instructors",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
      "API access",
    ],
    limits: {
      students: 500,
      instructors: 25,
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large institutions and school networks",
    icon: Rocket,
    monthlyPrice: 199,
    yearlyPrice: 1990,
    features: [
      "Unlimited students",
      "Unlimited instructors",
      "White-label solution",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
      "Multi-campus support",
    ],
    limits: {
      students: -1,
      instructors: -1,
    },
  },
];

const SubscriptionPlanStep = ({ data, onUpdate, errors }: SubscriptionPlanStepProps) => {
  const isYearly = data.billingCycle === "yearly";
  const savingsPercent = 17;

  return (
    <div className="space-y-6">
      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4 p-4 bg-muted/30 rounded-lg">
        <Label
          className={`cursor-pointer ${!isYearly ? "text-foreground font-medium" : "text-muted-foreground"}`}
        >
          Monthly
        </Label>
        <Switch
          checked={isYearly}
          onCheckedChange={(checked) =>
            onUpdate({ billingCycle: checked ? "yearly" : "monthly" })
          }
        />
        <div className="flex items-center gap-2">
          <Label
            className={`cursor-pointer ${isYearly ? "text-foreground font-medium" : "text-muted-foreground"}`}
          >
            Yearly
          </Label>
          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
            Save {savingsPercent}%
          </Badge>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isSelected = data.planId === plan.id;
          const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
          const period = isYearly ? "/year" : "/month";

          return (
            <div
              key={plan.id}
              className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-lg"
                  : "border-border hover:border-primary/50"
              } ${plan.popular ? "ring-2 ring-primary/20" : ""}`}
              onClick={() => onUpdate({ planId: plan.id })}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                  Most Popular
                </Badge>
              )}

              <div className="text-center mb-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              </div>

              <div className="text-center mb-6">
                <span className="text-4xl font-bold">${price}</span>
                <span className="text-muted-foreground">{period}</span>
              </div>

              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {errors?.planId && (
        <p className="text-sm text-destructive text-center">{errors.planId}</p>
      )}

      {/* Selected Plan Summary */}
      {data.planId && (
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                Selected: {plans.find((p) => p.id === data.planId)?.name} Plan
              </p>
              <p className="text-sm text-muted-foreground">
                Billed {isYearly ? "annually" : "monthly"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">
                ${isYearly
                  ? plans.find((p) => p.id === data.planId)?.yearlyPrice
                  : plans.find((p) => p.id === data.planId)?.monthlyPrice}
              </p>
              <p className="text-sm text-muted-foreground">
                {isYearly ? "per year" : "per month"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Trial Note */}
      <div className="text-center text-sm text-muted-foreground">
        <p>All plans include a 14-day free trial. No credit card required to start.</p>
      </div>
    </div>
  );
};

export default SubscriptionPlanStep;
