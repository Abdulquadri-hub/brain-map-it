// Live Session Management Types
// Laravel Inertia.js Integration:
// These types should match your Laravel backend models

export type SessionStatus = "scheduled" | "live" | "completed" | "cancelled";
export type AttendanceStatus = "present" | "absent" | "late" | "excused";
export type LivePlatform = "google_meet" | "zoom" | "teams";

export interface LiveSession {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  description?: string;
  scheduledAt: string;
  duration: number; // in minutes
  platform: LivePlatform;
  meetingLink?: string;
  meetingId?: string;
  passcode?: string;
  status: SessionStatus;
  recordingUrl?: string;
  instructorId: string;
  instructorName: string;
  instructorAvatar?: string;
  maxParticipants?: number;
  enrolledCount: number;
  attendeeCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SessionAttendee {
  id: string;
  sessionId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar?: string;
  status: AttendanceStatus;
  joinedAt?: string;
  leftAt?: string;
  duration?: number; // minutes attended
  notes?: string;
}

export interface SessionRecording {
  id: string;
  sessionId: string;
  url: string;
  duration: number;
  size: number; // in MB
  uploadedAt: string;
  expiresAt?: string;
}

// For calendar view
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: SessionStatus;
  courseId: string;
  courseName: string;
  platform: LivePlatform;
}

// Meeting link generation request
export interface GenerateMeetingLinkRequest {
  platform: LivePlatform;
  title: string;
  scheduledAt: string;
  duration: number;
  courseId: string;
}

export interface GenerateMeetingLinkResponse {
  meetingLink: string;
  meetingId?: string;
  passcode?: string;
}

// Bulk attendance update
export interface BulkAttendanceUpdate {
  sessionId: string;
  attendees: {
    studentId: string;
    status: AttendanceStatus;
    notes?: string;
  }[];
}
