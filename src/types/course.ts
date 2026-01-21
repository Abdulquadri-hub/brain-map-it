// Course & Content Management Types
// Laravel Inertia.js Integration:
// These types should match your Laravel backend models

export type LessonType = "video" | "document" | "quiz" | "assignment";
export type CourseStatus = "draft" | "active" | "archived";
export type ContentStatus = "draft" | "published";
export type LearningType = "self_paced" | "live_classes" | "hybrid";
export type LivePlatform = "google_meet" | "zoom" | "teams";
export type AcademicLevel = 
  | "primary_1" | "primary_2" | "primary_3" | "primary_4" | "primary_5" | "primary_6"
  | "jss_1" | "jss_2" | "jss_3"
  | "sss_1" | "sss_2" | "sss_3"
  | "adult";

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description?: string;
  type: LessonType;
  duration: string;
  content?: string;
  videoUrl?: string;
  documentUrl?: string;
  order: number;
  status: ContentStatus;
  isFree?: boolean;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  lessons: Lesson[];
  order: number;
}

export interface CourseInstructor {
  id: string;
  name: string;
  avatar?: string;
  title: string;
  bio?: string;
}

export interface CourseSchedule {
  startDate: string;
  endDate: string;
  classTime?: string;
}

export interface LiveSessionSchedule {
  dayOfWeek: string;
  time: string;
  duration: number; // in minutes
  timezone?: string;
}

export interface LiveSessionConfig {
  platform: LivePlatform;
  schedule: LiveSessionSchedule[];
  meetingLink?: string;
  autoGenerateLink: boolean;
  recordSessions: boolean;
  maxParticipants?: number;
}

export interface CoursePricing {
  selfPacedPrice: number;
  liveClassPrice: number;
  // Hybrid allows student to choose, both prices apply
}

export interface WhatsAppConfig {
  enabled: boolean;
  groupLink?: string;
  accessType: "live_only" | "all_students";
}

export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  instructor: CourseInstructor;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  academicLevel?: AcademicLevel;
  price: number;
  duration: string;
  image?: string;
  status: CourseStatus;
  enrolledCount: number;
  rating?: number;
  reviewCount?: number;
  features?: string[];
  requirements?: string[];
  schedule?: CourseSchedule;
  modules: Module[];
  createdAt?: string;
  updatedAt?: string;
  
  // New Learning Type System fields
  learningType: LearningType;
  allowsStudentChoice: boolean; // For hybrid - let student pick their experience
  pricing: CoursePricing;
  liveSession?: LiveSessionConfig;
  whatsApp?: WhatsAppConfig;
}

export interface StudentProgress {
  lessonId: string;
  completed: boolean;
  completedAt?: string;
  timeSpent?: number;
}

export interface CourseEnrollment {
  id: string;
  courseId: string;
  studentId: string;
  enrolledAt: string;
  progress: StudentProgress[];
  completedLessons: number;
  totalLessons: number;
  percentComplete: number;
  lastAccessedAt?: string;
  
  // New fields for learning type
  selectedLearningType: "self_paced" | "live_classes";
  hasLiveAccess: boolean;
  hasWhatsAppAccess: boolean;
  paidAmount: number;
}

// Live Session types for Phase 4
export interface LiveSession {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  scheduledAt: string;
  duration: number;
  meetingLink: string;
  status: "scheduled" | "live" | "completed" | "cancelled";
  recordingUrl?: string;
  attendeeCount?: number;
}

export interface SessionAttendance {
  id: string;
  sessionId: string;
  studentId: string;
  joinedAt: string;
  leftAt?: string;
  duration: number;
  status: "present" | "absent" | "late";
}
