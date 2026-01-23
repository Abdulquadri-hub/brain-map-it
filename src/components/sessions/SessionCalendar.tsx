import { useState, useMemo } from "react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday
} from "date-fns";
import { ChevronLeft, ChevronRight, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LiveSession, LivePlatform } from "@/types/live-session";
import { cn } from "@/lib/utils";

// Laravel Inertia.js Integration:
// Fetch sessions for the displayed month range
// import { router, usePage } from '@inertiajs/react'

interface SessionCalendarProps {
  sessions: LiveSession[];
  onSessionClick?: (session: LiveSession) => void;
  onDateClick?: (date: Date) => void;
}

const platformColors: Record<LivePlatform, string> = {
  google_meet: "bg-green-500",
  zoom: "bg-blue-500",
  teams: "bg-purple-500",
};

const statusColors: Record<string, string> = {
  scheduled: "bg-primary",
  live: "bg-red-500 animate-pulse",
  completed: "bg-muted-foreground",
  cancelled: "bg-destructive/50",
};

export function SessionCalendar({ sessions, onSessionClick, onDateClick }: SessionCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  const sessionsByDate = useMemo(() => {
    const map = new Map<string, LiveSession[]>();
    sessions.forEach(session => {
      const dateKey = format(new Date(session.scheduledAt), "yyyy-MM-dd");
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(session);
    });
    return map;
  }, [sessions]);

  const goToPreviousMonth = () => setCurrentMonth(prev => subMonths(prev, 1));
  const goToNextMonth = () => setCurrentMonth(prev => addMonths(prev, 1));
  const goToToday = () => setCurrentMonth(new Date());

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold ml-2">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
        </div>
        <Button variant="outline" size="sm" onClick={goToToday}>
          Today
        </Button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div 
            key={day} 
            className="p-2 text-center text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const daySessions = sessionsByDate.get(dateKey) || [];
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isCurrentDay = isToday(day);

          return (
            <div
              key={index}
              onClick={() => onDateClick?.(day)}
              className={cn(
                "min-h-[100px] p-2 border-b border-r border-border cursor-pointer transition-colors hover:bg-accent/50",
                !isCurrentMonth && "bg-muted/30 text-muted-foreground",
                index % 7 === 0 && "border-l-0",
                index < 7 && "border-t-0"
              )}
            >
              {/* Day Number */}
              <div className={cn(
                "w-7 h-7 flex items-center justify-center text-sm font-medium rounded-full mb-1",
                isCurrentDay && "bg-primary text-primary-foreground"
              )}>
                {format(day, "d")}
              </div>

              {/* Sessions */}
              <div className="space-y-1">
                {daySessions.slice(0, 3).map(session => (
                  <Tooltip key={session.id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSessionClick?.(session);
                        }}
                        className={cn(
                          "w-full text-left text-xs p-1 rounded truncate text-white",
                          statusColors[session.status]
                        )}
                      >
                        <span className="flex items-center gap-1">
                          <Video className="h-3 w-3 shrink-0" />
                          <span className="truncate">{session.title}</span>
                        </span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-[250px]">
                      <div className="space-y-1">
                        <p className="font-medium">{session.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {session.courseName}
                        </p>
                        <p className="text-xs">
                          {format(new Date(session.scheduledAt), "h:mm a")} • {session.duration} min
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {session.status}
                        </Badge>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
                {daySessions.length > 3 && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDateClick?.(day);
                    }}
                    className="text-xs text-primary hover:underline"
                  >
                    +{daySessions.length - 3} more
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 p-3 border-t border-border text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-primary" />
          <span>Scheduled</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-red-500" />
          <span>Live</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-muted-foreground" />
          <span>Completed</span>
        </div>
      </div>
    </div>
  );
}
