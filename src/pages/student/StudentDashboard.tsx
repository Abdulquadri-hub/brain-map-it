import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UsersRound, Video, FileText, Trophy, ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { MOCK_STUDENT_ASSIGNMENTS, MOCK_STUDENT_SUBMISSIONS, MOCK_BATCH_LEADERBOARD, MOCK_STUDENT_SESSIONS } from "@/data/student-mock-data";
import { MOCK_BATCHES } from "@/data/mock-data";

// Laravel Inertia.js Integration:
// import { usePage } from '@inertiajs/react'
// const { stats, nextSession, batches, assignments } = usePage().props

const StudentDashboard = () => {
  const enrolledBatches = MOCK_BATCHES.filter(b => b.id === "batch-1");
  const completedSessions = MOCK_STUDENT_SESSIONS.filter(s => s.status === "completed").length;
  const totalSessions = MOCK_STUDENT_SESSIONS.length;
  const pendingAssignments = MOCK_STUDENT_SUBMISSIONS.filter(s => s.status === "pending").length;
  const studentRank = MOCK_BATCH_LEADERBOARD.find(l => l.studentId === "s-1");
  const nextSession = MOCK_STUDENT_SESSIONS.find(s => s.status === "scheduled");

  const stats = [
    { label: "Active Batches", value: enrolledBatches.length, icon: UsersRound, color: "text-primary" },
    { label: "Upcoming Sessions", value: MOCK_STUDENT_SESSIONS.filter(s => s.status === "scheduled").length, icon: Video, color: "text-secondary" },
    { label: "Pending Assignments", value: pendingAssignments, icon: FileText, color: "text-orange-500" },
    { label: "Overall Rank", value: `#${studentRank?.rank || "-"}`, icon: Trophy, color: "text-yellow-500" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome back, Chidera! 👋</h1>
        <p className="text-muted-foreground">Here's your learning progress overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Session */}
        {nextSession && (
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" /> Next Live Session
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <h3 className="font-semibold">{nextSession.title}</h3>
              <p className="text-sm text-muted-foreground">{nextSession.courseName}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {new Date(nextSession.scheduledAt).toLocaleDateString("en-NG", { weekday: "long", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{nextSession.platform}</Badge>
                <Badge variant="outline">{nextSession.duration} min</Badge>
              </div>
              <Button className="w-full mt-2" asChild>
                <Link to="/student/sessions">Join Session</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Active Batches */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Active Batches</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/student/batches">View All <ArrowRight className="h-4 w-4 ml-1" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {enrolledBatches.map((batch) => (
              <Link key={batch.id} to={`/student/batch/${batch.id}`} className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{batch.courseName}</h4>
                    <p className="text-sm text-muted-foreground">{batch.name} • {batch.instructorName}</p>
                  </div>
                  <Badge variant={batch.status === "active" ? "default" : "secondary"}>{batch.status}</Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Sessions Progress</span>
                    <span>{completedSessions}/{totalSessions}</span>
                  </div>
                  <Progress value={(completedSessions / totalSessions) * 100} className="h-2" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Assignments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Recent Assignments</CardTitle>
            <CardDescription>Your latest assignment activity</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/student/assignments">View All <ArrowRight className="h-4 w-4 ml-1" /></Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {MOCK_STUDENT_ASSIGNMENTS.map((assign) => {
              const submission = MOCK_STUDENT_SUBMISSIONS.find(s => s.assignmentId === assign.id);
              return (
                <div key={assign.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <h4 className="font-medium text-sm">{assign.title}</h4>
                    <p className="text-xs text-muted-foreground">Due: {new Date(assign.dueDate).toLocaleDateString("en-NG", { month: "short", day: "numeric" })}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {submission?.grade && (
                      <span className="text-sm font-semibold">{submission.grade}/{assign.totalPoints}</span>
                    )}
                    <Badge variant={
                      submission?.status === "graded" ? "default" :
                      submission?.status === "submitted" ? "secondary" : "outline"
                    }>
                      {submission?.status || "pending"}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
