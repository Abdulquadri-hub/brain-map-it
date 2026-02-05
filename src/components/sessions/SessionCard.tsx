import { format, formatDistanceToNow, isPast, isFuture } from "date-fns";
import { 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  ExternalLink, 
  Play, 
  CheckCircle2,
  XCircle,
  MoreVertical,
  Copy,
  Edit,
  Trash2,
  UserCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LiveSession, LivePlatform } from "@/types/live-session";
import { cn } from "@/lib/utils";

// Laravel Inertia.js Integration:
// import { router } from '@inertiajs/react'
// Actions: router.post('/sessions/:id/start'), router.delete('/sessions/:id')

interface SessionCardProps {
  session: LiveSession;
  onStart?: (session: LiveSession) => void;
  onEdit?: (session: LiveSession) => void;
  onDelete?: (session: LiveSession) => void;
  onViewAttendance?: (session: LiveSession) => void;
  onCopyLink?: (session: LiveSession) => void;
}

const platformConfig: Record<LivePlatform, { name: string; color: string; icon: string }> = {
  jitsi: { name: "Jitsi Meet", color: "bg-orange-500", icon: "🎥" },
  zoom: { name: "Zoom", color: "bg-blue-500", icon: "📹" },
  custom: { name: "Custom", color: "bg-gray-500", icon: "🔗" },
};

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  scheduled: { label: "Scheduled", variant: "outline" },
  live: { label: "Live Now", variant: "default" },
  completed: { label: "Completed", variant: "secondary" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

export function SessionCard({ 
  session, 
  onStart, 
  onEdit, 
  onDelete, 
  onViewAttendance,
  onCopyLink 
}: SessionCardProps) {
  const scheduledDate = new Date(session.scheduledAt);
  const isUpcoming = isFuture(scheduledDate) && session.status === "scheduled";
  const isLive = session.status === "live";
  const platform = platformConfig[session.platform];
  const status = statusConfig[session.status];

  const canStart = isUpcoming && 
    new Date().getTime() >= scheduledDate.getTime() - 15 * 60 * 1000; // 15 min before

  return (
    <Card className={cn(
      "transition-all hover:shadow-md",
      isLive && "ring-2 ring-primary animate-pulse"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Platform Icon */}
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center text-lg",
              platform.color,
              "text-white"
            )}>
              {platform.icon}
            </div>

            <div className="flex-1 min-w-0">
              {/* Title & Course */}
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-medium text-foreground truncate">
                  {session.title}
                </h3>
                <Badge variant={status.variant} className="shrink-0">
                  {isLive && <span className="w-2 h-2 bg-white rounded-full animate-pulse mr-1" />}
                  {status.label}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground truncate mt-0.5">
                {session.courseName}
              </p>

              {/* Session Details */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{format(scheduledDate, "MMM d, yyyy")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{format(scheduledDate, "h:mm a")} ({session.duration} min)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  <span>{session.attendeeCount ?? 0}/{session.enrolledCount} attended</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-2 mt-3">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={session.instructorAvatar} />
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {session.instructorName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">
                  {session.instructorName}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Primary Action Based on Status */}
            {isLive && session.meetingLink && (
              <Button size="sm" className="gap-1" asChild>
                <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                  <Video className="h-4 w-4" />
                  Join Now
                </a>
              </Button>
            )}

            {canStart && (
              <Button size="sm" className="gap-1" onClick={() => onStart?.(session)}>
                <Play className="h-4 w-4" />
                Start Session
              </Button>
            )}

            {isUpcoming && !canStart && (
              <div className="text-sm text-muted-foreground">
                Starts {formatDistanceToNow(scheduledDate, { addSuffix: true })}
              </div>
            )}

            {session.status === "completed" && (
              <Button 
                size="sm" 
                variant="outline" 
                className="gap-1"
                onClick={() => onViewAttendance?.(session)}
              >
                <UserCheck className="h-4 w-4" />
                Attendance
              </Button>
            )}

            {/* More Options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {session.meetingLink && (
                  <DropdownMenuItem onClick={() => onCopyLink?.(session)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Meeting Link
                  </DropdownMenuItem>
                )}
                {session.meetingLink && (
                  <DropdownMenuItem asChild>
                    <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open in {platform.name}
                    </a>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onViewAttendance?.(session)}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  View Attendance
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {session.status === "scheduled" && (
                  <DropdownMenuItem onClick={() => onEdit?.(session)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Session
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onClick={() => onDelete?.(session)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {session.status === "scheduled" ? "Cancel Session" : "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
