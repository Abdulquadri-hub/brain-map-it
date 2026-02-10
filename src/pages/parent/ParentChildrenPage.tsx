import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, CalendarCheck, BarChart3, Trophy } from "lucide-react";
import { MOCK_PARENT_CHILDREN } from "@/data/student-mock-data";

// Laravel Inertia.js Integration:
// import { usePage } from '@inertiajs/react'
// const { children } = usePage().props

const ParentChildrenPage = () => {
  const children = MOCK_PARENT_CHILDREN;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Children</h1>
        <p className="text-muted-foreground">View your children's enrolled batches and progress.</p>
      </div>

      <div className="space-y-6">
        {children.map((child) => (
          <Card key={child.id}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="p-2 rounded-full bg-primary/10"><User className="h-4 w-4 text-primary" /></div>
                {child.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {child.batches.map((batch) => (
                <div key={batch.batchId} className="p-4 rounded-lg border space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{batch.courseName}</h4>
                      <p className="text-sm text-muted-foreground">{batch.batchName} • {batch.instructorName}</p>
                    </div>
                    <Badge variant={batch.status === "active" ? "default" : "secondary"}>{batch.status}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-2 bg-muted rounded">
                      <div className="flex items-center justify-center gap-1 mb-1"><CalendarCheck className="h-4 w-4 text-primary" /></div>
                      <p className="text-lg font-bold">{batch.attendanceRate}%</p>
                      <p className="text-xs text-muted-foreground">Attendance</p>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <div className="flex items-center justify-center gap-1 mb-1"><Trophy className="h-4 w-4 text-yellow-500" /></div>
                      <p className="text-lg font-bold">#{batch.leaderboardRank}</p>
                      <p className="text-xs text-muted-foreground">Rank</p>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <div className="flex items-center justify-center gap-1 mb-1"><BarChart3 className="h-4 w-4 text-secondary" /></div>
                      <p className="text-lg font-bold">{batch.totalStudents}</p>
                      <p className="text-xs text-muted-foreground">Students</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ParentChildrenPage;
