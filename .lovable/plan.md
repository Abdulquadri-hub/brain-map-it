

# Complete School Owner Dashboard - Fix, Connect & Extend

## Overview

This plan addresses three main areas: (1) fixing all data inconsistencies and broken page content, (2) adding missing pages (Complaints, Certificates, Financials, Marketplace Verification), and (3) connecting the Course-Batch-Session-Student flow to eliminate redundancy.

---

## Part 1: Fix Type Conflicts & Data Inconsistencies

### A. Fix LivePlatform Type Mismatch

**Problem:** Two different `LivePlatform` types exist -- `course.ts` says `google_meet | zoom | teams`, while `live-session.ts` says `jitsi | zoom | custom`.

**Fix:**
- Update `src/types/course.ts` line 15 to `"jitsi" | "zoom" | "custom"`
- Update `src/pages/dashboard/CourseBuilderPage.tsx` lines 103-107 to show Jitsi, Zoom, Custom options
- Update default values in `course.ts` from `google_meet` to `jitsi`

### B. Fix CoursesPage to Use V3 Data

**Problem:** CoursesPage defines its own simple `Course` interface that is completely different from the V3 `Course` type. It shows "progress bars" and "duration in weeks" instead of batch counts, prices, academic levels, and live session schedules.

**Fix:** Rewrite `CoursesPage` to:
- Import and use the V3 `Course` type from `src/types/course.ts`
- Show: title, academic level, price (in Naira), active batches count, total enrollments, live session day/time
- Course cards link to Course Builder for editing
- "Add Course" button links to `/dashboard/courses/new`
- Remove the old progress bar concept (no self-paced progress in V3)

### C. Fix StudentsPage to Use V3 Data

**Problem:** Students are shown with generic "Grade 7-12" and no batch association.

**Fix:** Rewrite `StudentsPage` to:
- Show students with their enrolled batch name, course, payment status
- Use V3 academic levels (Primary 1-6, JSS 1-3, SSS 1-3, Adult)
- Add parent name/contact column for minor students
- Add batch filter dropdown
- Remove "Add Student" button (students come through enrollment)

### D. Fix DashboardHome to Use V3 Data

**Problem:** Dashboard shows generic stats ("Total Students: 1,234", "Completion Rate: 87%") that don't reflect the batch/cohort model.

**Fix:** Rewrite `DashboardHome` to show:
- Stats: Active Batches, Total Enrolled Students, Pending Enrollments, Monthly Revenue
- Quick Actions: Create Course, Create Batch, View Enrollments, Schedule Session
- Recent Activity: New enrollments, batch completions, payments received
- Upcoming Sessions: Next 3 live sessions across all batches
- Remove generic "Staff Meeting" and "Parent-Teacher Conference" events

### E. Fix ReportsPage to Use V3 Data

**Problem:** Reports show generic enrollment trends and "grade distributions" not matching V3.

**Fix:** Update `ReportsPage` to show:
- Revenue trend chart (monthly income in Naira)
- Batch completion rates (per batch, not per course)
- Enrollment trend by month
- Top performing batches (by attendance and grade)
- Instructor payment summary

### F. Fix Sidebar Branding & Missing Links

**Problem:** Sidebar says "EduConnect" and is missing Enrollments link.

**Fix:**
- Change "EduConnect" to "Teach" and "School Portal" to "School Dashboard"
- Add Enrollments, Financials, and Complaints to sidebar navigation
- Reorder: Dashboard, Courses, Batches, Students, Instructors, Live Sessions, Enrollments, Complaints, Certificates, Reports, Financials

---

## Part 2: New Pages

### A. Complaints Page (`/dashboard/complaints`)

A page for school owners to view and manage complaints from students, parents, and instructors.

**Features:**
- Table listing all complaints with status (open, in-progress, resolved)
- Filter by type (student, parent, instructor), status, and date
- View complaint details in a dialog
- Respond to complaints with notes
- Status management (open -> in-progress -> resolved)
- Stats: Open complaints count, average resolution time

**New files:**
- `src/pages/dashboard/ComplaintsPage.tsx`
- `src/types/complaint.ts` (complaint types)

### B. Certificate Management Page (`/dashboard/certificates`)

A page for school owners to manage and issue certificates for completed batches.

**Features:**
- List all issued certificates with batch/student info
- Generate certificates for completed batches (bulk action)
- Certificate preview with school name, student name, course, batch, grade, date
- Download individual certificates
- Verification code display
- Stats: Total issued, pending generation

**New files:**
- `src/pages/dashboard/CertificatesPage.tsx`

### C. Financial Dashboard Page (`/dashboard/financials`)

A dedicated page for revenue tracking and instructor payment management.

**Features:**
- Revenue summary cards: Total Revenue, This Month, Outstanding Payments, Platform Fees
- Revenue chart by month
- Payment breakdown by course/batch
- Instructor payment tracking table (amount owed, paid, pending)
- Enrollment payments list with status

**New files:**
- `src/pages/dashboard/FinancialDashboardPage.tsx`

---

## Part 3: Marketplace School Verification

### How It Works

Schools need to be verified before appearing on the public marketplace. This gives the marketplace credibility and protects students.

**Verification Flow:**
1. School owner goes to Settings and clicks "List on Marketplace"
2. They fill in required info: school description, logo, category, location, proof documents
3. Submission creates a "pending verification" status
4. (In production, platform admin reviews and approves)
5. Once verified, school appears in the marketplace with a "Verified" badge

**Changes:**
- Add "Marketplace Listing" tab to `SettingsPage.tsx`
- Add `verificationStatus` field to School type: `"not_listed" | "pending" | "verified" | "rejected"`
- Update `Marketplace.tsx` to show a "Verified" badge on listed schools
- Add mock verification data

---

## Part 4: Course-Batch-Student Integration

### How Everything Connects (Avoiding Redundancy)

```text
Course (template)
  |
  +-- Batch 1 (Jan 2025)
  |     +-- Students (enrolled via enrollment request)
  |     +-- Live Sessions (scheduled per batch)
  |     +-- WhatsApp Group
  |     +-- Assignments
  |     +-- Leaderboard
  |     +-- Certificates (on completion)
  |
  +-- Batch 2 (Apr 2025)
        +-- Students
        +-- Live Sessions
        +-- ...
```

**Key Principle:** A Course is a template. A Batch is an instance of that course with actual students. Sessions, assignments, grades, and certificates all belong to a batch, not directly to a course.

### Integration Points

| From | To | How |
|------|----|-----|
| CoursesPage | BatchesPage | Course card shows "X active batches" with link to filtered batches |
| CoursesPage | CourseBuilder | "Edit" links to `/dashboard/courses/:id/edit` |
| BatchesPage | BatchDetail | Card clicks navigate to `/dashboard/batches/:id` |
| BatchDetail | LiveSessions | Sessions tab shows batch-specific sessions |
| BatchDetail | Students | Students tab shows batch enrollments |
| EnrollmentsPage | Batches | Approved enrollment assigns student to a batch |
| DashboardHome | All pages | Stats cards link to respective pages |
| LiveSessionsPage | Batches | Sessions listed by batch, not just by course |

### Mock Data Consistency

All pages will share the same mock course names, instructor names, and batch names so navigating between pages shows consistent information:

**Shared Mock Courses:**
- Mathematics for JSS1 (Dr. Sarah Johnson)
- English Language - Primary 5 (Mrs. Adaeze Okonkwo)
- Physics for SSS2 (Dr. Sarah Johnson)
- Web Development Bootcamp (Emmanuel Tech)

**Shared Mock Batches:**
- January 2025 Batch (Mathematics for JSS1, 25/30 students, active)
- February 2025 Batch (English Language, 18/25 students, open)
- March 2025 Cohort (Web Dev, 20/20 students, closed)
- December 2024 Batch (Physics, 28/30 students, completed)

---

## Part 5: Files Summary

### Files to Update (10 files)

| File | Changes |
|------|---------|
| `src/types/course.ts` | Fix LivePlatform to `jitsi, zoom, custom` |
| `src/pages/dashboard/CourseBuilderPage.tsx` | Update platform dropdown options |
| `src/pages/dashboard/CoursesPage.tsx` | Full rewrite with V3 Course type, batch counts, prices |
| `src/pages/dashboard/StudentsPage.tsx` | V3 academic levels, batch association, parent info |
| `src/pages/dashboard/DashboardHome.tsx` | V3 stats, batch-aware activities and upcoming sessions |
| `src/pages/dashboard/ReportsPage.tsx` | Batch-based analytics and revenue reports |
| `src/pages/dashboard/SettingsPage.tsx` | Add Marketplace Listing tab with verification |
| `src/components/dashboard/DashboardSidebar.tsx` | Fix branding, add missing menu items |
| `src/App.tsx` | Add routes for new pages |
| `src/pages/Marketplace.tsx` | Add "Verified" badge for verified schools |

### Files to Create (4 files)

| File | Purpose |
|------|---------|
| `src/types/complaint.ts` | Complaint type definitions |
| `src/pages/dashboard/ComplaintsPage.tsx` | Complaints management page |
| `src/pages/dashboard/CertificatesPage.tsx` | Certificate management page |
| `src/pages/dashboard/FinancialDashboardPage.tsx` | Revenue and payment tracking |

---

## Implementation Order

1. Fix `src/types/course.ts` - Align LivePlatform type
2. Fix `CourseBuilderPage.tsx` - Update platform options
3. Fix `DashboardSidebar.tsx` - Branding + add all menu items
4. Rewrite `DashboardHome.tsx` - V3 batch-aware stats
5. Rewrite `CoursesPage.tsx` - V3 Course type with batch links
6. Rewrite `StudentsPage.tsx` - V3 batch-based student view
7. Update `ReportsPage.tsx` - Batch-based analytics
8. Create `src/types/complaint.ts` - Complaint types
9. Create `ComplaintsPage.tsx` - Complaints management
10. Create `CertificatesPage.tsx` - Certificate management
11. Create `FinancialDashboardPage.tsx` - Revenue dashboard
12. Update `SettingsPage.tsx` - Add Marketplace Listing tab
13. Update `Marketplace.tsx` - Add Verified badge
14. Update `App.tsx` - Add all new routes

