import { useState } from "react";
import { Link } from "react-router-dom";
import { UsersRound, Users, Calendar, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOCK_BATCHES } from "@/data/mock-data";
import { MOCK_INSTRUCTOR_SCHOOLS } from "@/data/instructor-mock-data";
import { format } from "date-fns";

// Instructor inst-1 is assigned to batch-1 and batch-4
const assignedBatchIds = ["batch-1", "batch-4"];

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  open: "bg-blue-100 text-blue-700",
  closed: "bg-muted text-muted-foreground",
  completed: "bg-primary/10 text-primary",
};

const InstructorBatchesPage = () => {
  const [schoolFilter, setSchoolFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const assignedBatches = MOCK_BATCHES.filter((b) => assignedBatchIds.includes(b.id));

  const filteredBatches = assignedBatches.filter((b) => {
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">My Batches</h1>
        <p className="text-muted-foreground">Batches assigned to you across all schools</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={schoolFilter} onValueChange={setSchoolFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Schools" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Schools</SelectItem>
            {MOCK_INSTRUCTOR_SCHOOLS.map((s) => (
              <SelectItem key={s.schoolId} value={s.schoolId}>{s.schoolName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Batch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBatches.map((batch) => (
          <Link key={batch.id} to={`/instructor/batch/${batch.id}`}>
            <Card className="hover:shadow-md transition-all cursor-pointer border-l-4 border-l-secondary">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{batch.name}</h3>
                    <p className="text-sm text-muted-foreground">{batch.courseName}</p>
                  </div>
                  <Badge className={statusColors[batch.status]}>{batch.status}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{batch.currentEnrollment}/{batch.maxStudents} students</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(batch.startDate), "MMM d")} - {format(new Date(batch.endDate), "MMM d, yyyy")}</span>
                  </div>
                </div>

                {batch.whatsAppGroupName && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageCircle className="h-4 w-4 text-emerald-600" />
                    <span>{batch.whatsAppGroupName}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredBatches.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <UsersRound className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No batches found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InstructorBatchesPage;
