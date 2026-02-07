import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Users,
  Calendar,
  Pencil,
  Eye,
  Filter,
  UsersRound,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_COURSES } from "@/data/mock-data";
import { ACADEMIC_LEVEL_LABELS, DAY_LABELS, type CourseStatus } from "@/types/course";

/**
 * CoursesPage - V3 Batch-Aware
 * 
 * Laravel Inertia.js Integration:
 * - Use usePage() to receive courses from CourseController@index
 * - Replace MOCK_COURSES with Inertia props
 */

const CoursesPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredCourses = MOCK_COURSES.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.instructor?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: CourseStatus) => {
    const variants: Record<CourseStatus, string> = {
      active: "bg-primary/10 text-primary border-primary/20",
      draft: "bg-muted text-muted-foreground border-border",
      archived: "bg-secondary/10 text-secondary border-secondary/20",
    };
    return <Badge variant="outline" className={variants[status]}>{status}</Badge>;
  };

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Courses</h1>
          <p className="text-sm text-muted-foreground">Manage your course catalog. Each course is a template for batches.</p>
        </div>
        <Button onClick={() => navigate("/dashboard/courses/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Create Course
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Courses", value: MOCK_COURSES.length, icon: BookOpen },
          { label: "Active", value: MOCK_COURSES.filter(c => c.status === "active").length, color: "text-primary" },
          { label: "Total Batches", value: MOCK_COURSES.reduce((acc, c) => acc + c.totalBatches, 0), color: "text-secondary" },
          { label: "Total Enrollments", value: MOCK_COURSES.reduce((acc, c) => acc + c.totalEnrollments, 0), color: "text-foreground" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color || "text-foreground"}`}>{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses or instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-2 bg-primary" />
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-1 mt-1">
                      {course.instructor?.name || "No instructor"}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border border-border">
                      <DropdownMenuItem onClick={() => navigate(`/dashboard/courses/${course.id}/edit`)}>
                        <Pencil className="h-4 w-4 mr-2" /> Edit Course
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/dashboard/batches?course=${course.id}`)}>
                        <UsersRound className="h-4 w-4 mr-2" /> View Batches
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/school/preview/course/${course.id}`)}>
                        <Eye className="h-4 w-4 mr-2" /> Preview
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {ACADEMIC_LEVEL_LABELS[course.academicLevel]}
                  </Badge>
                  {getStatusBadge(course.status)}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-foreground">{formatPrice(course.price)}</span>
                  <span className="text-muted-foreground">{course.durationWeeks} weeks</span>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <UsersRound className="h-3.5 w-3.5" />
                    <span>{course.activeBatches} active batch{course.activeBatches !== 1 ? "es" : ""}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    <span>{course.totalEnrollments}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground border-t border-border pt-3">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {DAY_LABELS[course.liveSession.dayOfWeek]}s at {course.liveSession.time} · {course.liveSession.duration}min
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No courses found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your filters or create a new course.</p>
          <Button onClick={() => navigate("/dashboard/courses/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Button>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
