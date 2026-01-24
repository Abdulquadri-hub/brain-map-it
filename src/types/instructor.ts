/**
 * Instructor Types for Teach LMS V3
 * 
 * Laravel Inertia.js Integration:
 * These types should match the Laravel Eloquent models:
 * - App\Models\Instructor
 * - App\Models\InstructorAgreement
 * - App\Models\InstructorPayment
 * 
 * V3 Changes:
 * - Simplified payment structures: per_batch, per_student, monthly, custom
 * - Removed revenue_share and base_commission (platform doesn't process payments)
 * - Added batch assignments
 * - Note: Payments are handled directly by school owner, not platform
 */

// Simplified payment structure types for V3
export type PaymentStructure = 'per_batch' | 'per_student' | 'monthly' | 'custom';

export type InstructorStatus = 'active' | 'pending' | 'inactive';

export type InstructorPermission = 
  | 'upload_content'
  | 'host_live_sessions'
  | 'grade_assignments'
  | 'manage_enrollments'
  | 'view_analytics'
  | 'message_students';

export interface PaymentTerms {
  structure: PaymentStructure;
  // Per Batch Payment
  perBatchAmount?: number;
  // Per Student Payment
  perStudentAmount?: number;
  // Monthly Salary
  monthlyAmount?: number;
  // Custom Agreement
  customDescription?: string;
  customAmount?: number;
  // Payment notes
  notes?: string;
}

export interface InstructorAgreement {
  id: string;
  instructorId: string;
  schoolId: string;
  paymentTerms: PaymentTerms;
  permissions: InstructorPermission[];
  assignedBatches: string[]; // Batch IDs (changed from courses)
  startDate: string;
  endDate?: string;
  status: 'active' | 'pending' | 'terminated';
  createdAt: string;
  updatedAt: string;
}

export interface Instructor {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  bio?: string;
  specializations: string[];
  status: InstructorStatus;
  joinDate: string;
  // School-specific data (for current school context)
  department?: string;
  batches: number; // Active batches count
  students: number;
  agreement?: InstructorAgreement;
  // Multi-school data
  schoolAssociations?: SchoolAssociation[];
}

export interface SchoolAssociation {
  schoolId: string;
  schoolName: string;
  schoolLogo?: string;
  role: 'instructor' | 'lead_instructor';
  agreement: InstructorAgreement;
  // Payment tracking (for display only - school handles actual payments)
  totalEarnings: number;
  pendingPayment: number;
  batchesCount: number;
  studentsCount: number;
}

// Track instructor payments (for record keeping - not processing)
export interface InstructorPayment {
  id: string;
  instructorId: string;
  schoolId: string;
  amount: number;
  currency: string;
  period: string; // e.g., "January 2024" or "Batch: JSS2 Math Jan 2024"
  description: string;
  status: 'pending' | 'paid';
  paidAt?: string;
  createdAt: string;
  // Reference info
  batchId?: string;
  batchName?: string;
  studentCount?: number;
}

// Instructor Hub aggregated data (cross-tenant)
export interface InstructorHubData {
  instructor: Instructor;
  totalSchools: number;
  totalEarnings: number;
  pendingPayments: number;
  totalStudents: number;
  totalBatches: number;
  upcomingSessions: UpcomingSession[];
  recentActivity: ActivityItem[];
  schoolSummaries: SchoolSummary[];
}

export interface UpcomingSession {
  id: string;
  schoolId: string;
  schoolName: string;
  batchId: string;
  batchName: string;
  courseId: string;
  courseName: string;
  scheduledAt: string;
  duration: number;
  platform: string;
  meetingLink?: string;
}

export interface ActivityItem {
  id: string;
  type: 'enrollment' | 'completion' | 'submission' | 'message' | 'payment';
  schoolId: string;
  schoolName: string;
  description: string;
  timestamp: string;
}

export interface SchoolSummary {
  schoolId: string;
  schoolName: string;
  schoolLogo?: string;
  earnings: {
    thisMonth: number;
    lastMonth: number;
    total: number;
  };
  students: number;
  batches: number;
  pendingTasks: number;
  nextPayment?: {
    amount: number;
    date: string;
  };
}

// Invitation form data
export interface InstructorInvitation {
  name: string;
  email: string;
  phone: string;
  department: string;
  paymentTerms: PaymentTerms;
  permissions: InstructorPermission[];
  assignedBatches: string[];
  message?: string;
}

// Default values
export const DEFAULT_PAYMENT_TERMS: PaymentTerms = {
  structure: 'per_batch',
  perBatchAmount: 20000,
};

export const DEFAULT_PERMISSIONS: InstructorPermission[] = [
  'upload_content',
  'host_live_sessions',
  'grade_assignments',
  'view_analytics',
];

export const PERMISSION_LABELS: Record<InstructorPermission, string> = {
  upload_content: 'Upload course materials',
  host_live_sessions: 'Host live sessions',
  grade_assignments: 'Grade assignments',
  manage_enrollments: 'Manage student enrollments',
  view_analytics: 'View batch analytics',
  message_students: 'Message students directly',
};

export const PAYMENT_STRUCTURE_LABELS: Record<PaymentStructure, string> = {
  per_batch: 'Per Batch',
  per_student: 'Per Student',
  monthly: 'Monthly Salary',
  custom: 'Custom Agreement',
};

export const PAYMENT_STRUCTURE_DESCRIPTIONS: Record<PaymentStructure, string> = {
  per_batch: 'Fixed amount per batch taught',
  per_student: 'Amount per enrolled student',
  monthly: 'Fixed monthly salary',
  custom: 'Custom payment arrangement',
};
