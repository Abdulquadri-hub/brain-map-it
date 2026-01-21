import { useState } from "react";
import { Plus, Trash2, Video, Clock, Calendar, Users, Link2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LiveSessionConfig, LiveSessionSchedule, LivePlatform, WhatsAppConfig } from "@/types/course";

// Laravel Inertia.js Integration:
// This component manages live session configuration
// Data is saved via the parent CourseBuilderPage form submission

interface LiveSessionPlannerProps {
  config: LiveSessionConfig | undefined;
  onConfigChange: (config: LiveSessionConfig) => void;
  whatsApp: WhatsAppConfig | undefined;
  onWhatsAppChange: (config: WhatsAppConfig) => void;
  disabled?: boolean;
}

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const platformOptions: { id: LivePlatform; name: string; icon: string }[] = [
  { id: "google_meet", name: "Google Meet", icon: "🎥" },
  { id: "zoom", name: "Zoom", icon: "💻" },
  { id: "teams", name: "Microsoft Teams", icon: "📺" },
];

const durationOptions = [
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
];

const defaultConfig: LiveSessionConfig = {
  platform: "google_meet",
  schedule: [],
  autoGenerateLink: true,
  recordSessions: true,
};

const defaultWhatsApp: WhatsAppConfig = {
  enabled: false,
  accessType: "live_only",
};

const LiveSessionPlanner = ({
  config = defaultConfig,
  onConfigChange,
  whatsApp = defaultWhatsApp,
  onWhatsAppChange,
  disabled = false,
}: LiveSessionPlannerProps) => {
  const [newSchedule, setNewSchedule] = useState<Partial<LiveSessionSchedule>>({
    dayOfWeek: "Saturday",
    time: "10:00",
    duration: 60,
  });

  const handleAddSchedule = () => {
    if (!newSchedule.dayOfWeek || !newSchedule.time) return;
    
    const schedule: LiveSessionSchedule = {
      dayOfWeek: newSchedule.dayOfWeek,
      time: newSchedule.time,
      duration: newSchedule.duration || 60,
    };
    
    onConfigChange({
      ...config,
      schedule: [...config.schedule, schedule],
    });
    
    // Reset for next entry
    setNewSchedule({
      dayOfWeek: "Saturday",
      time: "10:00",
      duration: 60,
    });
  };

  const handleRemoveSchedule = (index: number) => {
    onConfigChange({
      ...config,
      schedule: config.schedule.filter((_, i) => i !== index),
    });
  };

  if (disabled) {
    return (
      <Card className="opacity-50">
        <CardContent className="p-6 text-center">
          <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Live session settings are only available for Live Classes and Hybrid courses
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Platform Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Video className="h-5 w-5" />
            Video Platform
          </CardTitle>
          <CardDescription>
            Choose your preferred platform for live sessions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {platformOptions.map((platform) => (
              <button
                key={platform.id}
                onClick={() => onConfigChange({ ...config, platform: platform.id })}
                className={`p-4 rounded-lg border-2 transition-all text-center ${
                  config.platform === platform.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <span className="text-2xl block mb-2">{platform.icon}</span>
                <span className="text-sm font-medium">{platform.name}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div>
              <Label>Auto-Generate Meeting Links</Label>
              <p className="text-xs text-muted-foreground">
                Automatically create meeting links for each session
              </p>
            </div>
            <Switch
              checked={config.autoGenerateLink}
              onCheckedChange={(checked) =>
                onConfigChange({ ...config, autoGenerateLink: checked })
              }
            />
          </div>

          {!config.autoGenerateLink && (
            <div className="space-y-2">
              <Label>Custom Meeting Link</Label>
              <Input
                value={config.meetingLink || ""}
                onChange={(e) =>
                  onConfigChange({ ...config, meetingLink: e.target.value })
                }
                placeholder="https://meet.google.com/xxx-xxxx-xxx"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Schedule
          </CardTitle>
          <CardDescription>
            Set recurring live class times (students will see this on the course page)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing Schedules */}
          {config.schedule.length > 0 && (
            <div className="space-y-2">
              {config.schedule.map((schedule, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                >
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">{schedule.dayOfWeek}</Badge>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{schedule.time}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {schedule.duration} minutes
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveSchedule(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Schedule */}
          <div className="grid grid-cols-4 gap-3 items-end">
            <div className="space-y-2">
              <Label>Day</Label>
              <Select
                value={newSchedule.dayOfWeek}
                onValueChange={(value) =>
                  setNewSchedule({ ...newSchedule, dayOfWeek: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border">
                  {daysOfWeek.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Input
                type="time"
                value={newSchedule.time || ""}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, time: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Duration</Label>
              <Select
                value={String(newSchedule.duration)}
                onValueChange={(value) =>
                  setNewSchedule({ ...newSchedule, duration: Number(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border">
                  {durationOptions.map((opt) => (
                    <SelectItem key={opt.value} value={String(opt.value)}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddSchedule}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          {config.schedule.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No sessions scheduled yet. Add your first live class time above.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Session Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Session Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div>
              <Label>Record Sessions</Label>
              <p className="text-xs text-muted-foreground">
                Automatically record and save live sessions for replay
              </p>
            </div>
            <Switch
              checked={config.recordSessions}
              onCheckedChange={(checked) =>
                onConfigChange({ ...config, recordSessions: checked })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Maximum Participants (Optional)</Label>
            <Input
              type="number"
              value={config.maxParticipants || ""}
              onChange={(e) =>
                onConfigChange({
                  ...config,
                  maxParticipants: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              placeholder="Leave empty for unlimited"
            />
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            WhatsApp Group
          </CardTitle>
          <CardDescription>
            Create a community for your live class students
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div>
              <Label>Enable WhatsApp Group</Label>
              <p className="text-xs text-muted-foreground">
                Share a WhatsApp group link with enrolled students
              </p>
            </div>
            <Switch
              checked={whatsApp.enabled}
              onCheckedChange={(checked) =>
                onWhatsAppChange({ ...whatsApp, enabled: checked })
              }
            />
          </div>

          {whatsApp.enabled && (
            <>
              <div className="space-y-2">
                <Label>Group Invite Link</Label>
                <Input
                  value={whatsApp.groupLink || ""}
                  onChange={(e) =>
                    onWhatsAppChange({ ...whatsApp, groupLink: e.target.value })
                  }
                  placeholder="https://chat.whatsapp.com/xxxxxxx"
                />
              </div>

              <div className="space-y-2">
                <Label>Who can access?</Label>
                <Select
                  value={whatsApp.accessType}
                  onValueChange={(value: "live_only" | "all_students") =>
                    onWhatsAppChange({ ...whatsApp, accessType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border">
                    <SelectItem value="live_only">
                      Live Class Students Only
                    </SelectItem>
                    <SelectItem value="all_students">
                      All Enrolled Students
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveSessionPlanner;
