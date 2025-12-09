import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import RegisterForm from "@/components/auth/RegisterForm";

// Laravel Inertia.js Integration:
// This page would be rendered via Inertia:
// Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
// 
// In the controller:
// return Inertia::render('Auth/RegisterPage');

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary to-primary/80 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-40 -left-20 w-80 h-80 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8" />
            <span className="text-2xl font-bold">Teach</span>
          </Link>
          
          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight">
              Start your learning journey today
            </h1>
            <p className="text-lg opacity-90">
              Whether you're a student, parent, instructor, or school owner, 
              Teach has everything you need to succeed.
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-white/10 rounded-lg p-4">
                <p className="font-semibold">For Students</p>
                <p className="text-sm opacity-80">Access quality courses from top schools</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="font-semibold">For Parents</p>
                <p className="text-sm opacity-80">Track your child's progress</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="font-semibold">For Instructors</p>
                <p className="text-sm opacity-80">Teach and earn from anywhere</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="font-semibold">For Schools</p>
                <p className="text-sm opacity-80">Build your online academy</p>
              </div>
            </div>
          </div>

          <p className="text-sm opacity-70">
            © 2024 Teach Platform. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex justify-center">
            <Link to="/" className="flex items-center gap-2 text-primary">
              <GraduationCap className="h-8 w-8" />
              <span className="text-2xl font-bold">Teach</span>
            </Link>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Create your account</h2>
            <p className="text-muted-foreground">
              Join thousands of learners and educators
            </p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
