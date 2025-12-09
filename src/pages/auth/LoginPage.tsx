import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";

// Laravel Inertia.js Integration:
// This page would be rendered via Inertia:
// Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
// 
// In the controller:
// return Inertia::render('Auth/LoginPage', [
//   'canResetPassword' => Route::has('password.request'),
// ]);

const LoginPage = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8" />
            <span className="text-2xl font-bold">Teach</span>
          </Link>
          
          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight">
              Welcome back to the future of online education
            </h1>
            <p className="text-lg opacity-90">
              Manage your school, courses, and students all in one place. 
              Join thousands of educators transforming learning.
            </p>
            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold">10,000+</p>
                <p className="text-sm opacity-80">Active Schools</p>
              </div>
              <div>
                <p className="text-3xl font-bold">500K+</p>
                <p className="text-sm opacity-80">Students</p>
              </div>
              <div>
                <p className="text-3xl font-bold">50K+</p>
                <p className="text-sm opacity-80">Courses</p>
              </div>
            </div>
          </div>

          <p className="text-sm opacity-70">
            © 2024 Teach Platform. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex justify-center">
            <Link to="/" className="flex items-center gap-2 text-primary">
              <GraduationCap className="h-8 w-8" />
              <span className="text-2xl font-bold">Teach</span>
            </Link>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Sign in to your account</h2>
            <p className="text-muted-foreground">
              Enter your credentials to access your dashboard
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
