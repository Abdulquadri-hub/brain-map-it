import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";

// Laravel Inertia.js Integration:
// import { usePage } from '@inertiajs/react'
// 
// Replace mock data with:
// const { courses } = usePage<{ courses: Course[] }>().props

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  level: string;
  enrolledCount: number;
  image: string;
}

const mockCourses: Course[] = [
  {
    id: "1",
    title: "Advanced Mathematics",
    description: "Master calculus, algebra, and geometry with practical applications",
    price: 25000,
    duration: "12 weeks",
    level: "Advanced",
    enrolledCount: 45,
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
  },
  {
    id: "2",
    title: "English Language & Literature",
    description: "Improve your English proficiency with comprehensive lessons",
    price: 20000,
    duration: "10 weeks",
    level: "Intermediate",
    enrolledCount: 62,
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400",
  },
  {
    id: "3",
    title: "Physics Fundamentals",
    description: "Explore the laws of nature through experiments and theory",
    price: 22000,
    duration: "12 weeks",
    level: "Beginner",
    enrolledCount: 38,
    image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400",
  },
  {
    id: "4",
    title: "Chemistry Basics",
    description: "Learn the fundamentals of chemistry and chemical reactions",
    price: 22000,
    duration: "10 weeks",
    level: "Beginner",
    enrolledCount: 41,
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400",
  },
  {
    id: "5",
    title: "Biology for Beginners",
    description: "Discover the science of life and living organisms",
    price: 20000,
    duration: "10 weeks",
    level: "Beginner",
    enrolledCount: 55,
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400",
  },
];

interface CourseSelectionStepProps {
  selectedCourses: string[];
  preselectedCourseId: string | null;
  onUpdate: (selectedCourses: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const CourseSelectionStep = ({
  selectedCourses,
  preselectedCourseId,
  onUpdate,
  onNext,
  onBack,
}: CourseSelectionStepProps) => {
  // Laravel Inertia.js Integration:
  // const { courses } = usePage().props
  const courses = mockCourses;

  const toggleCourse = (courseId: string) => {
    const updated = selectedCourses.includes(courseId)
      ? selectedCourses.filter((id) => id !== courseId)
      : [...selectedCourses, courseId];
    onUpdate(updated);
  };

  const totalPrice = selectedCourses.reduce((sum, courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return sum + (course?.price || 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Select Courses</h2>
        <p className="text-muted-foreground mt-2">
          Choose the courses you want to enroll in
        </p>
      </div>

      <div className="space-y-4">
        {courses.map((course) => {
          const isSelected = selectedCourses.includes(course.id);
          const isPreselected = course.id === preselectedCourseId;

          return (
            <Card
              key={course.id}
              className={`cursor-pointer transition-all ${
                isSelected
                  ? "border-primary ring-2 ring-primary/20"
                  : "hover:border-muted-foreground/50"
              }`}
              onClick={() => toggleCourse(course.id)}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="flex items-start pt-1">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleCourse(course.id)}
                    />
                  </div>
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-20 w-28 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold flex items-center gap-2">
                          {course.title}
                          {isPreselected && (
                            <Badge variant="secondary" className="text-xs">
                              Selected
                            </Badge>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {course.description}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-semibold">
                          ₦{course.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {course.level}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {course.duration}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {course.enrolledCount} enrolled
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-muted-foreground">
                {selectedCourses.length} course(s) selected
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="text-xl font-bold">
                ₦{totalPrice.toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={selectedCourses.length === 0}>
          Continue to Payment
        </Button>
      </div>
    </div>
  );
};

export default CourseSelectionStep;
