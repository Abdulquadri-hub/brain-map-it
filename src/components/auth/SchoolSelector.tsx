import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTenant } from "@/contexts/TenantContext";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Laravel Inertia.js Integration:
// import { router, usePage } from '@inertiajs/react'
// 
// Get schools from shared props:
// const { schools } = usePage<{ schools: School[] }>().props
// 
// Select school and set tenant:
// const selectSchool = (schoolId: string) => {
//   router.post('/switch-school', { school_id: schoolId }, {
//     onSuccess: () => router.visit('/dashboard')
//   })
// }

const SchoolSelector = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setActiveTenant, availableSchools } = useTenant();
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectSchool = (schoolId: string) => {
    setSelectedSchoolId(schoolId);
  };

  const handleContinue = async () => {
    if (!selectedSchoolId) return;

    setIsLoading(true);
    const selectedSchool = availableSchools.find((s) => s.id === selectedSchoolId);
    
    if (selectedSchool) {
      // Laravel Inertia.js: Replace with router.post('/switch-school', { school_id: selectedSchoolId })
      setActiveTenant(selectedSchool);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      navigate("/dashboard");
    }
    setIsLoading(false);
  };

  // If user only has one school or none, redirect
  if (!user?.schools || user.schools.length <= 1) {
    if (user?.schools?.[0]) {
      setActiveTenant(user.schools[0]);
    }
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Select a School</h2>
        <p className="text-sm text-muted-foreground">
          You have access to multiple schools. Choose one to continue.
        </p>
      </div>

      <div className="grid gap-3">
        {availableSchools.map((school) => (
          <button
            key={school.id}
            type="button"
            onClick={() => handleSelectSchool(school.id)}
            className={cn(
              "flex items-center gap-4 p-4 rounded-lg border-2 text-left transition-all",
              "hover:border-primary hover:bg-primary/5",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              selectedSchoolId === school.id && "border-primary bg-primary/5"
            )}
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={school.logo} alt={school.name} />
              <AvatarFallback className="bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{school.name}</p>
              <p className="text-sm text-muted-foreground capitalize">
                {school.role.replace("_", " ")}
              </p>
            </div>
            {selectedSchoolId === school.id && (
              <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
          </button>
        ))}
      </div>

      <Button
        onClick={handleContinue}
        className="w-full"
        size="lg"
        disabled={!selectedSchoolId || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          "Continue to Dashboard"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        You can switch schools anytime from the dashboard header.
      </p>
    </div>
  );
};

export default SchoolSelector;
