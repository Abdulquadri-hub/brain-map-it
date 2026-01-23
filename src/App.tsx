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
import ReportsPage from "./pages/dashboard/ReportsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
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

// Laravel Inertia.js Integration:
// Replace BrowserRouter with Inertia's routing:
// import { createInertiaApp } from '@inertiajs/react'
// 
// createInertiaApp({
//   resolve: name => {
//     const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true })
//     return pages[`./Pages/${name}.tsx`]
//   },
//   setup({ el, App, props }) {
//     createRoot(el).render(<App {...props} />)
//   },
// })

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
              
              {/* Dashboard Routes */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="students" element={<StudentsPage />} />
                <Route path="courses" element={<CoursesPage />} />
                <Route path="courses/:courseId/edit" element={<CourseBuilderPage />} />
                <Route path="courses/new" element={<CourseBuilderPage />} />
                <Route path="instructors" element={<InstructorsPage />} />
                <Route path="live-sessions" element={<LiveSessionsPage />} />
                <Route path="enrollments" element={<EnrollmentRequestsPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="settings" element={<SettingsPage />} />
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
