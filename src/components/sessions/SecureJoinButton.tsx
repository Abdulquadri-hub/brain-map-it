import { useState } from "react";
import { Video, Lock, Clock, Loader2, ExternalLink, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LiveSession, SecureSessionLink } from "@/types/live-session";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow, isFuture, isPast, addMinutes, subMinutes } from "date-fns";

// Laravel Inertia.js Integration:
// Secure link generation: fetch('/api/sessions/{id}/generate-link')
// Access validation: fetch('/api/sessions/{id}/validate-access')
// The backend verifies:
// 1. User is enrolled in the batch
// 2. Token is valid and not expired
// 3. Session is within valid time window (15 min before to 30 min after)

interface SecureJoinButtonProps {
  session: LiveSession;
  userType: "student" | "instructor";
  isEnrolled?: boolean;
  onJoinSuccess?: (link: string) => void;
}

export function SecureJoinButton({
  session,
  userType,
  isEnrolled = true,
  onJoinSuccess,
}: SecureJoinButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [secureLink, setSecureLink] = useState<SecureSessionLink | null>(null);
  const { toast } = useToast();

  const scheduledAt = new Date(session.scheduledAt);
  const sessionEnd = addMinutes(scheduledAt, session.duration);
  const validFrom = subMinutes(scheduledAt, 15); // 15 min before
  const validUntil = addMinutes(sessionEnd, 30); // 30 min after
  const now = new Date();

  const isWithinValidWindow = now >= validFrom && now <= validUntil;
  const isLive = session.status === "live";
  const isTooEarly = now < validFrom;
  const isTooLate = now > validUntil;
  const canJoin = isEnrolled && isWithinValidWindow && (isLive || session.status === "scheduled");

  const generateSecureLink = async () => {
    if (!isEnrolled) {
      toast({
        title: "Access denied",
        description: "You must be enrolled in this batch to join the session.",
        variant: "destructive",
      });
      return;
    }

    if (isTooEarly) {
      toast({
        title: "Session not available yet",
        description: `You can join 15 minutes before the session starts.`,
        variant: "destructive",
      });
      return;
    }

    if (isTooLate) {
      toast({
        title: "Session has ended",
        description: "This session is no longer available to join.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Laravel Inertia.js: Replace with actual API call
      // const response = await fetch(`/api/sessions/${session.id}/generate-link`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userType })
      // });
      
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock secure link generation
      const mockSecureLink: SecureSessionLink = {
        id: `link-${Date.now()}`,
        sessionId: session.id,
        batchId: session.courseId, // Should be batchId in real implementation
        token: `secure-token-${Math.random().toString(36).substr(2, 16)}`,
        userId: "current-user-id",
        userType,
        generatedAt: new Date().toISOString(),
        validFrom: validFrom.toISOString(),
        validUntil: validUntil.toISOString(),
        isUsed: false,
      };

      setSecureLink(mockSecureLink);

      // Build secure meeting URL with token
      const meetingUrl = session.meetingLink || `https://meet.jit.si/teach-${session.id}`;
      const secureUrl = `${meetingUrl}?token=${mockSecureLink.token}`;

      toast({
        title: "Secure link generated",
        description: "Opening meeting in a new tab...",
      });

      // Open in new tab
      window.open(secureUrl, "_blank", "noopener,noreferrer");
      onJoinSuccess?.(secureUrl);

    } catch (error) {
      toast({
        title: "Failed to join",
        description: "Could not generate secure link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Render different states
  if (!isEnrolled) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" disabled className="gap-2">
            <Lock className="h-4 w-4" />
            Not Enrolled
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>You must be enrolled in this batch to join</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  if (isTooEarly) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" disabled className="gap-2">
          <Clock className="h-4 w-4" />
          Starts {formatDistanceToNow(scheduledAt, { addSuffix: true })}
        </Button>
      </div>
    );
  }

  if (isTooLate) {
    return (
      <Button variant="outline" disabled className="gap-2">
        <Lock className="h-4 w-4" />
        Session Ended
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button 
        onClick={generateSecureLink} 
        disabled={isLoading || !canJoin}
        className="gap-2"
        variant={isLive ? "default" : "secondary"}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            {isLive ? (
              <>
                <Video className="h-4 w-4" />
                Join Live Class
              </>
            ) : (
              <>
                <ExternalLink className="h-4 w-4" />
                Join Session
              </>
            )}
          </>
        )}
      </Button>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className="gap-1 cursor-help">
            <Shield className="h-3 w-3" />
            Secured
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="font-medium mb-1">Secure Session Link</p>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>• Unique link generated for you</li>
            <li>• Cannot be shared or reused</li>
            <li>• Valid from 15 min before to 30 min after session</li>
          </ul>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
