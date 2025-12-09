import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import SchoolSelector from "@/components/auth/SchoolSelector";

// Laravel Inertia.js Integration:
// This page would be rendered after login if user has multiple schools:
// Route::get('/select-school', [AuthController::class, 'showSchoolSelector'])
//   ->middleware('auth')
//   ->name('select-school');
// 
// In the controller:
// $schools = $user->schools()->with('pivot')->get();
// return Inertia::render('Auth/SchoolSelectorPage', [
//   'schools' => $schools,
// ]);

const SchoolSelectorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <Link to="/" className="flex items-center gap-2 text-primary">
            <GraduationCap className="h-8 w-8" />
            <span className="text-2xl font-bold">Teach</span>
          </Link>
        </div>

        <div className="bg-card rounded-xl border shadow-lg p-6">
          <SchoolSelector />
        </div>
      </div>
    </div>
  );
};

export default SchoolSelectorPage;
