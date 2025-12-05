import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Users, MapPin } from "lucide-react";
import SchoolModal, { School } from "./SchoolModal";

const categories = [
  "All",
  "Primary Education",
  "Web Development",
  "Business & Finance",
  "Languages",
  "STEM",
  "Arts & Design",
];

const schools: School[] = [
  {
    name: "Bright Stars Academy",
    category: "Primary Education",
    location: "Lagos, Nigeria",
    students: 450,
    rating: 4.9,
    courses: 24,
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=250&fit=crop",
    description: "Bright Stars Academy is a premier primary education institution dedicated to nurturing young minds through innovative teaching methods and a supportive learning environment.",
    instructors: 15,
    established: "2019",
  },
  {
    name: "Tech Academy Nigeria",
    category: "Web Development",
    location: "Abuja, Nigeria",
    students: 1200,
    rating: 4.8,
    courses: 18,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop",
    description: "Tech Academy Nigeria is the leading coding bootcamp in West Africa, transforming beginners into job-ready developers with hands-on project-based learning.",
    instructors: 22,
    established: "2018",
  },
  {
    name: "Excel Learning Hub",
    category: "Business & Finance",
    location: "Accra, Ghana",
    students: 680,
    rating: 4.7,
    courses: 32,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop",
    description: "Excel Learning Hub empowers entrepreneurs and professionals with practical business skills, from financial literacy to advanced management strategies.",
    instructors: 18,
    established: "2020",
  },
  {
    name: "Lingua Africa",
    category: "Languages",
    location: "Nairobi, Kenya",
    students: 890,
    rating: 4.9,
    courses: 15,
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=250&fit=crop",
    description: "Lingua Africa offers immersive language courses in African and international languages, connecting cultures through communication.",
    instructors: 25,
    established: "2017",
  },
  {
    name: "STEM Excellence Hub",
    category: "STEM",
    location: "Lagos, Nigeria",
    students: 560,
    rating: 4.8,
    courses: 28,
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=250&fit=crop",
    description: "STEM Excellence Hub prepares the next generation of African scientists and engineers with cutting-edge curriculum and hands-on laboratory experiences.",
    instructors: 20,
    established: "2019",
  },
  {
    name: "Creative Arts Academy",
    category: "Arts & Design",
    location: "Cape Town, SA",
    students: 340,
    rating: 4.6,
    courses: 21,
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=250&fit=crop",
    description: "Creative Arts Academy nurtures artistic talent across graphic design, digital art, photography, and traditional fine arts with industry-experienced instructors.",
    instructors: 14,
    established: "2021",
  },
];

const Marketplace = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  const filteredSchools = activeFilter === "All" 
    ? schools 
    : schools.filter(school => school.category === activeFilter);

  return (
    <section id="marketplace" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
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

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === category
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* School Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchools.map((school) => (
            <div
              key={school.name}
              onClick={() => setSelectedSchool(school)}
              className="group rounded-2xl bg-card border border-border overflow-hidden hover:shadow-lg hover:border-secondary/30 transition-all duration-300 cursor-pointer"
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

        {/* Empty State */}
        {filteredSchools.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No schools found in this category. Try a different filter.
            </p>
          </div>
        )}
      </div>

      {/* School Detail Modal */}
      <SchoolModal
        isOpen={!!selectedSchool}
        onClose={() => setSelectedSchool(null)}
        school={selectedSchool}
      />
    </section>
  );
};

export default Marketplace;
