import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  TrendingUp,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BatchCard } from "@/components/batches/BatchCard";
import { CreateBatchDialog } from "@/components/batches/CreateBatchDialog";
import { Batch, BatchStatus } from "@/types/batch";
import { useToast } from "@/hooks/use-toast";

// Laravel Inertia.js Integration:
// import { usePage, router } from '@inertiajs/react'
// interface Props { batches: Batch[]; courses: Course[]; instructors: Instructor[] }
// const { batches, courses, instructors } = usePage<Props>().props

// Mock data for development
const mockCourses = [
  { id: "1", name: "Mathematics for JSS1" },
  { id: "2", name: "English Language - Primary 5" },
  { id: "3", name: "Physics for SSS2" },
  { id: "4", name: "Web Development Bootcamp" },
];

const mockInstructors = [
  { id: "inst-1", name: "Dr. Sarah Johnson" },
  { id: "inst-2", name: "Mrs. Adaeze Okonkwo" },
  { id: "inst-3", name: "Emmanuel Tech" },
];

const mockBatches: Batch[] = [
  {
    id: "1",
    courseId: "1",
    courseName: "Mathematics for JSS1",
    name: "January 2025 Batch",
    description: "First batch of the year for JSS1 Mathematics",
    startDate: "2025-01-15",
    endDate: "2025-04-15",
    maxStudents: 30,
    currentEnrollment: 25,
    status: "active",
    instructorId: "inst-1",
    instructorName: "Dr. Sarah Johnson",
    whatsAppLink: "https://chat.whatsapp.com/abc123",
    whatsAppGroupName: "Math Masters Jan 2025",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    courseId: "2",
    courseName: "English Language - Primary 5",
    name: "February 2025 Batch",
    startDate: "2025-02-01",
    endDate: "2025-05-01",
    maxStudents: 25,
    currentEnrollment: 18,
    status: "open",
    instructorId: "inst-2",
    instructorName: "Mrs. Adaeze Okonkwo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    courseId: "4",
    courseName: "Web Development Bootcamp",
    name: "March 2025 Cohort",
    description: "Intensive web development training",
    startDate: "2025-03-01",
    endDate: "2025-06-01",
    maxStudents: 20,
    currentEnrollment: 20,
    status: "closed",
    instructorId: "inst-3",
    instructorName: "Emmanuel Tech",
    whatsAppLink: "https://chat.whatsapp.com/webdev123",
    whatsAppGroupName: "WebDev Cohort 3",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    courseId: "3",
    courseName: "Physics for SSS2",
    name: "December 2024 Batch",
    startDate: "2024-12-01",
    endDate: "2025-02-28",
    maxStudents: 30,
    currentEnrollment: 28,
    status: "completed",
    instructorId: "inst-1",
    instructorName: "Dr. Sarah Johnson",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const BatchesPage = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState<Batch[]>(mockBatches);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editBatch, setEditBatch] = useState<Batch | null>(null);
  const { toast } = useToast();

  // Stats
  const stats = useMemo(() => ({
    total: batches.length,
    active: batches.filter((b) => b.status === "active").length,
    enrolling: batches.filter((b) => b.status === "open").length,
    totalStudents: batches.reduce((acc, b) => acc + b.currentEnrollment, 0),
  }), [batches]);

  // Filtered batches
  const filteredBatches = useMemo(() => {
    return batches.filter((batch) => {
      const matchesSearch =
        batch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batch.courseName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batch.instructorName?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || batch.status === statusFilter;
      const matchesCourse = courseFilter === "all" || batch.courseId === courseFilter;

      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [batches, searchQuery, statusFilter, courseFilter]);

  const handleViewBatch = (batch: Batch) => {
    navigate(`/dashboard/batches/${batch.id}`);
  };

  const handleEditBatch = (batch: Batch) => {
    setEditBatch(batch);
    setCreateDialogOpen(true);
  };

  const handleDeleteBatch = (batch: Batch) => {
    // Laravel Inertia.js: Replace with router.delete(`/batches/${batch.id}`)
    setBatches((prev) => prev.filter((b) => b.id !== batch.id));
    toast({
      title: "Batch deleted",
      description: `${batch.name} has been deleted.`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Batches
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage student cohorts and enrollments across courses
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Batch
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Batches</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/50">
                <TrendingUp className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent">
                <Calendar className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.enrolling}</p>
                <p className="text-xs text-muted-foreground">Enrolling</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
                <p className="text-xs text-muted-foreground">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search batches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Enrolling</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {mockCourses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Batch Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBatches.map((batch, index) => (
          <motion.div
            key={batch.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <BatchCard
              batch={batch}
              onView={handleViewBatch}
              onEdit={handleEditBatch}
              onDelete={handleDeleteBatch}
            />
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredBatches.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">No batches found</h3>
          <p className="text-muted-foreground mt-1">
            {searchQuery || statusFilter !== "all" || courseFilter !== "all"
              ? "Try adjusting your filters"
              : "Create your first batch to get started"}
          </p>
          {!searchQuery && statusFilter === "all" && courseFilter === "all" && (
            <Button className="mt-4" onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Batch
            </Button>
          )}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <CreateBatchDialog
        open={createDialogOpen}
        onOpenChange={(open) => {
          setCreateDialogOpen(open);
          if (!open) setEditBatch(null);
        }}
        courses={mockCourses}
        instructors={mockInstructors}
        editBatch={editBatch}
      />
    </div>
  );
};

export default BatchesPage;
