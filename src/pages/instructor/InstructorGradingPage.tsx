import { useState } from "react";
import { ClipboardCheck, FileText, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  MOCK_ASSIGNMENTS,
  MOCK_PENDING_SUBMISSIONS,
} from "@/data/instructor-mock-data";
import { format } from "date-fns";

const InstructorGradingPage = () => {
  const [assignmentFilter, setAssignmentFilter] = useState("all");
  const [gradingDialogOpen, setGradingDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [gradeScore, setGradeScore] = useState("");
  const [gradeFeedback, setGradeFeedback] = useState("");

  const pendingSubmissions = MOCK_PENDING_SUBMISSIONS.filter((s) => s.status === "submitted");
  const gradedSubmissions = MOCK_PENDING_SUBMISSIONS.filter((s) => s.status === "graded");

  const totalPending = pendingSubmissions.length;
  const totalGraded = gradedSubmissions.length;
  const avgGrade = gradedSubmissions.length > 0
    ? Math.round(gradedSubmissions.reduce((sum, s) => sum + (s.grade || 0), 0) / gradedSubmissions.length)
    : 0;

  const filteredSubmissions = assignmentFilter === "all"
    ? MOCK_PENDING_SUBMISSIONS
    : MOCK_PENDING_SUBMISSIONS.filter((s) => s.assignmentId === assignmentFilter);

  const openGrading = (submissionId: string) => {
    setSelectedSubmission(submissionId);
    setGradeScore("");
    setGradeFeedback("");
    setGradingDialogOpen(true);
  };

  const handleGrade = () => {
    // Laravel Inertia.js: router.post(`/submissions/${selectedSubmission}/grade`, { score, feedback })
    setGradingDialogOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Grading Hub</h1>
        <p className="text-muted-foreground">Review and grade student submissions across all batches</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalPending}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-emerald-100">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalGraded}</p>
              <p className="text-sm text-muted-foreground">Graded this week</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-secondary/10">
              <ClipboardCheck className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{avgGrade}%</p>
              <p className="text-sm text-muted-foreground">Average grade given</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignments Overview */}
      <div className="space-y-3">
        <h2 className="text-lg font-display font-semibold text-foreground">Assignments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_ASSIGNMENTS.map((assign) => (
            <Card key={assign.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{assign.title}</h3>
                    <p className="text-sm text-muted-foreground">{assign.courseName} • {assign.batchName}</p>
                    <p className="text-xs text-muted-foreground mt-1">Due: {format(new Date(assign.dueDate), "MMM d, yyyy")}</p>
                  </div>
                  {assign.pendingCount > 0 && (
                    <Badge className="bg-primary/10 text-primary">{assign.pendingCount} pending</Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span>{assign.gradedCount} graded</span>
                  <span>•</span>
                  <span>{assign.totalPoints} points</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Filter & Submissions Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-display font-semibold text-foreground">All Submissions</h2>
          <Select value={assignmentFilter} onValueChange={setAssignmentFilter}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Filter by assignment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignments</SelectItem>
              {MOCK_ASSIGNMENTS.map((a) => (
                <SelectItem key={a.id} value={a.id}>{a.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Files</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium text-foreground">{sub.studentName}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {sub.submittedAt ? format(new Date(sub.submittedAt), "MMM d, h:mm a") : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <FileText className="h-3 w-3" />
                        <span className="text-sm">{sub.attachments.length}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={sub.status === "graded" ? "secondary" : "outline"}>
                        {sub.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {sub.grade !== undefined ? (
                        <span className="font-medium text-foreground">{sub.grade}%</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {sub.status === "submitted" && (
                        <Button size="sm" variant="outline" onClick={() => openGrading(sub.id)}>
                          Grade
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Grading Dialog */}
      <Dialog open={gradingDialogOpen} onOpenChange={setGradingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Grade Submission</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="score">Score (out of 100)</Label>
              <Input
                id="score"
                type="number"
                min={0}
                max={100}
                placeholder="Enter score"
                value={gradeScore}
                onChange={(e) => setGradeScore(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="feedback">Feedback</Label>
              <Textarea
                id="feedback"
                placeholder="Write feedback for the student..."
                value={gradeFeedback}
                onChange={(e) => setGradeFeedback(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGradingDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleGrade}>Submit Grade</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstructorGradingPage;
