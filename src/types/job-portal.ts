/**
 * Job Portal Types for Teach LMS V3
 * 
 * Laravel Inertia.js Integration:
 * These types should match the Laravel Eloquent models:
 * - App\Models\TutorJob
 * - App\Models\JobApplication
 * - App\Models\TutorProfile
 */

import { PaymentStructure } from "./instructor";

// Academic levels for job requirements
export type AcademicLevel = "primary" | "jss" | "sss" | "undergraduate" | "professional";

export type JobStatus = "draft" | "open" | "closed" | "filled";
export type ApplicationStatus = "pending" | "reviewed" | "shortlisted" | "interview" | "offered" | "rejected" | "accepted";
export type JobType = "full_time" | "part_time" | "contract" | "per_batch";

export interface TutorJob {
  id: string;
  schoolId: string;
  schoolName: string;
  schoolLogo?: string;
  schoolLocation: string;
  
  title: string; // "Mathematics Instructor - Primary Level"
  description: string;
  requirements: string[];
  responsibilities: string[];
  
  subjects: string[];
  academicLevels: AcademicLevel[];
  jobType: JobType;
  
  // Compensation (displayed based on school preference)
  compensationType: PaymentStructure;
  salaryRange?: { min: number; max: number };
  showSalary: boolean;
  
  // Logistics
  batchesAvailable: number;
  expectedStudents: number;
  startDate: string;
  
  status: JobStatus;
  applicationCount: number;
  viewCount: number;
  
  createdAt: string;
  expiresAt?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  tutorId: string;
  
  // Tutor info (from profile)
  tutorName: string;
  tutorEmail: string;
  tutorPhone: string;
  tutorAvatar?: string;
  tutorBio: string;
  tutorExperience: TutorExperience[];
  tutorEducation: TutorEducation[];
  
  // Application specific
  coverLetter: string;
  expectedCompensation?: string;
  availableStartDate: string;
  
  status: ApplicationStatus;
  
  // Interview
  interviewScheduled?: InterviewSchedule;
  
  // Notes (private to school)
  schoolNotes?: string;
  rating?: number; // 1-5 rating by school
  
  appliedAt: string;
  updatedAt: string;
}

export interface InterviewSchedule {
  id: string;
  applicationId: string;
  scheduledAt: string;
  duration: number; // minutes
  platform: "jitsi" | "zoom" | "phone" | "in_person";
  meetingLink?: string;
  notes?: string;
  status: "scheduled" | "completed" | "cancelled" | "no_show";
}

export interface TutorProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  location: string;
  bio: string;
  
  specializations: string[];
  academicLevels: AcademicLevel[];
  experience: TutorExperience[];
  education: TutorEducation[];
  certifications: TutorCertification[];
  
  // Stats
  totalStudentsTaught: number;
  totalBatchesCompleted: number;
  averageRating: number;
  reviewCount: number;
  
  // Preferences
  jobPreferences: {
    jobTypes: JobType[];
    minSalary?: number;
    locations: string[];
    remoteOnly: boolean;
  };
  
  // Visibility
  isProfilePublic: boolean;
  isOpenToOpportunities: boolean;
  
  createdAt: string;
  updatedAt: string;
}

export interface TutorExperience {
  id: string;
  institution: string;
  role: string;
  subjects: string[];
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
}

export interface TutorEducation {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationYear: number;
}

export interface TutorCertification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
}

// Job search filters
export interface JobSearchFilters {
  subjects?: string[];
  academicLevels?: AcademicLevel[];
  jobTypes?: JobType[];
  location?: string;
  minSalary?: number;
  status?: JobStatus;
}

// Default values
export const DEFAULT_JOB_SEARCH_FILTERS: JobSearchFilters = {
  status: "open",
};
