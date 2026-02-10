

# Student & Parent Dashboard - Complete Implementation Plan

## Overview

Students and parents each get a dedicated dashboard under `/student` and `/parent` route prefixes. The Student Dashboard is where students see their enrolled batches, attend live sessions, view materials, submit assignments, and track progress. The Parent Dashboard gives parents visibility into their children's activities -- attendance, grades, payments, and upcoming sessions.

Both dashboards follow the same layout pattern as the School Owner (`/dashboard`) and Instructor (`/instructor`) dashboards: a sidebar layout using `SidebarProvider`, header with user menu, and `Outlet` for page content.

---

## How Students & Parents Relate to Existing Data

```text
Student (enrolled via EnrollmentPage)
  |
  +-- Batch 1 (Mathematics JSS1 - Jan 2025)
  |     +-- Materials (PDFs, links from Course)
  |     +-- Live Sessions (join via SecureJoinButton)
  |     +-- Assignments (view, submit)
  |     +-- Leaderboard (see rank)
  |     +-- WhatsApp Group (join link)
  |     +-- Certificate (on completion)
  |
  +-- Batch 2 (English Primary 5 - Feb 2025)
        +-- ...

Parent
  |
  +-- Child 1 (Chidera Okonkwo)
  |     +-- Batch enrollments (read-only view)
  |     +-- Attendance reports
  |     +-- Grade/leaderboard position
  |     +-- Payment receipts
  |
  +-- Child 2 (optional, for multi-child parents)
```

---

## Part 1: Student Dashboard

### StudentLayout (`src/components/student/StudentLayout.tsx`)

Same pattern as `InstructorLayout.tsx`:
- Sidebar branding: "Teach" with "Student Portal" subtitle
- Header with notification bell and user menu
- No school switcher needed (students belong to one school per enrollment)

### StudentSidebar (`src/components/student/StudentSidebar.tsx`)

| Menu Item | Route | Icon |
|-----------|-------|------|
| Dashboard | /student | LayoutDashboard |
| My Batches | /student/batches | UsersRound |
| Live Sessions | /student/sessions | Video |
| Assignments | /student/assignments | FileText |
| Certificates | /student/certificates | Award |
| Complaints | /student/complaints | MessageSquareWarning |

### StudentDashboard (`src/pages/student/StudentDashboard.tsx`)

Landing page with:
- **Stats Cards:** Active Batches, Upcoming Sessions, Pending Assignments, Overall Rank
- **Next Live Session card** with join button (reuses `SecureJoinButton`)
- **Active Batches summary** -- batch name, course, progress (sessions completed / total), instructor name
- **Recent Assignments** -- latest 3 pending or graded assignments
- **Leaderboard snippet** -- student's rank across their batches

### StudentBatchesPage (`src/pages/student/StudentBatchesPage.tsx`)

List all enrolled batches:
- Batch card: course name, batch name, instructor, dates, status, sessions progress
- Click navigates to batch detail
- Filter by status (active, completed)

### StudentBatchDetailPage (`src/pages/student/StudentBatchDetailPage.tsx`)

Single batch view with tabs:
- **Overview:** Batch info, progress bar, WhatsApp group link, next session
- **Materials:** Course materials list (PDFs, links, videos) -- download/open
- **Sessions:** All sessions with status, "Join" button for upcoming, attendance record for past
- **Assignments:** List of assignments with due date, submission status, grade if graded; submit button opens upload dialog
- **Leaderboard:** Full batch leaderboard with student highlighted

### StudentSessionsPage (`src/pages/student/StudentSessionsPage.tsx`)

Aggregated view of all sessions across batches:
- Upcoming, completed tabs
- Join button for upcoming sessions (SecureJoinButton)
- Attendance history

### StudentAssignmentsPage (`src/pages/student/StudentAssignmentsPage.tsx`)

All assignments across batches:
- Filter by batch, status (pending, submitted, graded, late)
- Table: assignment title, batch, due date, status, grade
- Submit button opens submission dialog (text + file upload placeholder)

### StudentCertificatesPage (`src/pages/student/StudentCertificatesPage.tsx`)

List of earned certificates:
- Certificate cards: course name, batch, grade, issue date, verification code
- Download button
- Empty state for students with no completed batches

### StudentComplaintsPage (`src/pages/student/StudentComplaintsPage.tsx`)

Submit and track complaints:
- "New Complaint" button with form (category, subject, description)
- List of submitted complaints with status
- View responses from school owner

---

## Part 2: Parent Dashboard

### ParentLayout (`src/components/parent/ParentLayout.tsx`)

Same sidebar layout pattern. If a parent has multiple children, a child switcher appears in the header.

### ParentSidebar (`src/components/parent/ParentSidebar.tsx`)

| Menu Item | Route | Icon |
|-----------|-------|------|
| Dashboard | /parent | LayoutDashboard |
| My Children | /parent/children | Users |
| Attendance | /parent/attendance | CalendarCheck |
| Grades | /parent/grades | BarChart3 |
| Payments | /parent/payments | Wallet |
| Complaints | /parent/complaints | MessageSquareWarning |

### ParentDashboard (`src/pages/parent/ParentDashboard.tsx`)

Overview across all children:
- **Child cards:** name, current batches, attendance rate, latest grade
- **Upcoming Sessions** for all children
- **Payment Summary:** total paid, pending
- **Quick Actions:** View grades, pay fees, submit complaint

### ParentChildrenPage (`src/pages/parent/ParentChildrenPage.tsx`)

List of enrolled children:
- Each child shows: name, enrolled batches, overall attendance, latest leaderboard rank
- Click to see child detail (same as student batch view but read-only)

### ParentAttendancePage (`src/pages/parent/ParentAttendancePage.tsx`)

Attendance records per child:
- Child filter/switcher
- Calendar heatmap or list showing present/absent/late per session
- Overall attendance percentage

### ParentGradesPage (`src/pages/parent/ParentGradesPage.tsx`)

Grade overview:
- Child filter
- Assignments with grades, batch leaderboard position
- Performance trend (if multiple graded assignments)

### ParentPaymentsPage (`src/pages/parent/ParentPaymentsPage.tsx`)

Payment history:
- All enrollment payments: child name, course, batch, amount, date, status
- Receipt download
- Pending payments highlighted

### ParentComplaintsPage (`src/pages/parent/ParentComplaintsPage.tsx`)

Same as student complaints but submitted as parent type:
- Submit complaint about any child's course/instructor
- Track status and responses

---

## Part 3: Mock Data Additions

### `src/data/mock-data.ts` updates

Add student-perspective and parent-perspective mock data consistent with existing entities:

**Student mock data (for student s-1: Chidera Okonkwo):**
- Enrolled in batch-1 (Math JSS1 Jan 2025)
- 3 assignments: 1 graded (85/100), 1 submitted, 1 pending
- Attendance: 8/10 sessions present
- Leaderboard rank: 4th out of 25
- Parent: Mrs. Ngozi Okonkwo

**Parent mock data (Mrs. Ngozi Okonkwo):**
- Children: Chidera Okonkwo (batch-1), David Obi (batch-1)
- Payment history: 2 payments completed (N15,000 each)
- Can view attendance and grades for both children

---

## Part 4: Auth & Route Updates

### AuthContext updates

Add support for student and parent roles in mock login:
- Student login returns role "student" with enrolled batches
- Parent login returns role "parent" with children data

### App.tsx route additions

```text
/student          -- StudentLayout
  /               -- StudentDashboard
  /batches        -- StudentBatchesPage
  /batch/:batchId -- StudentBatchDetailPage
  /sessions       -- StudentSessionsPage
  /assignments    -- StudentAssignmentsPage
  /certificates   -- StudentCertificatesPage
  /complaints     -- StudentComplaintsPage

/parent           -- ParentLayout
  /               -- ParentDashboard
  /children       -- ParentChildrenPage
  /attendance     -- ParentAttendancePage
  /grades         -- ParentGradesPage
  /payments       -- ParentPaymentsPage
  /complaints     -- ParentComplaintsPage
```

### Existing pages to update/remove

- `MyCoursesPage.tsx` and `CourseLearningPage.tsx` -- these old standalone pages will be replaced by the new Student Dashboard routes. The CourseLearningPage content is absorbed into `StudentBatchDetailPage`.
- Update the old `/my-courses` and `/learn/:courseId/lesson/:lessonId` routes to redirect to `/student/batches`.

---

## Part 5: Files Summary

### Files to Create (16 files)

| File | Purpose |
|------|---------|
| `src/components/student/StudentLayout.tsx` | Student layout with sidebar |
| `src/components/student/StudentSidebar.tsx` | Student navigation |
| `src/pages/student/StudentDashboard.tsx` | Student hub dashboard |
| `src/pages/student/StudentBatchesPage.tsx` | Enrolled batches list |
| `src/pages/student/StudentBatchDetailPage.tsx` | Batch detail with materials, sessions, assignments, leaderboard |
| `src/pages/student/StudentSessionsPage.tsx` | All sessions across batches |
| `src/pages/student/StudentAssignmentsPage.tsx` | Assignment management |
| `src/pages/student/StudentCertificatesPage.tsx` | Earned certificates |
| `src/pages/student/StudentComplaintsPage.tsx` | Submit/track complaints |
| `src/components/parent/ParentLayout.tsx` | Parent layout with sidebar |
| `src/components/parent/ParentSidebar.tsx` | Parent navigation |
| `src/pages/parent/ParentDashboard.tsx` | Parent overview |
| `src/pages/parent/ParentChildrenPage.tsx` | Children list and detail |
| `src/pages/parent/ParentAttendancePage.tsx` | Attendance tracking |
| `src/pages/parent/ParentGradesPage.tsx` | Grades overview |
| `src/pages/parent/ParentPaymentsPage.tsx` | Payment history |
| `src/pages/parent/ParentComplaintsPage.tsx` | Parent complaints |

### Files to Update (3 files)

| File | Changes |
|------|---------|
| `src/data/mock-data.ts` | Add student assignments, attendance, parent/child mock data |
| `src/contexts/AuthContext.tsx` | Add student/parent mock login support |
| `src/App.tsx` | Add `/student` and `/parent` route groups, redirect old learn routes |

---

## Implementation Order

1. Create `StudentSidebar.tsx` and `StudentLayout.tsx`
2. Create `ParentSidebar.tsx` and `ParentLayout.tsx`
3. Update `mock-data.ts` with student/parent mock data (assignments, attendance, payments)
4. Create `StudentDashboard.tsx`
5. Create `StudentBatchesPage.tsx`
6. Create `StudentBatchDetailPage.tsx` (materials, sessions, assignments, leaderboard tabs)
7. Create `StudentSessionsPage.tsx`
8. Create `StudentAssignmentsPage.tsx`
9. Create `StudentCertificatesPage.tsx`
10. Create `StudentComplaintsPage.tsx`
11. Create `ParentDashboard.tsx`
12. Create `ParentChildrenPage.tsx`
13. Create `ParentAttendancePage.tsx`
14. Create `ParentGradesPage.tsx`
15. Create `ParentPaymentsPage.tsx`
16. Create `ParentComplaintsPage.tsx`
17. Update `AuthContext.tsx` -- add student/parent login support
18. Update `App.tsx` -- add all new routes, redirect old learn routes

---

## Cross-Dashboard Data Sync

| Data Point | School Owner | Instructor | Student | Parent |
|------------|-------------|------------|---------|--------|
| Batches | All (create/edit) | Assigned only | Enrolled only | Child's batches (read-only) |
| Sessions | All (schedule) | Host + attendance | Join + view | View child's attendance |
| Assignments | View all grades | Create + grade | Submit + view grade | View child's grades |
| Certificates | Issue | View batch certs | Download own | View child's certs |
| Complaints | Receive + respond | Submit | Submit | Submit |
| Payments | Track revenue | Track earnings | View receipts | View receipts + pay |
| WhatsApp | Manage groups | View assigned | Join link | Not visible |
| Leaderboard | View all | View batch | See own rank | See child's rank |

### Shared Components Reused
- `SecureJoinButton` -- student joins sessions
- `WhatsAppGroupCard` -- student sees join link (read-only)
- `Badge`, `Card`, `Table`, `Tabs` -- consistent UI across all dashboards
- Complaint types from `src/types/complaint.ts` -- shared across student, parent, and school owner

