import { Briefcase, Calendar, Clock, MapPin, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_JOB_APPLICATIONS } from "@/data/instructor-mock-data";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  reviewed: "bg-blue-100 text-blue-700",
  shortlisted: "bg-emerald-100 text-emerald-700",
  interview: "bg-primary/10 text-primary",
  offered: "bg-emerald-100 text-emerald-800",
  rejected: "bg-destructive/10 text-destructive",
  accepted: "bg-emerald-200 text-emerald-800",
};

const InstructorApplicationsPage = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Job Applications</h1>
        <p className="text-muted-foreground">Track your applications to teaching positions</p>
      </div>

      {/* Stats Row */}
      <div className="flex flex-wrap gap-4">
        <Badge variant="outline" className="px-3 py-1.5 text-sm">
          {MOCK_JOB_APPLICATIONS.length} total applications
        </Badge>
        <Badge variant="outline" className="px-3 py-1.5 text-sm text-primary border-primary/30">
          {MOCK_JOB_APPLICATIONS.filter(a => a.status === "interview").length} interviews scheduled
        </Badge>
        <Badge variant="outline" className="px-3 py-1.5 text-sm text-emerald-700 border-emerald-300">
          {MOCK_JOB_APPLICATIONS.filter(a => a.status === "shortlisted").length} shortlisted
        </Badge>
      </div>

      {/* Application Cards */}
      <div className="space-y-4">
        {MOCK_JOB_APPLICATIONS.map((app) => (
          <Card key={app.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground text-lg">{app.jobTitle}</h3>
                  <p className="text-sm text-muted-foreground">{app.schoolName}</p>
                </div>
                <Badge className={statusColors[app.status] || ""}>{app.status}</Badge>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Applied {format(new Date(app.appliedAt), "MMM d, yyyy")}
                </span>
              </div>

              {/* Interview Details */}
              {app.status === "interview" && app.interviewDate && (
                <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Video className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground text-sm">Interview Scheduled</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(app.interviewDate), "EEEE, MMM d, yyyy 'at' h:mm a")}
                    {app.interviewPlatform && ` via ${app.interviewPlatform}`}
                  </p>
                </div>
              )}

              {/* Rejection Notes */}
              {app.status === "rejected" && app.notes && (
                <div className="mt-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                  <p className="text-sm text-muted-foreground">{app.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {MOCK_JOB_APPLICATIONS.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No applications yet</h3>
            <p className="text-sm text-muted-foreground">Browse the job marketplace to find teaching opportunities</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InstructorApplicationsPage;
