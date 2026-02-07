import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  UsersRound, 
  Users, 
  ClipboardList, 
  Wallet, 
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Video,
  BookOpen,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_BATCHES, MOCK_STUDENTS, MOCK_UPCOMING_SESSIONS } from "@/data/mock-data";

/**
 * DashboardHome - V3 Batch-Aware
 * 
 * Laravel Inertia.js Integration:
 * - Use usePage() to receive dashboard stats from DashboardController@index
 * - Replace mock data with Inertia props
 */

const DashboardHome = () => {
  const navigate = useNavigate();

  const activeBatches = MOCK_BATCHES.filter(b => b.status === "active" || b.status === "open").length;
  const totalStudents = MOCK_STUDENTS.length;
  const pendingPayments = MOCK_STUDENTS.filter(s => s.paymentStatus === "pending").length;

  const stats = [
    {
      title: "Active Batches",
      value: activeBatches.toString(),
      change: "+1",
      icon: UsersRound,
      color: "primary",
      link: "/dashboard/batches",
    },
    {
      title: "Enrolled Students",
      value: totalStudents.toString(),
      change: "+8",
      icon: Users,
      color: "secondary",
      link: "/dashboard/students",
    },
    {
      title: "Pending Enrollments",
      value: "3",
      change: "+2",
      icon: ClipboardList,
      color: "primary",
      link: "/dashboard/enrollments",
    },
    {
      title: "Monthly Revenue",
      value: "₦425K",
      change: "+18%",
      icon: Wallet,
      color: "secondary",
      link: "/dashboard/financials",
    },
  ];

  const quickActions = [
    { label: "Create Course", icon: BookOpen, href: "/dashboard/courses/new" },
    { label: "Create Batch", icon: Plus, href: "/dashboard/batches" },
    { label: "View Enrollments", icon: ClipboardList, href: "/dashboard/enrollments" },
    { label: "Live Sessions", icon: Video, href: "/dashboard/live-sessions" },
  ];

  const recentActivities = [
    {
      id: 1,
      title: "New enrollment request",
      description: "Chidera Okonkwo enrolled in Mathematics for JSS1 - January 2025 Batch",
      time: "5 minutes ago",
      status: "success" as const,
    },
    {
      id: 2,
      title: "Batch completed",
      description: "December 2024 Batch - Physics for SSS2 completed with 28 students",
      time: "1 hour ago",
      status: "success" as const,
    },
    {
      id: 3,
      title: "Payment received",
      description: "₦45,000 received from Emmanuel Nwachukwu for Web Development Bootcamp",
      time: "2 hours ago",
      status: "success" as const,
    },
    {
      id: 4,
      title: "Payment pending",
      description: "Blessing Okoro has not completed payment for Web Development Bootcamp",
      time: "3 hours ago",
      status: "warning" as const,
    },
  ];

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back! Here's your school overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(stat.link)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <ArrowUpRight className="h-3 w-3 text-primary" />
                      <span className="text-xs text-primary font-medium">{stat.change}</span>
                      <span className="text-xs text-muted-foreground">this month</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color === "primary" ? "bg-primary/10" : "bg-secondary/10"}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color === "primary" ? "text-primary" : "text-secondary"}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-primary/5 hover:border-primary/30 transition-all"
              onClick={() => navigate(action.href)}
            >
              <action.icon className="h-5 w-5 text-primary" />
              <span className="text-sm">{action.label}</span>
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Latest updates from your school</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className={`p-2 rounded-full ${activity.status === "success" ? "bg-primary/10" : "bg-destructive/10"}`}>
                      {activity.status === "success" ? (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{activity.title}</p>
                      <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Sessions</CardTitle>
              <CardDescription>Next live classes across batches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MOCK_UPCOMING_SESSIONS.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 transition-colors cursor-pointer"
                    onClick={() => navigate("/dashboard/live-sessions")}
                  >
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Video className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{session.title}</p>
                      <p className="text-xs text-muted-foreground">{session.courseName}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {new Date(session.scheduledAt).toLocaleDateString("en-NG", { weekday: "short", month: "short", day: "numeric" })}
                          {" · "}
                          {new Date(session.scheduledAt).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {session.platform}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button 
                variant="ghost" 
                className="w-full mt-4 text-primary hover:text-primary"
                onClick={() => navigate("/dashboard/live-sessions")}
              >
                View All Sessions
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHome;
