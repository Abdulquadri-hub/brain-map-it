import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  ArrowLeft,
  Clock,
  Users,
  BookOpen,
  Star,
  PlayCircle,
  FileText,
  CheckCircle,
  Calendar,
  Video,
  Zap,
  MessageCircle,
} from "lucide-react";

// Laravel Inertia.js Integration:
// import { usePage, Link, router } from '@inertiajs/react'
// 
// Replace mock data with:
// const { course, school, modules } = usePage<{
//   course: Course,
//   school: School,
//   modules: Module[]
// }>().props
//
// For enrollment:
// router.visit(`/school/${school.slug}/enroll?course=${course.id}`)

interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: "video" | "document" | "quiz";
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

// Mock data - will be replaced by Inertia props
const mockCourse = {
  id: "1",
  title: "Advanced Mathematics",
  description: "Master calculus, algebra, and geometry with practical applications. This comprehensive course covers everything from basic principles to advanced problem-solving techniques used in real-world scenarios.",
  learningType: "hybrid" as const,
  pricing: {
    selfPacedPrice: 15000,
    liveClassPrice: 25000,
  },
  duration: "12 weeks",
  level: "Advanced",
  enrolledCount: 45,
  rating: 4.8,
  reviewCount: 32,
  image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800",
  instructor: {
    id: "1",
    name: "Dr. Adaora Nwosu",
    avatar: "",
    title: "Mathematics Department Head",
    bio: "15+ years of experience teaching mathematics at various levels. PhD in Applied Mathematics from University of Lagos.",
  },
  features: [
    "24/7 access to course materials",
    "Live weekly sessions",
    "Personalized feedback on assignments",
    "Certificate upon completion",
    "Lifetime access to recordings",
  ],
  requirements: [
    "Basic understanding of algebra",
    "Access to a computer or tablet",
    "Commitment to 5-6 hours per week",
  ],
  schedule: {
    startDate: "2024-02-01",
    endDate: "2024-04-26",
    classTime: "Saturdays, 10:00 AM - 12:00 PM",
  },
  liveSession: {
    platform: "google_meet" as const,
    dayOfWeek: "saturday",
    time: "10:00",
  },
};

const mockModules: Module[] = [
  {
    id: "1",
    title: "Introduction to Calculus",
    lessons: [
      { id: "1", title: "What is Calculus?", duration: "15 min", type: "video" },
      { id: "2", title: "Limits and Continuity", duration: "25 min", type: "video" },
      { id: "3", title: "Practice Problems", duration: "30 min", type: "document" },
    ],
  },
  {
    id: "2",
    title: "Differentiation",
    lessons: [
      { id: "4", title: "Basic Derivatives", duration: "20 min", type: "video" },
      { id: "5", title: "Chain Rule", duration: "25 min", type: "video" },
      { id: "6", title: "Applications of Derivatives", duration: "30 min", type: "video" },
      { id: "7", title: "Quiz: Differentiation", duration: "15 min", type: "quiz" },
    ],
  },
  {
    id: "3",
    title: "Integration",
    lessons: [
      { id: "8", title: "Indefinite Integrals", duration: "25 min", type: "video" },
      { id: "9", title: "Definite Integrals", duration: "25 min", type: "video" },
      { id: "10", title: "Integration Techniques", duration: "35 min", type: "video" },
    ],
  },
];

const mockSchool = {
  slug: "brightstars",
  name: "Bright Stars Academy",
};

const CourseDetailPage = () => {
  const { slug, courseId } = useParams();
  const [selectedTab, setSelectedTab] = useState("overview");

  // Laravel Inertia.js Integration:
  // const { course, school, modules } = usePage().props

  const course = mockCourse;
  const modules = mockModules;
  const school = mockSchool;

  const totalLessons = modules.reduce((acc, mod) => acc + mod.lessons.length, 0);

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return <PlayCircle className="h-4 w-4" />;
      case "document":
        return <FileText className="h-4 w-4" />;
      case "quiz":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to={`/school/${slug}`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {school.name}
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Image */}
            <div className="rounded-lg overflow-hidden">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>

            {/* Course Info */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="outline">{course.level}</Badge>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 text-yellow-500" />
                  {course.rating} ({course.reviewCount} reviews)
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
              <p className="text-muted-foreground">{course.description}</p>
            </div>

            {/* Course Stats */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <span>{totalLessons} lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span>{course.enrolledCount} enrolled</span>
              </div>
            </div>

            {/* Instructor */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={course.instructor.avatar} />
                    <AvatarFallback className="text-lg">
                      {course.instructor.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{course.instructor.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {course.instructor.title}
                    </p>
                    <p className="text-sm mt-2">{course.instructor.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Curriculum */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Course Curriculum</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  {modules.map((module, index) => (
                    <AccordionItem key={module.id} value={module.id}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3 text-left">
                          <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
                            {index + 1}
                          </span>
                          <div>
                            <div className="font-medium">{module.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {module.lessons.length} lessons
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pl-11">
                          {module.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-muted-foreground">
                                  {getLessonIcon(lesson.type)}
                                </span>
                                <span className="text-sm">{lesson.title}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {lesson.duration}
                              </span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {course.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Enrollment Card */}
              <Card className="overflow-hidden">
                {course.learningType === "hybrid" && (
                  <div className="bg-primary/10 px-4 py-2 text-center">
                    <Badge variant="outline" className="border-primary text-primary">
                      <Zap className="h-3 w-3 mr-1" />
                      Flexible Learning
                    </Badge>
                  </div>
                )}
                <CardContent className="pt-6">
                  {course.learningType === "hybrid" ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Starting from</div>
                        <div className="text-3xl font-bold">
                          ₦{course.pricing.selfPacedPrice.toLocaleString()}
                        </div>
                      </div>
                      
                      {/* Learning Options Preview */}
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Self-Paced</span>
                          </div>
                          <span className="text-sm font-semibold">
                            ₦{course.pricing.selfPacedPrice.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-primary/20">
                          <div className="flex items-center gap-2">
                            <Video className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">Live Classes</span>
                            <Badge variant="secondary" className="text-xs">Popular</Badge>
                          </div>
                          <span className="text-sm font-semibold">
                            ₦{course.pricing.liveClassPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      
                      <Button className="w-full" size="lg" asChild>
                        <Link to={`/school/${slug}/enroll?course=${courseId}`}>
                          View Options & Enroll
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="text-3xl font-bold mb-4">
                        ₦{(course.pricing.selfPacedPrice || course.pricing.liveClassPrice).toLocaleString()}
                      </div>
                      <Button className="w-full mb-4" size="lg" asChild>
                        <Link to={`/school/${slug}/enroll?course=${courseId}`}>
                          Enroll Now
                        </Link>
                      </Button>
                    </>
                  )}
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    30-day money-back guarantee
                  </p>
                </CardContent>
              </Card>

              {/* Live Sessions Info (for hybrid/live courses) */}
              {(course.learningType === "hybrid" || course.learningType === "live_classes") && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Video className="h-5 w-5 text-primary" />
                      Live Classes Include
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Weekly live sessions</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      <span>WhatsApp study group</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Real-time Q&A with instructor</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Start Date</div>
                    <div className="font-medium">
                      {new Date(course.schedule.startDate).toLocaleDateString("en-NG", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">End Date</div>
                    <div className="font-medium">
                      {new Date(course.schedule.endDate).toLocaleDateString("en-NG", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Class Time</div>
                    <div className="font-medium">{course.schedule.classTime}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What's Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {course.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
