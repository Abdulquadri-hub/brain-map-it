/**
 * Instructor-Specific Mock Data
 *
 * Consistent with MOCK_COURSES, MOCK_BATCHES, and MOCK_STUDENTS
 * from src/data/mock-data.ts. Instructor "inst-1" (Dr. Sarah Johnson)
 * is the primary mock instructor.
 *
 * Laravel Inertia.js Integration:
 * Replace with usePage().props data from the backend.
 */

import type { InstructorPayment } from "@/types/instructor";
import type { AssignmentSubmission } from "@/types/batch";
import type { JobApplication, ApplicationStatus } from "@/types/job-portal";
import type { LiveSession } from "@/types/live-session";

// ─── Instructor School Summaries ──────────────────────────

export interface InstructorSchoolSummary {
  schoolId: string;
  schoolName: string;
  schoolLogo?: string;
  batchesCount: number;
  studentsCount: number;
  earningsThisMonth: number;
  earningsTotal: number;
  pendingPayment: number;
  nextSession?: {
    title: string;
    batchName: string;
    scheduledAt: string;
    platform: string;
  };
}

export const MOCK_INSTRUCTOR_SCHOOLS: InstructorSchoolSummary[] = [
  {
    schoolId: "school-1",
    schoolName: "Bright Stars Academy",
    batchesCount: 2,
    studentsCount: 53,
    earningsThisMonth: 55000,
    earningsTotal: 850000,
    pendingPayment: 25000,
    nextSession: {
      title: "Algebra: Linear Equations",
      batchName: "January 2025 Batch",
      scheduledAt: "2025-02-08T10:00:00+01:00",
      platform: "jitsi",
    },
  },
  {
    schoolId: "school-2",
    schoolName: "Excel Learning Center",
    batchesCount: 1,
    studentsCount: 22,
    earningsThisMonth: 45000,
    earningsTotal: 350000,
    pendingPayment: 0,
    nextSession: {
      title: "Thermodynamics Introduction",
      batchName: "Physics Advanced Cohort",
      scheduledAt: "2025-02-10T14:00:00+01:00",
      platform: "zoom",
    },
  },
];

// ─── Instructor Payments ──────────────────────────────────

export const MOCK_INSTRUCTOR_PAYMENTS: InstructorPayment[] = [
  {
    id: "pay-1",
    instructorId: "inst-1",
    schoolId: "school-1",
    amount: 25000,
    currency: "NGN",
    period: "January 2025",
    description: "Per batch payment - Mathematics for JSS1",
    status: "paid",
    paidAt: "2025-01-31T00:00:00Z",
    createdAt: "2025-01-28T00:00:00Z",
    batchId: "batch-1",
    batchName: "January 2025 Batch",
    studentCount: 25,
  },
  {
    id: "pay-2",
    instructorId: "inst-1",
    schoolId: "school-1",
    amount: 30000,
    currency: "NGN",
    period: "December 2024",
    description: "Per batch payment - Physics for SSS2",
    status: "paid",
    paidAt: "2024-12-31T00:00:00Z",
    createdAt: "2024-12-28T00:00:00Z",
    batchId: "batch-4",
    batchName: "December 2024 Batch",
    studentCount: 28,
  },
  {
    id: "pay-3",
    instructorId: "inst-1",
    schoolId: "school-2",
    amount: 45000,
    currency: "NGN",
    period: "January 2025",
    description: "Monthly salary - Excel Learning Center",
    status: "paid",
    paidAt: "2025-01-31T00:00:00Z",
    createdAt: "2025-01-28T00:00:00Z",
  },
  {
    id: "pay-4",
    instructorId: "inst-1",
    schoolId: "school-1",
    amount: 25000,
    currency: "NGN",
    period: "February 2025",
    description: "Per batch payment - Mathematics for JSS1",
    status: "pending",
    createdAt: "2025-02-01T00:00:00Z",
    batchId: "batch-1",
    batchName: "January 2025 Batch",
    studentCount: 25,
  },
];

// ─── Pending Submissions ──────────────────────────────────

export const MOCK_PENDING_SUBMISSIONS: AssignmentSubmission[] = [
  {
    id: "sub-1",
    assignmentId: "assign-1",
    studentId: "s-1",
    studentName: "Chidera Okonkwo",
    content: "My solution to the linear equations worksheet...",
    attachments: [{ id: "att-1", name: "math_worksheet.pdf", url: "#", type: "pdf", size: 1200000 }],
    status: "submitted",
    submittedAt: "2025-02-05T14:30:00Z",
  },
  {
    id: "sub-2",
    assignmentId: "assign-1",
    studentId: "s-2",
    studentName: "Amara Eze",
    content: "Please see attached document for my solutions.",
    attachments: [{ id: "att-2", name: "algebra_answers.pdf", url: "#", type: "pdf", size: 980000 }],
    status: "submitted",
    submittedAt: "2025-02-06T09:15:00Z",
  },
  {
    id: "sub-3",
    assignmentId: "assign-1",
    studentId: "s-7",
    studentName: "David Obi",
    attachments: [{ id: "att-3", name: "hw_week3.pdf", url: "#", type: "pdf", size: 750000 }],
    status: "submitted",
    submittedAt: "2025-02-06T16:45:00Z",
  },
  {
    id: "sub-4",
    assignmentId: "assign-2",
    studentId: "s-6",
    studentName: "Fatima Abdullahi",
    content: "Newton's Laws practical lab report attached.",
    attachments: [{ id: "att-4", name: "physics_lab_report.pdf", url: "#", type: "pdf", size: 2100000 }],
    status: "submitted",
    submittedAt: "2025-02-04T11:00:00Z",
  },
  {
    id: "sub-5",
    assignmentId: "assign-2",
    studentId: "s-1",
    studentName: "Chidera Okonkwo",
    content: "Completed all exercises from Chapter 4.",
    attachments: [],
    status: "graded",
    submittedAt: "2025-02-01T10:00:00Z",
    grade: 85,
    feedback: "Excellent work! Just review question 4b on momentum.",
    gradedAt: "2025-02-02T08:00:00Z",
    gradedBy: "inst-1",
  },
];

// ─── Mock Assignments (for grading context) ───────────────

export interface MockAssignmentContext {
  id: string;
  batchId: string;
  batchName: string;
  courseName: string;
  schoolName: string;
  title: string;
  dueDate: string;
  totalPoints: number;
  pendingCount: number;
  gradedCount: number;
}

export const MOCK_ASSIGNMENTS: MockAssignmentContext[] = [
  {
    id: "assign-1",
    batchId: "batch-1",
    batchName: "January 2025 Batch",
    courseName: "Mathematics for JSS1",
    schoolName: "Bright Stars Academy",
    title: "Linear Equations Worksheet",
    dueDate: "2025-02-07",
    totalPoints: 100,
    pendingCount: 3,
    gradedCount: 12,
  },
  {
    id: "assign-2",
    batchId: "batch-4",
    batchName: "December 2024 Batch",
    courseName: "Physics for SSS2",
    schoolName: "Bright Stars Academy",
    title: "Newton's Laws Lab Report",
    dueDate: "2025-02-05",
    totalPoints: 50,
    pendingCount: 1,
    gradedCount: 22,
  },
];

// ─── Instructor Sessions ─────────────────────────────────

export const MOCK_INSTRUCTOR_SESSIONS: LiveSession[] = [
  {
    id: "isession-1",
    courseId: "course-1",
    courseName: "Mathematics for JSS1",
    title: "Algebra: Linear Equations",
    description: "Introduction to solving linear equations",
    scheduledAt: "2025-02-08T10:00:00+01:00",
    duration: 90,
    platform: "jitsi",
    status: "scheduled",
    instructorId: "inst-1",
    instructorName: "Dr. Sarah Johnson",
    enrolledCount: 25,
    createdAt: "2025-01-30T00:00:00Z",
    updatedAt: "2025-01-30T00:00:00Z",
  },
  {
    id: "isession-2",
    courseId: "course-3",
    courseName: "Physics for SSS2",
    title: "Thermodynamics: Heat Transfer",
    description: "Understanding conduction, convection, and radiation",
    scheduledAt: "2025-02-10T14:00:00+01:00",
    duration: 120,
    platform: "zoom",
    meetingLink: "https://zoom.us/j/1234567890",
    status: "scheduled",
    instructorId: "inst-1",
    instructorName: "Dr. Sarah Johnson",
    enrolledCount: 28,
    createdAt: "2025-02-01T00:00:00Z",
    updatedAt: "2025-02-01T00:00:00Z",
  },
  {
    id: "isession-3",
    courseId: "course-1",
    courseName: "Mathematics for JSS1",
    title: "Algebra: Quadratic Expressions",
    scheduledAt: "2025-02-15T10:00:00+01:00",
    duration: 90,
    platform: "jitsi",
    status: "scheduled",
    instructorId: "inst-1",
    instructorName: "Dr. Sarah Johnson",
    enrolledCount: 25,
    createdAt: "2025-02-01T00:00:00Z",
    updatedAt: "2025-02-01T00:00:00Z",
  },
  {
    id: "isession-4",
    courseId: "course-1",
    courseName: "Mathematics for JSS1",
    title: "Number Theory: Factors & Multiples",
    scheduledAt: "2025-02-01T10:00:00+01:00",
    duration: 90,
    platform: "jitsi",
    status: "completed",
    instructorId: "inst-1",
    instructorName: "Dr. Sarah Johnson",
    enrolledCount: 25,
    attendeeCount: 22,
    createdAt: "2025-01-25T00:00:00Z",
    updatedAt: "2025-02-01T12:00:00Z",
  },
  {
    id: "isession-5",
    courseId: "course-3",
    courseName: "Physics for SSS2",
    title: "Mechanics: Newton's Laws Recap",
    scheduledAt: "2025-01-28T14:00:00+01:00",
    duration: 120,
    platform: "zoom",
    status: "completed",
    instructorId: "inst-1",
    instructorName: "Dr. Sarah Johnson",
    enrolledCount: 28,
    attendeeCount: 25,
    createdAt: "2025-01-20T00:00:00Z",
    updatedAt: "2025-01-28T16:30:00Z",
  },
];

// ─── Instructor Activity Feed ─────────────────────────────

export interface InstructorActivity {
  id: string;
  type: "enrollment" | "submission" | "payment" | "message";
  schoolName: string;
  description: string;
  timestamp: string;
}

export const MOCK_INSTRUCTOR_ACTIVITY: InstructorActivity[] = [
  { id: "act-1", type: "submission", schoolName: "Bright Stars Academy", description: "Chidera Okonkwo submitted Linear Equations Worksheet", timestamp: "2025-02-05T14:30:00Z" },
  { id: "act-2", type: "enrollment", schoolName: "Bright Stars Academy", description: "New student enrolled in Math JSS1 - January 2025 Batch", timestamp: "2025-02-04T10:00:00Z" },
  { id: "act-3", type: "payment", schoolName: "Excel Learning Center", description: "Payment of ₦45,000 received for January 2025", timestamp: "2025-01-31T09:00:00Z" },
  { id: "act-4", type: "submission", schoolName: "Bright Stars Academy", description: "Amara Eze submitted Linear Equations Worksheet", timestamp: "2025-02-06T09:15:00Z" },
  { id: "act-5", type: "message", schoolName: "Bright Stars Academy", description: "Parent inquiry about David Obi's progress", timestamp: "2025-02-03T16:00:00Z" },
];

// ─── Job Applications ─────────────────────────────────────

export interface MockJobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  schoolName: string;
  schoolLogo?: string;
  appliedAt: string;
  status: ApplicationStatus;
  interviewDate?: string;
  interviewPlatform?: string;
  notes?: string;
}

export const MOCK_JOB_APPLICATIONS: MockJobApplication[] = [
  {
    id: "app-1",
    jobId: "job-1",
    jobTitle: "Chemistry Instructor - SSS Level",
    schoolName: "Royal Academy Lagos",
    appliedAt: "2025-01-15T00:00:00Z",
    status: "interview",
    interviewDate: "2025-02-12T11:00:00+01:00",
    interviewPlatform: "zoom",
  },
  {
    id: "app-2",
    jobId: "job-2",
    jobTitle: "Mathematics Tutor - Primary & JSS",
    schoolName: "Greenfield School",
    appliedAt: "2025-01-20T00:00:00Z",
    status: "shortlisted",
  },
  {
    id: "app-3",
    jobId: "job-3",
    jobTitle: "Science Instructor - Part Time",
    schoolName: "Sunrise Academy",
    appliedAt: "2025-01-10T00:00:00Z",
    status: "rejected",
    notes: "Position filled by another candidate.",
  },
];

// ─── Instructor Earnings Chart Data ───────────────────────

export const MOCK_EARNINGS_CHART = [
  { month: "Sep", brightStars: 25000, excelCenter: 40000 },
  { month: "Oct", brightStars: 30000, excelCenter: 45000 },
  { month: "Nov", brightStars: 25000, excelCenter: 45000 },
  { month: "Dec", brightStars: 55000, excelCenter: 45000 },
  { month: "Jan", brightStars: 55000, excelCenter: 45000 },
  { month: "Feb", brightStars: 25000, excelCenter: 0 },
];

// ─── Instructor Batch Students (with grades/attendance) ───

export interface InstructorBatchStudent {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  attendanceRate: number;
  currentGrade: number;
  submissionsPending: number;
  submissionsGraded: number;
  lastActivity: string;
}

export const MOCK_BATCH_STUDENTS: Record<string, InstructorBatchStudent[]> = {
  "batch-1": [
    { id: "s-1", name: "Chidera Okonkwo", email: "chidera@example.com", attendanceRate: 92, currentGrade: 78, submissionsPending: 1, submissionsGraded: 4, lastActivity: "2025-02-05T14:30:00Z" },
    { id: "s-2", name: "Amara Eze", email: "amara@example.com", attendanceRate: 100, currentGrade: 88, submissionsPending: 1, submissionsGraded: 4, lastActivity: "2025-02-06T09:15:00Z" },
    { id: "s-7", name: "David Obi", email: "david.obi@example.com", attendanceRate: 84, currentGrade: 72, submissionsPending: 1, submissionsGraded: 3, lastActivity: "2025-02-06T16:45:00Z" },
  ],
  "batch-4": [
    { id: "s-6", name: "Fatima Abdullahi", email: "fatima@example.com", attendanceRate: 96, currentGrade: 91, submissionsPending: 1, submissionsGraded: 8, lastActivity: "2025-02-04T11:00:00Z" },
  ],
};
