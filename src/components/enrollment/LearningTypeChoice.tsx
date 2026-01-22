import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, BookOpen, Video, Users, MessageCircle, Clock, Zap } from "lucide-react";
import { LearningType } from "@/types/course";

interface LearningOption {
  type: LearningType;
  title: string;
  description: string;
  price: number;
  features: string[];
  icon: React.ReactNode;
  recommended?: boolean;
  perfectFor: string;
}

interface LearningTypeChoiceProps {
  courseName: string;
  selfPacedPrice: number;
  liveClassPrice: number;
  selectedType: LearningType | null;
  onSelect: (type: LearningType) => void;
  onNext: () => void;
  onBack: () => void;
}

const LearningTypeChoice = ({
  courseName,
  selfPacedPrice,
  liveClassPrice,
  selectedType,
  onSelect,
  onNext,
  onBack,
}: LearningTypeChoiceProps) => {
  const options: LearningOption[] = [
    {
      type: "self_paced",
      title: "Self-Paced Learning",
      description: "Learn at your own speed with lifetime access to all course materials",
      price: selfPacedPrice,
      icon: <BookOpen className="h-8 w-8" />,
      perfectFor: "Busy professionals and self-motivated learners",
      features: [
        "Access all video lessons anytime",
        "Downloadable course materials",
        "Practice quizzes & assignments",
        "Lifetime access to content",
        "Learn at your own pace",
        "Email support within 48 hours",
      ],
    },
    {
      type: "live_classes",
      title: "Live Classes",
      description: "Join interactive live sessions with real-time instructor support",
      price: liveClassPrice,
      icon: <Video className="h-8 w-8" />,
      recommended: true,
      perfectFor: "Students who thrive with structure and interaction",
      features: [
        "Everything in Self-Paced, plus:",
        "Weekly live class sessions",
        "Real-time Q&A with instructor",
        "WhatsApp study group access",
        "Session recordings (if you miss)",
        "Priority instructor support",
        "Structured weekly schedule",
        "Peer collaboration opportunities",
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Choose Your Learning Experience</h2>
        <p className="text-muted-foreground mt-2">
          Select how you'd like to learn <span className="font-medium text-foreground">{courseName}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {options.map((option) => {
          const isSelected = selectedType === option.type;

          return (
            <Card
              key={option.type}
              className={`cursor-pointer transition-all relative ${
                isSelected
                  ? "border-primary ring-2 ring-primary/20"
                  : "hover:border-muted-foreground/50"
              }`}
              onClick={() => onSelect(option.type)}
            >
              {option.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    <Zap className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <div className={`mx-auto mb-3 p-3 rounded-full ${
                  isSelected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  {option.icon}
                </div>
                <CardTitle className="text-xl">{option.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">₦{option.price.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">one-time payment</div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    Perfect for: {option.perfectFor}
                  </div>
                  <ul className="space-y-2">
                    {option.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {option.type === "live_classes" && (
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Live sessions: Saturdays, 10 AM - 12 PM</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>WhatsApp group for discussions</span>
                    </div>
                  </div>
                )}

                <Button
                  className="w-full"
                  variant={isSelected ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(option.type);
                  }}
                >
                  {isSelected ? "Selected" : "Select This Option"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Comparison Note */}
      <div className="bg-muted/50 rounded-lg p-4 text-center">
        <p className="text-sm text-muted-foreground">
          💡 <strong>Not sure?</strong> Live Classes include everything in Self-Paced plus interactive sessions. 
          You can always upgrade later!
        </p>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!selectedType}>
          Continue to Payment
        </Button>
      </div>
    </div>
  );
};

export default LearningTypeChoice;
