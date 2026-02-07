import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  CreditCard,
  AlertCircle,
  Download,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "recharts";
import { MOCK_REVENUE_DATA } from "@/data/mock-data";

/**
 * FinancialDashboardPage - Revenue & Payment Tracking
 * 
 * Laravel Inertia.js Integration:
 * - Use usePage() to receive financial data from FinancialController@index
 * - Replace mock data with Inertia props
 */

const paymentBreakdown = [
  { course: "Mathematics for JSS1", batch: "January 2025 Batch", enrolled: 25, paid: 23, revenue: 345000, outstanding: 30000 },
  { course: "English Language - Primary 5", batch: "February 2025 Batch", enrolled: 18, paid: 16, revenue: 192000, outstanding: 24000 },
  { course: "Web Development Bootcamp", batch: "March 2025 Cohort", enrolled: 20, paid: 19, revenue: 855000, outstanding: 45000 },
  { course: "Physics for SSS2", batch: "December 2024 Batch", enrolled: 28, paid: 28, revenue: 560000, outstanding: 0 },
];

const instructorPayments = [
  { name: "Dr. Sarah Johnson", courses: "Mathematics for JSS1, Physics for SSS2", totalOwed: 120000, paid: 80000, pending: 40000, lastPaid: "2025-01-15" },
  { name: "Mrs. Adaeze Okonkwo", courses: "English Language - Primary 5", totalOwed: 45000, paid: 45000, pending: 0, lastPaid: "2025-01-20" },
  { name: "Emmanuel Tech", courses: "Web Development Bootcamp", totalOwed: 180000, paid: 120000, pending: 60000, lastPaid: "2025-01-10" },
];

const recentPayments = [
  { id: "p-1", student: "Chidera Okonkwo", course: "Mathematics for JSS1", amount: 15000, status: "completed", date: "2025-02-01" },
  { id: "p-2", student: "Emmanuel Nwachukwu", course: "Web Development Bootcamp", amount: 45000, status: "completed", date: "2025-01-28" },
  { id: "p-3", student: "Blessing Okoro", course: "Web Development Bootcamp", amount: 45000, status: "pending", date: "2025-01-25" },
  { id: "p-4", student: "Grace Afolabi", course: "English Language - Primary 5", amount: 12000, status: "failed", date: "2025-01-22" },
];

const FinancialDashboardPage = () => {
  const [timeRange, setTimeRange] = useState("year");

  const totalRevenue = paymentBreakdown.reduce((acc, p) => acc + p.revenue, 0);
  const totalOutstanding = paymentBreakdown.reduce((acc, p) => acc + p.outstanding, 0);
  const platformFee = Math.round(totalRevenue * 0.1);

  const stats = [
    { title: "Total Revenue", value: `₦${(totalRevenue / 1000).toFixed(0)}K`, change: "+18%", icon: Wallet },
    { title: "This Month", value: "₦425K", change: "+12%", icon: TrendingUp },
    { title: "Outstanding", value: `₦${(totalOutstanding / 1000).toFixed(0)}K`, change: "3 students", icon: AlertCircle },
    { title: "Platform Fee (10%)", value: `₦${(platformFee / 1000).toFixed(0)}K`, change: "auto-deducted", icon: CreditCard },
  ];

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Completed</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Pending</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Financials</h1>
          <p className="text-sm text-muted-foreground">Track revenue, payments, and instructor payouts.</p>
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
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <ArrowUpRight className="h-3 w-3 text-primary" />
                      <span className="text-xs text-primary font-medium">{stat.change}</span>
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

      {/* Revenue Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-6">
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

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Payment Breakdown by Course */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Course/Batch</CardTitle>
            <CardDescription>Payment collection per batch</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Course / Batch</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Paid</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Revenue</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Outstanding</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentBreakdown.map((item) => (
                    <tr key={item.batch} className="border-b border-border">
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium text-foreground">{item.course}</p>
                        <p className="text-xs text-muted-foreground">{item.batch}</p>
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">{item.paid}/{item.enrolled}</td>
                      <td className="py-3 px-4 text-sm font-medium text-primary">₦{item.revenue.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-destructive">
                        {item.outstanding > 0 ? `₦${item.outstanding.toLocaleString()}` : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Instructor Payments */}
        <Card>
          <CardHeader>
            <CardTitle>Instructor Payments</CardTitle>
            <CardDescription>Payment status for instructors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {instructorPayments.map((instructor) => (
                <div key={instructor.name} className="p-4 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-foreground">{instructor.name}</p>
                    {instructor.pending === 0 ? (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Paid</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Pending</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{instructor.courses}</p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Total</p>
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
      </div>

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Student Payments</CardTitle>
          <CardDescription>Latest enrollment payments received</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Student</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Course</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 text-sm font-medium text-foreground">{payment.student}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{payment.course}</td>
                    <td className="py-3 px-4 text-sm font-medium text-foreground">₦{payment.amount.toLocaleString()}</td>
                    <td className="py-3 px-4">{getPaymentStatusBadge(payment.status)}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{payment.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialDashboardPage;
