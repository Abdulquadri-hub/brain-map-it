import { Building2, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTenant } from "@/contexts/TenantContext";
import { cn } from "@/lib/utils";

// Laravel Inertia.js Integration:
// import { router, usePage } from '@inertiajs/react'
// 
// Get current tenant and available schools:
// const { tenant, schools } = usePage<{ tenant: School, schools: School[] }>().props
// 
// Switch school:
// const switchSchool = (schoolId: string) => {
//   router.post('/switch-school', { school_id: schoolId }, {
//     preserveState: false,
//     onSuccess: () => {
//       // Page will reload with new tenant context
//     }
//   })
// }

const SchoolSwitcher = () => {
  const { activeTenant, availableSchools, switchSchool } = useTenant();

  // Don't show if user only has one school
  if (availableSchools.length <= 1) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2 px-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={activeTenant?.logo} alt={activeTenant?.name} />
            <AvatarFallback className="bg-primary/10 text-xs">
              <Building2 className="h-3 w-3 text-primary" />
            </AvatarFallback>
          </Avatar>
          <span className="max-w-[120px] truncate text-sm font-medium">
            {activeTenant?.name || "Select School"}
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Switch School</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableSchools.map((school) => (
          <DropdownMenuItem
            key={school.id}
            onClick={() => switchSchool(school.id)}
            className={cn(
              "flex items-center gap-3 cursor-pointer",
              activeTenant?.id === school.id && "bg-primary/5"
            )}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={school.logo} alt={school.name} />
              <AvatarFallback className="bg-primary/10">
                <Building2 className="h-4 w-4 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{school.name}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {school.role.replace("_", " ")}
              </p>
            </div>
            {activeTenant?.id === school.id && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SchoolSwitcher;
