import { format } from "date-fns";
import { 
  Users, 
  Calendar, 
  User, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  MessageCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Batch, BatchStatus } from "@/types/batch";
import { cn } from "@/lib/utils";

// Laravel Inertia.js Integration:
// import { router } from '@inertiajs/react'
// Navigate: router.visit(`/dashboard/batches/${batch.id}`)

interface BatchCardProps {
  batch: Batch;
  onView?: (batch: Batch) => void;
  onEdit?: (batch: Batch) => void;
  onDelete?: (batch: Batch) => void;
}

const statusConfig: Record<BatchStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  open: { label: "Enrolling", variant: "default" },
  active: { label: "In Progress", variant: "secondary" },
  closed: { label: "Closed", variant: "outline" },
  completed: { label: "Completed", variant: "outline" },
};

export function BatchCard({ batch, onView, onEdit, onDelete }: BatchCardProps) {
  const status = statusConfig[batch.status];
  const enrollmentPercentage = (batch.currentEnrollment / batch.maxStudents) * 100;
  const startDate = new Date(batch.startDate);
  const endDate = new Date(batch.endDate);

  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-foreground truncate">
                {batch.name}
              </h3>
              <Badge variant={status.variant}>
                {status.label}
              </Badge>
            </div>

            {/* Course Name */}
            {batch.courseName && (
              <p className="text-sm text-muted-foreground mt-1 truncate">
                {batch.courseName}
              </p>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                <span className="truncate">
                  {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}
                </span>
              </div>
              
              {batch.instructorName && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4 shrink-0" />
                  <span className="truncate">{batch.instructorName}</span>
                </div>
              )}
            </div>

            {/* Enrollment Progress */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Students</span>
                </div>
                <span className="font-medium">
                  {batch.currentEnrollment}/{batch.maxStudents}
                </span>
              </div>
              <Progress 
                value={enrollmentPercentage} 
                className={cn(
                  "h-2",
                  enrollmentPercentage >= 90 && "bg-destructive/20"
                )} 
              />
            </div>

            {/* WhatsApp Indicator */}
            {batch.whatsAppLink && (
              <div className="flex items-center gap-2 mt-3 text-sm text-green-600">
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp group linked</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView?.(batch)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(batch)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Batch
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete?.(batch)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Batch
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
