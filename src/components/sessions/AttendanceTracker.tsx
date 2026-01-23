import { useState } from "react";
import { format } from "date-fns";
import { 
  UserCheck, 
  UserX, 
  Clock, 
  AlertCircle,
  Save,
  Download,
  Search,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LiveSession, SessionAttendee, AttendanceStatus } from "@/types/live-session";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Laravel Inertia.js Integration:
// import { router } from '@inertiajs/react'
// Save: router.post('/sessions/:id/attendance', { attendees })
// Export: window.location.href = '/sessions/:id/attendance/export'

interface AttendanceTrackerProps {
  session: LiveSession;
  attendees: SessionAttendee[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (attendees: SessionAttendee[]) => void;
}

const statusConfig: Record<AttendanceStatus, { 
  label: string; 
  icon: React.ReactNode; 
  color: string;
  bgColor: string;
}> = {
  present: { 
    label: "Present", 
    icon: <UserCheck className="h-4 w-4" />, 
    color: "text-green-600",
    bgColor: "bg-green-100"
  },
  absent: { 
    label: "Absent", 
    icon: <UserX className="h-4 w-4" />, 
    color: "text-red-600",
    bgColor: "bg-red-100"
  },
  late: { 
    label: "Late", 
    icon: <Clock className="h-4 w-4" />, 
    color: "text-yellow-600",
    bgColor: "bg-yellow-100"
  },
  excused: { 
    label: "Excused", 
    icon: <AlertCircle className="h-4 w-4" />, 
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
};

export function AttendanceTracker({ 
  session, 
  attendees: initialAttendees, 
  open, 
  onOpenChange,
  onSave 
}: AttendanceTrackerProps) {
  const [attendees, setAttendees] = useState<SessionAttendee[]>(initialAttendees);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const filteredAttendees = attendees.filter(a => 
    a.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.studentEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    present: attendees.filter(a => a.status === "present").length,
    absent: attendees.filter(a => a.status === "absent").length,
    late: attendees.filter(a => a.status === "late").length,
    excused: attendees.filter(a => a.status === "excused").length,
  };

  const attendanceRate = attendees.length > 0 
    ? Math.round(((stats.present + stats.late) / attendees.length) * 100)
    : 0;

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendees(prev => 
      prev.map(a => a.studentId === studentId ? { ...a, status } : a)
    );
  };

  const handleNotesChange = (studentId: string, notes: string) => {
    setAttendees(prev => 
      prev.map(a => a.studentId === studentId ? { ...a, notes } : a)
    );
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    setAttendees(prev => prev.map(a => ({ ...a, status })));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Laravel Inertia.js: Replace with router.post('/sessions/:id/attendance', { attendees })
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave?.(attendees);
      toast({
        title: "Attendance saved",
        description: "Attendance records have been updated successfully.",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error saving attendance",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    // Laravel Inertia.js: Replace with window.location.href = '/sessions/:id/attendance/export'
    toast({
      title: "Export started",
      description: "Your attendance report is being downloaded.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Attendance: {session.title}</DialogTitle>
          <DialogDescription>
            {format(new Date(session.scheduledAt), "EEEE, MMMM d, yyyy 'at' h:mm a")} • {session.duration} minutes
          </DialogDescription>
        </DialogHeader>

        {/* Stats Summary */}
        <div className="grid grid-cols-5 gap-4 py-4 border-b border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{attendees.length}</div>
            <div className="text-xs text-muted-foreground">Total Enrolled</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.present}</div>
            <div className="text-xs text-muted-foreground">Present</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
            <div className="text-xs text-muted-foreground">Late</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
            <div className="text-xs text-muted-foreground">Absent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{attendanceRate}%</div>
            <div className="text-xs text-muted-foreground">Attendance Rate</div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center gap-3 py-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Mark all:</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleMarkAll("present")}
              className="text-green-600 border-green-200 hover:bg-green-50"
            >
              <UserCheck className="h-4 w-4 mr-1" />
              Present
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleMarkAll("absent")}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <UserX className="h-4 w-4 mr-1" />
              Absent
            </Button>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="flex-1 overflow-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Student</TableHead>
                <TableHead className="w-[150px]">Status</TableHead>
                <TableHead className="w-[120px]">Join Time</TableHead>
                <TableHead className="w-[100px]">Duration</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendees.map((attendee) => {
                const config = statusConfig[attendee.status];
                return (
                  <TableRow key={attendee.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={attendee.studentAvatar} />
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {attendee.studentName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{attendee.studentName}</div>
                          <div className="text-xs text-muted-foreground">
                            {attendee.studentEmail}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={attendee.status}
                        onValueChange={(value: AttendanceStatus) => 
                          handleStatusChange(attendee.studentId, value)
                        }
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(statusConfig).map(([status, cfg]) => (
                            <SelectItem key={status} value={status}>
                              <span className={cn("flex items-center gap-2", cfg.color)}>
                                {cfg.icon}
                                {cfg.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {attendee.joinedAt ? (
                        <span className="text-sm">
                          {format(new Date(attendee.joinedAt), "h:mm a")}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {attendee.duration ? (
                        <span className="text-sm">{attendee.duration} min</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="Add notes..."
                        value={attendee.notes || ""}
                        onChange={(e) => handleNotesChange(attendee.studentId, e.target.value)}
                        className="h-8 text-sm"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Attendance
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
