import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Users,
  BookOpen,
  Star,
  Clock,
  GraduationCap,
  Phone,
  Mail,
  Globe,
} from "lucide-react";

// Laravel Inertia.js Integration:
// import { usePage, Link } from '@inertiajs/react'
// 
// Replace mock data with:
// const { school, courses, instructors } = usePage<{
//   school: School,
//   courses: Course[],
//   instructors: Instructor[]
// }>().props
//
// Use Inertia Link for navigation:
// <Link href={`/school/${school.slug}/course/${course.id}`}>

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  level: string;
  enrolledCount: number;
  image: string;
  instructor: {
    name: string;
    avatar: string;
  };
}

interface Instructor {
  id: string;
  name: string;
  avatar: string;
  title: string;
  bio: string;
  coursesCount: number;
}

// Mock data - will be replaced by Inertia props
const mockSchool = {
  id: "1",
  name: "Bright Stars Academy",
  slug: "brightstars",
  logo: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200",
  coverImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200",
  description: "A premier learning institution dedicated to nurturing young minds with innovative teaching methods and a supportive learning environment.",
  location: "Lagos, Nigeria",
  phone: "+234 801 234 5678",
  email: "info@brightstars.edu",
  website: "www.brightstars.edu",
  studentCount: 450,
  courseCount: 24,
  rating: 4.8,
  reviewCount: 156,
  established: 2015,
  categories: ["Mathematics", "Sciences", "Languages", "Arts"],
};

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
    instructor: { name: "Dr. Adaora Nwosu", avatar: "" },
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
    instructor: { name: "Mrs. Folake Adekunle", avatar: "" },
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
    instructor: { name: "Prof. Chinedu Obi", avatar: "" },
  },
];

const mockInstructors: Instructor[] = [
  {
    id: "1",
    name: "Dr. Adaora Nwosu",
    avatar: "",
    title: "Mathematics Department Head",
    bio: "15+ years of experience teaching mathematics at various levels",
    coursesCount: 5,
  },
  {
    id: "2",
    name: "Mrs. Folake Adekunle",
    avatar: "",
    title: "Senior English Instructor",
    bio: "Certified TEFL instructor with a passion for literature",
    coursesCount: 3,
  },
  {
    id: "3",
    name: "Prof. Chinedu Obi",
    avatar: "",
    title: "Physics & Science Lead",
    bio: "PhD in Physics with research focus on renewable energy",
    coursesCount: 4,
  },
];

const SchoolPublicPage = () => {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState("courses");

  // Laravel Inertia.js Integration:
  // const { school, courses, instructors } = usePage().props

  const school = mockSchool;
  const courses = mockCourses;
  const instructors = mockInstructors;

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80">
        <img
          src={school.coverImage}
          alt={school.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* School Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-20 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
              <AvatarImage src={school.logo} alt={school.name} />
              <AvatarFallback className="text-2xl">
                {school.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 pt-4">
              <h1 className="text-3xl font-bold text-foreground">{school.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {school.location}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {school.studentCount} students
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {school.courseCount} courses
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  {school.rating} ({school.reviewCount} reviews)
                </span>
              </div>
              <p className="mt-4 text-muted-foreground max-w-2xl">
                {school.description}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button size="lg" asChild>
                <Link to={`/school/${slug}/enroll`}>Enroll Now</Link>
              </Button>
              <Button variant="outline" size="lg">
                Contact School
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <Card className="mb-8">
          <CardContent className="py-4">
            <div className="flex flex-wrap gap-6">
              <span className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {school.phone}
              </span>
              <span className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {school.email}
              </span>
              <span className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground" />
                {school.website}
              </span>
              <span className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Established {school.established}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {school.categories.map((category) => (
            <Badge key={category} variant="secondary">
              {category}
            </Badge>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
          <TabsList>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="instructors">Instructors</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-48 w-full object-cover"
                  />
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{course.level}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {course.duration}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={course.instructor.avatar} />
                          <AvatarFallback className="text-xs">
                            {course.instructor.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{course.instructor.name}</span>
                      </div>
                      <span className="font-semibold">
                        ₦{course.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {course.enrolledCount} enrolled
                      </span>
                    </div>
                    <Button className="w-full mt-4" asChild>
                      <Link to={`/school/${slug}/course/${course.id}`}>
                        View Course
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="instructors" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {instructors.map((instructor) => (
                <Card key={instructor.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-20 w-20 mb-4">
                        <AvatarImage src={instructor.avatar} />
                        <AvatarFallback className="text-xl">
                          {instructor.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold">{instructor.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {instructor.title}
                      </p>
                      <p className="text-sm mt-2">{instructor.bio}</p>
                      <Badge variant="secondary" className="mt-4">
                        <GraduationCap className="h-3 w-3 mr-1" />
                        {instructor.coursesCount} courses
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <Card>
              <CardContent className="py-6">
                <h3 className="text-xl font-semibold mb-4">About {school.name}</h3>
                <p className="text-muted-foreground">{school.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {school.studentCount}
                    </div>
                    <div className="text-sm text-muted-foreground">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {school.courseCount}
                    </div>
                    <div className="text-sm text-muted-foreground">Courses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {instructors.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Instructors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {new Date().getFullYear() - school.established}+
                    </div>
                    <div className="text-sm text-muted-foreground">Years</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SchoolPublicPage;
