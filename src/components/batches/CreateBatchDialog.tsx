import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Users, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Batch, BatchFormData, DEFAULT_BATCH_FORM } from "@/types/batch";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Laravel Inertia.js Integration:
// import { router, useForm } from '@inertiajs/react'
// Submit: router.post('/batches', data)
// Update: router.put(`/batches/${batch.id}`, data)

interface CreateBatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courses: { id: string; name: string }[];
  instructors: { id: string; name: string }[];
  editBatch?: Batch | null;
  onSuccess?: (batch: Batch) => void;
}

export function CreateBatchDialog({
  open,
  onOpenChange,
  courses,
  instructors,
  editBatch,
  onSuccess,
}: CreateBatchDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState<BatchFormData>(
    editBatch
      ? {
          name: editBatch.name,
          description: editBatch.description,
          startDate: editBatch.startDate,
          endDate: editBatch.endDate,
          maxStudents: editBatch.maxStudents,
          instructorId: editBatch.instructorId,
          whatsAppLink: editBatch.whatsAppLink,
        }
      : DEFAULT_BATCH_FORM
  );
  const [courseId, setCourseId] = useState(editBatch?.courseId || "");
  const [startDate, setStartDate] = useState<Date | undefined>(
    editBatch ? new Date(editBatch.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    editBatch ? new Date(editBatch.endDate) : undefined
  );

  const updateField = <K extends keyof BatchFormData>(
    field: K,
    value: BatchFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !courseId || !startDate || !endDate) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (startDate >= endDate) {
      toast({
        title: "Invalid dates",
        description: "End date must be after start date.",
        variant: "destructive",
      });
      return;
    }

    // Validate WhatsApp link format
    if (formData.whatsAppLink && !formData.whatsAppLink.includes("chat.whatsapp.com")) {
      toast({
        title: "Invalid WhatsApp link",
        description: "Please enter a valid WhatsApp group invite link.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const batchData = {
        ...formData,
        courseId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      // Laravel Inertia.js: Replace with router.post('/batches', batchData)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: editBatch ? "Batch updated" : "Batch created",
        description: `${formData.name} has been ${editBatch ? "updated" : "created"} successfully.`,
      });

      onOpenChange(false);
      // Reset form
      setFormData(DEFAULT_BATCH_FORM);
      setCourseId("");
      setStartDate(undefined);
      setEndDate(undefined);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save batch. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {editBatch ? "Edit Batch" : "Create New Batch"}
          </DialogTitle>
          <DialogDescription>
            {editBatch
              ? "Update the details for this batch."
              : "Create a new batch/cohort for students to enroll in."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Batch Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Batch Name *</Label>
            <Input
              id="name"
              placeholder="e.g., January 2025 Batch"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>

          {/* Course */}
          <div className="space-y-2">
            <Label>Course *</Label>
            <Select value={courseId} onValueChange={setCourseId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "MMM d, yyyy") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "MMM d, yyyy") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => startDate ? date <= startDate : false}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Max Students & Instructor */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxStudents">Max Students *</Label>
              <Input
                id="maxStudents"
                type="number"
                min="1"
                value={formData.maxStudents}
                onChange={(e) => updateField("maxStudents", parseInt(e.target.value) || 30)}
              />
            </div>

            <div className="space-y-2">
              <Label>Instructor</Label>
              <Select
                value={formData.instructorId || ""}
                onValueChange={(v) => updateField("instructorId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Assign instructor" />
                </SelectTrigger>
                <SelectContent>
                  {instructors.map((instructor) => (
                    <SelectItem key={instructor.id} value={instructor.id}>
                      {instructor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* WhatsApp Group Link */}
          <div className="space-y-2 p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-green-600" />
              <Label htmlFor="whatsapp" className="text-green-700 dark:text-green-400">
                WhatsApp Group Link (Optional)
              </Label>
            </div>
            <Input
              id="whatsapp"
              placeholder="https://chat.whatsapp.com/..."
              value={formData.whatsAppLink || ""}
              onChange={(e) => updateField("whatsAppLink", e.target.value)}
              className="bg-background"
            />
            <p className="text-xs text-muted-foreground">
              Only enrolled students and assigned instructors can see this link.
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of this batch..."
              value={formData.description || ""}
              onChange={(e) => updateField("description", e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {editBatch ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>{editBatch ? "Update Batch" : "Create Batch"}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
