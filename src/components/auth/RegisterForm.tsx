import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Mail, Lock, User, Phone, GraduationCap, Users, School, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Laravel Inertia.js Integration:
// import { useForm, router } from '@inertiajs/react'
// 
// const { data, setData, post, processing, errors } = useForm({
//   name: '',
//   email: '',
//   password: '',
//   password_confirmation: '',
//   role: 'student',
//   phone: '',
// })
// 
// const submit = (e) => {
//   e.preventDefault()
//   post('/register', {
//     onSuccess: () => {
//       // Redirect based on role
//       if (data.role === 'school_owner') {
//         router.visit('/onboarding')
//       } else {
//         router.visit('/dashboard')
//       }
//     }
//   })
// }

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  phone?: string;
  general?: string;
}

const roles: { value: UserRole; label: string; description: string; icon: React.ElementType }[] = [
  {
    value: "student",
    label: "Student",
    description: "Enroll in courses and learn",
    icon: GraduationCap,
  },
  {
    value: "parent",
    label: "Parent",
    description: "Manage your children's education",
    icon: Users,
  },
  {
    value: "instructor",
    label: "Instructor",
    description: "Teach and create courses",
    icon: BookOpen,
  },
  {
    value: "school_owner",
    label: "School Owner",
    description: "Create and manage your school",
    icon: School,
  },
];

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  
  const [step, setStep] = useState<"role" | "details">("role");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "" as UserRole,
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRoleSelect = (role: UserRole) => {
    setFormData({ ...formData, role });
    setStep("details");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      // Laravel Inertia.js: Replace with post('/register', data)
      await register(formData);
      toast.success("Account created successfully!");
      
      // Redirect based on role
      if (formData.role === "school_owner") {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setErrors({ general: "Registration failed. Please try again." });
      toast.error("Registration failed");
    }
  };

  if (step === "role") {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold">Choose your role</h2>
          <p className="text-sm text-muted-foreground">
            Select how you'll be using Teach
          </p>
        </div>

        <div className="grid gap-3">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.value}
                type="button"
                onClick={() => handleRoleSelect(role.value)}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-lg border-2 text-left transition-all",
                  "hover:border-primary hover:bg-primary/5",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                )}
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{role.label}</p>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  const selectedRole = roles.find((r) => r.value === formData.role);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <button
        type="button"
        onClick={() => setStep("role")}
        className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
      >
        ← Change role
      </button>

      {selectedRole && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <selectedRole.icon className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium text-sm">{selectedRole.label}</p>
            <p className="text-xs text-muted-foreground">{selectedRole.description}</p>
          </div>
        </div>
      )}

      {errors.general && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {errors.general}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`pl-10 ${errors.name ? "border-destructive" : ""}`}
            />
          </div>
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
            />
          </div>
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone number (optional)</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              placeholder="+234 800 000 0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password_confirmation">Confirm password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password_confirmation"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password_confirmation}
              onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
              className={`pl-10 ${errors.password_confirmation ? "border-destructive" : ""}`}
            />
          </div>
          {errors.password_confirmation && (
            <p className="text-sm text-destructive">{errors.password_confirmation}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        By creating an account, you agree to our{" "}
        <Link to="/terms" className="text-primary hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="/privacy" className="text-primary hover:underline">
          Privacy Policy
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
