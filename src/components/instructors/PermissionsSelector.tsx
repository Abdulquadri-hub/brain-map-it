import { 
  Upload, 
  Video, 
  ClipboardCheck, 
  Users, 
  BarChart3, 
  MessageSquare 
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { InstructorPermission, PERMISSION_LABELS } from "@/types/instructor";

/**
 * PermissionsSelector Component
 * 
 * Laravel Inertia.js Integration:
 * - Permissions stored in instructor_agreements.permissions (JSON column)
 * - Enforced via middleware and policies
 */

interface PermissionsSelectorProps {
  value: InstructorPermission[];
  onChange: (permissions: InstructorPermission[]) => void;
  className?: string;
}

const PERMISSION_ICONS: Record<InstructorPermission, typeof Upload> = {
  upload_content: Upload,
  host_live_sessions: Video,
  grade_assignments: ClipboardCheck,
  manage_enrollments: Users,
  view_analytics: BarChart3,
  message_students: MessageSquare,
};

const PERMISSION_DESCRIPTIONS: Record<InstructorPermission, string> = {
  upload_content: "Add videos, documents, and quizzes to courses",
  host_live_sessions: "Schedule and conduct live classes",
  grade_assignments: "Review and grade student submissions",
  manage_enrollments: "Approve or reject student enrollment requests",
  view_analytics: "Access course performance and student metrics",
  message_students: "Send direct messages to enrolled students",
};

const PermissionsSelector = ({ 
  value, 
  onChange, 
  className 
}: PermissionsSelectorProps) => {
  const togglePermission = (permission: InstructorPermission) => {
    if (value.includes(permission)) {
      onChange(value.filter((p) => p !== permission));
    } else {
      onChange([...value, permission]);
    }
  };

  const allPermissions = Object.keys(PERMISSION_LABELS) as InstructorPermission[];

  return (
    <div className={cn("space-y-3", className)}>
      <Label className="text-base font-medium">Permissions</Label>
      <p className="text-sm text-muted-foreground">
        Select what this instructor can do within your school.
      </p>
      
      <div className="grid gap-2">
        {allPermissions.map((permission) => {
          const isChecked = value.includes(permission);
          const Icon = PERMISSION_ICONS[permission];
          
          return (
            <label
              key={permission}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                isChecked 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50 hover:bg-muted/30"
              )}
            >
              <Checkbox
                checked={isChecked}
                onCheckedChange={() => togglePermission(permission)}
                className="mt-0.5"
              />
              <div className="flex items-start gap-2 flex-1 min-w-0">
                <Icon className={cn(
                  "h-4 w-4 mt-0.5 shrink-0",
                  isChecked ? "text-primary" : "text-muted-foreground"
                )} />
                <div>
                  <p className={cn(
                    "text-sm font-medium",
                    isChecked ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {PERMISSION_LABELS[permission]}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {PERMISSION_DESCRIPTIONS[permission]}
                  </p>
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default PermissionsSelector;
