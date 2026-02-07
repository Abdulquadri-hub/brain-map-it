import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Search, 
  Download,
  Filter,
  Eye,
  Phone,
  Mail,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { MOCK_STUDENTS, MOCK_BATCHES } from "@/data/mock-data";
import { ACADEMIC_LEVEL_LABELS, type AcademicLevel } from "@/types/course";

/**
 * StudentsPage - V3 Batch-Aware
 * 
 * Laravel Inertia.js Integration:
 * - Use usePage() to receive students from StudentController@index
 * - Students come through the enrollment flow, no manual "Add Student"
 */

const StudentsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [batchFilter, setBatchFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<typeof MOCK_STUDENTS[0] | null>(null);

  const filteredStudents = MOCK_STUDENTS.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBatch = batchFilter === "all" || student.batchId === batchFilter;
    const matchesPayment = paymentFilter === "all" || student.paymentStatus === paymentFilter;
    return matchesSearch && matchesBatch && matchesPayment;
  });

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Paid</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Pending</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Active</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">Completed</Badge>;
      case "dropped":
        return <Badge variant="outline" className="bg-muted text-muted-foreground border-border">Dropped</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Students</h1>
          <p className="text-sm text-muted-foreground">Students enrolled through the enrollment flow. Manage records and track progress.</p>
        </div>
        <Button variant="outline" onClick={() => toast.info("Export feature coming with backend integration")}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Students", value: MOCK_STUDENTS.length, icon: Users },
          { label: "Active", value: MOCK_STUDENTS.filter(s => s.status === "active").length, color: "text-primary" },
          { label: "Completed", value: MOCK_STUDENTS.filter(s => s.status === "completed").length, color: "text-secondary" },
          { label: "Pending Payment", value: MOCK_STUDENTS.filter(s => s.paymentStatus !== "completed").length, color: "text-destructive" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color || "text-foreground"}`}>{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={batchFilter} onValueChange={setBatchFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Batches</SelectItem>
                {MOCK_BATCHES.map(batch => (
                  <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="completed">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>Showing {filteredStudents.length} of {MOCK_STUDENTS.length} students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Student</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Course / Batch</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Level</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Parent</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Payment</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {student.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-foreground">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-foreground">{student.courseName}</p>
                      <p className="text-xs text-muted-foreground">{student.batchName}</p>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-xs">
                        {ACADEMIC_LEVEL_LABELS[student.academicLevel as AcademicLevel] || student.academicLevel}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {student.parentName ? (
                        <div>
                          <p className="text-sm text-foreground">{student.parentName}</p>
                          <p className="text-xs text-muted-foreground">{student.parentPhone}</p>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">N/A (Adult)</span>
                      )}
                    </td>
                    <td className="py-3 px-4">{getPaymentBadge(student.paymentStatus)}</td>
                    <td className="py-3 px-4">{getStatusBadge(student.status)}</td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedStudent(student)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredStudents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No students found matching your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Student Dialog */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {selectedStudent.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{selectedStudent.name}</h3>
                  <div className="flex gap-2 mt-1">
                    {getStatusBadge(selectedStudent.status)}
                    {getPaymentBadge(selectedStudent.paymentStatus)}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{selectedStudent.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{selectedStudent.phone}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Course</p>
                  <p className="font-medium text-foreground">{selectedStudent.courseName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Batch</p>
                  <p className="font-medium text-foreground">{selectedStudent.batchName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Academic Level</p>
                  <p className="font-medium text-foreground">
                    {ACADEMIC_LEVEL_LABELS[selectedStudent.academicLevel as AcademicLevel] || selectedStudent.academicLevel}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Enrolled</p>
                  <p className="font-medium text-foreground">{selectedStudent.enrolledAt}</p>
                </div>
              </div>
              {selectedStudent.parentName && (
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Parent/Guardian</p>
                  <p className="font-medium text-foreground">{selectedStudent.parentName}</p>
                  <p className="text-sm text-muted-foreground">{selectedStudent.parentPhone}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentsPage;
