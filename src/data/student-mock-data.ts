/**
 * Student & Parent Mock Data for Teach LMS
 * 
 * Consistent with entities in mock-data.ts:
 * - Student s-1 (Chidera Okonkwo) enrolled in batch-1
 * - Student s-7 (David Obi) enrolled in batch-1
 * - Parent: Mrs. Ngozi Okonkwo
 * 
 * Laravel Inertia.js Integration:
 * Replace with data from usePage().props in production.
 */

import type { Assignment, AssignmentSubmission, Certificate, BatchLeaderboard } from "@/types/batch";
import type { LiveSession } from "@/types/live-session";
import type { Complaint } from "@/types/complaint";

// ─── Student Assignments ──────────────────────────────────

export const MOCK_STUDENT_ASSIGNMENTS: Assignment[] = [
  {
    id: "assign-1",
    batchId: "batch-1",
    courseId: "course-1",
    title: "Linear Equations Practice Set",
    description: "Solve 20 linear equations covering single-variable and two-variable problems.",
    instructions: "Show all working steps. Submit as a PDF or clear photo of handwritten work.",
    dueDate: "2025-02-15",
    totalPoints: 100,
    status: "published",
    createdAt: "2025-01-20T00:00:00Z",
    updatedAt: "2025-01-20T00:00:00Z",
  },
  {
    id: "assign-2",
    batchId: "batch-1",
    courseId: "course-1",
    title: "Geometry: Triangles and Angles",
    description: "Complete exercises on triangle properties, angle calculations, and proofs.",
    dueDate: "2025-02-22",
    totalPoints: 100,
    status: "published",
    createdAt: "2025-01-27T00:00:00Z",
    updatedAt: "2025-01-27T00:00:00Z",
  },
  {
    id: "assign-3",
    batchId: "batch-1",
    courseId: "course-1",
    title: "Number Theory Quiz",
    description: "Weekly quiz on prime numbers, factors, and multiples.",
    dueDate: "2025-03-01",
    totalPoints: 50,
    status: "published",
    createdAt: "2025-02-03T00:00:00Z",
    updatedAt: "2025-02-03T00:00:00Z",
  },
];

// Student s-1 (Chidera) submissions
export const MOCK_STUDENT_SUBMISSIONS: AssignmentSubmission[] = [
  {
    id: "sub-1",
    assignmentId: "assign-1",
    studentId: "s-1",
    studentName: "Chidera Okonkwo",
    content: "Completed all 20 equations with working steps.",
    attachments: [
      { id: "att-1", name: "linear-equations.pdf", url: "#", type: "pdf", size: 2048000 },
    ],
    status: "graded",
    submittedAt: "2025-02-13T14:30:00Z",
    grade: 85,
    feedback: "Excellent work! Minor errors in questions 15 and 18. Review the substitution method.",
    gradedAt: "2025-02-14T10:00:00Z",
    gradedBy: "inst-1",
  },
  {
    id: "sub-2",
    assignmentId: "assign-2",
    studentId: "s-1",
    studentName: "Chidera Okonkwo",
    content: "Submitted geometry exercises.",
    attachments: [
      { id: "att-2", name: "triangles-work.pdf", url: "#", type: "pdf", size: 1536000 },
    ],
    status: "submitted",
    submittedAt: "2025-02-20T16:00:00Z",
  },
  {
    id: "sub-3",
    assignmentId: "assign-3",
    studentId: "s-1",
    studentName: "Chidera Okonkwo",
    attachments: [],
    status: "pending",
  },
];

// ─── Batch Leaderboard ────────────────────────────────────

export const MOCK_BATCH_LEADERBOARD: BatchLeaderboard[] = [
  { batchId: "batch-1", studentId: "s-2", studentName: "Amara Eze", overallScore: 92, assignmentAvg: 94, quizAvg: 90, attendanceRate: 100, participationScore: 88, rank: 1, previousRank: 2, rankChange: 1 },
  { batchId: "batch-1", studentId: "s-9", studentName: "Kemi Alade", overallScore: 90, assignmentAvg: 88, quizAvg: 92, attendanceRate: 95, participationScore: 90, rank: 2, previousRank: 1, rankChange: -1 },
  { batchId: "batch-1", studentId: "s-10", studentName: "Uche Nnadi", overallScore: 88, assignmentAvg: 86, quizAvg: 90, attendanceRate: 90, participationScore: 85, rank: 3, previousRank: 3, rankChange: 0 },
  { batchId: "batch-1", studentId: "s-1", studentName: "Chidera Okonkwo", overallScore: 85, assignmentAvg: 85, quizAvg: 82, attendanceRate: 80, participationScore: 88, rank: 4, previousRank: 5, rankChange: 1 },
  { batchId: "batch-1", studentId: "s-7", studentName: "David Obi", overallScore: 82, assignmentAvg: 80, quizAvg: 84, attendanceRate: 90, participationScore: 78, rank: 5, previousRank: 4, rankChange: -1 },
  { batchId: "batch-1", studentId: "s-11", studentName: "Ngozi Ibe", overallScore: 79, assignmentAvg: 76, quizAvg: 82, attendanceRate: 85, participationScore: 75, rank: 6, previousRank: 6, rankChange: 0 },
];

// ─── Student Sessions (with attendance) ───────────────────

export const MOCK_STUDENT_SESSIONS: (LiveSession & { attended?: boolean })[] = [
  {
    id: "ss-1", courseId: "course-1", courseName: "Mathematics for JSS1", title: "Introduction to Algebra",
    scheduledAt: "2025-01-11T10:00:00+01:00", duration: 90, platform: "jitsi", status: "completed",
    instructorId: "inst-1", instructorName: "Dr. Sarah Johnson", enrolledCount: 25,
    createdAt: "2025-01-06T00:00:00Z", updatedAt: "2025-01-11T00:00:00Z", attended: true,
  },
  {
    id: "ss-2", courseId: "course-1", courseName: "Mathematics for JSS1", title: "Variables and Expressions",
    scheduledAt: "2025-01-18T10:00:00+01:00", duration: 90, platform: "jitsi", status: "completed",
    instructorId: "inst-1", instructorName: "Dr. Sarah Johnson", enrolledCount: 25,
    createdAt: "2025-01-06T00:00:00Z", updatedAt: "2025-01-18T00:00:00Z", attended: true,
  },
  {
    id: "ss-3", courseId: "course-1", courseName: "Mathematics for JSS1", title: "Solving Linear Equations",
    scheduledAt: "2025-01-25T10:00:00+01:00", duration: 90, platform: "jitsi", status: "completed",
    instructorId: "inst-1", instructorName: "Dr. Sarah Johnson", enrolledCount: 25,
    createdAt: "2025-01-06T00:00:00Z", updatedAt: "2025-01-25T00:00:00Z", attended: false,
  },
  {
    id: "ss-4", courseId: "course-1", courseName: "Mathematics for JSS1", title: "Word Problems in Algebra",
    scheduledAt: "2025-02-01T10:00:00+01:00", duration: 90, platform: "jitsi", status: "completed",
    instructorId: "inst-1", instructorName: "Dr. Sarah Johnson", enrolledCount: 25,
    createdAt: "2025-01-06T00:00:00Z", updatedAt: "2025-02-01T00:00:00Z", attended: true,
  },
  {
    id: "ss-5", courseId: "course-1", courseName: "Mathematics for JSS1", title: "Geometry Fundamentals",
    scheduledAt: "2025-02-08T10:00:00+01:00", duration: 90, platform: "jitsi", status: "completed",
    instructorId: "inst-1", instructorName: "Dr. Sarah Johnson", enrolledCount: 25,
    createdAt: "2025-01-06T00:00:00Z", updatedAt: "2025-02-08T00:00:00Z", attended: true,
  },
  {
    id: "ss-6", courseId: "course-1", courseName: "Mathematics for JSS1", title: "Triangles and Angles",
    scheduledAt: "2025-02-15T10:00:00+01:00", duration: 90, platform: "jitsi", status: "scheduled",
    instructorId: "inst-1", instructorName: "Dr. Sarah Johnson", enrolledCount: 25,
    createdAt: "2025-01-06T00:00:00Z", updatedAt: "2025-02-08T00:00:00Z",
  },
  {
    id: "ss-7", courseId: "course-1", courseName: "Mathematics for JSS1", title: "Circles and Areas",
    scheduledAt: "2025-02-22T10:00:00+01:00", duration: 90, platform: "jitsi", status: "scheduled",
    instructorId: "inst-1", instructorName: "Dr. Sarah Johnson", enrolledCount: 25,
    createdAt: "2025-01-06T00:00:00Z", updatedAt: "2025-02-08T00:00:00Z",
  },
];

// ─── Course Materials ─────────────────────────────────────

export interface CourseMaterial {
  id: string;
  title: string;
  type: "pdf" | "link" | "video";
  url: string;
  size?: string;
  addedAt: string;
}

export const MOCK_COURSE_MATERIALS: CourseMaterial[] = [
  { id: "mat-1", title: "Algebra Basics - Chapter 1", type: "pdf", url: "#", size: "2.4 MB", addedAt: "2025-01-06" },
  { id: "mat-2", title: "Practice Worksheet: Equations", type: "pdf", url: "#", size: "1.1 MB", addedAt: "2025-01-13" },
  { id: "mat-3", title: "Khan Academy: Linear Equations", type: "link", url: "https://khanacademy.org", addedAt: "2025-01-20" },
  { id: "mat-4", title: "Geometry Introduction Video", type: "video", url: "#", addedAt: "2025-02-01" },
  { id: "mat-5", title: "Triangle Properties Notes", type: "pdf", url: "#", size: "3.0 MB", addedAt: "2025-02-08" },
];

// ─── Student Certificates ─────────────────────────────────

export const MOCK_STUDENT_CERTIFICATES: Certificate[] = [
  {
    id: "cert-1",
    studentId: "s-1",
    batchId: "batch-4",
    courseId: "course-3",
    studentName: "Chidera Okonkwo",
    courseName: "Physics for SSS2",
    batchName: "December 2024 Batch",
    issueDate: "2025-03-14",
    grade: "B+",
    rank: 4,
    totalStudents: 28,
    verificationCode: "TEACH-CERT-2025-0041",
    verificationUrl: "https://teach.app/verify/TEACH-CERT-2025-0041",
  },
];

// ─── Student Complaints ───────────────────────────────────

export const MOCK_STUDENT_COMPLAINTS: Complaint[] = [
  {
    id: "comp-s1",
    schoolId: "school-1",
    fromName: "Chidera Okonkwo",
    fromEmail: "chidera@example.com",
    fromType: "student",
    category: "technical",
    subject: "Cannot join live session",
    description: "I was unable to join the January 25th session. The link kept timing out.",
    status: "resolved",
    priority: "medium",
    relatedCourseName: "Mathematics for JSS1",
    relatedBatchName: "January 2025 Batch",
    responses: [
      { id: "resp-1", complaintId: "comp-s1", respondedBy: "School Admin", message: "We've fixed the session link. Please try the new link sent to your WhatsApp group.", createdAt: "2025-01-26T10:00:00Z" },
    ],
    createdAt: "2025-01-25T12:00:00Z",
    updatedAt: "2025-01-26T10:00:00Z",
    resolvedAt: "2025-01-26T10:00:00Z",
  },
];

// ─── Parent Mock Data ─────────────────────────────────────

export interface ParentChild {
  id: string;
  name: string;
  email: string;
  batches: {
    batchId: string;
    batchName: string;
    courseName: string;
    instructorName: string;
    status: string;
    attendanceRate: number;
    leaderboardRank: number;
    totalStudents: number;
  }[];
}

export const MOCK_PARENT_CHILDREN: ParentChild[] = [
  {
    id: "s-1",
    name: "Chidera Okonkwo",
    email: "chidera@example.com",
    batches: [
      {
        batchId: "batch-1",
        batchName: "January 2025 Batch",
        courseName: "Mathematics for JSS1",
        instructorName: "Dr. Sarah Johnson",
        status: "active",
        attendanceRate: 80,
        leaderboardRank: 4,
        totalStudents: 25,
      },
    ],
  },
  {
    id: "s-7",
    name: "David Obi",
    email: "david.obi@example.com",
    batches: [
      {
        batchId: "batch-1",
        batchName: "January 2025 Batch",
        courseName: "Mathematics for JSS1",
        instructorName: "Dr. Sarah Johnson",
        status: "active",
        attendanceRate: 90,
        leaderboardRank: 5,
        totalStudents: 25,
      },
    ],
  },
];

export interface ParentPayment {
  id: string;
  childName: string;
  courseName: string;
  batchName: string;
  amount: number;
  currency: string;
  status: "completed" | "pending" | "failed";
  paidAt?: string;
  reference: string;
}

export const MOCK_PARENT_PAYMENTS: ParentPayment[] = [
  {
    id: "pay-1",
    childName: "Chidera Okonkwo",
    courseName: "Mathematics for JSS1",
    batchName: "January 2025 Batch",
    amount: 15000,
    currency: "NGN",
    status: "completed",
    paidAt: "2025-01-03T09:00:00Z",
    reference: "PAY-2025-001",
  },
  {
    id: "pay-2",
    childName: "David Obi",
    courseName: "Mathematics for JSS1",
    batchName: "January 2025 Batch",
    amount: 15000,
    currency: "NGN",
    status: "completed",
    paidAt: "2025-01-05T11:30:00Z",
    reference: "PAY-2025-002",
  },
  {
    id: "pay-3",
    childName: "Chidera Okonkwo",
    courseName: "English Language - Primary 5",
    batchName: "February 2025 Batch",
    amount: 12000,
    currency: "NGN",
    status: "pending",
    reference: "PAY-2025-003",
  },
];
