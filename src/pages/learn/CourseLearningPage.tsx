import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Menu,
  X,
  Video,
  FileText,
  Link as LinkIcon,
  Clock,
  BookOpen,
  Calendar,
  MessageCircle,
  Users,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Course, CourseMaterial } from "@/types/course";

/**
 * CourseLearningPage - V3 Batch-Based Learning
 * 
 * Laravel Inertia.js Integration:
 * - Use usePage() to receive batch, course, materials, attendance data
 * 
 * V3 Changes:
 * - Removed module/lesson navigation (no self-paced content)
 * - Focus on: materials, live session info, batch details, leaderboard
 * - Students access materials and join live sessions
 */

// Mock data - V3 structure (no modules/lessons)
const mockCourse: Partial<Course> = {
  id: "1",
  title: "Advanced Mathematics",
  description: "Master calculus, algebra, and geometry through interactive live classes",
  category: "Mathematics",
  academicLevel: "sss_2",
  price: 25000,
  durationWeeks: 12,
  status: "active",
  liveSession: {
    dayOfWeek: "saturday",
    time: "10:00",
    duration: 90,
    platform: "jitsi",
    timezone: "Africa/Lagos",
  },
  whatsApp: {
    enabled: true,
    groupLink: "https://chat.whatsapp.com/example",
  },
  instructor: {
    id: "1",
    name: "Dr. Adaora Nwosu",
    title: "Mathematics Department Head",
  },
  materials: [
    { id: "1", courseId: "1", title: "Course Syllabus", type: "pdf", url: "/materials/syllabus.pdf", order: 0, createdAt: new Date().toISOString() },
    { id: "2", courseId: "1", title: "Introduction Video", type: "video_link", url: "https://youtube.com/watch?v=xyz", order: 1, createdAt: new Date().toISOString() },
    { id: "3", courseId: "1", title: "Week 1 Notes", type: "pdf", url: "/materials/week1.pdf", order: 2, createdAt: new Date().toISOString() },
    { id: "4", courseId: "1", title: "Practice Problems", type: "link", url: "https://example.com/practice", order: 3, createdAt: new Date().toISOString() },
  ],
};

const mockBatch = {
  id: "batch-1",
  name: "January 2025 Batch",
  startDate: "2025-01-15",
  endDate: "2025-04-15",
  currentEnrollment: 25,
  maxStudents: 30,
  nextSession: {
    date: "2025-01-25",
    time: "10:00",
    meetingLink: "https://meet.google.com/abc-defg-hij",
  },
  completedSessions: 2,
  totalSessions: 12,
};

const mockLeaderboard = [
  { rank: 1, name: "Adaeze Okafor", score: 95, avatar: null },
  { rank: 2, name: "Chidi Eze", score: 92, avatar: null },
  { rank: 3, name: "Ngozi Adeyemi", score: 88, avatar: null },
  { rank: 4, name: "You", score: 85, avatar: null, isCurrentUser: true },
  { rank: 5, name: "Emeka Nwankwo", score: 82, avatar: null },
];

const CourseLearningPage = () => {
  const { courseId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const course = mockCourse;
  const batch = mockBatch;
  const leaderboard = mockLeaderboard;

  const progressPercent = Math.round((batch.completedSessions / batch.totalSessions) * 100);

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4" />;
      case "video_link":
        return <Video className="h-4 w-4" />;
      case "link":
        return <LinkIcon className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatNextSession = () => {
    const date = new Date(batch.nextSession.date);
    return date.toLocaleDateString("en-NG", { 
      weekday: "long", 
      month: "short", 
      day: "numeric" 
    });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Sidebar Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "fixed lg:relative inset-y-0 left-0 z-40 w-80 bg-card border-r flex flex-col",
              "lg:translate-x-0"
            )}
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b">
              <Link
                to="/student/dashboard"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
              <h2 className="font-semibold line-clamp-2">{course.title}</h2>
              <p className="text-sm text-muted-foreground mt-1">{batch.name}</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <span>{batch.completedSessions}/{batch.totalSessions} sessions</span>
                <span>•</span>
                <span>{progressPercent}% complete</span>
              </div>
              <Progress value={progressPercent} className="mt-3 h-2" />
            </div>

            {/* Materials List */}
            <ScrollArea className="flex-1">
              <div className="p-4">
                <h3 className="font-medium text-sm text-muted-foreground mb-3">COURSE MATERIALS</h3>
                <div className="space-y-2">
                  {(course.materials || []).map((material) => (
                    <a
                      key={material.id}
                      href={material.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <span className="text-muted-foreground">
                        {getMaterialIcon(material.type)}
                      </span>
                      <span className="text-sm flex-1">{material.title}</span>
                    </a>
                  ))}
                </div>

                {/* Quick Links */}
                <div className="mt-6 space-y-2">
                  <h3 className="font-medium text-sm text-muted-foreground mb-3">QUICK LINKS</h3>
                  
                  {course.whatsApp?.enabled && course.whatsApp.groupLink && (
                    <a
                      href={course.whatsApp.groupLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors text-green-600"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">WhatsApp Group</span>
                    </a>
                  )}
                </div>
              </div>
            </ScrollArea>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-background border-b px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex-1 mx-4 lg:mx-8">
              <h1 className="text-lg font-semibold">{course.title}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                  Live Classes
                </Badge>
                <span>•</span>
                <span>{course.durationWeeks} weeks</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Next Live Session Card */}
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-primary" />
                  Next Live Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold">{formatNextSession()}</p>
                    <p className="text-muted-foreground">
                      {batch.nextSession.time} • {course.liveSession?.duration || 90} minutes
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Via {course.liveSession?.platform === "jitsi" ? "Jitsi Meet" : 
                           course.liveSession?.platform === "zoom" ? "Zoom" : "Custom Platform"}
                    </p>
                  </div>
                  <Button size="lg" asChild>
                    <a href={batch.nextSession.meetingLink} target="_blank" rel="noopener noreferrer">
                      <Video className="h-4 w-4 mr-2" />
                      Join Session
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Calendar className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                  <p className="text-2xl font-bold">{batch.completedSessions}</p>
                  <p className="text-xs text-muted-foreground">Sessions Attended</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                  <p className="text-2xl font-bold">{batch.totalSessions - batch.completedSessions}</p>
                  <p className="text-xs text-muted-foreground">Sessions Left</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                  <p className="text-2xl font-bold">{batch.currentEnrollment}</p>
                  <p className="text-xs text-muted-foreground">Classmates</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Award className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                  <p className="text-2xl font-bold">#4</p>
                  <p className="text-xs text-muted-foreground">Your Rank</p>
                </CardContent>
              </Card>
            </div>

            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Batch Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((student) => (
                    <div
                      key={student.rank}
                      className={cn(
                        "flex items-center gap-4 p-3 rounded-lg",
                        student.isCurrentUser && "bg-primary/10 border border-primary/20"
                      )}
                    >
                      <div className={cn(
                        "flex items-center justify-center h-8 w-8 rounded-full text-sm font-bold",
                        student.rank === 1 && "bg-yellow-500 text-yellow-900",
                        student.rank === 2 && "bg-gray-300 text-gray-700",
                        student.rank === 3 && "bg-orange-400 text-orange-900",
                        student.rank > 3 && "bg-muted text-muted-foreground"
                      )}>
                        {student.rank}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {student.name}
                          {student.isCurrentUser && <Badge variant="outline" className="ml-2 text-xs">You</Badge>}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{student.score}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Course Info */}
            <Card>
              <CardHeader>
                <CardTitle>About This Course</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{course.description}</p>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {course.instructor?.name?.charAt(0) || "I"}
                    </div>
                    <div>
                      <p className="font-medium">{course.instructor?.name}</p>
                      <p className="text-sm text-muted-foreground">{course.instructor?.title}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseLearningPage;
