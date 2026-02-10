import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, TrendingUp } from "lucide-react";
import { MOCK_PARENT_CHILDREN, MOCK_STUDENT_ASSIGNMENTS, MOCK_STUDENT_SUBMISSIONS, MOCK_BATCH_LEADERBOARD } from "@/data/student-mock-data";

// Laravel Inertia.js Integration:
// import { usePage } from '@inertiajs/react'

const ParentGradesPage = () => {
  const children = MOCK_PARENT_CHILDREN;
  const [selectedChild, setSelectedChild] = useState(children[0]?.id || "");
  const child = children.find(c => c.id === selectedChild);
  const leaderboardEntry = MOCK_BATCH_LEADERBOARD.find(l => l.studentId === selectedChild);

  // Get graded assignments for selected child
  const gradedSubmissions = MOCK_STUDENT_SUBMISSIONS.filter(s => s.studentId === selectedChild && s.grade !== undefined);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Grades</h1>
          <p className="text-muted-foreground">View your child's academic performance.</p>
        </div>
        <Select value={selectedChild} onValueChange={setSelectedChild}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Select child" /></SelectTrigger>
          <SelectContent>
            {children.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary */}
      {leaderboardEntry && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card><CardContent className="p-4 text-center">
            <p className="text-3xl font-bold">#{leaderboardEntry.rank}</p>
            <p className="text-xs text-muted-foreground">Leaderboard Rank</p>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{leaderboardEntry.overallScore}%</p>
            <p className="text-xs text-muted-foreground">Overall Score</p>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center">
            <p className="text-3xl font-bold">{leaderboardEntry.assignmentAvg}%</p>
            <p className="text-xs text-muted-foreground">Assignment Avg</p>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center">
            <p className="text-3xl font-bold">{leaderboardEntry.attendanceRate}%</p>
            <p className="text-xs text-muted-foreground">Attendance</p>
          </CardContent></Card>
        </div>
      )}

      {/* Graded Assignments */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Assignment Grades</CardTitle></CardHeader>
        <CardContent>
          {gradedSubmissions.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">No graded assignments yet for {child?.name}.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Grade</TableHead>
                  <TableHead>Feedback</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gradedSubmissions.map((sub) => {
                  const assign = MOCK_STUDENT_ASSIGNMENTS.find(a => a.id === sub.assignmentId);
                  return (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium">{assign?.title || "Unknown"}</TableCell>
                      <TableCell className="text-sm">{sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString("en-NG") : "–"}</TableCell>
                      <TableCell className="text-right font-semibold">{sub.grade}/{assign?.totalPoints}</TableCell>
                      <TableCell className="text-sm text-muted-foreground italic">{sub.feedback || "–"}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Batch Leaderboard Position */}
      {child?.batches.map((batch) => (
        <Card key={batch.batchId}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              {batch.courseName} – Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <p className="text-3xl font-bold">#{batch.leaderboardRank}</p>
                <p className="text-xs text-muted-foreground">out of {batch.totalStudents}</p>
              </div>
              <div className="flex-1">
                <p className="font-medium">{child.name}</p>
                <p className="text-sm text-muted-foreground">{batch.batchName}</p>
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> Top {Math.round((batch.leaderboardRank / batch.totalStudents) * 100)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ParentGradesPage;
