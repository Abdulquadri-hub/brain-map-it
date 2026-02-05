import { ExternalLink, MessageCircle, Users, Edit2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Laravel Inertia.js Integration:
// WhatsApp links are verified server-side before display
// Only enrolled students and assigned instructors can see the link

interface WhatsAppGroupCardProps {
  batchName: string;
  courseName: string;
  groupName?: string;
  link: string;
  memberCount?: number;
  onEdit?: () => void;
  canEdit?: boolean;
}

export function WhatsAppGroupCard({
  batchName,
  courseName,
  groupName,
  link,
  memberCount,
  onEdit,
  canEdit = false,
}: WhatsAppGroupCardProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast({
      title: "Link copied",
      description: "WhatsApp group link copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinGroup = () => {
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <Card className="overflow-hidden border-green-200 bg-gradient-to-br from-green-50 to-background dark:from-green-950/20 dark:to-background">
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-green-500 text-white">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">WhatsApp Community</h3>
              <p className="text-sm text-muted-foreground">{courseName}</p>
            </div>
          </div>
          {canEdit && onEdit && (
            <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8">
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Group Info */}
        <div className="mt-4 space-y-3">
          <div className="p-3 rounded-lg bg-background border">
            <p className="text-sm font-medium text-foreground">
              {groupName || `${batchName} Group`}
            </p>
            {memberCount && (
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>{memberCount} members</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button 
              onClick={handleJoinGroup}
              className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
            >
              <ExternalLink className="h-4 w-4" />
              Join WhatsApp Group
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyLink}
              className="shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Security Note */}
        <p className="mt-3 text-xs text-muted-foreground text-center">
          Only visible to enrolled students and instructors
        </p>
      </CardContent>
    </Card>
  );
}
