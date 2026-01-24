/**
 * Course & Content Management Types - V3 Simplified
 * 
 * Laravel Inertia.js Integration:
 * These types should match your Laravel backend models
 * 
 * V3 Changes:
 * - Removed LearningType (self_paced, hybrid) - all courses are live classes
 * - Removed CoursePricing - single price per course
 * - Simplified live session config - single schedule per course
 * - Removed module/lesson structure - replaced with course materials
 */

export type CourseStatus = "draft" | "active" | "archived";
export type LivePlatform = "google_meet" | "zoom" | "teams";
export type AcademicLevel = 
  | "primary_1" | "primary_2" | "primary_3" | "primary_4" | "primary_5" | "primary_6"
  | "jss_1" | "jss_2" | "jss_3"
  | "sss_1" | "sss_2" | "sss_3"
  | "adult";

export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export interface CourseInstructor {
  id: string;
  name: string;
  avatar?: string;
  title: string;
  bio?: string;
}

// Simplified course material (replaces complex module/lesson structure)
export interface CourseMaterial {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  type: "pdf" | "link" | "video_link";
  url: string;
  order: number;
  createdAt: string;
}

// Simple live session configuration (one schedule per course)
export interface LiveSessionConfig {
  dayOfWeek: DayOfWeek;
  time: string; // "16:00" 24-hour format
  duration: number; // in minutes (e.g., 90)
  platform: LivePlatform;
  timezone?: string; // default to WAT (West Africa Time)
}

// WhatsApp group for course communication
export interface WhatsAppConfig {
  enabled: boolean;
  groupLink?: string;
}

export interface Course {
  id: string;
  schoolId: string;
  title: string;
  description: string;
  shortDescription?: string;
  instructor?: CourseInstructor;
  category: string;
  academicLevel: AcademicLevel;
  price: number; // Single price in Naira
  durationWeeks: number; // Course duration in weeks
  image?: string;
  status: CourseStatus;
  
  // Live session configuration
  liveSession: LiveSessionConfig;
  
  // WhatsApp group
  whatsApp?: WhatsAppConfig;
  
  // Course materials (PDFs, links)
  materials?: CourseMaterial[];
  
  // Statistics
  totalBatches: number;
  activeBatches: number;
  totalEnrollments: number;
  
  // Features shown on course page
  features?: string[];
  requirements?: string[];
  
  createdAt: string;
  updatedAt: string;
}

// Live Session instance (actual scheduled session for a batch)
export interface LiveSession {
  id: string;
  batchId: string;
  courseId: string;
  title: string;
  description?: string;
  scheduledAt: string;
  duration: number;
  meetingLink?: string;
  platform: LivePlatform;
  status: "scheduled" | "live" | "completed" | "cancelled";
  recordingUrl?: string;
  attendeeCount?: number;
  createdAt: string;
}

export interface SessionAttendance {
  id: string;
  sessionId: string;
  studentId: string;
  studentName: string;
  joinedAt?: string;
  leftAt?: string;
  duration: number; // minutes attended
  status: "present" | "absent" | "late" | "excused";
}

// For course creation/editing forms
export interface CourseFormData {
  title: string;
  description: string;
  shortDescription?: string;
  category: string;
  academicLevel: AcademicLevel;
  price: number;
  durationWeeks: number;
  image?: string;
  liveSession: LiveSessionConfig;
  whatsApp?: WhatsAppConfig;
  features: string[];
  requirements: string[];
}

// Academic level display labels
export const ACADEMIC_LEVEL_LABELS: Record<AcademicLevel, string> = {
  primary_1: "Primary 1",
  primary_2: "Primary 2",
  primary_3: "Primary 3",
  primary_4: "Primary 4",
  primary_5: "Primary 5",
  primary_6: "Primary 6",
  jss_1: "JSS 1",
  jss_2: "JSS 2",
  jss_3: "JSS 3",
  sss_1: "SSS 1",
  sss_2: "SSS 2",
  sss_3: "SSS 3",
  adult: "Adult Education",
};

export const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export const PLATFORM_LABELS: Record<LivePlatform, string> = {
  google_meet: "Google Meet",
  zoom: "Zoom",
  teams: "Microsoft Teams",
};

// Default values
export const DEFAULT_LIVE_SESSION: LiveSessionConfig = {
  dayOfWeek: "saturday",
  time: "10:00",
  duration: 90,
  platform: "google_meet",
  timezone: "Africa/Lagos",
};

export const DEFAULT_COURSE_FORM: CourseFormData = {
  title: "",
  description: "",
  category: "",
  academicLevel: "adult",
  price: 0,
  durationWeeks: 8,
  liveSession: DEFAULT_LIVE_SESSION,
  features: [],
  requirements: [],
};
