import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, Upload } from "lucide-react";
import { MOCK_STUDENT_ASSIGNMENTS, MOCK_STUDENT_SUBMISSIONS } from "@/data/student-mock-data";
import type { SubmissionStatus } from "@/types/batch";

// Laravel Inertia.js Integration:
// import { usePage, router } from '@inertiajs/react'
// Submit: router.post('/student/assignments/:id/submit', formData)

const StudentAssignmentsPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const assignments = MOCK_STUDENT_ASSIGNMENTS.map(a => {
    const sub = MOCK_STUDENT_SUBMISSIONS.find(s => s.assignmentId === a.id);
    return { ...a, submission: sub };
  });

  const filtered = statusFilter === "all" ? assignments : assignments.filter(a => (a.submission?.status || "pending") === statusFilter);

  const statusColors: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
    graded: "default", submitted: "secondary", pending: "outline", late: "destructive",
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Assignments</h1>
          <p className="text-muted-foreground">All your assignments across batches.</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Filter" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="graded">Graded</SelectItem>
            <SelectItem value="late">Late</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assignment</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Grade</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a) => {
                const status = (a.submission?.status || "pending") as SubmissionStatus;
                return (
                  <TableRow key={a.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{a.title}</p>
                          <p className="text-xs text-muted-foreground">{a.description?.slice(0, 60)}...</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{new Date(a.dueDate).toLocaleDateString("en-NG", { month: "short", day: "numeric" })}</TableCell>
                    <TableCell className="text-sm">{a.totalPoints}</TableCell>
                    <TableCell><Badge variant={statusColors[status]}>{status}</Badge></TableCell>
                    <TableCell className="text-right text-sm font-semibold">
                      {a.submission?.grade !== undefined ? `${a.submission.grade}/${a.totalPoints}` : "–"}
                    </TableCell>
                    <TableCell className="text-right">
                      {status === "pending" && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm"><Upload className="h-3 w-3 mr-1" /> Submit</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader><DialogTitle>Submit: {a.title}</DialogTitle></DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Your Answer</Label>
                                <Textarea placeholder="Type your response here..." className="mt-1" rows={5} />
                              </div>
                              <div>
                                <Label>Attachments</Label>
                                <div className="mt-1 border-2 border-dashed rounded-lg p-6 text-center text-muted-foreground">
                                  <Upload className="h-8 w-8 mx-auto mb-2" />
                                  <p className="text-sm">Drag & drop files or click to upload</p>
                                  <p className="text-xs">PDF, images, documents up to 10MB</p>
                                </div>
                              </div>
                              <Button className="w-full">Submit Assignment</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentAssignmentsPage;
