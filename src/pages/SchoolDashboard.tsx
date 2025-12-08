import { motion } from "framer-motion";
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  TrendingUp, 
  Calendar, 
  Bell, 
  Settings, 
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    title: "Total Students",
    value: "1,234",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "primary",
  },
  {
    title: "Active Courses",
    value: "48",
    change: "+3",
    trend: "up",
    icon: BookOpen,
    color: "secondary",
  },
  {
    title: "Instructors",
    value: "24",
    change: "+2",
    trend: "up",
    icon: GraduationCap,
    color: "primary",
  },
  {
    title: "Completion Rate",
    value: "87%",
    change: "+5%",
    trend: "up",
    icon: TrendingUp,
    color: "secondary",
  },
];

const quickActions = [
  { label: "Add New Course", icon: Plus, href: "#" },
  { label: "Invite Instructor", icon: Users, href: "#" },
  { label: "View Calendar", icon: Calendar, href: "#" },
  { label: "Settings", icon: Settings, href: "#" },
];

const recentActivities = [
  {
    id: 1,
    title: "New student enrollment",
    description: "John Doe enrolled in 'Introduction to Mathematics'",
    time: "5 minutes ago",
    status: "success",
  },
  {
    id: 2,
    title: "Course completed",
    description: "15 students completed 'English Literature'",
    time: "1 hour ago",
    status: "success",
  },
  {
    id: 3,
    title: "Payment received",
    description: "Monthly subscription payment processed",
    time: "2 hours ago",
    status: "success",
  },
  {
    id: 4,
    title: "Assignment pending review",
    description: "8 assignments awaiting instructor review",
    time: "3 hours ago",
    status: "warning",
  },
];

const upcomingEvents = [
  {
    id: 1,
    title: "Staff Meeting",
    date: "Today, 2:00 PM",
    type: "meeting",
  },
  {
    id: 2,
    title: "Parent-Teacher Conference",
    date: "Tomorrow, 10:00 AM",
    type: "event",
  },
  {
    id: 3,
    title: "Final Exams Begin",
    date: "Dec 15, 2024",
    type: "exam",
  },
];

const SchoolDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back! Here's your school overview.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
                3
              </span>
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <ArrowUpRight className="h-3 w-3 text-primary" />
                        <span className="text-xs text-primary font-medium">{stat.change}</span>
                        <span className="text-xs text-muted-foreground">vs last month</span>
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
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-4 text-primary hover:text-primary">
                  View All Activity
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{event.date}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {event.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Platform Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Platform Usage</CardTitle>
                <CardDescription>This month's activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Storage Used</span>
                    <span className="font-medium text-foreground">2.4 GB / 10 GB</span>
                  </div>
                  <Progress value={24} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Active Users</span>
                    <span className="font-medium text-foreground">847 / 1,000</span>
                  </div>
                  <Progress value={84} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Courses Created</span>
                    <span className="font-medium text-foreground">48 / 100</span>
                  </div>
                  <Progress value={48} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default SchoolDashboard;
