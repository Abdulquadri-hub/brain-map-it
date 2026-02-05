import { useState, useMemo } from "react";
import { format, isToday, isTomorrow, isThisWeek, isPast, addDays } from "date-fns";
import { motion } from "framer-motion";
import { 
  Video, 
  Calendar as CalendarIcon, 
  List, 
  Plus, 
  Search,
  Filter,
  Clock,
  Users,
  TrendingUp,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SessionCard } from "@/components/sessions/SessionCard";
import { SessionCalendar } from "@/components/sessions/SessionCalendar";
import { AttendanceTracker } from "@/components/sessions/AttendanceTracker";
import { CreateSessionDialog } from "@/components/sessions/CreateSessionDialog";
import { LiveSession, SessionAttendee } from "@/types/live-session";
import { useToast } from "@/hooks/use-toast";

// Laravel Inertia.js Integration:
// import { usePage, router } from '@inertiajs/react'
// interface Props { sessions: LiveSession[]; courses: Course[]; stats: SessionStats }
// const { sessions, courses, stats } = usePage<Props>().props

// Mock data for development
const mockCourses = [
  { id: "1", name: "Mathematics for JSS1" },
  { id: "2", name: "English Language - Primary 5" },
  { id: "3", name: "Physics for SSS2" },
  { id: "4", name: "Web Development Bootcamp" },
];

const mockSessions: LiveSession[] = [
  {
    id: "1",
    courseId: "1",
    courseName: "Mathematics for JSS1",
    title: "Week 5: Introduction to Algebra",
    description: "Learn the basics of algebraic expressions",
    scheduledAt: new Date().toISOString(),
    duration: 60,
    platform: "jitsi",
    meetingLink: "https://meet.jit.si/teach-math-session",
    status: "live",
    instructorId: "inst-1",
    instructorName: "Dr. Sarah Johnson",
    enrolledCount: 45,
    attendeeCount: 38,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    courseId: "2",
    courseName: "English Language - Primary 5",
    title: "Grammar: Tenses and Conjugation",
    scheduledAt: addDays(new Date(), 1).toISOString(),
    duration: 45,
    platform: "zoom",
    meetingLink: "https://zoom.us/j/1234567890",
    status: "scheduled",
    instructorId: "inst-2",
    instructorName: "Mrs. Adaeze Okonkwo",
    enrolledCount: 32,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    courseId: "3",
    courseName: "Physics for SSS2",
    title: "Newton's Laws of Motion",
    scheduledAt: addDays(new Date(), 2).toISOString(),
    duration: 90,
    platform: "custom",
    status: "scheduled",
    instructorId: "inst-1",
    instructorName: "Dr. Sarah Johnson",
    enrolledCount: 28,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    courseId: "1",
    courseName: "Mathematics for JSS1",
    title: "Week 4: Number Systems Review",
    scheduledAt: addDays(new Date(), -3).toISOString(),
    duration: 60,
    platform: "jitsi",
    status: "completed",
    instructorId: "inst-1",
    instructorName: "Dr. Sarah Johnson",
    enrolledCount: 45,
    attendeeCount: 41,
    recordingUrl: "https://example.com/recording",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    courseId: "4",
    courseName: "Web Development Bootcamp",
    title: "React Components Deep Dive",
    scheduledAt: addDays(new Date(), -7).toISOString(),
    duration: 120,
    platform: "zoom",
    status: "completed",
    instructorId: "inst-3",
    instructorName: "Emmanuel Tech",
    enrolledCount: 55,
    attendeeCount: 48,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockAttendees: SessionAttendee[] = [
  { id: "a1", sessionId: "4", studentId: "s1", studentName: "Chidi Okoro", studentEmail: "chidi@example.com", status: "present", joinedAt: new Date().toISOString(), duration: 58 },
  { id: "a2", sessionId: "4", studentId: "s2", studentName: "Amara Eze", studentEmail: "amara@example.com", status: "present", joinedAt: new Date().toISOString(), duration: 60 },
  { id: "a3", sessionId: "4", studentId: "s3", studentName: "Tunde Bakare", studentEmail: "tunde@example.com", status: "late", joinedAt: new Date().toISOString(), duration: 45 },
  { id: "a4", sessionId: "4", studentId: "s4", studentName: "Ngozi Adeyemi", studentEmail: "ngozi@example.com", status: "absent" },
  { id: "a5", sessionId: "4", studentId: "s5", studentName: "Emeka Obi", studentEmail: "emeka@example.com", status: "present", joinedAt: new Date().toISOString(), duration: 55 },
];

const LiveSessionsPage = () => {
  const [sessions, setSessions] = useState<LiveSession[]>(mockSessions);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [attendanceSession, setAttendanceSession] = useState<LiveSession | null>(null);
  const [editSession, setEditSession] = useState<LiveSession | null>(null);
  const { toast } = useToast();

  // Stats
  const stats = useMemo(() => ({
    totalSessions: sessions.length,
    liveSessions: sessions.filter(s => s.status === "live").length,
    upcomingSessions: sessions.filter(s => s.status === "scheduled").length,
    avgAttendance: Math.round(
      sessions
        .filter(s => s.status === "completed" && s.attendeeCount)
        .reduce((acc, s) => acc + (s.attendeeCount! / s.enrolledCount) * 100, 0) /
      (sessions.filter(s => s.status === "completed" && s.attendeeCount).length || 1)
    ),
  }), [sessions]);

  // Filtered sessions
  const filteredSessions = useMemo(() => {
    return sessions.filter(session => {
      const matchesSearch = 
        session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.instructorName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || session.status === statusFilter;
      const matchesCourse = courseFilter === "all" || session.courseId === courseFilter;
      
      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [sessions, searchQuery, statusFilter, courseFilter]);

  // Group sessions by time period for list view
  const groupedSessions = useMemo(() => {
    const live = filteredSessions.filter(s => s.status === "live");
    const today = filteredSessions.filter(s => 
      s.status === "scheduled" && isToday(new Date(s.scheduledAt))
    );
    const tomorrow = filteredSessions.filter(s => 
      s.status === "scheduled" && isTomorrow(new Date(s.scheduledAt))
    );
    const thisWeek = filteredSessions.filter(s => 
      s.status === "scheduled" && 
      !isToday(new Date(s.scheduledAt)) && 
      !isTomorrow(new Date(s.scheduledAt)) &&
      isThisWeek(new Date(s.scheduledAt))
    );
    const upcoming = filteredSessions.filter(s => 
      s.status === "scheduled" && !isThisWeek(new Date(s.scheduledAt))
    );
    const past = filteredSessions.filter(s => 
      s.status === "completed" || s.status === "cancelled"
    ).sort((a, b) => 
      new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
    );

    return { live, today, tomorrow, thisWeek, upcoming, past };
  }, [filteredSessions]);

  const handleStartSession = (session: LiveSession) => {
    // Laravel Inertia.js: Replace with router.post(`/sessions/${session.id}/start`)
    setSessions(prev => 
      prev.map(s => s.id === session.id ? { ...s, status: "live" as const } : s)
    );
    toast({
      title: "Session started",
      description: "Students can now join the live session.",
    });
  };

  const handleDeleteSession = (session: LiveSession) => {
    // Laravel Inertia.js: Replace with router.delete(`/sessions/${session.id}`)
    setSessions(prev => prev.filter(s => s.id !== session.id));
    toast({
      title: session.status === "scheduled" ? "Session cancelled" : "Session deleted",
      description: "The session has been removed.",
    });
  };

  const handleCopyLink = (session: LiveSession) => {
    if (session.meetingLink) {
      navigator.clipboard.writeText(session.meetingLink);
      toast({
        title: "Link copied",
        description: "Meeting link copied to clipboard.",
      });
    }
  };

  const renderSessionGroup = (title: string, sessions: LiveSession[], icon?: React.ReactNode) => {
    if (sessions.length === 0) return null;
    
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          {icon}
          <span>{title}</span>
          <Badge variant="secondary" className="ml-auto">
            {sessions.length}
          </Badge>
        </div>
        <div className="space-y-3">
          {sessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <SessionCard
                session={session}
                onStart={handleStartSession}
                onEdit={(s) => {
                  setEditSession(s);
                  setCreateDialogOpen(true);
                }}
                onDelete={handleDeleteSession}
                onViewAttendance={setAttendanceSession}
                onCopyLink={handleCopyLink}
              />
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Video className="h-6 w-6 text-primary" />
            Live Sessions
          </h1>
          <p className="text-muted-foreground mt-1">
            Schedule and manage live classes for your courses
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Schedule Session
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Video className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalSessions}</p>
                <p className="text-xs text-muted-foreground">Total Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <div className="w-5 h-5 rounded-full bg-red-500 animate-pulse" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.liveSessions}</p>
                <p className="text-xs text-muted-foreground">Live Now</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.upcomingSessions}</p>
                <p className="text-xs text-muted-foreground">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.avgAttendance}%</p>
                <p className="text-xs text-muted-foreground">Avg. Attendance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {mockCourses.map(course => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="rounded-none"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("calendar")}
              className="rounded-none"
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === "list" ? (
        <div className="space-y-6">
          {/* Live Sessions */}
          {renderSessionGroup(
            "Live Now",
            groupedSessions.live,
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          )}

          {/* Today */}
          {renderSessionGroup("Today", groupedSessions.today)}

          {/* Tomorrow */}
          {renderSessionGroup("Tomorrow", groupedSessions.tomorrow)}

          {/* This Week */}
          {renderSessionGroup("This Week", groupedSessions.thisWeek)}

          {/* Upcoming */}
          {renderSessionGroup("Upcoming", groupedSessions.upcoming)}

          {/* Past Sessions */}
          {groupedSessions.past.length > 0 && (
            <div className="pt-4 border-t border-border">
              {renderSessionGroup(
                "Past Sessions",
                groupedSessions.past.slice(0, 5),
                <CheckCircle2 className="h-4 w-4" />
              )}
              {groupedSessions.past.length > 5 && (
                <Button variant="ghost" className="w-full mt-2">
                  View all past sessions ({groupedSessions.past.length})
                </Button>
              )}
            </div>
          )}

          {/* Empty State */}
          {filteredSessions.length === 0 && (
            <div className="text-center py-12">
              <Video className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">No sessions found</h3>
              <p className="text-muted-foreground mt-1">
                {searchQuery || statusFilter !== "all" || courseFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Schedule your first live session to get started"}
              </p>
              {!searchQuery && statusFilter === "all" && courseFilter === "all" && (
                <Button 
                  className="mt-4"
                  onClick={() => setCreateDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Session
                </Button>
              )}
            </div>
          )}
        </div>
      ) : (
        <SessionCalendar
          sessions={filteredSessions}
          onSessionClick={setAttendanceSession}
          onDateClick={(date) => {
            // Could open create dialog with pre-filled date
            console.log("Date clicked:", date);
          }}
        />
      )}

      {/* Create/Edit Session Dialog */}
      <CreateSessionDialog
        open={createDialogOpen}
        onOpenChange={(open) => {
          setCreateDialogOpen(open);
          if (!open) setEditSession(null);
        }}
        courses={mockCourses}
        editSession={editSession}
      />

      {/* Attendance Tracker Dialog */}
      {attendanceSession && (
        <AttendanceTracker
          session={attendanceSession}
          attendees={mockAttendees}
          open={!!attendanceSession}
          onOpenChange={(open) => !open && setAttendanceSession(null)}
          onSave={(attendees) => {
            // Laravel Inertia.js: Handle in the component
            console.log("Save attendees:", attendees);
          }}
        />
      )}
    </div>
  );
};

export default LiveSessionsPage;
