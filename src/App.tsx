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
              
              {/* Student Learning Routes */}
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
