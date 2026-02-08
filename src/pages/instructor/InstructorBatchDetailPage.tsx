import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users, Calendar, Video, MessageCircle, Award, ClipboardCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { MOCK_BATCHES } from "@/data/mock-data";
import {
  MOCK_BATCH_STUDENTS,
  MOCK_INSTRUCTOR_SESSIONS,
  MOCK_PENDING_SUBMISSIONS,
} from "@/data/instructor-mock-data";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  open: "bg-blue-100 text-blue-700",
  closed: "bg-muted text-muted-foreground",
  completed: "bg-primary/10 text-primary",
};

const InstructorBatchDetailPage = () => {
  const { batchId } = useParams();
  const batch = MOCK_BATCHES.find((b) => b.id === batchId);

  if (!batch) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-foreground">Batch not found</h2>
        <Button variant="ghost" asChild className="mt-4">
          <Link to="/instructor/batches"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Batches</Link>
        </Button>
      </div>
    );
  }

  const students = MOCK_BATCH_STUDENTS[batch.id] || [];
  const batchSessions = MOCK_INSTRUCTOR_SESSIONS.filter((s) => s.courseId === batch.courseId);
  const batchSubmissions = MOCK_PENDING_SUBMISSIONS.filter((s) => s.status === "submitted");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/instructor/batches"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-display font-bold text-foreground">{batch.name}</h1>
            <Badge className={statusColors[batch.status]}>{batch.status}</Badge>
          </div>
          <p className="text-muted-foreground">{batch.courseName}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="h-5 w-5 text-secondary" />
            <div>
              <p className="text-2xl font-bold text-foreground">{batch.currentEnrollment}</p>
              <p className="text-xs text-muted-foreground">of {batch.maxStudents} students</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Video className="h-5 w-5 text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">{batchSessions.filter(s => s.status === "scheduled").length}</p>
              <p className="text-xs text-muted-foreground">upcoming sessions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <ClipboardCheck className="h-5 w-5 text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">{batchSubmissions.length}</p>
              <p className="text-xs text-muted-foreground">pending grades</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">{format(new Date(batch.startDate), "MMM d")}</p>
              <p className="text-xs text-muted-foreground">to {format(new Date(batch.endDate), "MMM d, yyyy")}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="students" className="w-full">
        <TabsList>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="grading">Grading</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        {/* Students Tab */}
        <TabsContent value="students">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Submissions</TableHead>
                    <TableHead>Last Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={student.attendanceRate} className="w-16 h-2" />
                          <span className="text-sm text-muted-foreground">{student.attendanceRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-foreground">{student.currentGrade}%</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {student.submissionsGraded} graded, {student.submissionsPending} pending
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(student.lastActivity), "MMM d, h:mm a")}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                  {students.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No students in this batch yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions">
          <div className="space-y-3">
            {batchSessions.map((session) => (
              <Card key={session.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Video className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{session.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(session.scheduledAt), "EEEE, MMM d, yyyy 'at' h:mm a")}
                        {" • "}{session.duration} min
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={session.status === "completed" ? "secondary" : "default"}>
                      {session.status}
                    </Badge>
                    {session.status === "scheduled" && (
                      <Button size="sm">Join Session</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {batchSessions.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No sessions scheduled for this batch
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Grading Tab */}
        <TabsContent value="grading">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pending Submissions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Attachments</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batchSubmissions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium text-foreground">{sub.studentName}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {sub.submittedAt ? format(new Date(sub.submittedAt), "MMM d, h:mm a") : "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {sub.attachments.length} file{sub.attachments.length !== 1 ? "s" : ""}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-primary border-primary/30">Pending</Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">Grade</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {batchSubmissions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No pending submissions
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Batch Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Attendance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students
                    .sort((a, b) => b.currentGrade - a.currentGrade)
                    .map((student, index) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-bold text-foreground">
                            {index + 1}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-foreground">{student.name}</TableCell>
                        <TableCell>
                          <span className="font-semibold text-foreground">{student.currentGrade}%</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-muted-foreground">{student.attendanceRate}%</span>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* WhatsApp Group */}
      {batch.whatsAppGroupName && (
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 rounded-lg bg-emerald-100">
              <MessageCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{batch.whatsAppGroupName}</p>
              <p className="text-sm text-muted-foreground">WhatsApp group for this batch</p>
            </div>
            {batch.whatsAppLink && (
              <Button variant="outline" size="sm" asChild>
                <a href={batch.whatsAppLink} target="_blank" rel="noreferrer">Open Group</a>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InstructorBatchDetailPage;
