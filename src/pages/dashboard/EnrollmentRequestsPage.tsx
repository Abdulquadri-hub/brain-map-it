import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  User,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

// Laravel Inertia.js Integration:
// import { usePage, router } from '@inertiajs/react'
// 
// Replace mock data with:
// const { enrollmentRequests, stats } = usePage<{
//   enrollmentRequests: EnrollmentRequest[],
//   stats: EnrollmentStats
// }>().props
//
// For actions:
// router.post('/enrollment-requests/:id/approve', {}, { onSuccess: ... })
// router.post('/enrollment-requests/:id/reject', { reason }, { onSuccess: ... })

interface EnrollmentRequest {
  id: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  parentName?: string;
  parentEmail?: string;
  enrollmentType: "adult" | "parent";
  courses: { id: string; title: string; price: number }[];
  totalAmount: number;
  paymentStatus: "paid" | "pending" | "failed";
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  grade?: string;
  dateOfBirth?: string;
}

// Mock data - will be replaced by Inertia props
const mockEnrollmentRequests: EnrollmentRequest[] = [
  {
    id: "1",
    studentName: "Chidera Okonkwo",
    studentEmail: "chidera@example.com",
    studentPhone: "+234 801 234 5678",
    enrollmentType: "adult",
    courses: [
      { id: "1", title: "Advanced Mathematics", price: 25000 },
      { id: "2", title: "Physics Fundamentals", price: 22000 },
    ],
    totalAmount: 47000,
    paymentStatus: "paid",
    status: "pending",
    submittedAt: "2024-01-15T10:30:00Z",
    dateOfBirth: "1998-05-20",
  },
  {
    id: "2",
    studentName: "Amara Eze",
    studentEmail: "amara.parent@example.com",
    studentPhone: "+234 802 345 6789",
    parentName: "Mrs. Ngozi Eze",
    parentEmail: "ngozi.eze@example.com",
    enrollmentType: "parent",
    courses: [{ id: "3", title: "English Language & Literature", price: 20000 }],
    totalAmount: 20000,
    paymentStatus: "paid",
    status: "pending",
    submittedAt: "2024-01-14T15:45:00Z",
    grade: "SSS 2",
    dateOfBirth: "2008-03-12",
  },
  {
    id: "3",
    studentName: "Emeka Nnamdi",
    studentEmail: "emeka@example.com",
    studentPhone: "+234 803 456 7890",
    enrollmentType: "adult",
    courses: [{ id: "1", title: "Advanced Mathematics", price: 25000 }],
    totalAmount: 25000,
    paymentStatus: "pending",
    status: "pending",
    submittedAt: "2024-01-13T09:15:00Z",
    dateOfBirth: "1995-11-08",
  },
  {
    id: "4",
    studentName: "Adanna Okoro",
    studentEmail: "adanna.parent@example.com",
    studentPhone: "+234 804 567 8901",
    parentName: "Mr. Chukwuma Okoro",
    parentEmail: "chukwuma.okoro@example.com",
    enrollmentType: "parent",
    courses: [
      { id: "4", title: "Chemistry Basics", price: 22000 },
      { id: "5", title: "Biology for Beginners", price: 20000 },
    ],
    totalAmount: 42000,
    paymentStatus: "paid",
    status: "approved",
    submittedAt: "2024-01-12T14:20:00Z",
    grade: "JSS 3",
    dateOfBirth: "2010-07-25",
  },
];

const EnrollmentRequestsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedRequest, setSelectedRequest] = useState<EnrollmentRequest | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Laravel Inertia.js Integration:
  // const { enrollmentRequests } = usePage().props
  const enrollmentRequests = mockEnrollmentRequests;

  const filteredRequests = enrollmentRequests.filter((request) => {
    const matchesSearch =
      request.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.studentEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || request.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const stats = {
    pending: enrollmentRequests.filter((r) => r.status === "pending").length,
    approved: enrollmentRequests.filter((r) => r.status === "approved").length,
    rejected: enrollmentRequests.filter((r) => r.status === "rejected").length,
  };

  const handleApprove = (request: EnrollmentRequest) => {
    // Laravel Inertia.js Integration:
    // router.post(`/enrollment-requests/${request.id}/approve`, {}, {
    //   onSuccess: () => toast.success('Enrollment approved'),
    //   onError: (errors) => toast.error('Failed to approve')
    // })
    console.log("Approving:", request.id);
    setShowDetailsDialog(false);
  };

  const handleReject = () => {
    // Laravel Inertia.js Integration:
    // router.post(`/enrollment-requests/${selectedRequest.id}/reject`, {
    //   reason: rejectReason
    // }, {
    //   onSuccess: () => {
    //     toast.success('Enrollment rejected');
    //     setShowRejectDialog(false);
    //   }
    // })
    console.log("Rejecting:", selectedRequest?.id, "Reason:", rejectReason);
    setShowRejectDialog(false);
    setRejectReason("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "pending":
        return <Badge variant="secondary">Awaiting Payment</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Enrollment Requests</h1>
          <p className="text-muted-foreground">
            Review and manage student enrollment requests
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold">{stats.approved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold">{stats.rejected}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Tabs and Table */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="pending">
              Pending ({stats.pending})
            </TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <Card>
              <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Courses</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <p className="text-muted-foreground">
                          No enrollment requests found
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {request.studentName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{request.studentName}</div>
                              <div className="text-sm text-muted-foreground">
                                {request.studentEmail}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {request.enrollmentType === "parent" ? "Minor" : "Adult"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[200px]">
                            {request.courses.map((c) => c.title).join(", ")}
                          </div>
                        </TableCell>
                        <TableCell>₦{request.totalAmount.toLocaleString()}</TableCell>
                        <TableCell>{getPaymentBadge(request.paymentStatus)}</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>
                          {new Date(request.submittedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setShowDetailsDialog(true);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              {request.status === "pending" && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => handleApprove(request)}
                                    className="text-green-600"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedRequest(request);
                                      setShowRejectDialog(true);
                                    }}
                                    className="text-red-600"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Enrollment Request Details</DialogTitle>
            <DialogDescription>
              Review the complete enrollment information
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6">
              {/* Student Info */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Student Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <div>
                      <span className="text-muted-foreground">Name: </span>
                      {selectedRequest.studentName}
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      {selectedRequest.studentEmail}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      {selectedRequest.studentPhone}
                    </div>
                    {selectedRequest.dateOfBirth && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {new Date(selectedRequest.dateOfBirth).toLocaleDateString()}
                      </div>
                    )}
                    {selectedRequest.grade && (
                      <div>
                        <span className="text-muted-foreground">Grade: </span>
                        {selectedRequest.grade}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {selectedRequest.enrollmentType === "parent" && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Parent/Guardian
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                      <div>
                        <span className="text-muted-foreground">Name: </span>
                        {selectedRequest.parentName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        {selectedRequest.parentEmail}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Courses */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Selected Courses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedRequest.courses.map((course) => (
                      <div
                        key={course.id}
                        className="flex justify-between text-sm"
                      >
                        <span>{course.title}</span>
                        <span>₦{course.price.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 flex justify-between font-medium">
                      <span>Total</span>
                      <span>₦{selectedRequest.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {getStatusBadge(selectedRequest.status)}
                  {getPaymentBadge(selectedRequest.paymentStatus)}
                </div>
                <span className="text-sm text-muted-foreground">
                  Submitted: {new Date(selectedRequest.submittedAt).toLocaleString()}
                </span>
              </div>
            </div>
          )}
          <DialogFooter>
            {selectedRequest?.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDetailsDialog(false);
                    setShowRejectDialog(true);
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button onClick={() => handleApprove(selectedRequest!)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Enrollment
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Enrollment</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this enrollment request.
              The applicant will be notified.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Textarea
                placeholder="Enter reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectReason.trim()}
            >
              Reject Enrollment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default EnrollmentRequestsPage;
