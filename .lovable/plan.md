

# Instructor Dashboard - Complete Implementation Plan

## Overview

The Instructor Dashboard is a separate area (`/instructor`) where instructors manage their teaching activities across multiple schools. It mirrors the school owner dashboard pattern but is focused on the instructor's perspective: their assigned batches, upcoming sessions, student grading, earnings tracking, and job applications.

---

## What the Instructor Sees

An instructor can belong to multiple schools. When they log in, they land on an aggregated hub showing data from all schools, with the ability to drill into each school or batch individually.

### Dashboard Structure

```text
/instructor
  |-- (index) InstructorDashboard      -- Aggregated hub across all schools
  |-- /school/:schoolId                -- School-specific view
  |-- /batch/:batchId                  -- Batch detail (students, grading, sessions)
  |-- /grading                         -- All pending submissions to grade
  |-- /applications                    -- Job portal applications tracking
  |-- /profile                         -- Public tutor profile management
  |-- /earnings                        -- Earnings breakdown across schools
```

---

## Part 1: Instructor Layout and Navigation

### InstructorLayout (`src/components/instructor/InstructorLayout.tsx`)

A dedicated layout similar to `DashboardLayout.tsx` but with instructor-specific sidebar and branding.

- Sidebar branding: "Teach" with "Instructor Hub" subtitle
- School switcher in the header (reuses existing `SchoolSwitcher` component)
- Notification bell
- User menu with logout

### InstructorSidebar (`src/components/instructor/InstructorSidebar.tsx`)

Sidebar navigation items:

| Menu Item | Route | Icon |
|-----------|-------|------|
| Hub | /instructor | LayoutDashboard |
| My Batches | /instructor/batches | UsersRound |
| Grading | /instructor/grading | ClipboardCheck |
| Live Sessions | /instructor/sessions | Video |
| Earnings | /instructor/earnings | Wallet |
| Job Portal | /instructor/applications | Briefcase |
| My Profile | /instructor/profile | User |

---

## Part 2: Instructor Dashboard Hub (`/instructor`)

### Page: `src/pages/instructor/InstructorDashboard.tsx`

The main landing page showing an aggregated view across all schools.

**Stats Cards:**
- Total Schools (number of schools they teach at)
- Active Batches (across all schools)
- Total Students (across all batches)
- Pending Earnings (total unpaid amount)

**School Summary Cards:**
Each school the instructor belongs to gets a summary card showing:
- School name, logo
- Number of batches assigned
- Number of students
- Earnings this month / total
- Next upcoming session
- "View School" button to drill in

**Upcoming Sessions (next 5):**
- Session title, batch name, school name
- Date/time, platform
- "Join" button with SecureJoinButton component

**Recent Activity:**
- New enrollments in their batches
- Assignment submissions received
- Payments received
- Messages from students

Uses mock data consistent with the shared `MOCK_BATCHES` and `MOCK_COURSES` from `src/data/mock-data.ts`, extended with instructor-specific data.

---

## Part 3: Instructor Batch Management

### Page: `src/pages/instructor/InstructorBatchesPage.tsx` (`/instructor/batches`)

Lists all batches assigned to the instructor across all schools, with school filter.

- Batch cards showing: batch name, course name, school name, student count, status
- WhatsApp group card (visible because instructor is assigned)
- Filter by school, status
- Click navigates to batch detail

### Page: `src/pages/instructor/InstructorBatchDetailPage.tsx` (`/instructor/batch/:batchId`)

Instructor's view of a specific batch with tabs:

**Overview Tab:**
- Batch info (name, course, dates, status)
- Student count / enrollment progress
- WhatsApp group card
- Upcoming sessions for this batch

**Students Tab:**
- Student list with attendance rate, current grade, last submission status
- Click on student to see their progress detail

**Sessions Tab:**
- List of sessions for this batch
- "Start Session" button (generates secure link)
- "Schedule Session" button
- Attendance tracking for completed sessions (uses existing `AttendanceTracker` component)

**Grading Tab:**
- Pending submissions for this batch
- Grade submission interface (score + feedback)
- Previously graded submissions

**Leaderboard Tab:**
- Same leaderboard component from school owner view
- Read-only for instructors

---

## Part 4: Grading Hub

### Page: `src/pages/instructor/InstructorGradingPage.tsx` (`/instructor/grading`)

A centralized view of all pending assignments across all batches.

- Filter by school, batch, assignment
- Table: Student name, batch, assignment title, submitted date, status
- "Grade" button opens grading dialog
- Grading dialog: view submission, enter score (out of total), write feedback, save
- Stats: Total pending, graded this week, average grade given

---

## Part 5: Live Sessions (Instructor View)

### Page: `src/pages/instructor/InstructorSessionsPage.tsx` (`/instructor/sessions`)

All sessions the instructor is responsible for, across schools.

- Calendar view and list view toggle
- Filter by school, batch
- "Start Session" generates secure link (reuses `SecureJoinButton`)
- "Take Attendance" opens `AttendanceTracker` component after session
- Upcoming, live, completed tabs

---

## Part 6: Earnings Dashboard

### Page: `src/pages/instructor/InstructorEarningsPage.tsx` (`/instructor/earnings`)

Tracks earnings across all schools (display only -- school handles actual payments).

**Summary Cards:**
- Total Earnings (all time)
- This Month
- Pending Payments
- Schools Teaching At

**Earnings Chart:**
- Monthly earnings trend (last 6 months)
- Stacked by school (different colors)

**Breakdown Table:**
- School name, payment structure, amount, period, status (paid/pending)
- Uses `InstructorPayment` type from `src/types/instructor.ts`

---

## Part 7: Job Applications Tracker

### Page: `src/pages/instructor/InstructorApplicationsPage.tsx` (`/instructor/applications`)

Track all job applications the instructor has submitted.

- Application cards: job title, school name, applied date, status
- Status badges: pending, reviewed, shortlisted, interview, offered, rejected, accepted
- Filter by status
- Interview details (if scheduled)
- Uses `JobApplication` type from `src/types/job-portal.ts`

---

## Part 8: Tutor Profile

### Page: `src/pages/instructor/InstructorProfilePage.tsx` (`/instructor/profile`)

Manage the instructor's public profile for the job portal.

**Sections:**
- Personal info (name, email, phone, location, bio, avatar)
- Specializations (subjects they teach)
- Academic levels they cover
- Experience history (institution, role, subjects, dates)
- Education (degree, institution, year)
- Certifications
- Job preferences (job types, min salary, locations, remote preference)
- Profile visibility toggle (public/private, open to opportunities)

Uses `TutorProfile` type from `src/types/job-portal.ts`.

---

## Part 9: Mock Data for Instructor

### Update: `src/data/mock-data.ts`

Add instructor-specific mock data that stays consistent with existing courses/batches:

```text
MOCK_INSTRUCTOR_HUB_DATA:
  - Instructor: Dr. Sarah Johnson (inst-1)
  - Schools: Bright Stars Academy, Excel Learning Center
  - Assigned Batches: batch-1 (Math JSS1), batch-4 (Physics SSS2)
  - Earnings: This month N100,000, total N1,200,000
  - Pending: N25,000 from Bright Stars
  
MOCK_INSTRUCTOR_PAYMENTS:
  - Jan 2025: Bright Stars, batch-1, N25,000/batch, paid
  - Jan 2025: Excel Center, Physics SSS2, N30,000/batch, pending
  
MOCK_INSTRUCTOR_SUBMISSIONS:
  - 3 pending submissions from batch-1 students
  - 2 pending from batch-4 students
```

---

## Part 10: Auth Context Update

### Update: `src/contexts/AuthContext.tsx`

Update mock login to support instructor role with multi-school data:
- When logging in, set role to "instructor" 
- Include school associations with instructor role
- This enables the school switcher and instructor-specific routing

---

## Files Summary

### Files to Create (10 files)

| File | Purpose |
|------|---------|
| `src/components/instructor/InstructorLayout.tsx` | Layout wrapper with sidebar |
| `src/components/instructor/InstructorSidebar.tsx` | Instructor-specific navigation |
| `src/pages/instructor/InstructorDashboard.tsx` | Aggregated hub dashboard |
| `src/pages/instructor/InstructorBatchesPage.tsx` | All assigned batches |
| `src/pages/instructor/InstructorBatchDetailPage.tsx` | Single batch (students, grading, sessions) |
| `src/pages/instructor/InstructorGradingPage.tsx` | Centralized grading hub |
| `src/pages/instructor/InstructorSessionsPage.tsx` | Sessions across schools |
| `src/pages/instructor/InstructorEarningsPage.tsx` | Earnings tracking |
| `src/pages/instructor/InstructorApplicationsPage.tsx` | Job application tracker |
| `src/pages/instructor/InstructorProfilePage.tsx` | Tutor profile management |

### Files to Update (2 files)

| File | Changes |
|------|---------|
| `src/data/mock-data.ts` | Add instructor hub data, payments, submissions |
| `src/App.tsx` | Add `/instructor` routes with `InstructorLayout` |

---

## Implementation Order

1. Create `InstructorSidebar.tsx` -- navigation component
2. Create `InstructorLayout.tsx` -- layout with sidebar, header, school switcher
3. Update `mock-data.ts` -- add instructor-specific mock data
4. Create `InstructorDashboard.tsx` -- aggregated hub page
5. Create `InstructorBatchesPage.tsx` -- all assigned batches
6. Create `InstructorBatchDetailPage.tsx` -- batch detail with grading/sessions tabs
7. Create `InstructorGradingPage.tsx` -- centralized grading
8. Create `InstructorSessionsPage.tsx` -- sessions view with secure join
9. Create `InstructorEarningsPage.tsx` -- earnings tracking
10. Create `InstructorApplicationsPage.tsx` -- job applications
11. Create `InstructorProfilePage.tsx` -- tutor profile editor
12. Update `App.tsx` -- register all instructor routes

---

## How It Syncs with School Owner Dashboard

| Data Point | School Owner Sees | Instructor Sees |
|------------|-------------------|-----------------|
| Batches | All batches in their school | Only batches assigned to them |
| Students | All students across all batches | Only students in assigned batches |
| Sessions | All sessions across all batches | Only sessions they are hosting |
| Earnings | Total payroll to all instructors | Their own earnings from each school |
| Grades | Read batch leaderboard | Grade and review submissions |
| WhatsApp | All batch groups (can edit) | Assigned batch groups (view only) |
| Complaints | Receive and manage complaints | Can submit complaints |
| Certificates | Issue certificates | View certificates for their batches |

### Shared Components Reused
- `SecureJoinButton` -- same secure session join logic
- `AttendanceTracker` -- same attendance UI
- `WhatsAppGroupCard` -- same card, but without edit capability
- `SessionCard` -- same session display
- `SchoolSwitcher` -- same multi-school switcher in header

