import { useState } from "react";
import { Video, Calendar, Clock, Users, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_INSTRUCTOR_SESSIONS } from "@/data/instructor-mock-data";
import { format } from "date-fns";

const platformBadge: Record<string, string> = {
  jitsi: "bg-primary/10 text-primary",
  zoom: "bg-blue-100 text-blue-700",
  custom: "bg-muted text-muted-foreground",
};

const InstructorSessionsPage = () => {
  const upcoming = MOCK_INSTRUCTOR_SESSIONS.filter((s) => s.status === "scheduled");
  const completed = MOCK_INSTRUCTOR_SESSIONS.filter((s) => s.status === "completed");
  const live = MOCK_INSTRUCTOR_SESSIONS.filter((s) => s.status === "live");

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Live Sessions</h1>
        <p className="text-muted-foreground">All your sessions across schools</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10"><Video className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-2xl font-bold text-foreground">{upcoming.length}</p>
              <p className="text-sm text-muted-foreground">Upcoming</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-emerald-100"><CheckCircle2 className="h-5 w-5 text-emerald-600" /></div>
            <div>
              <p className="text-2xl font-bold text-foreground">{completed.length}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-secondary/10"><Users className="h-5 w-5 text-secondary" /></div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {completed.reduce((sum, s) => sum + (s.attendeeCount || 0), 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total attendees</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          {live.length > 0 && <TabsTrigger value="live">Live ({live.length})</TabsTrigger>}
          <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-3 mt-4">
          {upcoming.map((session) => (
            <SessionCard key={session.id} session={session} showJoin />
          ))}
          {upcoming.length === 0 && <EmptyState message="No upcoming sessions" />}
        </TabsContent>

        {live.length > 0 && (
          <TabsContent value="live" className="space-y-3 mt-4">
            {live.map((session) => (
              <SessionCard key={session.id} session={session} showJoin />
            ))}
          </TabsContent>
        )}

        <TabsContent value="completed" className="space-y-3 mt-4">
          {completed.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
          {completed.length === 0 && <EmptyState message="No completed sessions yet" />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface SessionCardProps {
  session: typeof MOCK_INSTRUCTOR_SESSIONS[0];
  showJoin?: boolean;
}

const SessionCard = ({ session, showJoin }: SessionCardProps) => (
  <Card>
    <CardContent className="p-5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-primary/10">
          <Video className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{session.title}</h3>
          <p className="text-sm text-muted-foreground">{session.courseName}</p>
          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(session.scheduledAt), "EEEE, MMM d, yyyy")}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {format(new Date(session.scheduledAt), "h:mm a")} • {session.duration} min
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {session.attendeeCount ?? session.enrolledCount} {session.status === "completed" ? "attended" : "enrolled"}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge className={platformBadge[session.platform] || ""}>{session.platform}</Badge>
        {showJoin && session.status === "scheduled" && (
          <Button size="sm">Start Session</Button>
        )}
        {session.status === "completed" && (
          <Button size="sm" variant="outline">Take Attendance</Button>
        )}
      </div>
    </CardContent>
  </Card>
);

const EmptyState = ({ message }: { message: string }) => (
  <Card>
    <CardContent className="p-12 text-center">
      <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </CardContent>
  </Card>
);

export default InstructorSessionsPage;
