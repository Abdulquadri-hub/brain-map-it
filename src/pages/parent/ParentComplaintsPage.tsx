import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, MessageSquareWarning } from "lucide-react";
import { COMPLAINT_STATUS_LABELS, COMPLAINT_CATEGORY_LABELS } from "@/types/complaint";
import type { Complaint } from "@/types/complaint";

// Laravel Inertia.js Integration:
// import { router } from '@inertiajs/react'

// Mock parent complaints
const MOCK_PARENT_COMPLAINTS: Complaint[] = [
  {
    id: "comp-p1",
    schoolId: "school-1",
    fromName: "Mrs. Ngozi Okonkwo",
    fromEmail: "ngozi@example.com",
    fromType: "parent",
    category: "payment",
    subject: "Payment not reflecting",
    description: "I made a payment for my son David's enrollment on Jan 5, but the status still shows pending.",
    status: "in_progress",
    priority: "high",
    relatedCourseName: "Mathematics for JSS1",
    relatedBatchName: "January 2025 Batch",
    responses: [
      { id: "resp-p1", complaintId: "comp-p1", respondedBy: "School Admin", message: "We're checking with our payment processor. We'll update you within 24 hours.", createdAt: "2025-01-07T09:00:00Z" },
    ],
    createdAt: "2025-01-06T14:00:00Z",
    updatedAt: "2025-01-07T09:00:00Z",
  },
];

const statusColors: Record<string, "default" | "secondary" | "outline"> = {
  open: "outline", in_progress: "secondary", resolved: "default",
};

const ParentComplaintsPage = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Complaints</h1>
          <p className="text-muted-foreground">Submit and track complaints about your children's courses.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" /> New Complaint</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Submit a Complaint</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Regarding Child</Label>
                <Select>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select child" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="s-1">Chidera Okonkwo</SelectItem>
                    <SelectItem value="s-7">David Obi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Category</Label>
                <Select>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(COMPLAINT_CATEGORY_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Subject</Label>
                <Input placeholder="Brief subject line" className="mt-1" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea placeholder="Describe the issue..." className="mt-1" rows={4} />
              </div>
              <Button className="w-full">Submit Complaint</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {MOCK_PARENT_COMPLAINTS.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquareWarning className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-1">No Complaints</h3>
            <p className="text-sm text-muted-foreground">You haven't submitted any complaints yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {MOCK_PARENT_COMPLAINTS.map((complaint) => (
            <Card key={complaint.id}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{complaint.subject}</h3>
                    <p className="text-sm text-muted-foreground">{COMPLAINT_CATEGORY_LABELS[complaint.category]} • {new Date(complaint.createdAt).toLocaleDateString("en-NG")}</p>
                  </div>
                  <Badge variant={statusColors[complaint.status]}>{COMPLAINT_STATUS_LABELS[complaint.status]}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{complaint.description}</p>
                {complaint.responses.length > 0 && (
                  <div className="border-t pt-3 space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Responses:</p>
                    {complaint.responses.map((resp) => (
                      <div key={resp.id} className="bg-muted p-3 rounded-lg text-sm">
                        <p className="font-medium text-xs mb-1">{resp.respondedBy} • {new Date(resp.createdAt).toLocaleDateString("en-NG")}</p>
                        <p>{resp.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParentComplaintsPage;
