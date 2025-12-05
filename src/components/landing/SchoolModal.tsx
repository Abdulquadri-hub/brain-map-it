import { X, Star, Users, MapPin, BookOpen, Clock, Award, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface School {
  name: string;
  category: string;
  location: string;
  students: number;
  rating: number;
  courses: number;
  image: string;
  description?: string;
  features?: string[];
  instructors?: number;
  established?: string;
}

interface SchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  school: School | null;
}

const SchoolModal = ({ isOpen, onClose, school }: SchoolModalProps) => {
  if (!school) return null;

  const defaultFeatures = [
    "Live interactive classes",
    "Downloadable course materials",
    "Certificate upon completion",
    "24/7 student support",
    "Mobile learning app",
    "Progress tracking dashboard"
  ];

  const defaultDescription = `${school.name} is a leading educational institution offering high-quality ${school.category.toLowerCase()} programs. With a strong focus on practical skills and student success, we've helped thousands of students achieve their learning goals.`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 bg-card border-border overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogClose className="absolute right-4 top-4 z-10 rounded-full bg-background/80 p-2 hover:bg-background transition-colors">
          <X className="h-5 w-5 text-foreground" />
          <span className="sr-only">Close</span>
        </DialogClose>

        {/* Hero Image */}
        <div className="relative h-56">
          <img
            src={school.image}
            alt={school.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          <div className="absolute bottom-4 left-6 right-6">
            <span className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-2">
              {school.category}
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              {school.name}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 rounded-xl bg-muted/50 text-center">
              <div className="flex items-center justify-center gap-1 text-primary mb-1">
                <Star className="w-4 h-4 fill-primary" />
                <span className="font-bold text-lg">{school.rating}</span>
              </div>
              <span className="text-xs text-muted-foreground">Rating</span>
            </div>
            <div className="p-3 rounded-xl bg-muted/50 text-center">
              <div className="flex items-center justify-center gap-1 text-secondary mb-1">
                <Users className="w-4 h-4" />
                <span className="font-bold text-lg">{school.students.toLocaleString()}</span>
              </div>
              <span className="text-xs text-muted-foreground">Students</span>
            </div>
            <div className="p-3 rounded-xl bg-muted/50 text-center">
              <div className="flex items-center justify-center gap-1 text-accent-foreground mb-1">
                <BookOpen className="w-4 h-4" />
                <span className="font-bold text-lg">{school.courses}</span>
              </div>
              <span className="text-xs text-muted-foreground">Courses</span>
            </div>
            <div className="p-3 rounded-xl bg-muted/50 text-center">
              <div className="flex items-center justify-center gap-1 text-foreground mb-1">
                <Award className="w-4 h-4" />
                <span className="font-bold text-lg">{school.instructors || 12}</span>
              </div>
              <span className="text-xs text-muted-foreground">Instructors</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-5 h-5 text-primary" />
            <span>{school.location}</span>
            {school.established && (
              <>
                <span className="mx-2">•</span>
                <Clock className="w-4 h-4" />
                <span>Est. {school.established}</span>
              </>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-foreground mb-2">About</h3>
            <p className="text-muted-foreground leading-relaxed">
              {school.description || defaultDescription}
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">What You'll Get</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {(school.features || defaultFeatures).map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="pt-4 border-t border-border flex flex-col sm:flex-row gap-3">
            <Button size="lg" className="flex-1 gradient-hero text-primary-foreground font-semibold">
              Enroll Now
            </Button>
            <Button variant="outline" size="lg" className="flex-1">
              View Courses
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SchoolModal;
