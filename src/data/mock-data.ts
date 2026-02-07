/**
 * Shared Mock Data for Teach LMS Dashboard
 * 
 * All dashboard pages import from here to ensure consistent
 * course names, instructor names, batch names, and student data.
 * 
 * Laravel Inertia.js Integration:
 * Replace these with data from usePage().props in production.
 */

import type { Course } from "@/types/course";
import type { Batch } from "@/types/batch";
import type { LiveSession } from "@/types/live-session";

// ─── Instructors ───────────────────────────────────────────

export const MOCK_INSTRUCTORS = [
  { id: "inst-1", name: "Dr. Sarah Johnson", title: "Mathematics & Physics" },
  { id: "inst-2", name: "Mrs. Adaeze Okonkwo", title: "English Language" },
  { id: "inst-3", name: "Emmanuel Tech", title: "Web Development" },
];

// ─── Courses ───────────────────────────────────────────────

export const MOCK_COURSES: Course[] = [
  {
    id: "course-1",
    schoolId: "school-1",
    title: "Mathematics for JSS1",
    description: "Foundation mathematics covering algebra, geometry, and number theory for Junior Secondary School 1.",
    shortDescription: "Foundation math for JSS1",
    instructor: { id: "inst-1", name: "Dr. Sarah Johnson", title: "Mathematics Department Head" },
    category: "Mathematics",
    academicLevel: "jss_1",
    price: 15000,
    durationWeeks: 12,
    status: "active",
    liveSession: { dayOfWeek: "saturday", time: "10:00", duration: 90, platform: "jitsi", timezone: "Africa/Lagos" },
    whatsApp: { enabled: true, groupLink: "https://chat.whatsapp.com/abc123" },
    totalBatches: 2,
    activeBatches: 1,
    totalEnrollments: 55,
    features: ["Weekly live sessions", "Practice worksheets", "WhatsApp support group"],
    requirements: ["Basic arithmetic knowledge"],
    createdAt: "2024-09-01T00:00:00Z",
    updatedAt: "2025-01-15T00:00:00Z",
  },
  {
    id: "course-2",
    schoolId: "school-1",
    title: "English Language - Primary 5",
    description: "Comprehensive English language course for Primary 5 students covering reading, writing, and grammar.",
    shortDescription: "English for Primary 5",
    instructor: { id: "inst-2", name: "Mrs. Adaeze Okonkwo", title: "English Department" },
    category: "English",
    academicLevel: "primary_5",
    price: 12000,
    durationWeeks: 10,
    status: "active",
    liveSession: { dayOfWeek: "wednesday", time: "15:00", duration: 60, platform: "zoom", timezone: "Africa/Lagos" },
    totalBatches: 1,
    activeBatches: 1,
    totalEnrollments: 18,
    features: ["Interactive reading sessions", "Writing workshops", "Grammar drills"],
    requirements: ["Basic reading and writing ability"],
    createdAt: "2024-10-01T00:00:00Z",
    updatedAt: "2025-01-10T00:00:00Z",
  },
  {
    id: "course-3",
    schoolId: "school-1",
    title: "Physics for SSS2",
    description: "Advanced physics concepts for Senior Secondary School 2 students preparing for WASSCE.",
    shortDescription: "Advanced physics for SSS2",
    instructor: { id: "inst-1", name: "Dr. Sarah Johnson", title: "Mathematics & Physics" },
    category: "Science",
    academicLevel: "sss_2",
    price: 20000,
    durationWeeks: 14,
    status: "active",
    liveSession: { dayOfWeek: "friday", time: "16:00", duration: 120, platform: "jitsi", timezone: "Africa/Lagos" },
    totalBatches: 1,
    activeBatches: 0,
    totalEnrollments: 28,
    features: ["Lab simulations", "Past question practice", "One-on-one tutoring"],
    requirements: ["JSS3 physics knowledge", "Basic mathematics"],
    createdAt: "2024-08-15T00:00:00Z",
    updatedAt: "2025-01-05T00:00:00Z",
  },
  {
    id: "course-4",
    schoolId: "school-1",
    title: "Web Development Bootcamp",
    description: "Full-stack web development bootcamp covering HTML, CSS, JavaScript, React, and Node.js.",
    shortDescription: "Full-stack web development",
    instructor: { id: "inst-3", name: "Emmanuel Tech", title: "Lead Developer" },
    category: "Technology",
    academicLevel: "adult",
    price: 45000,
    durationWeeks: 16,
    status: "active",
    liveSession: { dayOfWeek: "tuesday", time: "19:00", duration: 120, platform: "zoom", timezone: "Africa/Lagos" },
    whatsApp: { enabled: true, groupLink: "https://chat.whatsapp.com/def456" },
    totalBatches: 2,
    activeBatches: 1,
    totalEnrollments: 40,
    features: ["Hands-on projects", "Portfolio building", "Job placement support"],
    requirements: ["Computer with internet", "Basic computer skills"],
    createdAt: "2024-07-01T00:00:00Z",
    updatedAt: "2025-01-20T00:00:00Z",
  },
];

// ─── Batches ───────────────────────────────────────────────

export const MOCK_BATCHES: Batch[] = [
  {
    id: "batch-1",
    courseId: "course-1",
    courseName: "Mathematics for JSS1",
    name: "January 2025 Batch",
    description: "New year intake for JSS1 mathematics",
    startDate: "2025-01-06",
    endDate: "2025-03-28",
    maxStudents: 30,
    currentEnrollment: 25,
    status: "active",
    instructorId: "inst-1",
    instructorName: "Dr. Sarah Johnson",
    whatsAppLink: "https://chat.whatsapp.com/batch1",
    whatsAppGroupName: "Math JSS1 - Jan 2025",
    createdAt: "2024-12-15T00:00:00Z",
    updatedAt: "2025-01-06T00:00:00Z",
  },
  {
    id: "batch-2",
    courseId: "course-2",
    courseName: "English Language - Primary 5",
    name: "February 2025 Batch",
    startDate: "2025-02-03",
    endDate: "2025-04-11",
    maxStudents: 25,
    currentEnrollment: 18,
    status: "open",
    instructorId: "inst-2",
    instructorName: "Mrs. Adaeze Okonkwo",
    whatsAppLink: "https://chat.whatsapp.com/batch2",
    whatsAppGroupName: "English P5 - Feb 2025",
    createdAt: "2025-01-10T00:00:00Z",
    updatedAt: "2025-01-20T00:00:00Z",
  },
  {
    id: "batch-3",
    courseId: "course-4",
    courseName: "Web Development Bootcamp",
    name: "March 2025 Cohort",
    startDate: "2025-03-01",
    endDate: "2025-06-20",
    maxStudents: 20,
    currentEnrollment: 20,
    status: "closed",
    instructorId: "inst-3",
    instructorName: "Emmanuel Tech",
    whatsAppLink: "https://chat.whatsapp.com/batch3",
    whatsAppGroupName: "WebDev - Mar 2025",
    createdAt: "2025-01-25T00:00:00Z",
    updatedAt: "2025-02-01T00:00:00Z",
  },
  {
    id: "batch-4",
    courseId: "course-3",
    courseName: "Physics for SSS2",
    name: "December 2024 Batch",
    startDate: "2024-12-02",
    endDate: "2025-03-14",
    maxStudents: 30,
    currentEnrollment: 28,
    status: "completed",
    instructorId: "inst-1",
    instructorName: "Dr. Sarah Johnson",
    createdAt: "2024-11-15T00:00:00Z",
    updatedAt: "2025-03-14T00:00:00Z",
  },
];

// ─── Students ──────────────────────────────────────────────

export interface MockStudent {
  id: string;
  name: string;
  email: string;
  phone: string;
  batchId: string;
  batchName: string;
  courseName: string;
  academicLevel: string;
  parentName?: string;
  parentPhone?: string;
  paymentStatus: "completed" | "pending" | "failed";
  enrolledAt: string;
  status: "active" | "completed" | "dropped";
}

export const MOCK_STUDENTS: MockStudent[] = [
  { id: "s-1", name: "Chidera Okonkwo", email: "chidera@example.com", phone: "+234 801 234 5678", batchId: "batch-1", batchName: "January 2025 Batch", courseName: "Mathematics for JSS1", academicLevel: "jss_1", parentName: "Mrs. Ngozi Okonkwo", parentPhone: "+234 811 111 1111", paymentStatus: "completed", enrolledAt: "2025-01-03", status: "active" },
  { id: "s-2", name: "Amara Eze", email: "amara@example.com", phone: "+234 802 345 6789", batchId: "batch-1", batchName: "January 2025 Batch", courseName: "Mathematics for JSS1", academicLevel: "jss_1", parentName: "Mr. Emeka Eze", parentPhone: "+234 812 222 2222", paymentStatus: "completed", enrolledAt: "2025-01-04", status: "active" },
  { id: "s-3", name: "Tunde Adeyemi", email: "tunde@example.com", phone: "+234 803 456 7890", batchId: "batch-2", batchName: "February 2025 Batch", courseName: "English Language - Primary 5", academicLevel: "primary_5", parentName: "Mrs. Folake Adeyemi", parentPhone: "+234 813 333 3333", paymentStatus: "completed", enrolledAt: "2025-01-28", status: "active" },
  { id: "s-4", name: "Emmanuel Nwachukwu", email: "emmanuel.n@example.com", phone: "+234 804 567 8901", batchId: "batch-3", batchName: "March 2025 Cohort", courseName: "Web Development Bootcamp", academicLevel: "adult", paymentStatus: "completed", enrolledAt: "2025-02-15", status: "active" },
  { id: "s-5", name: "Blessing Okoro", email: "blessing@example.com", phone: "+234 805 678 9012", batchId: "batch-3", batchName: "March 2025 Cohort", courseName: "Web Development Bootcamp", academicLevel: "adult", paymentStatus: "pending", enrolledAt: "2025-02-20", status: "active" },
  { id: "s-6", name: "Fatima Abdullahi", email: "fatima@example.com", phone: "+234 806 789 0123", batchId: "batch-4", batchName: "December 2024 Batch", courseName: "Physics for SSS2", academicLevel: "sss_2", parentName: "Alhaji Abdullahi", parentPhone: "+234 816 666 6666", paymentStatus: "completed", enrolledAt: "2024-11-25", status: "completed" },
  { id: "s-7", name: "David Obi", email: "david.obi@example.com", phone: "+234 807 890 1234", batchId: "batch-1", batchName: "January 2025 Batch", courseName: "Mathematics for JSS1", academicLevel: "jss_1", parentName: "Mr. Peter Obi", parentPhone: "+234 817 777 7777", paymentStatus: "completed", enrolledAt: "2025-01-05", status: "active" },
  { id: "s-8", name: "Grace Afolabi", email: "grace@example.com", phone: "+234 808 901 2345", batchId: "batch-2", batchName: "February 2025 Batch", courseName: "English Language - Primary 5", academicLevel: "primary_5", parentName: "Mrs. Yetunde Afolabi", parentPhone: "+234 818 888 8888", paymentStatus: "failed", enrolledAt: "2025-01-30", status: "active" },
];

// ─── Upcoming Sessions ────────────────────────────────────

export const MOCK_UPCOMING_SESSIONS: LiveSession[] = [
  {
    id: "session-1",
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
    id: "session-2",
    courseId: "course-2",
    courseName: "English Language - Primary 5",
    title: "Reading Comprehension Practice",
    scheduledAt: "2025-02-05T15:00:00+01:00",
    duration: 60,
    platform: "zoom",
    status: "scheduled",
    instructorId: "inst-2",
    instructorName: "Mrs. Adaeze Okonkwo",
    enrolledCount: 18,
    createdAt: "2025-01-28T00:00:00Z",
    updatedAt: "2025-01-28T00:00:00Z",
  },
  {
    id: "session-3",
    courseId: "course-4",
    courseName: "Web Development Bootcamp",
    title: "React Hooks Deep Dive",
    scheduledAt: "2025-02-04T19:00:00+01:00",
    duration: 120,
    platform: "zoom",
    status: "scheduled",
    instructorId: "inst-3",
    instructorName: "Emmanuel Tech",
    enrolledCount: 20,
    createdAt: "2025-01-25T00:00:00Z",
    updatedAt: "2025-01-25T00:00:00Z",
  },
];

// ─── Revenue Data ──────────────────────────────────────────

export const MOCK_REVENUE_DATA = [
  { month: "Sep", revenue: 180000 },
  { month: "Oct", revenue: 220000 },
  { month: "Nov", revenue: 195000 },
  { month: "Dec", revenue: 310000 },
  { month: "Jan", revenue: 425000 },
  { month: "Feb", revenue: 380000 },
];

export const MOCK_ENROLLMENT_TREND = [
  { month: "Sep", enrollments: 12 },
  { month: "Oct", enrollments: 18 },
  { month: "Nov", enrollments: 15 },
  { month: "Dec", enrollments: 28 },
  { month: "Jan", enrollments: 35 },
  { month: "Feb", enrollments: 22 },
];
