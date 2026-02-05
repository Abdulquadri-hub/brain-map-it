/**
 * Batch/Cohort Types for Teach LMS V3
 * 
 * Laravel Inertia.js Integration:
 * These types should match the Laravel Eloquent models:
 * - App\Models\Batch
 * - App\Models\BatchEnrollment
 * - App\Models\BatchLeaderboard
 * - App\Models\Assignment
 * - App\Models\AssignmentSubmission
 */

export type BatchStatus = "open" | "closed" | "active" | "completed";
export type EnrollmentStatus = "active" | "completed" | "dropped";
export type PaymentStatus = "pending" | "completed" | "failed";
export type SubmissionStatus = "pending" | "submitted" | "graded" | "late";

export interface Batch {
  id: string;
  courseId: string;
  courseName?: string;
  name: string; // "January 2025 Batch"
  description?: string;
  startDate: string;
  endDate: string;
  maxStudents: number;
  currentEnrollment: number;
  status: BatchStatus;
  instructorId?: string;
  instructorName?: string;
  whatsAppLink?: string;
  whatsAppGroupName?: string;
  whatsAppQRCode?: string;
  meetingLink?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BatchEnrollment {
  id: string;
  studentId: string;
  batchId: string;
  courseId: string;
  paidAmount: number;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  enrollmentStatus: EnrollmentStatus;
  enrolledAt: string;
  completedAt?: string;
  certificateId?: string;
}

export interface BatchLeaderboard {
  batchId: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  overallScore: number;
  assignmentAvg: number;
  quizAvg: number;
  attendanceRate: number;
  participationScore: number;
  rank: number;
  previousRank?: number;
  rankChange?: number; // positive = moved up, negative = moved down
}

export interface Assignment {
  id: string;
  batchId: string;
  courseId: string;
  title: string;
  description: string;
  instructions?: string;
  dueDate: string;
  totalPoints: number;
  attachments?: AssignmentAttachment[];
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentAttachment {
  id: string;
  name: string;
  url: string;
  type: "pdf" | "image" | "link";
  size?: number;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  content?: string;
  attachments: SubmissionAttachment[];
  status: SubmissionStatus;
  submittedAt?: string;
  grade?: number;
  feedback?: string;
  gradedAt?: string;
  gradedBy?: string;
}

export interface SubmissionAttachment {
  id: string;
  name: string;
  url: string;
  type: "pdf" | "image" | "document";
  size: number;
}

export interface Certificate {
  id: string;
  studentId: string;
  batchId: string;
  courseId: string;
  studentName: string;
  courseName: string;
  batchName: string;
  issueDate: string;
  grade: string; // "A", "B", "C", etc.
  rank: number;
  totalStudents: number;
  verificationCode: string;
  verificationUrl: string;
  downloadUrl?: string;
}

// Batch statistics for dashboard
export interface BatchStats {
  totalStudents: number;
  activeStudents: number;
  completedStudents: number;
  droppedStudents: number;
  averageAttendance: number;
  averageGrade: number;
  assignmentsCount: number;
  pendingSubmissions: number;
}

// For batch creation/editing forms
export interface BatchFormData {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  maxStudents: number;
  instructorId?: string;
  whatsAppLink?: string;
}

// Default values
export const DEFAULT_BATCH_FORM: BatchFormData = {
  name: "",
  startDate: "",
  endDate: "",
  maxStudents: 30,
};
