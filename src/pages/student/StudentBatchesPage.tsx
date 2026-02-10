import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Calendar, Users, User } from "lucide-react";
import { MOCK_BATCHES } from "@/data/mock-data";
import { MOCK_STUDENT_SESSIONS } from "@/data/student-mock-data";

// Laravel Inertia.js Integration:
// import { usePage } from '@inertiajs/react'
// const { enrolledBatches } = usePage().props

const StudentBatchesPage = () => {
  // Mock: student s-1 is enrolled in batch-1 (active) and batch-4 (completed)
  const enrolledBatchIds = ["batch-1", "batch-4"];
  const enrolledBatches = MOCK_BATCHES.filter(b => enrolledBatchIds.includes(b.id));
  const activeBatches = enrolledBatches.filter(b => b.status === "active" || b.status === "open");
  const completedBatches = enrolledBatches.filter(b => b.status === "completed");

  const getSessionProgress = (batchId: string) => {
    const sessions = MOCK_STUDENT_SESSIONS.filter(s => s.courseId === MOCK_BATCHES.find(b => b.id === batchId)?.courseId);
    const completed = sessions.filter(s => s.status === "completed").length;
    return { completed, total: sessions.length };
  };

  const BatchCard = ({ batch }: { batch: typeof MOCK_BATCHES[0] }) => {
    const progress = getSessionProgress(batch.id);
    return (
      <Link to={`/student/batch/${batch.id}`}>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-5 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-foreground">{batch.courseName}</h3>
                <p className="text-sm text-muted-foreground">{batch.name}</p>
              </div>
              <Badge variant={batch.status === "active" ? "default" : batch.status === "completed" ? "secondary" : "outline"}>
                {batch.status}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {batch.instructorName}</span>
              <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {batch.currentEnrollment} students</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(batch.startDate).toLocaleDateString("en-NG", { month: "short", day: "numeric" })} – {new Date(batch.endDate).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Sessions</span>
                <span>{progress.completed}/{progress.total}</span>
              </div>
              <Progress value={progress.total ? (progress.completed / progress.total) * 100 : 0} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Batches</h1>
        <p className="text-muted-foreground">All your enrolled courses and batches.</p>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active ({activeBatches.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedBatches.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeBatches.map(b => <BatchCard key={b.id} batch={b} />)}
            {activeBatches.length === 0 && <p className="text-muted-foreground col-span-2">No active batches.</p>}
          </div>
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedBatches.map(b => <BatchCard key={b.id} batch={b} />)}
            {completedBatches.length === 0 && <p className="text-muted-foreground col-span-2">No completed batches yet.</p>}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentBatchesPage;
