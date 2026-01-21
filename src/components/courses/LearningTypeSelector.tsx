import { motion } from "framer-motion";
import { BookOpen, Video, Sparkles, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { LearningType, CoursePricing } from "@/types/course";

// Laravel Inertia.js Integration:
// This component receives props from the parent CourseBuilderPage
// State updates are handled locally and propagated via onChange callbacks

interface LearningTypeSelectorProps {
  selectedType: LearningType;
  onTypeChange: (type: LearningType) => void;
  pricing: CoursePricing;
  onPricingChange: (pricing: CoursePricing) => void;
  allowsStudentChoice: boolean;
  onAllowsChoiceChange: (allows: boolean) => void;
}

const learningTypeOptions = [
  {
    id: "self_paced" as LearningType,
    title: "Self-Paced",
    description: "Students learn at their own pace with pre-recorded content",
    icon: BookOpen,
    features: [
      "Pre-recorded video lessons",
      "Downloadable resources",
      "Self-paced quizzes",
      "24/7 access to materials",
    ],
    recommended: "Best for busy students who need flexibility",
    color: "bg-blue-500/10 border-blue-500/30 hover:border-blue-500",
    activeColor: "border-blue-500 ring-2 ring-blue-500/20",
    iconColor: "text-blue-500",
  },
  {
    id: "live_classes" as LearningType,
    title: "Live Classes",
    description: "Real-time instruction with scheduled live sessions",
    icon: Video,
    features: [
      "Live video sessions",
      "Real-time Q&A",
      "WhatsApp group support",
      "Session recordings",
    ],
    recommended: "Best for students who want direct interaction",
    color: "bg-green-500/10 border-green-500/30 hover:border-green-500",
    activeColor: "border-green-500 ring-2 ring-green-500/20",
    iconColor: "text-green-500",
  },
  {
    id: "hybrid" as LearningType,
    title: "Hybrid (Flexible)",
    description: "Offer both options - let students choose their experience",
    icon: Sparkles,
    features: [
      "All self-paced content",
      "Optional live sessions",
      "Student chooses their path",
      "Maximize enrollment",
    ],
    recommended: "Best for maximizing reach and revenue",
    color: "bg-purple-500/10 border-purple-500/30 hover:border-purple-500",
    activeColor: "border-purple-500 ring-2 ring-purple-500/20",
    iconColor: "text-purple-500",
    popular: true,
  },
];

const LearningTypeSelector = ({
  selectedType,
  onTypeChange,
  pricing,
  onPricingChange,
  allowsStudentChoice,
  onAllowsChoiceChange,
}: LearningTypeSelectorProps) => {
  return (
    <div className="space-y-6">
      {/* Learning Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {learningTypeOptions.map((option) => {
          const isSelected = selectedType === option.id;
          const Icon = option.icon;

          return (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`cursor-pointer transition-all relative ${option.color} ${
                  isSelected ? option.activeColor : ""
                }`}
                onClick={() => onTypeChange(option.id)}
              >
                {option.popular && (
                  <Badge className="absolute -top-2 right-4 bg-primary">
                    Most Popular
                  </Badge>
                )}
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-background ${option.iconColor}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{option.title}</h3>
                        {isSelected && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {option.description}
                      </p>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2">
                    {option.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-4 text-xs text-muted-foreground italic">
                    {option.recommended}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Pricing Configuration */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-1">Pricing by Learning Type</h3>
            <p className="text-sm text-muted-foreground">
              Set different prices for each learning experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Self-Paced Price */}
            <div className={`space-y-2 ${selectedType === "live_classes" ? "opacity-50" : ""}`}>
              <Label className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-500" />
                Self-Paced Price (₦)
              </Label>
              <Input
                type="number"
                value={pricing.selfPacedPrice || ""}
                onChange={(e) =>
                  onPricingChange({
                    ...pricing,
                    selfPacedPrice: Number(e.target.value),
                  })
                }
                placeholder="15000"
                disabled={selectedType === "live_classes"}
              />
              <p className="text-xs text-muted-foreground">
                Lower price point for self-directed learners
              </p>
            </div>

            {/* Live Class Price */}
            <div className={`space-y-2 ${selectedType === "self_paced" ? "opacity-50" : ""}`}>
              <Label className="flex items-center gap-2">
                <Video className="h-4 w-4 text-green-500" />
                Live Class Price (₦)
              </Label>
              <Input
                type="number"
                value={pricing.liveClassPrice || ""}
                onChange={(e) =>
                  onPricingChange({
                    ...pricing,
                    liveClassPrice: Number(e.target.value),
                  })
                }
                placeholder="25000"
                disabled={selectedType === "self_paced"}
              />
              <p className="text-xs text-muted-foreground">
                Premium price includes live interaction
              </p>
            </div>
          </div>

          {/* Hybrid Student Choice Toggle */}
          {selectedType === "hybrid" && (
            <div className="flex items-center justify-between p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
              <div>
                <Label className="text-base">Let Students Choose</Label>
                <p className="text-sm text-muted-foreground">
                  Students can pick Self-Paced or Live during enrollment
                </p>
              </div>
              <Switch
                checked={allowsStudentChoice}
                onCheckedChange={onAllowsChoiceChange}
              />
            </div>
          )}

          {/* Price Summary */}
          <div className="p-4 rounded-lg bg-muted/50">
            <h4 className="font-medium mb-2">Price Summary</h4>
            {selectedType === "self_paced" && (
              <p className="text-sm">
                All students pay:{" "}
                <span className="font-semibold">
                  ₦{(pricing.selfPacedPrice || 0).toLocaleString()}
                </span>
              </p>
            )}
            {selectedType === "live_classes" && (
              <p className="text-sm">
                All students pay:{" "}
                <span className="font-semibold">
                  ₦{(pricing.liveClassPrice || 0).toLocaleString()}
                </span>
              </p>
            )}
            {selectedType === "hybrid" && (
              <div className="space-y-1 text-sm">
                <p>
                  Self-Paced option:{" "}
                  <span className="font-semibold">
                    ₦{(pricing.selfPacedPrice || 0).toLocaleString()}
                  </span>
                </p>
                <p>
                  Live Class option:{" "}
                  <span className="font-semibold">
                    ₦{(pricing.liveClassPrice || 0).toLocaleString()}
                  </span>
                </p>
                <p className="text-muted-foreground mt-2">
                  Display as: "From ₦{Math.min(pricing.selfPacedPrice || 0, pricing.liveClassPrice || 0).toLocaleString()}"
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningTypeSelector;
