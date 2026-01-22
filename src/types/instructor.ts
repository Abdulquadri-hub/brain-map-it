/**
 * Instructor Types for Teach LMS
 * 
 * Laravel Inertia.js Integration:
 * These types should match the Laravel Eloquent models:
 * - App\Models\Instructor
 * - App\Models\InstructorAgreement
 * - App\Models\InstructorPayout
 */

// Payment structure types
export type PaymentStructure = 'revenue_share' | 'fixed_salary' | 'base_commission';

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
  // Revenue Share
  revenueSharePercentage?: number; // 10-50%
  // Fixed Salary
  fixedSalaryAmount?: number;
  salaryFrequency?: 'monthly' | 'weekly' | 'per_course';
  // Base + Commission
  baseSalaryAmount?: number;
  commissionPercentage?: number;
}

export interface InstructorAgreement {
  id: string;
  instructorId: string;
  schoolId: string;
  paymentTerms: PaymentTerms;
  permissions: InstructorPermission[];
  assignedCourses: string[]; // Course IDs
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
  courses: number;
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
  totalEarnings: number;
  pendingPayout: number;
  coursesCount: number;
  studentsCount: number;
}

export interface InstructorPayout {
  id: string;
  instructorId: string;
  schoolId: string;
  amount: number;
  currency: string;
  period: string; // e.g., "January 2024"
  breakdown: PayoutBreakdown;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paidAt?: string;
  createdAt: string;
}

export interface PayoutBreakdown {
  grossRevenue: number;
  platformFee: number; // 10%
  instructorShare: number;
  // For base + commission
  baseSalary?: number;
  commission?: number;
  // Deductions
  deductions: PayoutDeduction[];
  netAmount: number;
}

export interface PayoutDeduction {
  type: string;
  description: string;
  amount: number;
}

// Instructor Hub aggregated data (cross-tenant)
export interface InstructorHubData {
  instructor: Instructor;
  totalSchools: number;
  totalEarnings: number;
  pendingPayouts: number;
  totalStudents: number;
  totalCourses: number;
  upcomingSessions: UpcomingSession[];
  recentActivity: ActivityItem[];
  schoolSummaries: SchoolSummary[];
}

export interface UpcomingSession {
  id: string;
  schoolId: string;
  schoolName: string;
  courseId: string;
  courseName: string;
  scheduledAt: string;
  duration: number;
  platform: string;
  meetingLink?: string;
}

export interface ActivityItem {
  id: string;
  type: 'enrollment' | 'completion' | 'submission' | 'message' | 'payout';
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
  courses: number;
  pendingTasks: number;
  nextPayout?: {
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
  assignedCourses: string[];
  message?: string;
}

// Default values
export const DEFAULT_PAYMENT_TERMS: PaymentTerms = {
  structure: 'revenue_share',
  revenueSharePercentage: 30,
};

export const DEFAULT_PERMISSIONS: InstructorPermission[] = [
  'upload_content',
  'host_live_sessions',
  'grade_assignments',
  'view_analytics',
];

export const PERMISSION_LABELS: Record<InstructorPermission, string> = {
  upload_content: 'Upload course content',
  host_live_sessions: 'Host live sessions',
  grade_assignments: 'Grade assignments & quizzes',
  manage_enrollments: 'Manage student enrollments',
  view_analytics: 'View course analytics',
  message_students: 'Message students directly',
};
