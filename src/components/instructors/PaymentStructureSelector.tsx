import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Percent, 
  Banknote, 
  TrendingUp,
  Check,
  Info
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { PaymentTerms, PaymentStructure } from "@/types/instructor";

/**
 * PaymentStructureSelector Component
 * 
 * Laravel Inertia.js Integration:
 * - Values will be passed to InstructorController@store
 * - Payment terms stored in instructor_agreements table
 */

interface PaymentStructureSelectorProps {
  value: PaymentTerms;
  onChange: (terms: PaymentTerms) => void;
  className?: string;
}

const paymentOptions: {
  value: PaymentStructure;
  label: string;
  description: string;
  icon: typeof Percent;
  color: string;
  example: string;
}[] = [
  {
    value: "revenue_share",
    label: "Revenue Share",
    description: "Instructor earns a percentage of course revenue",
    icon: Percent,
    color: "text-primary",
    example: "e.g., 30% of each enrollment fee",
  },
  {
    value: "fixed_salary",
    label: "Fixed Salary",
    description: "Instructor receives a fixed payment per period",
    icon: Banknote,
    color: "text-secondary",
    example: "e.g., ₦150,000/month",
  },
  {
    value: "base_commission",
    label: "Base + Commission",
    description: "Fixed base salary plus percentage of revenue",
    icon: TrendingUp,
    color: "text-accent-foreground",
    example: "e.g., ₦50,000 + 15% of revenue",
  },
];

const PaymentStructureSelector = ({ 
  value, 
  onChange, 
  className 
}: PaymentStructureSelectorProps) => {
  const [selectedStructure, setSelectedStructure] = useState<PaymentStructure>(
    value.structure
  );

  const handleStructureChange = (structure: PaymentStructure) => {
    setSelectedStructure(structure);
    
    // Reset to defaults for new structure
    const newTerms: PaymentTerms = { structure };
    
    switch (structure) {
      case "revenue_share":
        newTerms.revenueSharePercentage = value.revenueSharePercentage || 30;
        break;
      case "fixed_salary":
        newTerms.fixedSalaryAmount = value.fixedSalaryAmount || 100000;
        newTerms.salaryFrequency = value.salaryFrequency || "monthly";
        break;
      case "base_commission":
        newTerms.baseSalaryAmount = value.baseSalaryAmount || 50000;
        newTerms.commissionPercentage = value.commissionPercentage || 15;
        break;
    }
    
    onChange(newTerms);
  };

  const updateTerms = (updates: Partial<PaymentTerms>) => {
    onChange({ ...value, ...updates });
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2">
        <Label className="text-base font-medium">Payment Structure</Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>Choose how the instructor will be compensated. This can be changed later if both parties agree.</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Payment Structure Cards */}
      <div className="grid gap-3">
        {paymentOptions.map((option) => {
          const isSelected = selectedStructure === option.value;
          const Icon = option.icon;
          
          return (
            <motion.div
              key={option.value}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Card
                className={cn(
                  "cursor-pointer transition-all border-2",
                  isSelected 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                )}
                onClick={() => handleStructureChange(option.value)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      isSelected ? "bg-primary/10" : "bg-muted"
                    )}>
                      <Icon className={cn("h-5 w-5", isSelected ? "text-primary" : "text-muted-foreground")} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground">{option.label}</h4>
                        {isSelected && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">{option.example}</p>
                    </div>
                  </div>

                  {/* Expanded Configuration */}
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-border"
                    >
                      {option.value === "revenue_share" && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Revenue Share Percentage</Label>
                            <span className="text-lg font-bold text-primary">
                              {value.revenueSharePercentage || 30}%
                            </span>
                          </div>
                          <Slider
                            value={[value.revenueSharePercentage || 30]}
                            onValueChange={([val]) => updateTerms({ revenueSharePercentage: val })}
                            min={10}
                            max={50}
                            step={5}
                            className="py-2"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>10%</span>
                            <span>50%</span>
                          </div>
                          <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                            Instructor will earn ₦{((value.revenueSharePercentage || 30) * 100).toLocaleString()} 
                            {" "}for every ₦10,000 enrollment
                          </p>
                        </div>
                      )}

                      {option.value === "fixed_salary" && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-sm">Salary Amount (₦)</Label>
                            <Input
                              type="number"
                              value={value.fixedSalaryAmount || 100000}
                              onChange={(e) => updateTerms({ fixedSalaryAmount: Number(e.target.value) })}
                              placeholder="100000"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm">Payment Frequency</Label>
                            <Select
                              value={value.salaryFrequency || "monthly"}
                              onValueChange={(val: 'monthly' | 'weekly' | 'per_course') => 
                                updateTerms({ salaryFrequency: val })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="per_course">Per Course</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}

                      {option.value === "base_commission" && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-sm">Base Salary (₦/month)</Label>
                            <Input
                              type="number"
                              value={value.baseSalaryAmount || 50000}
                              onChange={(e) => updateTerms({ baseSalaryAmount: Number(e.target.value) })}
                              placeholder="50000"
                            />
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">Commission Percentage</Label>
                              <span className="font-bold text-primary">
                                {value.commissionPercentage || 15}%
                              </span>
                            </div>
                            <Slider
                              value={[value.commissionPercentage || 15]}
                              onValueChange={([val]) => updateTerms({ commissionPercentage: val })}
                              min={5}
                              max={30}
                              step={5}
                              className="py-2"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>5%</span>
                              <span>30%</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                            Total: ₦{(value.baseSalaryAmount || 50000).toLocaleString()}/month + {value.commissionPercentage || 15}% of revenue
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentStructureSelector;
