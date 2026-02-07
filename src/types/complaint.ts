/**
 * Complaint Management Types
 * 
 * Laravel Inertia.js Integration:
 * These types should match your Laravel backend models:
 * - App\Models\Complaint
 * - App\Models\ComplaintResponse
 */

export type ComplaintStatus = "open" | "in_progress" | "resolved";
export type ComplaintType = "student" | "parent" | "instructor";
export type ComplaintCategory = "course_content" | "instructor" | "payment" | "technical" | "general";

export interface Complaint {
  id: string;
  schoolId: string;
  fromName: string;
  fromEmail: string;
  fromType: ComplaintType;
  category: ComplaintCategory;
  subject: string;
  description: string;
  status: ComplaintStatus;
  priority: "low" | "medium" | "high";
  relatedCourseId?: string;
  relatedCourseName?: string;
  relatedBatchId?: string;
  relatedBatchName?: string;
  responses: ComplaintResponse[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface ComplaintResponse {
  id: string;
  complaintId: string;
  respondedBy: string;
  message: string;
  createdAt: string;
}

export const COMPLAINT_STATUS_LABELS: Record<ComplaintStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
};

export const COMPLAINT_TYPE_LABELS: Record<ComplaintType, string> = {
  student: "Student",
  parent: "Parent",
  instructor: "Instructor",
};

export const COMPLAINT_CATEGORY_LABELS: Record<ComplaintCategory, string> = {
  course_content: "Course Content",
  instructor: "Instructor",
  payment: "Payment",
  technical: "Technical",
  general: "General",
};
