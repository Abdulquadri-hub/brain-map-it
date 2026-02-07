import { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Search,
  Star,
  Users,
  MapPin,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import SchoolModal, { School } from "@/components/landing/SchoolModal";
import Footer from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";

/**
 * Marketplace - School Discovery with Verification Badges
 * 
 * Laravel Inertia.js Integration:
 * - Use usePage() to receive schools from MarketplaceController@index
 * - Replace allSchools with Inertia props
 */

interface MarketplaceSchool extends School {
  verified?: boolean;
}

const categories = [
  "All Categories",
  "Primary Education",
  "Secondary Education",
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Business & Finance",
  "Languages",
  "STEM",
  "Arts & Design",
  "Health & Wellness",
];

const locations = [
  "All Locations",
  "Lagos, Nigeria",
  "Abuja, Nigeria",
  "Accra, Ghana",
  "Nairobi, Kenya",
  "Cape Town, SA",
  "Johannesburg, SA",
  "Dar es Salaam, TZ",
];

const allSchools: MarketplaceSchool[] = [
  {
    name: "Bright Stars Academy",
    category: "Primary Education",
    location: "Lagos, Nigeria",
    students: 450,
    rating: 4.9,
    courses: 24,
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=250&fit=crop",
    description: "Premier primary education institution dedicated to nurturing young minds.",
    instructors: 15,
    established: "2019",
    verified: true,
  },
  {
    name: "Tech Academy Nigeria",
    category: "Web Development",
    location: "Abuja, Nigeria",
    students: 1200,
    rating: 4.8,
    courses: 18,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop",
    description: "Leading coding bootcamp transforming beginners into job-ready developers.",
    instructors: 22,
    established: "2018",
    verified: true,
  },
  {
    name: "Excel Learning Hub",
    category: "Business & Finance",
    location: "Accra, Ghana",
    students: 680,
    rating: 4.7,
    courses: 32,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop",
    description: "Empowering entrepreneurs with practical business skills.",
    instructors: 18,
    established: "2020",
    verified: false,
  },
  {
    name: "Lingua Africa",
    category: "Languages",
    location: "Nairobi, Kenya",
    students: 890,
    rating: 4.9,
    courses: 15,
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=250&fit=crop",
    description: "Immersive language courses connecting cultures through communication.",
    instructors: 25,
    established: "2017",
    verified: true,
  },
  {
    name: "STEM Excellence Hub",
    category: "STEM",
    location: "Lagos, Nigeria",
    students: 560,
    rating: 4.8,
    courses: 28,
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=250&fit=crop",
    description: "Preparing the next generation of African scientists and engineers.",
    instructors: 20,
    established: "2019",
    verified: true,
  },
  {
    name: "Creative Arts Academy",
    category: "Arts & Design",
    location: "Cape Town, SA",
    students: 340,
    rating: 4.6,
    courses: 21,
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=250&fit=crop",
    description: "Nurturing artistic talent across graphic design and digital art.",
    instructors: 14,
    established: "2021",
    verified: false,
  },
  {
    name: "Code Masters Academy",
    category: "Mobile Development",
    location: "Abuja, Nigeria",
    students: 780,
    rating: 4.7,
    courses: 14,
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
    description: "Specialized in iOS and Android app development training.",
    instructors: 16,
    established: "2020",
    verified: false,
  },
  {
    name: "Data Insights Africa",
    category: "Data Science",
    location: "Johannesburg, SA",
    students: 520,
    rating: 4.8,
    courses: 22,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
    description: "Comprehensive data science and analytics training programs.",
    instructors: 19,
    established: "2019",
    verified: true,
  },
  {
    name: "Future Leaders Academy",
    category: "Secondary Education",
    location: "Lagos, Nigeria",
    students: 920,
    rating: 4.9,
    courses: 45,
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=250&fit=crop",
    description: "Preparing students for university and beyond with excellence.",
    instructors: 35,
    established: "2016",
    verified: true,
  },
  {
    name: "Wellness Institute Africa",
    category: "Health & Wellness",
    location: "Nairobi, Kenya",
    students: 410,
    rating: 4.5,
    courses: 18,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=250&fit=crop",
    description: "Holistic health and wellness certification programs.",
    instructors: 12,
    established: "2021",
    verified: false,
  },
  {
    name: "African Business School",
    category: "Business & Finance",
    location: "Dar es Salaam, TZ",
    students: 650,
    rating: 4.6,
    courses: 26,
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=250&fit=crop",
    description: "Executive education and MBA programs for African leaders.",
    instructors: 21,
    established: "2018",
    verified: true,
  },
  {
    name: "Digital Arts Studio",
    category: "Arts & Design",
    location: "Lagos, Nigeria",
    students: 380,
    rating: 4.7,
    courses: 16,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
    description: "Animation, 3D modeling, and digital illustration courses.",
    instructors: 11,
    established: "2020",
    verified: false,
  },
];

const ITEMS_PER_PAGE = 6;

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [sortBy, setSortBy] = useState("rating");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  const filteredAndSortedSchools = useMemo(() => {
    let result = [...allSchools];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (school) =>
          school.name.toLowerCase().includes(query) ||
          school.category.toLowerCase().includes(query) ||
          school.location.toLowerCase().includes(query)
      );
    }

    if (categoryFilter !== "All Categories") {
      result = result.filter((school) => school.category === categoryFilter);
    }

    if (locationFilter !== "All Locations") {
      result = result.filter((school) => school.location === locationFilter);
    }

    switch (sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "students":
        result.sort((a, b) => b.students - a.students);
        break;
      case "courses":
        result.sort((a, b) => b.courses - a.courses);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [searchQuery, categoryFilter, locationFilter, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedSchools.length / ITEMS_PER_PAGE);
  const paginatedSchools = filteredAndSortedSchools.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("All Categories");
    setLocationFilter("All Locations");
    setSortBy("rating");
    setCurrentPage(1);
  };

  return (
    <>
      <Helmet>
        <title>Marketplace - Discover Schools | Teach LMS</title>
        <meta name="description" content="Browse thousands of schools and courses on Teach. Find the perfect learning experience across Africa." />
      </Helmet>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center shadow-md group-hover:shadow-glow transition-shadow duration-300">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl text-foreground">Teach</span>
            </Link>
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16 min-h-screen bg-background">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-10">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Explore the <span className="text-gradient-secondary">Marketplace</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Discover {allSchools.length}+ schools offering world-class education across Africa.
              Find your perfect learning path today.
            </p>
          </div>

          {/* Filters */}
          <div className="bg-card border border-border rounded-2xl p-4 md:p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search schools, categories, or locations..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="pl-10 h-12 bg-background"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <Select value={categoryFilter} onValueChange={(value) => { setCategoryFilter(value); setCurrentPage(1); }}>
                  <SelectTrigger className="w-[180px] h-12 bg-background"><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}
                  </SelectContent>
                </Select>
                <Select value={locationFilter} onValueChange={(value) => { setLocationFilter(value); setCurrentPage(1); }}>
                  <SelectTrigger className="w-[180px] h-12 bg-background"><SelectValue placeholder="Location" /></SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (<SelectItem key={loc} value={loc}>{loc}</SelectItem>))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px] h-12 bg-background">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="students">Most Students</SelectItem>
                    <SelectItem value="courses">Most Courses</SelectItem>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={resetFilters} className="h-12">Reset</Button>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{paginatedSchools.length}</span> of{" "}
                <span className="font-medium text-foreground">{filteredAndSortedSchools.length}</span> schools
              </p>
            </div>
          </div>

          {/* Schools Grid */}
          {paginatedSchools.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {paginatedSchools.map((school) => (
                <div
                  key={school.name}
                  onClick={() => setSelectedSchool(school)}
                  className="group rounded-2xl bg-card border border-border overflow-hidden hover:shadow-lg hover:border-secondary/30 transition-all duration-300 cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img src={school.image} alt={school.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <span className="inline-block px-3 py-1 rounded-full bg-secondary/90 text-secondary-foreground text-xs font-medium">
                        {school.category}
                      </span>
                      {school.verified && (
                        <Badge className="bg-primary/90 text-primary-foreground border-0 gap-1">
                          <ShieldCheck className="h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
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
                      <span className="text-sm font-medium text-foreground">{school.courses} courses</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-card border border-border rounded-2xl">
              <p className="text-xl text-muted-foreground mb-4">No schools found matching your criteria</p>
              <Button onClick={resetFilters}>Clear Filters</Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" size="icon" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  onClick={() => handlePageChange(page)}
                  className={currentPage === page ? "gradient-hero" : ""}
                >
                  {page}
                </Button>
              ))}
              <Button variant="outline" size="icon" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <SchoolModal isOpen={!!selectedSchool} onClose={() => setSelectedSchool(null)} school={selectedSchool} />
    </>
  );
};

export default Marketplace;
