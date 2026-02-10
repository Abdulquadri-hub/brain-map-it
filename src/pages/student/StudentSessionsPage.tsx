import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, Clock, Video } from "lucide-react";
import { MOCK_STUDENT_SESSIONS } from "@/data/student-mock-data";

// Laravel Inertia.js Integration:
// import { usePage } from '@inertiajs/react'
// const { sessions } = usePage().props

const StudentSessionsPage = () => {
  const upcoming = MOCK_STUDENT_SESSIONS.filter(s => s.status === "scheduled");
  const completed = MOCK_STUDENT_SESSIONS.filter(s => s.status === "completed");
  const attendedCount = completed.filter(s => s.attended).length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Live Sessions</h1>
        <p className="text-muted-foreground">Your sessions across all batches. Attendance: {attendedCount}/{completed.length} ({completed.length ? Math.round((attendedCount / completed.length) * 100) : 0}%)</p>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4 space-y-3">
          {upcoming.length === 0 && <p className="text-muted-foreground">No upcoming sessions.</p>}
          {upcoming.map((session) => (
            <Card key={session.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10"><Video className="h-5 w-5 text-primary" /></div>
                  <div>
                    <p className="font-medium">{session.title}</p>
                    <p className="text-sm text-muted-foreground">{session.courseName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(session.scheduledAt).toLocaleDateString("en-NG", { weekday: "long", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })} • {session.duration} min
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{session.platform}</Badge>
                  <Button size="sm">Join Session</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="mt-4 space-y-3">
          {completed.map((session) => (
            <Card key={session.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {session.attended ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-destructive" />}
                  <div>
                    <p className="font-medium">{session.title}</p>
                    <p className="text-sm text-muted-foreground">{session.courseName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(session.scheduledAt).toLocaleDateString("en-NG", { weekday: "short", month: "short", day: "numeric" })} • {session.duration} min
                    </p>
                  </div>
                </div>
                <Badge variant={session.attended ? "default" : "destructive"}>
                  {session.attended ? "Present" : "Absent"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentSessionsPage;
