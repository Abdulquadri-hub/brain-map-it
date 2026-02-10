import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, CalendarCheck, Wallet, ArrowRight, Clock, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { MOCK_PARENT_CHILDREN, MOCK_PARENT_PAYMENTS, MOCK_STUDENT_SESSIONS } from "@/data/student-mock-data";

// Laravel Inertia.js Integration:
// import { usePage } from '@inertiajs/react'
// const { children, payments, upcomingSessions } = usePage().props

const ParentDashboard = () => {
  const children = MOCK_PARENT_CHILDREN;
  const payments = MOCK_PARENT_PAYMENTS;
  const totalPaid = payments.filter(p => p.status === "completed").reduce((s, p) => s + p.amount, 0);
  const pendingPayments = payments.filter(p => p.status === "pending").reduce((s, p) => s + p.amount, 0);
  const upcomingSessions = MOCK_STUDENT_SESSIONS.filter(s => s.status === "scheduled");

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome, Mrs. Ngozi! 👋</h1>
        <p className="text-muted-foreground">Monitor your children's learning progress.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-muted text-primary"><Users className="h-5 w-5" /></div>
          <div><p className="text-2xl font-bold">{children.length}</p><p className="text-xs text-muted-foreground">Children</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-muted text-secondary"><CalendarCheck className="h-5 w-5" /></div>
          <div><p className="text-2xl font-bold">{upcomingSessions.length}</p><p className="text-xs text-muted-foreground">Upcoming Sessions</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-muted text-green-500"><Wallet className="h-5 w-5" /></div>
          <div><p className="text-2xl font-bold">₦{totalPaid.toLocaleString()}</p><p className="text-xs text-muted-foreground">Total Paid</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-muted text-orange-500"><Wallet className="h-5 w-5" /></div>
          <div><p className="text-2xl font-bold">₦{pendingPayments.toLocaleString()}</p><p className="text-xs text-muted-foreground">Pending</p></div>
        </CardContent></Card>
      </div>

      {/* Children Cards */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">My Children</CardTitle>
          <Button variant="ghost" size="sm" asChild><Link to="/parent/children">View All <ArrowRight className="h-4 w-4 ml-1" /></Link></Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {children.map((child) => (
            <div key={child.id} className="p-4 rounded-lg border space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{child.name}</h3>
                <Badge variant="outline">{child.batches.length} batch{child.batches.length !== 1 ? "es" : ""}</Badge>
              </div>
              {child.batches.map((batch) => (
                <div key={batch.batchId} className="flex items-center justify-between text-sm bg-muted/50 rounded p-2">
                  <div>
                    <p className="font-medium">{batch.courseName}</p>
                    <p className="text-xs text-muted-foreground">{batch.instructorName}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1"><CalendarCheck className="h-3 w-3" /> {batch.attendanceRate}%</span>
                    <span className="flex items-center gap-1"><BarChart3 className="h-3 w-3" /> #{batch.leaderboardRank}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
          <Link to="/parent/grades"><BarChart3 className="h-5 w-5" /> View Grades</Link>
        </Button>
        <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
          <Link to="/parent/payments"><Wallet className="h-5 w-5" /> Payment History</Link>
        </Button>
        <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
          <Link to="/parent/complaints"><Users className="h-5 w-5" /> Submit Complaint</Link>
        </Button>
      </div>
    </div>
  );
};

export default ParentDashboard;
