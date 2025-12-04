import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Users, MapPin } from "lucide-react";

const schools = [
  {
    name: "Bright Stars Academy",
    category: "Primary Education",
    location: "Lagos, Nigeria",
    students: 450,
    rating: 4.9,
    courses: 24,
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=250&fit=crop",
  },
  {
    name: "Tech Academy Nigeria",
    category: "Web Development",
    location: "Abuja, Nigeria",
    students: 1200,
    rating: 4.8,
    courses: 18,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop",
  },
  {
    name: "Excel Learning Hub",
    category: "Business & Finance",
    location: "Accra, Ghana",
    students: 680,
    rating: 4.7,
    courses: 32,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop",
  },
];

const Marketplace = () => {
  return (
    <section id="marketplace" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
              Discover Schools
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Explore Our{" "}
              <span className="text-gradient-secondary">Marketplace</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Browse thousands of schools and courses. Find the perfect learning 
              experience for you or your children.
            </p>
          </div>
          <Button variant="outline" size="lg" className="self-start md:self-auto">
            Browse All Schools
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* School Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.map((school) => (
            <div
              key={school.name}
              className="group rounded-2xl bg-card border border-border overflow-hidden hover:shadow-lg hover:border-secondary/30 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={school.image}
                  alt={school.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-secondary/90 text-secondary-foreground text-xs font-medium">
                    {school.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-display font-bold text-xl text-foreground mb-2 group-hover:text-secondary transition-colors">
                  {school.name}
                </h3>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {school.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-primary fill-primary" />
                    {school.rating}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    {school.students.toLocaleString()} students
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {school.courses} courses
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Marketplace;
