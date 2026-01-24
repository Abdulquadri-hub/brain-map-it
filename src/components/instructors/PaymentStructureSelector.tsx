import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Banknote,
  Users,
  Calendar,
  Settings,
  Check,
  Info
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { PaymentTerms, PaymentStructure, PAYMENT_STRUCTURE_LABELS, PAYMENT_STRUCTURE_DESCRIPTIONS } from "@/types/instructor";

/**
 * PaymentStructureSelector Component - V3 Simplified
 * 
 * Laravel Inertia.js Integration:
 * - Values will be passed to InstructorController@store
 * - Payment terms stored in instructor_agreements table
 * 
 * V3 Changes:
 * - Simplified to: per_batch, per_student, monthly, custom
 * - Removed revenue_share and base_commission
 * - Note: School owner handles payments directly, not platform
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
  icon: typeof Banknote;
  color: string;
  example: string;
}[] = [
  {
    value: "per_batch",
    label: PAYMENT_STRUCTURE_LABELS.per_batch,
    description: PAYMENT_STRUCTURE_DESCRIPTIONS.per_batch,
    icon: Calendar,
    color: "text-primary",
    example: "e.g., ₦20,000 per batch taught",
  },
  {
    value: "per_student",
    label: PAYMENT_STRUCTURE_LABELS.per_student,
    description: PAYMENT_STRUCTURE_DESCRIPTIONS.per_student,
    icon: Users,
    color: "text-secondary",
    example: "e.g., ₦2,000 per enrolled student",
  },
  {
    value: "monthly",
    label: PAYMENT_STRUCTURE_LABELS.monthly,
    description: PAYMENT_STRUCTURE_DESCRIPTIONS.monthly,
    icon: Banknote,
    color: "text-accent-foreground",
    example: "e.g., ₦150,000/month",
  },
  {
    value: "custom",
    label: PAYMENT_STRUCTURE_LABELS.custom,
    description: PAYMENT_STRUCTURE_DESCRIPTIONS.custom,
    icon: Settings,
    color: "text-muted-foreground",
    example: "Define your own terms",
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
      case "per_batch":
        newTerms.perBatchAmount = value.perBatchAmount || 20000;
        break;
      case "per_student":
        newTerms.perStudentAmount = value.perStudentAmount || 2000;
        break;
      case "monthly":
        newTerms.monthlyAmount = value.monthlyAmount || 100000;
        break;
      case "custom":
        newTerms.customDescription = value.customDescription || "";
        newTerms.customAmount = value.customAmount || 0;
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
            <p>Choose how you will compensate the instructor. Payments are handled directly by you, not the platform.</p>
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
                      {option.value === "per_batch" && (
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label className="text-sm">Amount per Batch (₦)</Label>
                            <Input
                              type="number"
                              value={value.perBatchAmount || 20000}
                              onChange={(e) => updateTerms({ perBatchAmount: Number(e.target.value) })}
                              placeholder="20000"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                            Instructor earns ₦{(value.perBatchAmount || 20000).toLocaleString()} for each batch they teach
                          </p>
                        </div>
                      )}

                      {option.value === "per_student" && (
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label className="text-sm">Amount per Student (₦)</Label>
                            <Input
                              type="number"
                              value={value.perStudentAmount || 2000}
                              onChange={(e) => updateTerms({ perStudentAmount: Number(e.target.value) })}
                              placeholder="2000"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                            With 20 students in a batch, instructor earns ₦{((value.perStudentAmount || 2000) * 20).toLocaleString()}
                          </p>
                        </div>
                      )}

                      {option.value === "monthly" && (
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label className="text-sm">Monthly Salary (₦)</Label>
                            <Input
                              type="number"
                              value={value.monthlyAmount || 100000}
                              onChange={(e) => updateTerms({ monthlyAmount: Number(e.target.value) })}
                              placeholder="100000"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                            Fixed monthly payment of ₦{(value.monthlyAmount || 100000).toLocaleString()}
                          </p>
                        </div>
                      )}

                      {option.value === "custom" && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-sm">Custom Amount (₦)</Label>
                            <Input
                              type="number"
                              value={value.customAmount || 0}
                              onChange={(e) => updateTerms({ customAmount: Number(e.target.value) })}
                              placeholder="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm">Agreement Details</Label>
                            <Textarea
                              value={value.customDescription || ""}
                              onChange={(e) => updateTerms({ customDescription: e.target.value })}
                              placeholder="Describe the custom payment arrangement..."
                              rows={3}
                            />
                          </div>
                        </div>
                      )}

                      {/* Notes field for all structures */}
                      <div className="mt-4 space-y-2">
                        <Label className="text-sm">Additional Notes (Optional)</Label>
                        <Textarea
                          value={value.notes || ""}
                          onChange={(e) => updateTerms({ notes: e.target.value })}
                          placeholder="Any additional payment notes..."
                          rows={2}
                        />
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Platform Note */}
      <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
        💡 <strong>Note:</strong> Payments are handled directly by you (school owner). 
        This platform tracks payment agreements for record-keeping only.
      </div>
    </div>
  );
};

export default PaymentStructureSelector;
