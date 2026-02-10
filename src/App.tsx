import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TenantProvider } from "@/contexts/TenantContext";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import SchoolOnboarding from "./pages/SchoolOnboarding";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import StudentsPage from "./pages/dashboard/StudentsPage";
import CoursesPage from "./pages/dashboard/CoursesPage";
import CourseBuilderPage from "./pages/dashboard/CourseBuilderPage";
import InstructorsPage from "./pages/dashboard/InstructorsPage";
import LiveSessionsPage from "./pages/dashboard/LiveSessionsPage";
import BatchesPage from "./pages/dashboard/BatchesPage";
import BatchDetailPage from "./pages/dashboard/BatchDetailPage";
import ReportsPage from "./pages/dashboard/ReportsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import ComplaintsPage from "./pages/dashboard/ComplaintsPage";
import CertificatesPage from "./pages/dashboard/CertificatesPage";
import FinancialDashboardPage from "./pages/dashboard/FinancialDashboardPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import SchoolSelectorPage from "./pages/auth/SchoolSelectorPage";
import SchoolPublicPage from "./pages/school/SchoolPublicPage";
import CourseDetailPage from "./pages/school/CourseDetailPage";
import EnrollmentPage from "./pages/enrollment/EnrollmentPage";
import EnrollmentRequestsPage from "./pages/dashboard/EnrollmentRequestsPage";
import CourseLearningPage from "./pages/learn/CourseLearningPage";
import MyCoursesPage from "./pages/learn/MyCoursesPage";
import NotFound from "./pages/NotFound";

// Student Dashboard
import StudentLayout from "./components/student/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentBatchesPage from "./pages/student/StudentBatchesPage";
import StudentBatchDetailPage from "./pages/student/StudentBatchDetailPage";
import StudentSessionsPage from "./pages/student/StudentSessionsPage";
import StudentAssignmentsPage from "./pages/student/StudentAssignmentsPage";
import StudentCertificatesPage from "./pages/student/StudentCertificatesPage";
import StudentComplaintsPage from "./pages/student/StudentComplaintsPage";

// Parent Dashboard
import ParentLayout from "./components/parent/ParentLayout";
import ParentDashboard from "./pages/parent/ParentDashboard";
import ParentChildrenPage from "./pages/parent/ParentChildrenPage";
import ParentAttendancePage from "./pages/parent/ParentAttendancePage";
import ParentGradesPage from "./pages/parent/ParentGradesPage";
import ParentPaymentsPage from "./pages/parent/ParentPaymentsPage";
import ParentComplaintsPage from "./pages/parent/ParentComplaintsPage";

// Instructor Dashboard
import InstructorLayout from "./components/instructor/InstructorLayout";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import InstructorBatchesPage from "./pages/instructor/InstructorBatchesPage";
import InstructorBatchDetailPage from "./pages/instructor/InstructorBatchDetailPage";
import InstructorGradingPage from "./pages/instructor/InstructorGradingPage";
import InstructorSessionsPage from "./pages/instructor/InstructorSessionsPage";
import InstructorEarningsPage from "./pages/instructor/InstructorEarningsPage";
import InstructorApplicationsPage from "./pages/instructor/InstructorApplicationsPage";
import InstructorProfilePage from "./pages/instructor/InstructorProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TenantProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/onboarding" element={<SchoolOnboarding />} />
              
              {/* Auth Routes */}
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/register" element={<RegisterPage />} />
              <Route path="/auth/select-school" element={<SchoolSelectorPage />} />
              
              {/* School Owner Dashboard Routes */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="courses" element={<CoursesPage />} />
                <Route path="courses/:courseId/edit" element={<CourseBuilderPage />} />
                <Route path="courses/new" element={<CourseBuilderPage />} />
                <Route path="batches" element={<BatchesPage />} />
                <Route path="batches/:batchId" element={<BatchDetailPage />} />
                <Route path="instructors" element={<InstructorsPage />} />
                <Route path="students" element={<StudentsPage />} />
                <Route path="live-sessions" element={<LiveSessionsPage />} />
                <Route path="enrollments" element={<EnrollmentRequestsPage />} />
                <Route path="complaints" element={<ComplaintsPage />} />
                <Route path="certificates" element={<CertificatesPage />} />
                <Route path="financials" element={<FinancialDashboardPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* Instructor Dashboard Routes */}
              <Route path="/instructor" element={<InstructorLayout />}>
                <Route index element={<InstructorDashboard />} />
                <Route path="batches" element={<InstructorBatchesPage />} />
                <Route path="batch/:batchId" element={<InstructorBatchDetailPage />} />
                <Route path="grading" element={<InstructorGradingPage />} />
                <Route path="sessions" element={<InstructorSessionsPage />} />
                <Route path="earnings" element={<InstructorEarningsPage />} />
                <Route path="applications" element={<InstructorApplicationsPage />} />
                <Route path="profile" element={<InstructorProfilePage />} />
              </Route>
              
              {/* Student Dashboard Routes */}
              <Route path="/student" element={<StudentLayout />}>
                <Route index element={<StudentDashboard />} />
                <Route path="batches" element={<StudentBatchesPage />} />
                <Route path="batch/:batchId" element={<StudentBatchDetailPage />} />
                <Route path="sessions" element={<StudentSessionsPage />} />
                <Route path="assignments" element={<StudentAssignmentsPage />} />
                <Route path="certificates" element={<StudentCertificatesPage />} />
                <Route path="complaints" element={<StudentComplaintsPage />} />
              </Route>

              {/* Parent Dashboard Routes */}
              <Route path="/parent" element={<ParentLayout />}>
                <Route index element={<ParentDashboard />} />
                <Route path="children" element={<ParentChildrenPage />} />
                <Route path="attendance" element={<ParentAttendancePage />} />
                <Route path="grades" element={<ParentGradesPage />} />
                <Route path="payments" element={<ParentPaymentsPage />} />
                <Route path="complaints" element={<ParentComplaintsPage />} />
              </Route>

              {/* Legacy Student Routes - redirect to new dashboard */}
              <Route path="/my-courses" element={<MyCoursesPage />} />
              <Route path="/learn/:courseId/lesson/:lessonId" element={<CourseLearningPage />} />
              
              {/* Public School Routes */}
              <Route path="/school/:slug" element={<SchoolPublicPage />} />
              <Route path="/school/:slug/course/:courseId" element={<CourseDetailPage />} />
              <Route path="/school/:slug/enroll" element={<EnrollmentPage />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </TenantProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
