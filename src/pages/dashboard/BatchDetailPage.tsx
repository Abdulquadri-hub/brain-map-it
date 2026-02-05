import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  ArrowLeft,
  Users,
  Calendar,
  User,
  Video,
  MessageCircle,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Trophy,
  FileText,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WhatsAppGroupCard } from "@/components/batches/WhatsAppGroupCard";
import { SessionCard } from "@/components/sessions/SessionCard";
import { CreateSessionDialog } from "@/components/sessions/CreateSessionDialog";
import { Batch, BatchLeaderboard, BatchEnrollment } from "@/types/batch";
import { LiveSession } from "@/types/live-session";
import { useToast } from "@/hooks/use-toast";

// Laravel Inertia.js Integration:
// import { usePage, router } from '@inertiajs/react'
// interface Props { batch: Batch; students: Student[]; sessions: LiveSession[]; leaderboard: BatchLeaderboard[] }
// const { batch, students, sessions, leaderboard } = usePage<Props>().props

// Mock data
const mockBatch: Batch = {
  id: "1",
  courseId: "1",
  courseName: "Mathematics for JSS1",
  name: "January 2025 Batch",
  description: "First batch of the year for JSS1 Mathematics covering algebra, geometry, and arithmetic.",
  startDate: "2025-01-15",
  endDate: "2025-04-15",
  maxStudents: 30,
  currentEnrollment: 25,
  status: "active",
  instructorId: "inst-1",
  instructorName: "Dr. Sarah Johnson",
  whatsAppLink: "https://chat.whatsapp.com/abc123xyz",
  whatsAppGroupName: "Math Masters Jan 2025",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockStudents = [
  { id: "s1", name: "Chidi Okoro", email: "chidi@example.com", avatar: "", enrolledAt: "2025-01-10", paymentStatus: "completed" as const, grade: 85 },
  { id: "s2", name: "Amara Eze", email: "amara@example.com", avatar: "", enrolledAt: "2025-01-11", paymentStatus: "completed" as const, grade: 92 },
  { id: "s3", name: "Tunde Bakare", email: "tunde@example.com", avatar: "", enrolledAt: "2025-01-12", paymentStatus: "pending" as const, grade: 78 },
  { id: "s4", name: "Ngozi Adeyemi", email: "ngozi@example.com", avatar: "", enrolledAt: "2025-01-13", paymentStatus: "completed" as const, grade: 88 },
  { id: "s5", name: "Emeka Obi", email: "emeka@example.com", avatar: "", enrolledAt: "2025-01-14", paymentStatus: "completed" as const, grade: 95 },
];

const mockLeaderboard: BatchLeaderboard[] = [
  { batchId: "1", studentId: "s5", studentName: "Emeka Obi", overallScore: 95, assignmentAvg: 94, quizAvg: 96, attendanceRate: 100, participationScore: 90, rank: 1, previousRank: 1 },
  { batchId: "1", studentId: "s2", studentName: "Amara Eze", overallScore: 92, assignmentAvg: 90, quizAvg: 94, attendanceRate: 100, participationScore: 88, rank: 2, previousRank: 3, rankChange: 1 },
  { batchId: "1", studentId: "s4", studentName: "Ngozi Adeyemi", overallScore: 88, assignmentAvg: 86, quizAvg: 90, attendanceRate: 95, participationScore: 85, rank: 3, previousRank: 2, rankChange: -1 },
  { batchId: "1", studentId: "s1", studentName: "Chidi Okoro", overallScore: 85, assignmentAvg: 82, quizAvg: 88, attendanceRate: 100, participationScore: 80, rank: 4, previousRank: 4 },
  { batchId: "1", studentId: "s3", studentName: "Tunde Bakare", overallScore: 78, assignmentAvg: 75, quizAvg: 81, attendanceRate: 85, participationScore: 75, rank: 5, previousRank: 5 },
];

const mockSessions: LiveSession[] = [
  {
    id: "1",
    courseId: "1",
    courseName: "Mathematics for JSS1",
    title: "Week 5: Introduction to Algebra",
    scheduledAt: new Date().toISOString(),
    duration: 60,
    platform: "jitsi",
    meetingLink: "https://meet.jit.si/teach-math-session",
    status: "scheduled",
    instructorId: "inst-1",
    instructorName: "Dr. Sarah Johnson",
    enrolledCount: 25,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const BatchDetailPage = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [batch] = useState<Batch>(mockBatch);
  const [createSessionOpen, setCreateSessionOpen] = useState(false);
  const { toast } = useToast();

  const enrollmentPercentage = (batch.currentEnrollment / batch.maxStudents) * 100;

  const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
    open: { label: "Enrolling", variant: "default" },
    active: { label: "In Progress", variant: "secondary" },
    closed: { label: "Closed", variant: "outline" },
    completed: { label: "Completed", variant: "outline" },
  };

  const status = statusConfig[batch.status];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard/batches")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{batch.name}</h1>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
            <p className="text-muted-foreground mt-1">{batch.courseName}</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit Batch
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Batch Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Batch
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {batch.currentEnrollment}/{batch.maxStudents}
                </p>
                <p className="text-xs text-muted-foreground">Students</p>
              </div>
            </div>
            <Progress value={enrollmentPercentage} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/50">
                <Calendar className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {format(new Date(batch.startDate), "MMM d")} - {format(new Date(batch.endDate), "MMM d")}
                </p>
                <p className="text-xs text-muted-foreground">Duration</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {batch.instructorName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{batch.instructorName}</p>
                <p className="text-xs text-muted-foreground">Instructor</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent">
                <Video className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockSessions.length}</p>
                <p className="text-xs text-muted-foreground">Live Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* WhatsApp Group Card */}
      {batch.whatsAppLink && (
        <WhatsAppGroupCard
          batchName={batch.name}
          courseName={batch.courseName || ""}
          groupName={batch.whatsAppGroupName}
          link={batch.whatsAppLink}
          memberCount={batch.currentEnrollment}
          canEdit={true}
          onEdit={() => toast({ title: "Edit WhatsApp group", description: "Opening editor..." })}
        />
      )}

      {/* Tabs */}
      <Tabs defaultValue="students" className="space-y-4">
        <TabsList>
          <TabsTrigger value="students" className="gap-2">
            <Users className="h-4 w-4" />
            Students
          </TabsTrigger>
          <TabsTrigger value="sessions" className="gap-2">
            <Video className="h-4 w-4" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="gap-2">
            <Trophy className="h-4 w-4" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="materials" className="gap-2">
            <FileText className="h-4 w-4" />
            Materials
          </TabsTrigger>
        </TabsList>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Students</CardTitle>
              <CardDescription>
                {batch.currentEnrollment} students enrolled in this batch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Enrolled</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={student.avatar} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {student.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {student.email}
                      </TableCell>
                      <TableCell>
                        {format(new Date(student.enrolledAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={student.paymentStatus === "completed" ? "default" : "destructive"}
                        >
                          {student.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {student.grade}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Live Sessions</h3>
            <Button onClick={() => setCreateSessionOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Schedule Session
            </Button>
          </div>
          <div className="space-y-3">
            {mockSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
          {mockSessions.length === 0 && (
            <Card className="py-12">
              <CardContent className="text-center">
                <Video className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">No sessions scheduled</h3>
                <p className="text-muted-foreground mt-1">
                  Schedule your first live session for this batch
                </p>
                <Button className="mt-4" onClick={() => setCreateSessionOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Session
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Batch Leaderboard
              </CardTitle>
              <CardDescription>
                Student rankings based on overall performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead className="text-right">Assignments</TableHead>
                    <TableHead className="text-right">Quizzes</TableHead>
                    <TableHead className="text-right">Attendance</TableHead>
                    <TableHead className="text-right">Overall</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLeaderboard.map((entry) => (
                    <TableRow key={entry.studentId}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${entry.rank <= 3 ? "text-yellow-500" : ""}`}>
                            #{entry.rank}
                          </span>
                          {entry.rankChange !== undefined && entry.rankChange !== 0 && (
                            <span className={`text-xs ${entry.rankChange > 0 ? "text-green-500" : "text-red-500"}`}>
                              {entry.rankChange > 0 ? `↑${entry.rankChange}` : `↓${Math.abs(entry.rankChange)}`}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={entry.studentAvatar} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {entry.studentName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{entry.studentName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{entry.assignmentAvg}%</TableCell>
                      <TableCell className="text-right">{entry.quizAvg}%</TableCell>
                      <TableCell className="text-right">{entry.attendanceRate}%</TableCell>
                      <TableCell className="text-right font-bold">{entry.overallScore}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Materials Tab */}
        <TabsContent value="materials" className="space-y-4">
          <Card className="py-12">
            <CardContent className="text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">No materials uploaded</h3>
              <p className="text-muted-foreground mt-1">
                Upload course materials for students in this batch
              </p>
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Upload Materials
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Session Dialog */}
      <CreateSessionDialog
        open={createSessionOpen}
        onOpenChange={setCreateSessionOpen}
        courses={[{ id: batch.courseId, name: batch.courseName || "" }]}
      />
    </div>
  );
};

export default BatchDetailPage;
