import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarCheck, CheckCircle2, XCircle } from "lucide-react";
import { MOCK_PARENT_CHILDREN, MOCK_STUDENT_SESSIONS } from "@/data/student-mock-data";

// Laravel Inertia.js Integration:
// import { usePage } from '@inertiajs/react'

const ParentAttendancePage = () => {
  const children = MOCK_PARENT_CHILDREN;
  const [selectedChild, setSelectedChild] = useState(children[0]?.id || "");

  const completedSessions = MOCK_STUDENT_SESSIONS.filter(s => s.status === "completed");
  const child = children.find(c => c.id === selectedChild);

  // Mock attendance data based on selected child
  const attendanceRate = child?.batches[0]?.attendanceRate || 0;
  const attendedCount = Math.round((attendanceRate / 100) * completedSessions.length);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Attendance</h1>
          <p className="text-muted-foreground">Track your child's session attendance.</p>
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 text-center">
          <p className="text-3xl font-bold text-primary">{attendanceRate}%</p>
          <p className="text-xs text-muted-foreground">Overall Attendance</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-3xl font-bold text-green-500">{attendedCount}</p>
          <p className="text-xs text-muted-foreground">Sessions Attended</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-3xl font-bold text-destructive">{completedSessions.length - attendedCount}</p>
          <p className="text-xs text-muted-foreground">Sessions Missed</p>
        </CardContent></Card>
      </div>

      {/* Session List */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Session History</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {completedSessions.map((session, idx) => {
            const attended = idx < attendedCount;
            return (
              <div key={session.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  {attended ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-destructive" />}
                  <div>
                    <p className="font-medium text-sm">{session.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(session.scheduledAt).toLocaleDateString("en-NG", { weekday: "short", month: "short", day: "numeric" })} • {session.courseName}
                    </p>
                  </div>
                </div>
                <Badge variant={attended ? "default" : "destructive"}>{attended ? "Present" : "Absent"}</Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default ParentAttendancePage;
