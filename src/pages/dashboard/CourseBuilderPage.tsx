import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Eye,
  MoreHorizontal,
  Settings,
  BookOpen,
  Users,
  ImageIcon,
  Upload,
  Plus,
  Trash2,
  Video,
  Link as LinkIcon,
  FileText,
  MessageCircle,
  Calendar,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import type { 
  Course, 
  CourseStatus, 
  LiveSessionConfig, 
  WhatsAppConfig, 
  CourseMaterial,
  AcademicLevel,
  DayOfWeek,
  LivePlatform,
  ACADEMIC_LEVEL_LABELS,
  DAY_LABELS,
  PLATFORM_LABELS,
  DEFAULT_LIVE_SESSION,
} from "@/types/course";

/**
 * CourseBuilderPage - V3 Simplified
 * 
 * Laravel Inertia.js Integration:
 * - Use usePage() to receive course from CourseController@edit
 * - Use router.put(`/dashboard/courses/${course.id}`, courseData) to save
 * 
 * V3 Changes:
 * - Removed LearningType selector (all courses are live classes)
 * - Removed module/lesson curriculum (replaced with materials)
 * - Simplified to: Basic Info, Schedule, Materials tabs
 * - Single price per course
 */

const categories = ["Mathematics", "English", "Science", "History", "Technology", "Arts", "Languages", "Business"];

const academicLevels: { value: AcademicLevel; label: string }[] = [
  { value: "primary_1", label: "Primary 1" },
  { value: "primary_2", label: "Primary 2" },
  { value: "primary_3", label: "Primary 3" },
  { value: "primary_4", label: "Primary 4" },
  { value: "primary_5", label: "Primary 5" },
  { value: "primary_6", label: "Primary 6" },
  { value: "jss_1", label: "JSS 1" },
  { value: "jss_2", label: "JSS 2" },
  { value: "jss_3", label: "JSS 3" },
  { value: "sss_1", label: "SSS 1" },
  { value: "sss_2", label: "SSS 2" },
  { value: "sss_3", label: "SSS 3" },
  { value: "adult", label: "Adult Education" },
];

const daysOfWeek: { value: DayOfWeek; label: string }[] = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

const platforms: { value: LivePlatform; label: string }[] = [
  { value: "google_meet", label: "Google Meet" },
  { value: "zoom", label: "Zoom" },
  { value: "teams", label: "Microsoft Teams" },
];

const mockInstructors = [
  { id: "1", name: "Dr. James Wilson" },
  { id: "2", name: "Prof. Sarah Adams" },
  { id: "3", name: "Dr. Michael Chen" },
  { id: "4", name: "Prof. Emily Brown" },
];

const CourseBuilderPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const isNewCourse = courseId === "new";

  // Course state - V3 simplified structure
  const [course, setCourse] = useState<Partial<Course>>({
    id: isNewCourse ? "" : courseId,
    title: isNewCourse ? "" : "Advanced Mathematics",
    description: isNewCourse ? "" : "Master calculus, algebra, and geometry with practical applications through interactive live classes.",
    shortDescription: isNewCourse ? "" : "Comprehensive math course for advanced learners",
    category: isNewCourse ? "" : "Mathematics",
    academicLevel: isNewCourse ? "adult" : "sss_2",
    price: isNewCourse ? 0 : 25000,
    durationWeeks: isNewCourse ? 8 : 12,
    status: "draft",
    liveSession: isNewCourse ? {
      dayOfWeek: "saturday",
      time: "10:00",
      duration: 90,
      platform: "google_meet",
      timezone: "Africa/Lagos",
    } : {
      dayOfWeek: "saturday",
      time: "10:00",
      duration: 90,
      platform: "google_meet",
      timezone: "Africa/Lagos",
    },
    whatsApp: { enabled: true, groupLink: "" },
    instructor: isNewCourse ? undefined : {
      id: "1",
      name: "Dr. James Wilson",
      title: "Mathematics Department Head",
    },
    materials: isNewCourse ? [] : [
      { id: "1", courseId: courseId || "", title: "Course Syllabus", type: "pdf", url: "/materials/syllabus.pdf", order: 0, createdAt: new Date().toISOString() },
      { id: "2", courseId: courseId || "", title: "Introduction Video", type: "video_link", url: "https://youtube.com/watch?v=xyz", order: 1, createdAt: new Date().toISOString() },
    ],
    features: isNewCourse ? [] : [
      "Weekly live interactive sessions",
      "WhatsApp group support",
      "Personalized feedback on assignments",
      "Certificate upon completion",
    ],
    requirements: isNewCourse ? [] : [
      "Basic understanding of algebra",
      "Access to a computer or tablet",
      "Stable internet connection for live classes",
    ],
    totalBatches: 0,
    activeBatches: 0,
    totalEnrollments: 0,
  });

  const [activeTab, setActiveTab] = useState("details");
  const [isSaving, setIsSaving] = useState(false);
  const [newFeature, setNewFeature] = useState("");
  const [newRequirement, setNewRequirement] = useState("");
  const [newMaterial, setNewMaterial] = useState<Partial<CourseMaterial>>({
    title: "",
    type: "pdf",
    url: "",
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Laravel Inertia.js Integration:
    // router.put(`/dashboard/courses/${course.id}`, course, {
    //   onSuccess: () => toast.success('Course saved!'),
    //   onError: (errors) => ...
    // })
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Course saved successfully!");
    setIsSaving(false);
  };

  const handlePublish = () => {
    setCourse({ ...course, status: "active" });
    toast.success("Course published!");
  };

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    setCourse({
      ...course,
      features: [...(course.features || []), newFeature.trim()],
    });
    setNewFeature("");
  };

  const handleRemoveFeature = (index: number) => {
    setCourse({
      ...course,
      features: (course.features || []).filter((_, i) => i !== index),
    });
  };

  const handleAddRequirement = () => {
    if (!newRequirement.trim()) return;
    setCourse({
      ...course,
      requirements: [...(course.requirements || []), newRequirement.trim()],
    });
    setNewRequirement("");
  };

  const handleRemoveRequirement = (index: number) => {
    setCourse({
      ...course,
      requirements: (course.requirements || []).filter((_, i) => i !== index),
    });
  };

  const handleAddMaterial = () => {
    if (!newMaterial.title || !newMaterial.url) return;
    const material: CourseMaterial = {
      id: `material-${Date.now()}`,
      courseId: courseId || "",
      title: newMaterial.title,
      type: newMaterial.type as "pdf" | "link" | "video_link",
      url: newMaterial.url,
      description: newMaterial.description,
      order: (course.materials || []).length,
      createdAt: new Date().toISOString(),
    };
    setCourse({
      ...course,
      materials: [...(course.materials || []), material],
    });
    setNewMaterial({ title: "", type: "pdf", url: "" });
    toast.success("Material added!");
  };

  const handleRemoveMaterial = (materialId: string) => {
    setCourse({
      ...course,
      materials: (course.materials || []).filter((m) => m.id !== materialId),
    });
    toast.success("Material removed");
  };

  const handleLiveSessionChange = (updates: Partial<LiveSessionConfig>) => {
    setCourse({
      ...course,
      liveSession: { ...course.liveSession!, ...updates },
    });
  };

  const handleWhatsAppChange = (updates: Partial<WhatsAppConfig>) => {
    setCourse({
      ...course,
      whatsApp: { ...course.whatsApp!, ...updates },
    });
  };

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4" />;
      case "video_link":
        return <Video className="h-4 w-4" />;
      case "link":
        return <LinkIcon className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/courses")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">
                  {isNewCourse ? "Create New Course" : course.title || "Untitled Course"}
                </h1>
                <Badge
                  variant={course.status === "active" ? "default" : "secondary"}
                  className="ml-2"
                >
                  {course.status}
                </Badge>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  Live Classes
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {course.durationWeeks || 0} weeks • {academicLevels.find(l => l.value === course.academicLevel)?.label || "Not set"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link to={`/school/preview/course/${courseId}`} target="_blank">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Link>
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
            {course.status === "draft" && (
              <Button variant="default" className="bg-primary" onClick={handlePublish}>
                Publish Course
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border border-border">
                <DropdownMenuItem>Duplicate Course</DropdownMenuItem>
                <DropdownMenuItem>Export Course</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  Archive Course
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="details" className="gap-2">
              <Settings className="h-4 w-4" />
              Course Details
            </TabsTrigger>
            <TabsTrigger value="schedule" className="gap-2">
              <Calendar className="h-4 w-4" />
              Live Schedule
            </TabsTrigger>
            <TabsTrigger value="materials" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Materials
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Users className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Info */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Enter the core details about your course
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Course Title</Label>
                      <Input
                        value={course.title || ""}
                        onChange={(e) => setCourse({ ...course, title: e.target.value })}
                        placeholder="Enter course title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Short Description</Label>
                      <Input
                        value={course.shortDescription || ""}
                        onChange={(e) => setCourse({ ...course, shortDescription: e.target.value })}
                        placeholder="Brief summary (displayed in course cards)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Full Description</Label>
                      <Textarea
                        value={course.description || ""}
                        onChange={(e) => setCourse({ ...course, description: e.target.value })}
                        placeholder="Detailed course description"
                        rows={5}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select
                          value={course.category || ""}
                          onValueChange={(value) => setCourse({ ...course, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border border-border">
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Academic Level</Label>
                        <Select
                          value={course.academicLevel || ""}
                          onValueChange={(value: AcademicLevel) =>
                            setCourse({ ...course, academicLevel: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border border-border">
                            {academicLevels.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Duration (Weeks)</Label>
                        <Input
                          type="number"
                          value={course.durationWeeks || ""}
                          onChange={(e) => setCourse({ ...course, durationWeeks: Number(e.target.value) })}
                          placeholder="e.g., 12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Price (₦)</Label>
                        <Input
                          type="number"
                          value={course.price || ""}
                          onChange={(e) => setCourse({ ...course, price: Number(e.target.value) })}
                          placeholder="e.g., 25000"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Instructor</Label>
                      <Select
                        value={course.instructor?.id || ""}
                        onValueChange={(value) => {
                          const instructor = mockInstructors.find((i) => i.id === value);
                          if (instructor) {
                            setCourse({
                              ...course,
                              instructor: { ...instructor, title: "", bio: "" },
                            });
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select instructor" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border border-border">
                          {mockInstructors.map((instructor) => (
                            <SelectItem key={instructor.id} value={instructor.id}>
                              {instructor.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* What's Included */}
                <Card>
                  <CardHeader>
                    <CardTitle>What's Included</CardTitle>
                    <CardDescription>
                      List features and benefits students will get
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        placeholder="e.g., Weekly live sessions"
                        onKeyDown={(e) => e.key === "Enter" && handleAddFeature()}
                      />
                      <Button onClick={handleAddFeature}>Add</Button>
                    </div>
                    <div className="space-y-2">
                      {(course.features || []).map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <span className="text-sm">{feature}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFeature(index)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Requirements */}
                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                    <CardDescription>
                      Prerequisites students need before enrolling
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={newRequirement}
                        onChange={(e) => setNewRequirement(e.target.value)}
                        placeholder="e.g., Basic algebra knowledge"
                        onKeyDown={(e) => e.key === "Enter" && handleAddRequirement()}
                      />
                      <Button onClick={handleAddRequirement}>Add</Button>
                    </div>
                    <div className="space-y-2">
                      {(course.requirements || []).map((req, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <span className="text-sm">{req}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveRequirement(index)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Course Image */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Course Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG up to 2MB
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Pricing Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Pricing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Course Price</span>
                      <span className="font-medium text-lg">
                        ₦{(course.price || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">{course.durationWeeks || 0} weeks</span>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        All students join live class batches
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Stats (for existing courses) */}
                {!isNewCourse && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Course Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Active Batches</span>
                        <span className="font-medium">{course.activeBatches || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Batches</span>
                        <span className="font-medium">{course.totalBatches || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Enrollments</span>
                        <span className="font-medium">{course.totalEnrollments || 0}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Live Session Schedule</h2>
              <p className="text-muted-foreground">
                Configure when live classes will be held for each batch
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Schedule</CardTitle>
                  <CardDescription>
                    Set the recurring day and time for live sessions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Day of Week</Label>
                    <Select
                      value={course.liveSession?.dayOfWeek || "saturday"}
                      onValueChange={(value: DayOfWeek) =>
                        handleLiveSessionChange({ dayOfWeek: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border border-border">
                        {daysOfWeek.map((day) => (
                          <SelectItem key={day.value} value={day.value}>
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input
                      type="time"
                      value={course.liveSession?.time || "10:00"}
                      onChange={(e) => handleLiveSessionChange({ time: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Duration (minutes)</Label>
                    <Select
                      value={String(course.liveSession?.duration || 90)}
                      onValueChange={(value) =>
                        handleLiveSessionChange({ duration: Number(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border border-border">
                        <SelectItem value="60">60 minutes (1 hour)</SelectItem>
                        <SelectItem value="90">90 minutes (1.5 hours)</SelectItem>
                        <SelectItem value="120">120 minutes (2 hours)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Platform</Label>
                    <Select
                      value={course.liveSession?.platform || "google_meet"}
                      onValueChange={(value: LivePlatform) =>
                        handleLiveSessionChange({ platform: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border border-border">
                        {platforms.map((platform) => (
                          <SelectItem key={platform.value} value={platform.value}>
                            {platform.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>WhatsApp Group</CardTitle>
                  <CardDescription>
                    Enable a WhatsApp group for student communication
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable WhatsApp Group</Label>
                      <p className="text-sm text-muted-foreground">
                        Students will join the group after enrollment
                      </p>
                    </div>
                    <Switch
                      checked={course.whatsApp?.enabled || false}
                      onCheckedChange={(checked) =>
                        handleWhatsAppChange({ enabled: checked })
                      }
                    />
                  </div>
                  {course.whatsApp?.enabled && (
                    <div className="space-y-2">
                      <Label>Group Invite Link</Label>
                      <Input
                        value={course.whatsApp?.groupLink || ""}
                        onChange={(e) =>
                          handleWhatsAppChange({ groupLink: e.target.value })
                        }
                        placeholder="https://chat.whatsapp.com/..."
                      />
                      <p className="text-xs text-muted-foreground">
                        Create a WhatsApp group and paste the invite link here
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Schedule Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Schedule Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      Every {daysOfWeek.find(d => d.value === course.liveSession?.dayOfWeek)?.label} at {course.liveSession?.time || "10:00"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {course.liveSession?.duration || 90} minutes via {platforms.find(p => p.value === course.liveSession?.platform)?.label}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Materials Tab */}
          <TabsContent value="materials" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Course Materials</h2>
              <p className="text-muted-foreground">
                Add PDFs, videos, and links for students to access
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Add Material</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={newMaterial.title || ""}
                      onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                      placeholder="e.g., Course Syllabus"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={newMaterial.type || "pdf"}
                      onValueChange={(value: "pdf" | "link" | "video_link") =>
                        setNewMaterial({ ...newMaterial, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border border-border">
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="video_link">Video Link</SelectItem>
                        <SelectItem value="link">External Link</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>URL</Label>
                    <Input
                      value={newMaterial.url || ""}
                      onChange={(e) => setNewMaterial({ ...newMaterial, url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <Button onClick={handleAddMaterial}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Material
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Materials ({(course.materials || []).length})</CardTitle>
              </CardHeader>
              <CardContent>
                {(course.materials || []).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No materials added yet</p>
                    <p className="text-sm">Add PDFs, videos, or links for students</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(course.materials || []).map((material) => (
                      <div
                        key={material.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-muted">
                            {getMaterialIcon(material.type)}
                          </div>
                          <div>
                            <p className="font-medium">{material.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {material.type === "pdf" ? "PDF Document" : material.type === "video_link" ? "Video" : "Link"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <a href={material.url} target="_blank" rel="noopener noreferrer">
                              <Eye className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMaterial(material.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Enrollment Settings</CardTitle>
                <CardDescription>
                  Control how students can enroll in this course
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <Label>Require Approval</Label>
                    <p className="text-sm text-muted-foreground">
                      Manually approve each enrollment request
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <Label>Allow Late Enrollment</Label>
                    <p className="text-sm text-muted-foreground">
                      Students can join after a batch has started
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible actions for this course
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Archive Course</p>
                    <p className="text-sm text-muted-foreground">
                      Remove from catalog but keep data
                    </p>
                  </div>
                  <Button variant="outline">Archive</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Delete Course</p>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete this course and all data
                    </p>
                  </div>
                  <Button variant="destructive">Delete</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CourseBuilderPage;
