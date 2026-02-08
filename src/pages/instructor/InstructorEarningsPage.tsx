import { Wallet, Building2, TrendingUp, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import {
  MOCK_INSTRUCTOR_PAYMENTS,
  MOCK_INSTRUCTOR_SCHOOLS,
  MOCK_EARNINGS_CHART,
} from "@/data/instructor-mock-data";
import { format } from "date-fns";

const InstructorEarningsPage = () => {
  const totalEarnings = MOCK_INSTRUCTOR_PAYMENTS
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);
  const thisMonth = MOCK_INSTRUCTOR_PAYMENTS
    .filter((p) => p.period.includes("February 2025"))
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingTotal = MOCK_INSTRUCTOR_PAYMENTS
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Earnings</h1>
        <p className="text-muted-foreground">Track your earnings across all schools</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-emerald-100"><Wallet className="h-5 w-5 text-emerald-600" /></div>
            <div>
              <p className="text-2xl font-bold text-foreground">₦{totalEarnings.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10"><TrendingUp className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-2xl font-bold text-foreground">₦{thisMonth.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">This Month</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-yellow-100"><CreditCard className="h-5 w-5 text-yellow-700" /></div>
            <div>
              <p className="text-2xl font-bold text-foreground">₦{pendingTotal.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-secondary/10"><Building2 className="h-5 w-5 text-secondary" /></div>
            <div>
              <p className="text-2xl font-bold text-foreground">{MOCK_INSTRUCTOR_SCHOOLS.length}</p>
              <p className="text-sm text-muted-foreground">Schools</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Earnings Trend (Last 6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={MOCK_EARNINGS_CHART}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} className="text-xs" />
              <Tooltip formatter={(value: number) => [`₦${value.toLocaleString()}`, ""]} />
              <Legend />
              <Bar dataKey="brightStars" name="Bright Stars Academy" fill="hsl(28, 95%, 55%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="excelCenter" name="Excel Learning Center" fill="hsl(185, 60%, 30%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_INSTRUCTOR_PAYMENTS.map((payment) => {
                const school = MOCK_INSTRUCTOR_SCHOOLS.find((s) => s.schoolId === payment.schoolId);
                return (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium text-foreground">{payment.period}</TableCell>
                    <TableCell className="text-muted-foreground">{school?.schoolName || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{payment.description}</TableCell>
                    <TableCell className="font-semibold text-foreground">₦{payment.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={payment.status === "paid" ? "secondary" : "outline"} className={payment.status === "paid" ? "bg-emerald-100 text-emerald-700" : "text-primary border-primary/30"}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorEarningsPage;
