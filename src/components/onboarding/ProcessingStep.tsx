import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, AlertCircle, Rocket, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ProcessingStepProps {
  schoolName: string;
  onComplete: () => void;
  onRetry: () => void;
}

interface SetupStep {
  id: string;
  label: string;
  status: "pending" | "in-progress" | "completed" | "error";
}

const ProcessingStep = ({ schoolName, onComplete, onRetry }: ProcessingStepProps) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [currentMessage, setCurrentMessage] = useState("Starting setup process...");
  const [subdomain, setSubdomain] = useState("");
  const [setupSteps, setSetupSteps] = useState<SetupStep[]>([
    { id: "validate", label: "Validating information", status: "pending" },
    { id: "account", label: "Creating your account", status: "pending" },
    { id: "platform", label: "Setting up your platform", status: "pending" },
    { id: "finalize", label: "Finalizing configuration", status: "pending" },
  ]);

  // Generate subdomain from school name
  const generateSubdomain = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 20);
  };

  useEffect(() => {
    // TODO: Replace with actual Inertia.js API call
    // import { router } from '@inertiajs/react';
    // router.post('/school/complete-onboarding', data, {
    //   onProgress: (progress) => setProgress(progress.percentage),
    //   onSuccess: () => setStatus('success'),
    //   onError: () => setStatus('error'),
    // });

    const simulateProcessing = async () => {
      const steps = [
        { progress: 15, stepIndex: 0, message: "Validating your information..." },
        { progress: 35, stepIndex: 1, message: "Creating your account..." },
        { progress: 65, stepIndex: 2, message: "Setting up your platform..." },
        { progress: 90, stepIndex: 3, message: "Finalizing configuration..." },
        { progress: 100, stepIndex: -1, message: "All set!" },
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        
        setProgress(steps[i].progress);
        setCurrentMessage(steps[i].message);

        if (steps[i].stepIndex >= 0) {
          setSetupSteps((prev) =>
            prev.map((step, idx) => ({
              ...step,
              status:
                idx < steps[i].stepIndex
                  ? "completed"
                  : idx === steps[i].stepIndex
                  ? "in-progress"
                  : "pending",
            }))
          );
        } else {
          setSetupSteps((prev) =>
            prev.map((step) => ({ ...step, status: "completed" }))
          );
        }
      }

      // Mock success (90% success rate for demo)
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        setSubdomain(generateSubdomain(schoolName));
        setStatus("success");
      } else {
        setStatus("error");
        setCurrentMessage("Something went wrong. Please try again.");
        setSetupSteps((prev) =>
          prev.map((step, idx) =>
            idx === 2 ? { ...step, status: "error" } : step
          )
        );
      }
    };

    simulateProcessing();
  }, [schoolName]);

  const getStepIcon = (step: SetupStep) => {
    switch (step.status) {
      case "completed":
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
          >
            <Check className="w-3.5 h-3.5 text-primary-foreground" />
          </motion.div>
        );
      case "in-progress":
        return (
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
          </div>
        );
      case "error":
        return (
          <div className="w-6 h-6 rounded-full bg-destructive flex items-center justify-center">
            <AlertCircle className="w-3.5 h-3.5 text-destructive-foreground" />
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-muted border-2 border-border" />
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {/* Animated Icon */}
      <AnimatePresence mode="wait">
        {status === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative mb-8"
          >
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center animate-pulse-soft">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping" />
          </motion.div>
        )}

        {status === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="mb-8"
          >
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-glow">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <Check className="w-12 h-12 text-primary-foreground" />
              </motion.div>
            </div>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-destructive" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title */}
      <motion.h2
        key={currentMessage}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-foreground mb-2 text-center"
      >
        {status === "success" ? "All Set!" : status === "error" ? "Setup Failed" : "Setting Up..."}
      </motion.h2>

      {/* Subtitle */}
      <p className="text-muted-foreground text-center mb-8">
        {status === "success"
          ? "Your school platform is ready to use"
          : status === "error"
          ? "We encountered an issue during setup"
          : currentMessage}
      </p>

      {/* Progress Bar */}
      {status === "processing" && (
        <div className="w-full max-w-md mb-8">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground text-center mt-2">
            {progress}% complete
          </p>
        </div>
      )}

      {/* Setup Timeline */}
      <div className="w-full max-w-sm mb-8">
        <div className="space-y-4">
          {setupSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4"
            >
              {getStepIcon(step)}
              <span
                className={`text-sm ${
                  step.status === "completed"
                    ? "text-foreground"
                    : step.status === "in-progress"
                    ? "text-primary font-medium"
                    : step.status === "error"
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Success State: Show Subdomain */}
      {status === "success" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-md space-y-6"
        >
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-2">Your school platform URL</p>
            <div className="flex items-center justify-center gap-2">
              <code className="text-lg font-mono font-semibold text-primary">
                {subdomain}.educonnect.africa
              </code>
              <ExternalLink className="w-4 h-4 text-primary" />
            </div>
          </div>

          <Button
            onClick={onComplete}
            className="w-full gap-2"
            size="lg"
          >
            <Rocket className="w-4 h-4" />
            Go to Dashboard
          </Button>
        </motion.div>
      )}

      {/* Error State: Retry Button */}
      {status === "error" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <p className="text-sm text-muted-foreground text-center">
            Don't worry, your information has been saved. Please try again.
          </p>
          <Button onClick={onRetry} variant="outline" size="lg">
            Try Again
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default ProcessingStep;