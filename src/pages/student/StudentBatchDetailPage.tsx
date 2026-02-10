import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Calendar, FileDown, ExternalLink, Video, FileText, Trophy, MessageCircle, CheckCircle2, XCircle, Clock } from "lucide-react";
import { MOCK_BATCHES } from "@/data/mock-data";
import {
  MOCK_STUDENT_SESSIONS, MOCK_STUDENT_ASSIGNMENTS, MOCK_STUDENT_SUBMISSIONS,
  MOCK_COURSE_MATERIALS, MOCK_BATCH_LEADERBOARD,
} from "@/data/student-mock-data";

// Laravel Inertia.js Integration:
// import { usePage } from '@inertiajs/react'
// const { batch, materials, sessions, assignments, leaderboard } = usePage().props

const StudentBatchDetailPage = () => {
  const { batchId } = useParams();
  const batch = MOCK_BATCHES.find(b => b.id === batchId);

  if (!batch) {
    return <div className="p-6"><p className="text-muted-foreground">Batch not found.</p></div>;
  }

  const completedSessions = MOCK_STUDENT_SESSIONS.filter(s => s.status === "completed").length;
  const totalSessions = MOCK_STUDENT_SESSIONS.length;
  const attendedSessions = MOCK_STUDENT_SESSIONS.filter(s => s.attended).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild><Link to="/student/batches"><ArrowLeft className="h-4 w-4" /></Link></Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{batch.courseName}</h1>
          <p className="text-muted-foreground">{batch.name} • {batch.instructorName}</p>
        </div>
        <Badge className="ml-auto" variant={batch.status === "active" ? "default" : "secondary"}>{batch.status}</Badge>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{completedSessions}/{totalSessions}</p><p className="text-xs text-muted-foreground">Sessions Completed</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{attendedSessions}/{completedSessions}</p><p className="text-xs text-muted-foreground">Attendance Rate</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">#{MOCK_BATCH_LEADERBOARD.find(l => l.studentId === "s-1")?.rank || "-"}</p><p className="text-xs text-muted-foreground">Leaderboard Rank</p></CardContent></Card>
          </div>
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between text-sm"><span>Progress</span><span>{Math.round((completedSessions / totalSessions) * 100)}%</span></div>
              <Progress value={(completedSessions / totalSessions) * 100} className="h-3" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <Calendar className="h-4 w-4" />
                {new Date(batch.startDate).toLocaleDateString("en-NG")} – {new Date(batch.endDate).toLocaleDateString("en-NG")}
              </div>
            </CardContent>
          </Card>
          {batch.whatsAppLink && (
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-sm">{batch.whatsAppGroupName || "WhatsApp Group"}</p>
                    <p className="text-xs text-muted-foreground">Join the class discussion group</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <a href={batch.whatsAppLink} target="_blank" rel="noopener noreferrer">Join <ExternalLink className="h-3 w-3 ml-1" /></a>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Materials */}
        <TabsContent value="materials" className="mt-4">
          <div className="space-y-3">
            {MOCK_COURSE_MATERIALS.map((mat) => (
              <Card key={mat.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {mat.type === "pdf" ? <FileText className="h-5 w-5 text-red-500" /> :
                     mat.type === "video" ? <Video className="h-5 w-5 text-blue-500" /> :
                     <ExternalLink className="h-5 w-5 text-primary" />}
                    <div>
                      <p className="font-medium text-sm">{mat.title}</p>
                      <p className="text-xs text-muted-foreground">{mat.type.toUpperCase()}{mat.size ? ` • ${mat.size}` : ""} • Added {mat.addedAt}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    {mat.type === "pdf" ? <FileDown className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Sessions */}
        <TabsContent value="sessions" className="mt-4">
          <div className="space-y-3">
            {MOCK_STUDENT_SESSIONS.map((session) => (
              <Card key={session.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {session.status === "completed" ? (
                      session.attended ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-destructive" />
                    ) : <Clock className="h-5 w-5 text-primary" />}
                    <div>
                      <p className="font-medium text-sm">{session.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(session.scheduledAt).toLocaleDateString("en-NG", { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })} • {session.duration} min
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={session.status === "completed" ? "secondary" : "default"}>{session.status}</Badge>
                    {session.status === "scheduled" && (
                      <Button size="sm">Join</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Assignments */}
        <TabsContent value="assignments" className="mt-4">
          <div className="space-y-3">
            {MOCK_STUDENT_ASSIGNMENTS.map((assign) => {
              const sub = MOCK_STUDENT_SUBMISSIONS.find(s => s.assignmentId === assign.id);
              return (
                <Card key={assign.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{assign.title}</p>
                      <p className="text-xs text-muted-foreground">Due: {new Date(assign.dueDate).toLocaleDateString("en-NG", { month: "short", day: "numeric" })} • {assign.totalPoints} pts</p>
                      {sub?.feedback && <p className="text-xs text-muted-foreground mt-1 italic">"{sub.feedback}"</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      {sub?.grade !== undefined && <span className="text-sm font-semibold">{sub.grade}/{assign.totalPoints}</span>}
                      <Badge variant={sub?.status === "graded" ? "default" : sub?.status === "submitted" ? "secondary" : "outline"}>
                        {sub?.status || "pending"}
                      </Badge>
                      {sub?.status === "pending" && <Button size="sm">Submit</Button>}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Leaderboard */}
        <TabsContent value="leaderboard" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Trophy className="h-5 w-5 text-yellow-500" /> Batch Leaderboard</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead className="text-right">Attendance</TableHead>
                    <TableHead className="text-right">Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_BATCH_LEADERBOARD.map((entry) => (
                    <TableRow key={entry.studentId} className={entry.studentId === "s-1" ? "bg-primary/5 font-medium" : ""}>
                      <TableCell className="font-bold">{entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : `#${entry.rank}`}</TableCell>
                      <TableCell>{entry.studentName} {entry.studentId === "s-1" && <Badge variant="outline" className="ml-2 text-xs">You</Badge>}</TableCell>
                      <TableCell className="text-right">{entry.overallScore}%</TableCell>
                      <TableCell className="text-right">{entry.attendanceRate}%</TableCell>
                      <TableCell className="text-right">
                        {entry.rankChange && entry.rankChange > 0 ? <span className="text-green-500">↑{entry.rankChange}</span> :
                         entry.rankChange && entry.rankChange < 0 ? <span className="text-destructive">↓{Math.abs(entry.rankChange)}</span> : "–"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentBatchDetailPage;
