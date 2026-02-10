import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, MessageSquareWarning } from "lucide-react";
import { MOCK_STUDENT_COMPLAINTS } from "@/data/student-mock-data";
import { COMPLAINT_STATUS_LABELS, COMPLAINT_CATEGORY_LABELS } from "@/types/complaint";
import type { ComplaintCategory } from "@/types/complaint";

// Laravel Inertia.js Integration:
// import { router } from '@inertiajs/react'
// Submit: router.post('/student/complaints', formData)

const StudentComplaintsPage = () => {
  const complaints = MOCK_STUDENT_COMPLAINTS;

  const statusColors: Record<string, "default" | "secondary" | "outline"> = {
    open: "outline", in_progress: "secondary", resolved: "default",
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Complaints</h1>
          <p className="text-muted-foreground">Submit and track your complaints.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" /> New Complaint</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Submit a Complaint</DialogTitle></DialogHeader>
            <div className="space-y-4">
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
                <Textarea placeholder="Describe your issue in detail..." className="mt-1" rows={4} />
              </div>
              <Button className="w-full">Submit Complaint</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {complaints.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquareWarning className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-1">No Complaints</h3>
            <p className="text-sm text-muted-foreground">You haven't submitted any complaints yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {complaints.map((complaint) => (
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

export default StudentComplaintsPage;
