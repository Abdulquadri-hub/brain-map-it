import { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquareWarning,
  Search,
  Filter,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Complaint, ComplaintStatus } from "@/types/complaint";

/**
 * ComplaintsPage - School Owner Complaint Management
 * 
 * Laravel Inertia.js Integration:
 * - Use usePage() to receive complaints from ComplaintController@index
 * - router.post('/complaints/:id/respond', { message }) to respond
 * - router.put('/complaints/:id/status', { status }) to update status
 */

const mockComplaints: Complaint[] = [
  {
    id: "c-1",
    schoolId: "school-1",
    fromName: "Chidera Okonkwo",
    fromEmail: "chidera@example.com",
    fromType: "student",
    category: "course_content",
    subject: "Lesson materials not loading properly",
    description: "The PDF materials for week 3 of Mathematics for JSS1 are not loading. I've tried multiple browsers and devices.",
    status: "open",
    priority: "high",
    relatedCourseName: "Mathematics for JSS1",
    relatedBatchName: "January 2025 Batch",
    responses: [],
    createdAt: "2025-02-01T10:30:00Z",
    updatedAt: "2025-02-01T10:30:00Z",
  },
  {
    id: "c-2",
    schoolId: "school-1",
    fromName: "Mrs. Folake Adeyemi",
    fromEmail: "folake@example.com",
    fromType: "parent",
    category: "instructor",
    subject: "Class schedule conflict",
    description: "My child Tunde has another class that conflicts with the Wednesday 3PM English session. Can the time be adjusted?",
    status: "in_progress",
    priority: "medium",
    relatedCourseName: "English Language - Primary 5",
    relatedBatchName: "February 2025 Batch",
    responses: [
      { id: "r-1", complaintId: "c-2", respondedBy: "Admin", message: "We're looking into alternative time slots for this batch. Will update you within 48 hours.", createdAt: "2025-01-30T14:00:00Z" },
    ],
    createdAt: "2025-01-29T08:15:00Z",
    updatedAt: "2025-01-30T14:00:00Z",
  },
  {
    id: "c-3",
    schoolId: "school-1",
    fromName: "Emmanuel Tech",
    fromEmail: "emmanuel@example.com",
    fromType: "instructor",
    category: "payment",
    subject: "December payment not received",
    description: "I haven't received my payment for the December 2024 Physics batch sessions. It's been 3 weeks since the batch completed.",
    status: "resolved",
    priority: "high",
    relatedCourseName: "Physics for SSS2",
    relatedBatchName: "December 2024 Batch",
    responses: [
      { id: "r-2", complaintId: "c-3", respondedBy: "Admin", message: "Apologies for the delay. Payment of ₦80,000 has been processed and should reflect within 24 hours.", createdAt: "2025-01-28T11:00:00Z" },
    ],
    createdAt: "2025-01-25T09:00:00Z",
    updatedAt: "2025-01-28T11:00:00Z",
    resolvedAt: "2025-01-28T11:00:00Z",
  },
  {
    id: "c-4",
    schoolId: "school-1",
    fromName: "Blessing Okoro",
    fromEmail: "blessing@example.com",
    fromType: "student",
    category: "technical",
    subject: "Cannot join Zoom meeting",
    description: "The Zoom link for the Web Development Bootcamp keeps saying 'meeting has expired'. This has happened for the last 2 sessions.",
    status: "open",
    priority: "high",
    relatedCourseName: "Web Development Bootcamp",
    relatedBatchName: "March 2025 Cohort",
    responses: [],
    createdAt: "2025-02-03T16:45:00Z",
    updatedAt: "2025-02-03T16:45:00Z",
  },
];

const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState(mockComplaints);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [responseMessage, setResponseMessage] = useState("");

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch = c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.fromName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    const matchesType = typeFilter === "all" || c.fromType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    open: complaints.filter(c => c.status === "open").length,
    inProgress: complaints.filter(c => c.status === "in_progress").length,
    resolved: complaints.filter(c => c.status === "resolved").length,
  };

  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case "open":
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20"><AlertCircle className="h-3 w-3 mr-1" />Open</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20"><Clock className="h-3 w-3 mr-1" />In Progress</Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20"><CheckCircle2 className="h-3 w-3 mr-1" />Resolved</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      high: "bg-destructive/10 text-destructive",
      medium: "bg-yellow-500/10 text-yellow-600",
      low: "bg-muted text-muted-foreground",
    };
    return <Badge variant="outline" className={styles[priority]}>{priority}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      student: "bg-primary/10 text-primary",
      parent: "bg-secondary/10 text-secondary",
      instructor: "bg-accent text-accent-foreground",
    };
    return <Badge variant="outline" className={styles[type] || ""}>{type}</Badge>;
  };

  const handleRespond = () => {
    if (!selectedComplaint || !responseMessage.trim()) return;
    const updatedComplaints = complaints.map(c => {
      if (c.id === selectedComplaint.id) {
        return {
          ...c,
          status: "in_progress" as ComplaintStatus,
          responses: [...c.responses, {
            id: `r-${Date.now()}`,
            complaintId: c.id,
            respondedBy: "Admin",
            message: responseMessage,
            createdAt: new Date().toISOString(),
          }],
          updatedAt: new Date().toISOString(),
        };
      }
      return c;
    });
    setComplaints(updatedComplaints);
    setResponseMessage("");
    setSelectedComplaint(updatedComplaints.find(c => c.id === selectedComplaint.id) || null);
    toast.success("Response sent successfully!");
  };

  const handleResolve = (complaint: Complaint) => {
    setComplaints(complaints.map(c =>
      c.id === complaint.id ? { ...c, status: "resolved" as ComplaintStatus, resolvedAt: new Date().toISOString() } : c
    ));
    setSelectedComplaint(null);
    toast.success("Complaint marked as resolved");
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Complaints</h1>
          <p className="text-sm text-muted-foreground">Manage feedback from students, parents, and instructors.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open</p>
                <p className="text-2xl font-bold text-destructive">{stats.open}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-destructive/50" />
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500/50" />
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold text-primary">{stats.resolved}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-primary/50" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search complaints..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="instructor">Instructor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Complaints Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">From</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Subject</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Priority</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((complaint) => (
                  <tr key={complaint.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="text-sm font-medium text-foreground">{complaint.fromName}</p>
                      <p className="text-xs text-muted-foreground">{complaint.fromEmail}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-foreground line-clamp-1">{complaint.subject}</p>
                      {complaint.relatedCourseName && (
                        <p className="text-xs text-muted-foreground">{complaint.relatedCourseName}</p>
                      )}
                    </td>
                    <td className="py-3 px-4">{getTypeBadge(complaint.fromType)}</td>
                    <td className="py-3 px-4">{getPriorityBadge(complaint.priority)}</td>
                    <td className="py-3 px-4">{getStatusBadge(complaint.status)}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedComplaint(complaint)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredComplaints.length === 0 && (
            <div className="text-center py-8">
              <MessageSquareWarning className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No complaints found.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Complaint Detail Dialog */}
      <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedComplaint?.subject}</DialogTitle>
            <DialogDescription>
              From {selectedComplaint?.fromName} · {selectedComplaint?.fromType} · {selectedComplaint && new Date(selectedComplaint.createdAt).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          {selectedComplaint && (
            <div className="space-y-4">
              <div className="flex gap-2">
                {getStatusBadge(selectedComplaint.status)}
                {getPriorityBadge(selectedComplaint.priority)}
                {selectedComplaint.relatedCourseName && (
                  <Badge variant="outline">{selectedComplaint.relatedCourseName}</Badge>
                )}
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-foreground">{selectedComplaint.description}</p>
              </div>

              {selectedComplaint.responses.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">Responses</p>
                  {selectedComplaint.responses.map((response) => (
                    <div key={response.id} className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium text-primary">{response.respondedBy}</span>
                        <span className="text-xs text-muted-foreground">{new Date(response.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-foreground">{response.message}</p>
                    </div>
                  ))}
                </div>
              )}

              {selectedComplaint.status !== "resolved" && (
                <div className="space-y-2">
                  <Textarea
                    placeholder="Write a response..."
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    rows={3}
                  />
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => handleResolve(selectedComplaint)}>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Mark Resolved
                    </Button>
                    <Button onClick={handleRespond} disabled={!responseMessage.trim()}>
                      <Send className="h-4 w-4 mr-2" />
                      Send Response
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ComplaintsPage;
