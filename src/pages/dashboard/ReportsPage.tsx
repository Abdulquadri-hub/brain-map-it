import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Wallet,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { MOCK_REVENUE_DATA, MOCK_ENROLLMENT_TREND, MOCK_BATCHES, MOCK_INSTRUCTORS } from "@/data/mock-data";

/**
 * ReportsPage - V3 Batch-Based Analytics
 * 
 * Laravel Inertia.js Integration:
 * - Use usePage() to receive report data from ReportController@index
 * - Replace mock data with Inertia props
 */

const batchPerformance = [
  { name: "Jan 2025 - Math JSS1", attendance: 92, completion: 85, students: 25 },
  { name: "Feb 2025 - English P5", attendance: 88, completion: 78, students: 18 },
  { name: "Mar 2025 - WebDev", attendance: 95, completion: 90, students: 20 },
  { name: "Dec 2024 - Physics SSS2", attendance: 82, completion: 96, students: 28 },
];

const instructorPayments = [
  { name: "Dr. Sarah Johnson", courses: 2, totalOwed: 120000, paid: 80000, pending: 40000 },
  { name: "Mrs. Adaeze Okonkwo", courses: 1, totalOwed: 45000, paid: 45000, pending: 0 },
  { name: "Emmanuel Tech", courses: 1, totalOwed: 180000, paid: 120000, pending: 60000 },
];

const ReportsPage = () => {
  const [timeRange, setTimeRange] = useState("year");

  const stats = [
    { 
      title: "Total Revenue", 
      value: "₦1.71M", 
      change: "+18%", 
      trend: "up" as const,
      icon: Wallet,
      description: "all time",
    },
    { 
      title: "Total Enrollments", 
      value: "141", 
      change: "+35", 
      trend: "up" as const,
      icon: Users,
      description: "across all batches",
    },
    { 
      title: "Batch Completion", 
      value: "87%", 
      change: "+5%", 
      trend: "up" as const,
      icon: TrendingUp,
      description: "average rate",
    },
    { 
      title: "Avg Attendance", 
      value: "89%", 
      change: "-2%", 
      trend: "down" as const,
      icon: BarChart3,
      description: "across live sessions",
    },
  ];

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground">Track batch performance, revenue, and enrollment trends.</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
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
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="h-3 w-3 text-primary" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-destructive" />
                      )}
                      <span className={`text-xs font-medium ${stat.trend === "up" ? "text-primary" : "text-destructive"}`}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-muted-foreground">{stat.description}</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend (₦)</CardTitle>
              <CardDescription>Monthly revenue from course enrollments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MOCK_REVENUE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `₦${(v/1000)}K`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                      formatter={(value: number) => [`₦${value.toLocaleString()}`, "Revenue"]}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enrollment Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle>Enrollment Trend</CardTitle>
              <CardDescription>Monthly new enrollments across batches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_ENROLLMENT_TREND}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                    />
                    <Bar dataKey="enrollments" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Batch Performance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card>
            <CardHeader>
              <CardTitle>Batch Performance</CardTitle>
              <CardDescription>Attendance and completion rates by batch</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {batchPerformance.map((batch, index) => (
                  <div key={batch.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{batch.name}</p>
                      <Badge variant="outline" className="text-xs">{batch.students} students</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Attendance</span>
                          <span className="font-medium text-foreground">{batch.attendance}%</span>
                        </div>
                        <Progress value={batch.attendance} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Completion</span>
                          <span className="font-medium text-foreground">{batch.completion}%</span>
                        </div>
                        <Progress value={batch.completion} className="h-1.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Instructor Payments */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Card>
            <CardHeader>
              <CardTitle>Instructor Payment Summary</CardTitle>
              <CardDescription>Payment status for each instructor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {instructorPayments.map((instructor) => (
                  <div key={instructor.name} className="p-4 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-foreground">{instructor.name}</p>
                      <Badge variant="outline" className="text-xs">{instructor.courses} course{instructor.courses > 1 ? "s" : ""}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Total Owed</p>
                        <p className="font-medium text-foreground">₦{instructor.totalOwed.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Paid</p>
                        <p className="font-medium text-primary">₦{instructor.paid.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Pending</p>
                        <p className="font-medium text-destructive">₦{instructor.pending.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportsPage;
