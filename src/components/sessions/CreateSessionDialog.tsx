import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Video, Link2, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { LiveSession, LivePlatform } from "@/types/live-session";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Laravel Inertia.js Integration:
// import { router, useForm } from '@inertiajs/react'
// Submit: router.post('/sessions', data)
// Generate link: fetch('/api/sessions/generate-link', { method: 'POST', body: JSON.stringify(data) })

interface CreateSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courses: { id: string; name: string }[];
  onSuccess?: (session: LiveSession) => void;
  editSession?: LiveSession | null;
}

const platformOptions: { value: LivePlatform; label: string; icon: string }[] = [
  { value: "google_meet", label: "Google Meet", icon: "🎥" },
  { value: "zoom", label: "Zoom", icon: "📹" },
  { value: "teams", label: "Microsoft Teams", icon: "💬" },
];

const durationOptions = [
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "1 hour" },
  { value: "90", label: "1.5 hours" },
  { value: "120", label: "2 hours" },
];

const timeSlots = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return {
    value: `${hour.toString().padStart(2, "0")}:${minute}`,
    label: `${displayHour}:${minute} ${period}`,
  };
});

export function CreateSessionDialog({ 
  open, 
  onOpenChange, 
  courses,
  onSuccess,
  editSession 
}: CreateSessionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const { toast } = useToast();

  // Form state
  const [title, setTitle] = useState(editSession?.title || "");
  const [description, setDescription] = useState(editSession?.description || "");
  const [courseId, setCourseId] = useState(editSession?.courseId || "");
  const [platform, setPlatform] = useState<LivePlatform>(editSession?.platform || "google_meet");
  const [date, setDate] = useState<Date | undefined>(
    editSession ? new Date(editSession.scheduledAt) : undefined
  );
  const [time, setTime] = useState(
    editSession ? format(new Date(editSession.scheduledAt), "HH:mm") : "09:00"
  );
  const [duration, setDuration] = useState(editSession?.duration?.toString() || "60");
  const [autoGenerateLink, setAutoGenerateLink] = useState(true);
  const [meetingLink, setMeetingLink] = useState(editSession?.meetingLink || "");
  const [maxParticipants, setMaxParticipants] = useState(
    editSession?.maxParticipants?.toString() || ""
  );

  const handleGenerateLink = async () => {
    if (!date || !courseId) {
      toast({
        title: "Missing information",
        description: "Please select a course and date first.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingLink(true);
    try {
      // Laravel Inertia.js: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock generated link based on platform
      const mockLinks: Record<LivePlatform, string> = {
        google_meet: "https://meet.google.com/abc-defg-hij",
        zoom: "https://zoom.us/j/1234567890",
        teams: "https://teams.microsoft.com/l/meetup-join/...",
      };
      
      setMeetingLink(mockLinks[platform]);
      toast({
        title: "Meeting link generated",
        description: `${platformOptions.find(p => p.value === platform)?.label} link created successfully.`,
      });
    } catch (error) {
      toast({
        title: "Failed to generate link",
        description: "Please try again or enter a link manually.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !courseId || !date) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!meetingLink && !autoGenerateLink) {
      toast({
        title: "Missing meeting link",
        description: "Please generate or enter a meeting link.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Combine date and time
      const [hours, minutes] = time.split(":").map(Number);
      const scheduledAt = new Date(date);
      scheduledAt.setHours(hours, minutes, 0, 0);

      const sessionData = {
        title,
        description,
        courseId,
        platform,
        scheduledAt: scheduledAt.toISOString(),
        duration: parseInt(duration),
        meetingLink: autoGenerateLink ? undefined : meetingLink,
        autoGenerateLink,
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : undefined,
      };

      // Laravel Inertia.js: Replace with router.post('/sessions', sessionData)
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: editSession ? "Session updated" : "Session created",
        description: `Live session scheduled for ${format(scheduledAt, "MMMM d, yyyy 'at' h:mm a")}.`,
      });

      onOpenChange(false);
      // Reset form
      setTitle("");
      setDescription("");
      setCourseId("");
      setDate(undefined);
      setMeetingLink("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            {editSession ? "Edit Live Session" : "Schedule Live Session"}
          </DialogTitle>
          <DialogDescription>
            {editSession 
              ? "Update the details for this live session."
              : "Create a new live class session for your students."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Session Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Week 3: Introduction to Algebra"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Course */}
          <div className="space-y-2">
            <Label>Course *</Label>
            <Select value={courseId} onValueChange={setCourseId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(course => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "MMM d, yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Time *</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {timeSlots.map(slot => (
                    <SelectItem key={slot.value} value={slot.value}>
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Duration & Platform */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {durationOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={platform} onValueChange={(v: LivePlatform) => setPlatform(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {platformOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <span className="flex items-center gap-2">
                        <span>{opt.icon}</span>
                        {opt.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Meeting Link */}
          <div className="space-y-3 p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link2 className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm font-medium">Meeting Link</Label>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="auto-generate" className="text-xs text-muted-foreground">
                  Auto-generate
                </Label>
                <Switch
                  id="auto-generate"
                  checked={autoGenerateLink}
                  onCheckedChange={setAutoGenerateLink}
                />
              </div>
            </div>

            {autoGenerateLink ? (
              <p className="text-sm text-muted-foreground">
                A meeting link will be automatically generated when the session starts.
              </p>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="https://meet.google.com/..."
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGenerateLink}
                    disabled={isGeneratingLink}
                  >
                    {isGeneratingLink ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-1" />
                        Generate
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="What will be covered in this session?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Max Participants */}
          <div className="space-y-2">
            <Label htmlFor="max-participants">Max Participants (Optional)</Label>
            <Input
              id="max-participants"
              type="number"
              placeholder="Leave empty for no limit"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {editSession ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>{editSession ? "Update Session" : "Schedule Session"}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
