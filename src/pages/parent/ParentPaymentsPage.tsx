import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wallet, Download } from "lucide-react";
import { MOCK_PARENT_PAYMENTS } from "@/data/student-mock-data";

// Laravel Inertia.js Integration:
// import { usePage } from '@inertiajs/react'

const ParentPaymentsPage = () => {
  const payments = MOCK_PARENT_PAYMENTS;
  const totalPaid = payments.filter(p => p.status === "completed").reduce((s, p) => s + p.amount, 0);
  const pending = payments.filter(p => p.status === "pending").reduce((s, p) => s + p.amount, 0);

  const statusColors: Record<string, "default" | "secondary" | "destructive"> = {
    completed: "default", pending: "secondary", failed: "destructive",
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Payments</h1>
        <p className="text-muted-foreground">View payment history and receipts.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-green-500">₦{totalPaid.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Total Paid</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-orange-500">₦{pending.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Pending</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold">{payments.length}</p>
          <p className="text-xs text-muted-foreground">Total Transactions</p>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Payment History</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Child</TableHead>
                <TableHead>Course / Batch</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((pay) => (
                <TableRow key={pay.id} className={pay.status === "pending" ? "bg-orange-500/5" : ""}>
                  <TableCell className="font-medium">{pay.childName}</TableCell>
                  <TableCell>
                    <p className="text-sm">{pay.courseName}</p>
                    <p className="text-xs text-muted-foreground">{pay.batchName}</p>
                  </TableCell>
                  <TableCell className="font-semibold">₦{pay.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-sm">{pay.paidAt ? new Date(pay.paidAt).toLocaleDateString("en-NG") : "–"}</TableCell>
                  <TableCell><Badge variant={statusColors[pay.status]}>{pay.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    {pay.status === "completed" && (
                      <Button size="sm" variant="ghost"><Download className="h-4 w-4" /></Button>
                    )}
                    {pay.status === "pending" && (
                      <Button size="sm">Pay Now</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParentPaymentsPage;
