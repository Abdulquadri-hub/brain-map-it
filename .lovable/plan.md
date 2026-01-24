
# Teach LMS V3 Migration Plan
## From Hybrid Learning Types to Batch/Cohort Live Classes System

---

## Executive Summary

The V3 architecture document represents a **significant simplification** of the current system. The key paradigm shift is:

**Current System (V2):** Courses can be Self-Paced, Live Classes, or Hybrid (student chooses)
**New System (V3):** All courses are **Live Classes only**, organized by **Batches/Cohorts**

This is a smarter approach for the Nigerian market because:
- Live classes match Nigerian learning culture (interactive, teacher-led)
- Batches create urgency ("Only 5 spots left!")
- Cohorts build community and reduce dropout
- Simpler system = fewer bugs, easier maintenance

---

## What We Need to REMOVE

### Files to Delete Entirely

| File | Reason |
|------|--------|
| `src/components/courses/LearningTypeSelector.tsx` | No more self-paced/hybrid options |
| `src/components/enrollment/LearningTypeChoice.tsx` | Students don't choose learning type |
| `src/components/courses/LiveSessionPlanner.tsx` | Replaced by simpler batch schedule config |

### Code to Remove from Files

| File | What to Remove |
|------|----------------|
| `src/types/course.ts` | Remove `LearningType`, `CoursePricing`, `allowsStudentChoice`, `liveSession.schedule[]` array - courses have ONE schedule |
| `src/pages/dashboard/CourseBuilderPage.tsx` | Remove LearningTypeSelector, remove learning type tab, simplify to single schedule |
| `src/pages/enrollment/EnrollmentPage.tsx` | Remove learning type choice step (step 4) |
| `src/components/enrollment/PaymentStep.tsx` | Remove learning type price logic |
| `src/components/enrollment/CourseSelectionStep.tsx` | Remove learning type badges |
| `src/pages/school/CourseDetailPage.tsx` | Remove hybrid pricing display |

### Features to Remove

1. **Self-Paced Learning** - V3 is live-classes only
2. **Hybrid Course Option** - No student choice of learning type
3. **Multiple Subscription Tiers** - V3 uses single ₦20,000/month plan
4. **Complex Pricing (Self-Paced vs Live)** - One price per course
5. **Module/Lesson Curriculum Structure** - Replaced with simpler course materials (PDFs, links)

---

## What We Need to UPDATE

### 1. Type Definitions (`src/types/course.ts`)

**Before:**
```
learningType: "self_paced" | "live_classes" | "hybrid"
pricing: { selfPacedPrice, liveClassPrice }
liveSession: { schedule: LiveSessionSchedule[] }
```

**After:**
```
price: number  // Single price
durationWeeks: number
liveSessionDay: string  // "friday"
liveSessionTime: string // "16:00"
liveSessionDuration: number // 90 minutes
liveSessionPlatform: "google_meet" | "zoom" | "teams"
```

### 2. School Onboarding (`src/pages/SchoolOnboarding.tsx`)

**Update Steps:**
- Step 1: School Profile (keep, add timezone, brand colors)
- Step 2: ~~Select Plan~~ → **Academic Structure** (grade levels offered)
- Step 3: Payment Setup → **Paystack Connection** (to receive payments)
- Step 4: Review (keep)
- Step 5: Processing (keep)

**Key Change:** Remove subscription plan selection - single ₦20,000/month tier

### 3. Course Builder (`src/pages/dashboard/CourseBuilderPage.tsx`)

**Simplify to:**
- Basic Info (title, description, academic level, price, duration weeks)
- Live Session Config (day, time, duration, platform)
- Course Materials (PDFs, links - NOT modules/lessons)
- WhatsApp Group Link field

**Remove:**
- Learning Type selection
- Module/Lesson builder
- Self-paced content tabs

### 4. Enrollment Flow (`src/pages/enrollment/EnrollmentPage.tsx`)

**New Flow:**
1. Account Type (parent/child or adult) - KEEP
2. Registration (parent info, child info or adult info) - KEEP
3. **Batch Selection** - NEW (select which batch to join)
4. Payment (single price) - SIMPLIFY
5. Success - KEEP

### 5. Instructor System (`src/pages/dashboard/InstructorsPage.tsx`)

**Keep but Update:**
- Change payment structures: `per_batch`, `per_student`, `monthly`, `custom`
- Remove `revenue_share` and `base_commission` (platform doesn't handle instructor payments)
- Add: "Note: Payments handled directly by school owner"
- Add: Assign instructors to specific batches

### 6. Live Sessions Page (`src/pages/dashboard/LiveSessionsPage.tsx`)

**Keep but Update:**
- Sessions are now per-batch, not per-course
- Add batch context to all sessions
- Simplify - school owner creates Google Meet links manually

---

## What We Need to ADD

### New Types (`src/types/batch.ts`)

```typescript
interface Batch {
  id: string;
  courseId: string;
  name: string; // "January 2025 Batch"
  startDate: string;
  endDate: string;
  maxStudents: number;
  currentEnrollment: number;
  status: "open" | "closed" | "active" | "completed";
}

interface BatchEnrollment {
  id: string;
  studentId: string;
  batchId: string;
  courseId: string;
  paidAmount: number;
  paymentStatus: "pending" | "completed";
  enrollmentStatus: "active" | "completed" | "dropped";
}

interface BatchLeaderboard {
  batchId: string;
  studentId: string;
  overallScore: number;
  assignmentAvg: number;
  quizAvg: number;
  attendanceRate: number;
  rank: number;
}
```

### New Pages

| Page | Purpose |
|------|---------|
| `src/pages/dashboard/BatchesPage.tsx` | Manage batches for all courses |
| `src/pages/dashboard/BatchDetailPage.tsx` | View single batch (students, attendance, leaderboard) |
| `src/pages/parent/ParentDashboard.tsx` | Parent monitoring child progress |
| `src/pages/parent/ChildProgressPage.tsx` | Detailed child progress view |
| `src/pages/instructor/InstructorDashboard.tsx` | Instructor's view (per school context) |
| `src/pages/student/StudentDashboard.tsx` | Student's enrolled batches, next class, assignments |
| `src/pages/student/BatchCoursePage.tsx` | Student view of batch (materials, sessions, leaderboard) |

### New Components

| Component | Purpose |
|-----------|---------|
| `src/components/batches/BatchCard.tsx` | Display batch info (enrollment status, dates) |
| `src/components/batches/BatchSelector.tsx` | For enrollment - choose which batch to join |
| `src/components/batches/BatchLeaderboard.tsx` | Ranked list of students in batch |
| `src/components/batches/CreateBatchDialog.tsx` | Create new batch for a course |
| `src/components/assignments/AssignmentCard.tsx` | Display assignment with due date |
| `src/components/assignments/AssignmentSubmission.tsx` | Student submits work |
| `src/components/assignments/GradingView.tsx` | Instructor grades submissions |
| `src/components/certificates/CertificatePreview.tsx` | Show generated certificate |
| `src/components/parent/ChildCard.tsx` | Summary of child's progress |
| `src/components/parent/AttendanceReport.tsx` | Child's attendance history |

### New Features

1. **Batch Management**
   - Create batches with start/end dates, max students
   - Open/close enrollment per batch
   - Track enrollment count
   - Mark batch as complete
   - Generate certificates for completed batches

2. **Batch Leaderboard**
   - Rank students by: assignments (40%), quizzes (30%), attendance (20%), participation (10%)
   - Show rank changes ("up from #10 to #7")
   - Instructor view shows students needing attention

3. **Assignment System**
   - Create assignments per batch
   - Students upload submissions (PDF, images)
   - Instructor grades with feedback
   - Track submission rates

4. **Certificate Generation**
   - Auto-generate for students completing batch with 60%+
   - Include: name, course, batch, grade, rank, unique ID
   - Verification URL

5. **Parent Dashboard**
   - View child's grades, attendance, assignments
   - See batch leaderboard position
   - Receive weekly progress emails
   - Message instructor

6. **Instructor Payment Tracking**
   - Track payment agreements (per batch, per student, monthly)
   - Mark payments as completed (for record keeping)
   - Note: Platform doesn't process instructor payments

---

## Implementation Phases

### Phase 1: Foundation Cleanup (Week 1)
**Remove old, establish new types**

Tasks:
1. Delete `LearningTypeSelector.tsx`, `LearningTypeChoice.tsx`, `LiveSessionPlanner.tsx`
2. Create `src/types/batch.ts` with Batch, BatchEnrollment, BatchLeaderboard types
3. Update `src/types/course.ts` - simplify to single price, single schedule
4. Update `src/types/instructor.ts` - payment types to per_batch, per_student, monthly, custom

### Phase 2: Batch System (Week 1-2)
**Core batch management**

Tasks:
1. Create `BatchCard.tsx`, `CreateBatchDialog.tsx`, `BatchSelector.tsx`
2. Create `BatchesPage.tsx` - list all batches across courses
3. Create `BatchDetailPage.tsx` - single batch view
4. Update `CoursesPage.tsx` - show batch count per course
5. Update routing in `App.tsx`

### Phase 3: Course Builder Simplification (Week 2)
**Simplify course creation**

Tasks:
1. Rebuild `CourseBuilderPage.tsx`:
   - Basic info tab (title, description, level, price, weeks)
   - Schedule tab (day, time, duration, platform)
   - Materials tab (upload PDFs, add links)
   - WhatsApp field
2. Remove module/lesson complexity
3. Add "Create First Batch" prompt after course creation

### Phase 4: Enrollment with Batch Selection (Week 2-3)
**Update enrollment flow**

Tasks:
1. Update `EnrollmentPage.tsx` - add batch selection step
2. Create `BatchSelector.tsx` for enrollment - shows available batches with spots
3. Update `PaymentStep.tsx` - single price, show batch info
4. Update `EnrollmentSuccessStep.tsx` - show batch start date, WhatsApp link
5. Remove learning type choice logic

### Phase 5: School Onboarding Update (Week 3)
**Simplify to single plan**

Tasks:
1. Update `SubscriptionPlanStep.tsx` - single ₦20,000/month plan (no selection needed)
2. Add `AcademicStructureStep.tsx` - select grade levels offered
3. Update payment step - Paystack connection for receiving payments
4. Update review step to match new flow

### Phase 6: Student Dashboard (Week 3-4)
**Student learning experience**

Tasks:
1. Create `StudentDashboard.tsx` - enrolled batches, next class, pending assignments
2. Create `BatchCoursePage.tsx` - student view of batch (materials, schedule, leaderboard)
3. Create `AssignmentCard.tsx`, `AssignmentSubmission.tsx`
4. Add countdown to next class, "Join Class" button
5. Remove module/lesson progress tracking

### Phase 7: Assignment & Grading System (Week 4)
**Instructor grading flow**

Tasks:
1. Create `AssignmentForm.tsx` - instructor creates assignment
2. Create `AssignmentSubmission.tsx` - student uploads work
3. Create `GradingView.tsx` - instructor grades with feedback
4. Create `SubmissionsPage.tsx` - list all pending submissions
5. Add grading to instructor dashboard

### Phase 8: Batch Leaderboard (Week 4-5)
**Gamification**

Tasks:
1. Create `BatchLeaderboard.tsx` - ranked student list
2. Add leaderboard to `BatchCoursePage.tsx` (student view)
3. Add leaderboard analytics to `BatchDetailPage.tsx` (instructor/owner view)
4. Show rank changes and improvement indicators

### Phase 9: Parent Dashboard (Week 5)
**Parent oversight**

Tasks:
1. Create `ParentDashboard.tsx` - overview of all children
2. Create `ChildProgressPage.tsx` - detailed child view
3. Create `AttendanceReport.tsx` - attendance history
4. Add parent login flow
5. Add parent routes to `App.tsx`

### Phase 10: Certificates & Completion (Week 5-6)
**Batch completion flow**

Tasks:
1. Create `CertificatePreview.tsx` - certificate template
2. Add "Generate Certificates" to `BatchDetailPage.tsx`
3. Create certificate download for students
4. Add verification URL support
5. Update batch status to "completed"

### Phase 11: Instructor Multi-School Experience (Week 6)
**Cross-tenant instructor support**

Tasks:
1. Update `SchoolSelectorPage.tsx` - show instructor's schools with stats
2. Add "Switch School" to instructor dashboard
3. Create `InstructorDashboard.tsx` - batch-focused view
4. Add payment tracking across schools (display only)

### Phase 12: Financial Dashboard (Week 6-7)
**School owner revenue tracking**

Tasks:
1. Create `FinancialDashboardPage.tsx` - gross revenue, platform fees (10%), net
2. Show revenue by course and batch
3. Instructor payment tracking (mark as paid)
4. Export reports

---

## Routes Update (`src/App.tsx`)

```typescript
// Remove
// /learn/:courseId/lesson/:lessonId - No more lessons

// Update  
// /my-courses → /student/dashboard

// Add
/dashboard/batches
/dashboard/batches/:batchId
/dashboard/batches/:batchId/assignments
/dashboard/courses/:courseId/batches/new
/student/dashboard
/student/batch/:batchId
/student/batch/:batchId/assignment/:assignmentId
/parent/dashboard
/parent/child/:childId
/instructor/dashboard
```

---

## Summary

This migration simplifies the platform significantly while adding powerful batch-based features. The key insight is that **Nigerian tutors prefer live, interactive teaching** over self-paced content, so we're leaning into that strength.

**Total Estimated Timeline: 6-7 weeks**

**Files to Delete: 3**
**Files to Create: ~25**
**Files to Update: ~15**
