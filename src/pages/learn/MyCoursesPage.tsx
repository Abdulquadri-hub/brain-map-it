import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  PlayCircle,
  CheckCircle,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Laravel Inertia.js Integration:
// import { usePage, Link } from '@inertiajs/react'
//
// Replace mock data with:
// const { enrolledCourses, completedCourses } = usePage<{
//   enrolledCourses: CourseEnrollment[],
//   completedCourses: CourseEnrollment[]
// }>().props

interface EnrolledCourse {
  id: string;
  courseId: string;
  title: string;
  instructor: string;
  image: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  lastAccessedAt: string;
  nextLessonId: string;
  nextLessonTitle: string;
  status: "in_progress" | "completed" | "not_started";
}

const mockEnrolledCourses: EnrolledCourse[] = [
  {
    id: "1",
    courseId: "1",
    title: "Advanced Mathematics",
    instructor: "Dr. Adaora Nwosu",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
    progress: 65,
    completedLessons: 7,
    totalLessons: 11,
    lastAccessedAt: "2024-01-15T10:30:00Z",
    nextLessonId: "8",
    nextLessonTitle: "Differentiation Assignment",
    status: "in_progress",
  },
  {
    id: "2",
    courseId: "2",
    title: "English Literature",
    instructor: "Prof. Sarah Adams",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400",
    progress: 30,
    completedLessons: 3,
    totalLessons: 10,
    lastAccessedAt: "2024-01-14T14:20:00Z",
    nextLessonId: "4",
    nextLessonTitle: "Shakespeare's Works",
    status: "in_progress",
  },
  {
    id: "3",
    courseId: "3",
    title: "Physics Fundamentals",
    instructor: "Dr. Michael Chen",
    image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400",
    progress: 100,
    completedLessons: 12,
    totalLessons: 12,
    lastAccessedAt: "2024-01-10T09:00:00Z",
    nextLessonId: "",
    nextLessonTitle: "",
    status: "completed",
  },
  {
    id: "4",
    courseId: "4",
    title: "Introduction to Programming",
    instructor: "Mr. David Lee",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400",
    progress: 0,
    completedLessons: 0,
    totalLessons: 15,
    lastAccessedAt: "",
    nextLessonId: "1",
    nextLessonTitle: "Welcome to Programming",
    status: "not_started",
  },
];

const MyCoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("all");

  const courses = mockEnrolledCourses;

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "in_progress" && course.status === "in_progress") ||
      (filterStatus === "completed" && course.status === "completed") ||
      (filterStatus === "not_started" && course.status === "not_started");
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && course.status !== "completed") ||
      (activeTab === "completed" && course.status === "completed");
    return matchesSearch && matchesStatus && matchesTab;
  });

  const inProgressCount = courses.filter((c) => c.status === "in_progress").length;
  const completedCount = courses.filter((c) => c.status === "completed").length;

  const formatLastAccessed = (dateString: string) => {
    if (!dateString) return "Not started";
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold mb-2">My Courses</h1>
          <p className="text-muted-foreground">
            Continue learning from where you left off
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{courses.length}</p>
                  <p className="text-sm text-muted-foreground">Enrolled Courses</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <PlayCircle className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{inProgressCount}</p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{completedCount}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Course List */}
        {filteredCourses.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No courses found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "Try adjusting your search"
                  : "You haven't enrolled in any courses yet"}
              </p>
              {!searchQuery && (
                <Button asChild>
                  <Link to="/marketplace">Browse Courses</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Course Image */}
                      <div className="md:w-48 lg:w-64 flex-shrink-0">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="h-40 md:h-full w-full object-cover"
                        />
                      </div>

                      {/* Course Info */}
                      <div className="flex-1 p-4 md:p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{course.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {course.instructor}
                              </p>
                            </div>
                            <Badge
                              variant={
                                course.status === "completed"
                                  ? "default"
                                  : course.status === "in_progress"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {course.status === "completed"
                                ? "Completed"
                                : course.status === "in_progress"
                                ? "In Progress"
                                : "Not Started"}
                            </Badge>
                          </div>

                          {/* Progress */}
                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">
                                {course.completedLessons} of {course.totalLessons} lessons
                              </span>
                              <span className="font-medium">{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>

                          {/* Meta Info */}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Last accessed: {formatLastAccessed(course.lastAccessedAt)}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                          {course.nextLessonTitle ? (
                            <div className="text-sm">
                              <span className="text-muted-foreground">Next: </span>
                              <span className="font-medium">{course.nextLessonTitle}</span>
                            </div>
                          ) : (
                            <div className="text-sm text-green-600 flex items-center gap-1">
                              <CheckCircle className="h-4 w-4" />
                              Course completed!
                            </div>
                          )}
                          <Button asChild>
                            <Link to={`/learn/${course.courseId}/lesson/${course.nextLessonId || "1"}`}>
                              {course.status === "not_started"
                                ? "Start Course"
                                : course.status === "completed"
                                ? "Review"
                                : "Continue"}
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoursesPage;
