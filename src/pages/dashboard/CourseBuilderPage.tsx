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
  Sparkles,
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
import ModuleEditor from "@/components/courses/ModuleEditor";
import LearningTypeSelector from "@/components/courses/LearningTypeSelector";
import LiveSessionPlanner from "@/components/courses/LiveSessionPlanner";
import type { Course, Module, CourseStatus, LearningType, CoursePricing, LiveSessionConfig, WhatsAppConfig } from "@/types/course";

// Laravel Inertia.js Integration:
// import { usePage, router } from '@inertiajs/react'
//
// Replace mock data with:
// const { course, instructors, categories } = usePage<{
//   course: Course,
//   instructors: Instructor[],
//   categories: string[]
// }>().props
//
// For saving:
// router.put(`/dashboard/courses/${course.id}`, courseData, {
//   onSuccess: () => toast.success('Course saved!'),
//   onError: (errors) => Object.values(errors).forEach(e => toast.error(e))
// })

const categories = ["Mathematics", "English", "Science", "History", "Technology", "Arts", "Languages", "Business"];
const levels = ["Beginner", "Intermediate", "Advanced"] as const;

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

  // Mock course data - replace with Inertia props
  const [course, setCourse] = useState<Partial<Course>>({
    id: isNewCourse ? "" : courseId,
    title: isNewCourse ? "" : "Advanced Mathematics",
    description: isNewCourse ? "" : "Master calculus, algebra, and geometry with practical applications.",
    shortDescription: isNewCourse ? "" : "Comprehensive math course for advanced learners",
    category: isNewCourse ? "" : "Mathematics",
    level: isNewCourse ? "Beginner" : "Advanced",
    price: isNewCourse ? 0 : 25000,
    duration: isNewCourse ? "" : "12 weeks",
    status: "draft",
    learningType: isNewCourse ? "hybrid" : "hybrid",
    allowsStudentChoice: true,
    pricing: isNewCourse 
      ? { selfPacedPrice: 15000, liveClassPrice: 25000 }
      : { selfPacedPrice: 15000, liveClassPrice: 25000 },
    liveSession: isNewCourse ? undefined : {
      platform: "google_meet",
      schedule: [{ dayOfWeek: "Saturday", time: "10:00", duration: 60 }],
      autoGenerateLink: true,
      recordSessions: true,
    },
    whatsApp: { enabled: true, groupLink: "", accessType: "live_only" },
    instructor: isNewCourse ? undefined : {
      id: "1",
      name: "Dr. James Wilson",
      title: "Mathematics Department Head",
    },
    features: isNewCourse ? [] : [
      "24/7 access to course materials",
      "Live weekly sessions",
      "Personalized feedback on assignments",
    ],
    requirements: isNewCourse ? [] : [
      "Basic understanding of algebra",
      "Access to a computer or tablet",
    ],
    modules: isNewCourse ? [] : [
      {
        id: "1",
        courseId: courseId || "",
        title: "Introduction to Calculus",
        description: "Getting started with calculus concepts",
        order: 0,
        lessons: [
          { id: "1", moduleId: "1", title: "What is Calculus?", duration: "15 min", type: "video", order: 0, status: "published" },
          { id: "2", moduleId: "1", title: "Limits and Continuity", duration: "25 min", type: "video", order: 1, status: "published" },
        ],
      },
      {
        id: "2",
        courseId: courseId || "",
        title: "Differentiation",
        description: "Learn about derivatives",
        order: 1,
        lessons: [
          { id: "3", moduleId: "2", title: "Basic Derivatives", duration: "20 min", type: "video", order: 0, status: "draft" },
          { id: "4", moduleId: "2", title: "Practice Quiz", duration: "15 min", type: "quiz", order: 1, status: "draft" },
        ],
      },
    ],
  });

  const [activeTab, setActiveTab] = useState("details");
  const [isSaving, setIsSaving] = useState(false);
  const [newFeature, setNewFeature] = useState("");
  const [newRequirement, setNewRequirement] = useState("");

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

  const handleModulesChange = (modules: Module[]) => {
    setCourse({ ...course, modules });
  };

  const handleLearningTypeChange = (learningType: LearningType) => {
    setCourse({ ...course, learningType });
  };

  const handlePricingChange = (pricing: CoursePricing) => {
    setCourse({ ...course, pricing });
  };

  const handleAllowsChoiceChange = (allowsStudentChoice: boolean) => {
    setCourse({ ...course, allowsStudentChoice });
  };

  const handleLiveSessionChange = (liveSession: LiveSessionConfig) => {
    setCourse({ ...course, liveSession });
  };

  const handleWhatsAppChange = (whatsApp: WhatsAppConfig) => {
    setCourse({ ...course, whatsApp });
  };

  const totalLessons = (course.modules || []).reduce(
    (acc, m) => acc + m.lessons.length,
    0
  );

  const getLearningTypeBadge = () => {
    switch (course.learningType) {
      case "self_paced":
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-600">Self-Paced</Badge>;
      case "live_classes":
        return <Badge variant="secondary" className="bg-green-500/10 text-green-600">Live Classes</Badge>;
      case "hybrid":
        return <Badge variant="secondary" className="bg-purple-500/10 text-purple-600">Hybrid</Badge>;
      default:
        return null;
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
                {getLearningTypeBadge()}
              </div>
              <p className="text-sm text-muted-foreground">
                {totalLessons} lessons • {(course.modules || []).length} modules
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
            <TabsTrigger value="learning-type" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Learning Type
            </TabsTrigger>
            <TabsTrigger value="curriculum" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Curriculum
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
                        <Label>Level</Label>
                        <Select
                          value={course.level || ""}
                          onValueChange={(value: typeof levels[number]) =>
                            setCourse({ ...course, level: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border border-border">
                            {levels.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Duration</Label>
                        <Input
                          value={course.duration || ""}
                          onChange={(e) => setCourse({ ...course, duration: e.target.value })}
                          placeholder="e.g., 12 weeks"
                        />
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
                        placeholder="e.g., Lifetime access to materials"
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
                    {course.learningType === "self_paced" && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Self-Paced</span>
                        <span className="font-medium">
                          ₦{(course.pricing?.selfPacedPrice || 0).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {course.learningType === "live_classes" && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Live Classes</span>
                        <span className="font-medium">
                          ₦{(course.pricing?.liveClassPrice || 0).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {course.learningType === "hybrid" && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Self-Paced</span>
                          <span className="font-medium">
                            ₦{(course.pricing?.selfPacedPrice || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Live Classes</span>
                          <span className="font-medium">
                            ₦{(course.pricing?.liveClassPrice || 0).toLocaleString()}
                          </span>
                        </div>
                      </>
                    )}
                    <p className="text-xs text-muted-foreground pt-2">
                      Configure pricing in the Learning Type tab
                    </p>
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
                        <span className="text-muted-foreground">Enrolled Students</span>
                        <span className="font-medium">45</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Completion Rate</span>
                        <span className="font-medium">72%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Average Rating</span>
                        <span className="font-medium">4.8 / 5</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Learning Type Tab - NEW */}
          <TabsContent value="learning-type" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Learning Experience</h2>
              <p className="text-muted-foreground">
                Choose how students will experience your course
              </p>
            </div>

            <LearningTypeSelector
              selectedType={course.learningType || "hybrid"}
              onTypeChange={handleLearningTypeChange}
              pricing={course.pricing || { selfPacedPrice: 0, liveClassPrice: 0 }}
              onPricingChange={handlePricingChange}
              allowsStudentChoice={course.allowsStudentChoice || false}
              onAllowsChoiceChange={handleAllowsChoiceChange}
            />

            {/* Live Session Planner - only for live_classes or hybrid */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Live Session Configuration</h3>
              <LiveSessionPlanner
                config={course.liveSession}
                onConfigChange={handleLiveSessionChange}
                whatsApp={course.whatsApp}
                onWhatsAppChange={handleWhatsAppChange}
                disabled={course.learningType === "self_paced"}
              />
            </div>
          </TabsContent>

          {/* Curriculum Tab */}
          <TabsContent value="curriculum">
            <ModuleEditor
              modules={course.modules || []}
              onModulesChange={handleModulesChange}
              courseId={courseId || "new"}
            />
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
                      Students can enroll after the start date
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <Label>Enrollment Limit</Label>
                    <p className="text-sm text-muted-foreground">
                      Maximum number of students (0 = unlimited)
                    </p>
                  </div>
                  <Input
                    type="number"
                    className="w-24"
                    placeholder="0"
                    defaultValue="0"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schedule</CardTitle>
                <CardDescription>Set course start and end dates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Class Time (Optional)</Label>
                  <Input placeholder="e.g., Saturdays, 10:00 AM - 12:00 PM" />
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
