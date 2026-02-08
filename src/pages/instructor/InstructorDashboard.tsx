import { Link } from "react-router-dom";
import { Building2, UsersRound, Users, Wallet, Video, Clock, ArrowRight, FileText, CreditCard, UserPlus, MessageSquare } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MOCK_INSTRUCTOR_SCHOOLS,
  MOCK_INSTRUCTOR_SESSIONS,
  MOCK_INSTRUCTOR_ACTIVITY,
} from "@/data/instructor-mock-data";
import { format } from "date-fns";

// Laravel Inertia.js Integration:
// import { usePage } from '@inertiajs/react'
// const { instructorHub } = usePage<{ instructorHub: InstructorHubData }>().props

const InstructorDashboard = () => {
  const totalSchools = MOCK_INSTRUCTOR_SCHOOLS.length;
  const totalBatches = MOCK_INSTRUCTOR_SCHOOLS.reduce((sum, s) => sum + s.batchesCount, 0);
  const totalStudents = MOCK_INSTRUCTOR_SCHOOLS.reduce((sum, s) => sum + s.studentsCount, 0);
  const totalPending = MOCK_INSTRUCTOR_SCHOOLS.reduce((sum, s) => sum + s.pendingPayment, 0);

  const upcomingSessions = MOCK_INSTRUCTOR_SESSIONS
    .filter((s) => s.status === "scheduled")
    .slice(0, 5);

  const activityTypeIcon: Record<string, React.ReactNode> = {
    submission: <FileText className="h-4 w-4 text-primary" />,
    enrollment: <UserPlus className="h-4 w-4 text-secondary" />,
    payment: <CreditCard className="h-4 w-4 text-emerald-600" />,
    message: <MessageSquare className="h-4 w-4 text-muted-foreground" />,
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Instructor Hub</h1>
        <p className="text-muted-foreground">Welcome back, Dr. Sarah Johnson</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Schools", value: totalSchools, icon: Building2, color: "text-primary" },
          { label: "Active Batches", value: totalBatches, icon: UsersRound, color: "text-secondary" },
          { label: "Total Students", value: totalStudents, icon: Users, color: "text-primary" },
          { label: "Pending Earnings", value: `₦${totalPending.toLocaleString()}`, icon: Wallet, color: "text-emerald-600" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold font-display text-foreground">{stat.value}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* School Summaries */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-display font-semibold text-foreground">My Schools</h2>
          {MOCK_INSTRUCTOR_SCHOOLS.map((school) => (
            <Card key={school.schoolId} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {school.schoolName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{school.schoolName}</h3>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                      <span>{school.batchesCount} batches</span>
                      <span>•</span>
                      <span>{school.studentsCount} students</span>
                      <span>•</span>
                      <span className="text-emerald-600 font-medium">₦{school.earningsThisMonth.toLocaleString()} this month</span>
                    </div>
                    {school.pendingPayment > 0 && (
                      <Badge variant="outline" className="mt-2 text-primary border-primary/30">
                        ₦{school.pendingPayment.toLocaleString()} pending
                      </Badge>
                    )}
                    {school.nextSession && (
                      <div className="mt-3 p-3 rounded-lg bg-muted/50 flex items-center gap-3">
                        <Video className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{school.nextSession.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {school.nextSession.batchName} • {format(new Date(school.nextSession.scheduledAt), "MMM d, h:mm a")}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upcoming Sessions */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Upcoming Sessions</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/instructor/sessions">View all <ArrowRight className="ml-1 h-3 w-3" /></Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                    <Video className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{session.title}</p>
                    <p className="text-xs text-muted-foreground">{session.courseName}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(session.scheduledAt), "MMM d, h:mm a")}
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">{session.platform}</Badge>
                </div>
              ))}
              {upcomingSessions.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No upcoming sessions</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {MOCK_INSTRUCTOR_ACTIVITY.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="mt-0.5">{activityTypeIcon[activity.type]}</div>
                  <div className="min-w-0">
                    <p className="text-sm text-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.schoolName} • {format(new Date(activity.timestamp), "MMM d, h:mm a")}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
