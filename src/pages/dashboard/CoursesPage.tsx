import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Users,
  Clock,
  Eye,
  Pencil,
  Trash2,
  Filter,
  Grid,
  List
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  students: number;
  duration: string;
  status: "active" | "draft" | "archived";
  progress: number;
}

const initialCourses: Course[] = [
  { id: "1", title: "Introduction to Mathematics", description: "Fundamental math concepts for beginners", instructor: "Dr. James Wilson", category: "Mathematics", students: 45, duration: "12 weeks", status: "active", progress: 75 },
  { id: "2", title: "English Literature", description: "Exploring classic and modern literature", instructor: "Prof. Sarah Adams", category: "English", students: 32, duration: "10 weeks", status: "active", progress: 60 },
  { id: "3", title: "Physics Fundamentals", description: "Core physics principles and applications", instructor: "Dr. Michael Chen", category: "Science", students: 28, duration: "14 weeks", status: "active", progress: 45 },
  { id: "4", title: "World History", description: "A journey through world civilizations", instructor: "Prof. Emily Brown", category: "History", students: 38, duration: "12 weeks", status: "draft", progress: 0 },
  { id: "5", title: "Computer Science Basics", description: "Introduction to programming and algorithms", instructor: "Mr. David Lee", category: "Technology", students: 52, duration: "16 weeks", status: "active", progress: 85 },
  { id: "6", title: "Art & Design", description: "Creative expression through visual arts", instructor: "Ms. Lisa Garcia", category: "Arts", students: 20, duration: "8 weeks", status: "archived", progress: 100 },
];

const categories = ["Mathematics", "English", "Science", "History", "Technology", "Arts"];

const CoursesPage = () => {
  const [searchParams] = useSearchParams();
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    instructor: "",
    category: "",
    duration: "",
  });

  useEffect(() => {
    if (searchParams.get("action") === "add") {
      setIsAddDialogOpen(true);
    }
  }, [searchParams]);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddCourse = () => {
    const course: Course = {
      id: Date.now().toString(),
      ...newCourse,
      students: 0,
      status: "draft",
      progress: 0,
    };
    setCourses([...courses, course]);
    setNewCourse({ title: "", description: "", instructor: "", category: "", duration: "" });
    setIsAddDialogOpen(false);
    toast.success("Course created successfully!");
  };

  const handleEditCourse = () => {
    if (!selectedCourse) return;
    setCourses(courses.map((c) => (c.id === selectedCourse.id ? selectedCourse : c)));
    setIsEditDialogOpen(false);
    toast.success("Course updated successfully!");
  };

  const handleDeleteCourse = () => {
    if (!selectedCourse) return;
    setCourses(courses.filter((c) => c.id !== selectedCourse.id));
    setIsDeleteDialogOpen(false);
    toast.success("Course deleted successfully!");
  };

  const getStatusBadge = (status: Course["status"]) => {
    const variants = {
      active: "bg-primary/10 text-primary border-primary/20",
      draft: "bg-muted text-muted-foreground border-border",
      archived: "bg-secondary/10 text-secondary border-secondary/20",
    };
    return <Badge variant="outline" className={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Courses</h1>
          <p className="text-sm text-muted-foreground">Manage your course catalog and curriculum.</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Courses", value: courses.length, icon: BookOpen },
          { label: "Active", value: courses.filter((c) => c.status === "active").length, color: "text-primary" },
          { label: "Draft", value: courses.filter((c) => c.status === "draft").length, color: "text-muted-foreground" },
          { label: "Total Students", value: courses.reduce((acc, c) => acc + c.students, 0), color: "text-secondary" },
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
                placeholder="Search courses..."
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
            <div className="flex gap-2">
              <Button 
                variant={viewMode === "grid" ? "default" : "outline"} 
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === "list" ? "default" : "outline"} 
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid/List */}
      {viewMode === "grid" ? (
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
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                      <CardDescription className="line-clamp-2 mt-1">{course.description}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover border border-border">
                        <DropdownMenuItem onClick={() => { setSelectedCourse(course); setIsViewDialogOpen(true); }}>
                          <Eye className="h-4 w-4 mr-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setSelectedCourse(course); setIsEditDialogOpen(true); }}>
                          <Pencil className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => { setSelectedCourse(course); setIsDeleteDialogOpen(true); }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{course.instructor}</span>
                    {getStatusBadge(course.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {course.students} students
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.duration}
                    </div>
                  </div>
                  {course.status === "active" && (
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-foreground">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-1.5" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Course</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Instructor</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Students</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Progress</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="text-sm font-medium text-foreground">{course.title}</p>
                      <p className="text-xs text-muted-foreground">{course.category}</p>
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground">{course.instructor}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{course.students}</td>
                    <td className="py-3 px-4">{getStatusBadge(course.status)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Progress value={course.progress} className="h-1.5 w-16" />
                        <span className="text-xs text-muted-foreground">{course.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border border-border">
                          <DropdownMenuItem onClick={() => { setSelectedCourse(course); setIsViewDialogOpen(true); }}>
                            <Eye className="h-4 w-4 mr-2" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setSelectedCourse(course); setIsEditDialogOpen(true); }}>
                            <Pencil className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => { setSelectedCourse(course); setIsDeleteDialogOpen(true); }}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Add Course Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Course</DialogTitle>
            <DialogDescription>Create a new course for your students.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Course Title</Label>
              <Input 
                value={newCourse.title} 
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} 
                placeholder="Introduction to..."
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={newCourse.description} 
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} 
                placeholder="Course description..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Instructor</Label>
                <Input 
                  value={newCourse.instructor} 
                  onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })} 
                  placeholder="Dr. John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input 
                  value={newCourse.duration} 
                  onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })} 
                  placeholder="12 weeks"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={newCourse.category} onValueChange={(value) => setNewCourse({ ...newCourse, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCourse}>Create Course</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Course Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Course Details</DialogTitle>
          </DialogHeader>
          {selectedCourse && (
            <div className="space-y-4 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{selectedCourse.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedCourse.description}</p>
                </div>
                {getStatusBadge(selectedCourse.status)}
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Instructor</p>
                  <p className="font-medium text-foreground">{selectedCourse.instructor}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium text-foreground">{selectedCourse.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Students Enrolled</p>
                  <p className="font-medium text-foreground">{selectedCourse.students}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium text-foreground">{selectedCourse.duration}</p>
                </div>
              </div>
              {selectedCourse.status === "active" && (
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Course Progress</p>
                  <Progress value={selectedCourse.progress} className="h-2" />
                  <p className="text-sm font-medium text-foreground mt-1">{selectedCourse.progress}% Complete</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Course Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>Update the course information.</DialogDescription>
          </DialogHeader>
          {selectedCourse && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Course Title</Label>
                <Input 
                  value={selectedCourse.title} 
                  onChange={(e) => setSelectedCourse({ ...selectedCourse, title: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={selectedCourse.description} 
                  onChange={(e) => setSelectedCourse({ ...selectedCourse, description: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  value={selectedCourse.status} 
                  onValueChange={(value: Course["status"]) => setSelectedCourse({ ...selectedCourse, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditCourse}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedCourse?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteCourse}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoursesPage;
