// Course & Content Management Types
// Laravel Inertia.js Integration:
// These types should match your Laravel backend models

export type LessonType = "video" | "document" | "quiz" | "assignment";
export type CourseStatus = "draft" | "active" | "archived";
export type ContentStatus = "draft" | "published";

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

export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  instructor: CourseInstructor;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
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
}
