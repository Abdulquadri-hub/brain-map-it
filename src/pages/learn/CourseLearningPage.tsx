import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  PlayCircle,
  FileText,
  HelpCircle,
  ClipboardList,
  CheckCircle,
  Circle,
  Clock,
  BookOpen,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import type { Course, Module, Lesson, LessonType } from "@/types/course";

// Laravel Inertia.js Integration:
// import { usePage, router } from '@inertiajs/react'
//
// Replace mock data with:
// const { course, enrollment, currentLesson } = usePage<{
//   course: Course,
//   enrollment: CourseEnrollment,
//   currentLesson: Lesson
// }>().props
//
// For marking lesson complete:
// router.post(`/learn/${courseId}/lessons/${lessonId}/complete`)

const lessonTypeIcons: Record<LessonType, React.ReactNode> = {
  video: <PlayCircle className="h-4 w-4" />,
  document: <FileText className="h-4 w-4" />,
  quiz: <HelpCircle className="h-4 w-4" />,
  assignment: <ClipboardList className="h-4 w-4" />,
};

// Mock data
const mockCourse: Course = {
  id: "1",
  title: "Advanced Mathematics",
  description: "Master calculus, algebra, and geometry",
  category: "Mathematics",
  level: "Advanced",
  price: 25000,
  duration: "12 weeks",
  enrolledCount: 45,
  status: "active",
  learningType: "hybrid",
  allowsStudentChoice: true,
  pricing: { selfPacedPrice: 15000, liveClassPrice: 25000 },
  instructor: {
    id: "1",
    name: "Dr. Adaora Nwosu",
    title: "Mathematics Department Head",
  },
  modules: [
    {
      id: "1",
      courseId: "1",
      title: "Introduction to Calculus",
      order: 0,
      lessons: [
        { id: "1", moduleId: "1", title: "What is Calculus?", duration: "15 min", type: "video", order: 0, status: "published" },
        { id: "2", moduleId: "1", title: "Limits and Continuity", duration: "25 min", type: "video", order: 1, status: "published" },
        { id: "3", moduleId: "1", title: "Practice Problems", duration: "30 min", type: "document", order: 2, status: "published" },
        { id: "4", moduleId: "1", title: "Module 1 Quiz", duration: "15 min", type: "quiz", order: 3, status: "published" },
      ],
    },
    {
      id: "2",
      courseId: "1",
      title: "Differentiation",
      order: 1,
      lessons: [
        { id: "5", moduleId: "2", title: "Basic Derivatives", duration: "20 min", type: "video", order: 0, status: "published" },
        { id: "6", moduleId: "2", title: "Chain Rule", duration: "25 min", type: "video", order: 1, status: "published" },
        { id: "7", moduleId: "2", title: "Applications of Derivatives", duration: "30 min", type: "video", order: 2, status: "published" },
        { id: "8", moduleId: "2", title: "Differentiation Assignment", duration: "45 min", type: "assignment", order: 3, status: "published" },
      ],
    },
    {
      id: "3",
      courseId: "1",
      title: "Integration",
      order: 2,
      lessons: [
        { id: "9", moduleId: "3", title: "Indefinite Integrals", duration: "25 min", type: "video", order: 0, status: "published" },
        { id: "10", moduleId: "3", title: "Definite Integrals", duration: "25 min", type: "video", order: 1, status: "published" },
        { id: "11", moduleId: "3", title: "Integration Techniques", duration: "35 min", type: "video", order: 2, status: "published" },
      ],
    },
  ],
};

const mockCompletedLessons = new Set(["1", "2", "3"]);

const CourseLearningPage = () => {
  const { courseId, lessonId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(mockCompletedLessons);
  
  const course = mockCourse;
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const currentLesson = allLessons.find((l) => l.id === lessonId) || allLessons[0];
  const currentLessonIndex = allLessons.findIndex((l) => l.id === currentLesson.id);
  const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;
  
  const totalLessons = allLessons.length;
  const completedCount = completedLessons.size;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const handleMarkComplete = () => {
    // Laravel Inertia.js Integration:
    // router.post(`/learn/${courseId}/lessons/${currentLesson.id}/complete`)
    setCompletedLessons(new Set([...completedLessons, currentLesson.id]));
  };

  const handleMarkIncomplete = () => {
    const newCompleted = new Set(completedLessons);
    newCompleted.delete(currentLesson.id);
    setCompletedLessons(newCompleted);
  };

  const isLessonCompleted = completedLessons.has(currentLesson.id);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Sidebar Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "fixed lg:relative inset-y-0 left-0 z-40 w-80 bg-card border-r flex flex-col",
              "lg:translate-x-0"
            )}
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b">
              <Link
                to="/dashboard"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
              <h2 className="font-semibold line-clamp-2">{course.title}</h2>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <span>{completedCount}/{totalLessons} lessons</span>
                <span>•</span>
                <span>{progressPercent}% complete</span>
              </div>
              <Progress value={progressPercent} className="mt-3 h-2" />
            </div>

            {/* Curriculum */}
            <ScrollArea className="flex-1">
              <div className="p-4">
                <Accordion
                  type="multiple"
                  defaultValue={course.modules.map((m) => m.id)}
                  className="space-y-2"
                >
                  {course.modules.map((module, moduleIndex) => {
                    const moduleCompletedCount = module.lessons.filter((l) =>
                      completedLessons.has(l.id)
                    ).length;
                    const isModuleComplete = moduleCompletedCount === module.lessons.length;

                    return (
                      <AccordionItem
                        key={module.id}
                        value={module.id}
                        className="border rounded-lg px-3"
                      >
                        <AccordionTrigger className="hover:no-underline py-3">
                          <div className="flex items-center gap-3 text-left">
                            <div
                              className={cn(
                                "flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium",
                                isModuleComplete
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              {isModuleComplete ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                moduleIndex + 1
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium">{module.title}</div>
                              <div className="text-xs text-muted-foreground">
                                {moduleCompletedCount}/{module.lessons.length} complete
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-3">
                          <div className="space-y-1 ml-9">
                            {module.lessons.map((lesson) => {
                              const isActive = lesson.id === currentLesson.id;
                              const isCompleted = completedLessons.has(lesson.id);

                              return (
                                <Link
                                  key={lesson.id}
                                  to={`/learn/${courseId}/lesson/${lesson.id}`}
                                  className={cn(
                                    "flex items-center gap-3 p-2 rounded-lg text-sm transition-colors",
                                    isActive
                                      ? "bg-primary/10 text-primary"
                                      : "hover:bg-muted"
                                  )}
                                >
                                  <span className={cn(
                                    isCompleted ? "text-primary" : "text-muted-foreground"
                                  )}>
                                    {isCompleted ? (
                                      <CheckCircle className="h-4 w-4" />
                                    ) : (
                                      lessonTypeIcons[lesson.type]
                                    )}
                                  </span>
                                  <span className={cn(
                                    "flex-1 line-clamp-1",
                                    isCompleted && "text-muted-foreground"
                                  )}>
                                    {lesson.title}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {lesson.duration}
                                  </span>
                                </Link>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            </ScrollArea>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-background border-b px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex-1 mx-4 lg:mx-8">
              <h1 className="text-lg font-semibold line-clamp-1">{currentLesson.title}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                  {currentLesson.type}
                </Badge>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {currentLesson.duration}
                </span>
              </div>
            </div>
            <Button
              variant={isLessonCompleted ? "secondary" : "default"}
              onClick={isLessonCompleted ? handleMarkIncomplete : handleMarkComplete}
            >
              {isLessonCompleted ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Completed
                </>
              ) : (
                <>
                  <Circle className="h-4 w-4 mr-2" />
                  Mark Complete
                </>
              )}
            </Button>
          </div>
        </header>

        {/* Lesson Content */}
        <div className="flex-1 p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Video Player Placeholder */}
            {currentLesson.type === "video" && (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-8">
                <div className="text-center">
                  <PlayCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Video Player</p>
                  <p className="text-sm text-muted-foreground">
                    Connect your video hosting (Vimeo, YouTube, etc.)
                  </p>
                </div>
              </div>
            )}

            {/* Document Content Placeholder */}
            {currentLesson.type === "document" && (
              <div className="bg-card border rounded-lg p-8 mb-8">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <h2>Lesson Content</h2>
                  <p>
                    This is where the document content would be displayed. You can use
                    a rich text editor or Markdown renderer to display formatted content.
                  </p>
                  <h3>Example Section</h3>
                  <ul>
                    <li>Point one about the topic</li>
                    <li>Point two with more details</li>
                    <li>Point three to wrap up</li>
                  </ul>
                  <p>
                    Additional content and explanations would go here. The document
                    content is typically stored in the database and rendered dynamically.
                  </p>
                </div>
              </div>
            )}

            {/* Quiz Placeholder */}
            {currentLesson.type === "quiz" && (
              <div className="bg-card border rounded-lg p-8 mb-8 text-center">
                <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">Quiz: {currentLesson.title}</h2>
                <p className="text-muted-foreground mb-6">
                  Test your knowledge with this quiz
                </p>
                <Button>Start Quiz</Button>
              </div>
            )}

            {/* Assignment Placeholder */}
            {currentLesson.type === "assignment" && (
              <div className="bg-card border rounded-lg p-8 mb-8">
                <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">{currentLesson.title}</h2>
                <p className="text-muted-foreground mb-6">
                  Complete this assignment to demonstrate your understanding
                </p>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-medium mb-2">Instructions</h3>
                    <p className="text-sm text-muted-foreground">
                      Assignment instructions and requirements would be displayed here.
                    </p>
                  </div>
                  <Button>Submit Assignment</Button>
                </div>
              </div>
            )}

            {/* Lesson Description */}
            {currentLesson.description && (
              <div className="mb-8">
                <h3 className="font-semibold mb-2">About this lesson</h3>
                <p className="text-muted-foreground">{currentLesson.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <footer className="sticky bottom-0 bg-background border-t px-4 lg:px-8 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            {prevLesson ? (
              <Button variant="outline" asChild>
                <Link to={`/learn/${courseId}/lesson/${prevLesson.id}`}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Previous:</span> {prevLesson.title.slice(0, 20)}...
                </Link>
              </Button>
            ) : (
              <div />
            )}
            {nextLesson ? (
              <Button asChild>
                <Link to={`/learn/${courseId}/lesson/${nextLesson.id}`}>
                  <span className="hidden sm:inline">Next:</span> {nextLesson.title.slice(0, 20)}...
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            ) : (
              <Button variant="default" className="bg-primary">
                Complete Course
              </Button>
            )}
          </div>
        </footer>
      </main>
    </div>
  );
};

export default CourseLearningPage;
