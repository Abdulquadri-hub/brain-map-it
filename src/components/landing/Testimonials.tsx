import { useState } from "react";
import { Play, Quote, Star } from "lucide-react";
import VideoModal from "./VideoModal";

const videoTestimonials = [
  {
    id: 1,
    name: "Tunde Adeyemi",
    role: "Founder, Bright Stars Academy",
    location: "Lagos, Nigeria",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1",
    quote: "Teach helped me scale from 20 students to over 400 in just 8 months. The platform handles everything so I can focus on teaching.",
    stats: { students: 450, revenue: "₦2.5M/month" },
  },
  {
    id: 2,
    name: "Amara Okafor",
    role: "CEO, Code Masters Academy",
    location: "Abuja, Nigeria",
    thumbnail: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=300&fit=crop&crop=face",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1",
    quote: "The multi-tenant architecture means I can manage 3 different academies from one dashboard. Game changer for my education business.",
    stats: { students: 1200, revenue: "₦5.2M/month" },
  },
  {
    id: 3,
    name: "Kwame Mensah",
    role: "Director, Excel Learning Hub",
    location: "Accra, Ghana",
    thumbnail: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop&crop=face",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1",
    quote: "Finally, a platform built for African educators. Paystack integration works flawlessly, and my students love the mobile experience.",
    stats: { students: 680, revenue: "GH₵45K/month" },
  },
];

const successStories = [
  {
    name: "Chiamaka Eze",
    age: 14,
    achievement: "Scored 95% in WAEC Mathematics",
    story: "Started struggling with fractions in Primary 5. After joining Bright Stars Academy on Teach, I went from failing to top of my class.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
    school: "Bright Stars Academy",
  },
  {
    name: "Ibrahim Suleiman",
    age: 24,
    achievement: "Landed junior developer job at Paystack",
    story: "Completed the Full-Stack Web Development course at Tech Academy Nigeria. Within 3 months of graduating, I got my dream job.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
    school: "Tech Academy Nigeria",
  },
  {
    name: "Fatima Bello",
    age: 32,
    achievement: "Started her own tutoring business",
    story: "Learned digital marketing on Teach, now running a successful online tutoring business with 50+ students of my own.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    school: "Business Mastery Academy",
  },
  {
    name: "David Okonkwo",
    age: 17,
    achievement: "Won National Science Competition",
    story: "The interactive physics lessons and live classes helped me understand concepts I struggled with for years. Now I want to study engineering.",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=face",
    school: "STEM Excellence Hub",
  },
];

const Testimonials = () => {
  const [activeVideo, setActiveVideo] = useState<typeof videoTestimonials[0] | null>(null);

  return (
    <section className="py-20 md:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
            Success Stories
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Trusted by{" "}
            <span className="text-gradient-primary">African Educators</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Hear from school owners and students who transformed their education journey with Teach.
          </p>
        </div>

        {/* Video Testimonials */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {videoTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="group rounded-2xl bg-card border border-border overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300"
            >
              {/* Video Thumbnail */}
              <div 
                className="relative h-48 overflow-hidden cursor-pointer"
                onClick={() => setActiveVideo(testimonial)}
              >
                <img
                  src={testimonial.thumbnail}
                  alt={testimonial.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center group-hover:bg-foreground/50 transition-colors">
                  <div className="w-16 h-16 rounded-full gradient-hero flex items-center justify-center shadow-glow transform group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 text-primary-foreground ml-1" fill="currentColor" />
                  </div>
                </div>
                {/* Stats Badge */}
                <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                  <span className="px-2 py-1 rounded-full bg-secondary/90 text-secondary-foreground text-xs font-medium">
                    {testimonial.stats.students} students
                  </span>
                  <span className="px-2 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">
                    {testimonial.stats.revenue}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Quote className="w-8 h-8 text-primary/30 flex-shrink-0" />
                  <p className="text-muted-foreground text-sm leading-relaxed italic">
                    "{testimonial.quote}"
                  </p>
                </div>
                
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <img
                    src={testimonial.thumbnail}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">
                      {testimonial.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role} • {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Student Success Stories */}
        <div className="relative">
          <div className="text-center mb-12">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              Student Success Stories
            </h3>
            <p className="text-muted-foreground">
              Real results from students learning on Teach-powered schools
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {successStories.map((story, index) => (
              <div
                key={story.name}
                className="group p-6 rounded-2xl bg-gradient-to-br from-card to-muted/30 border border-border hover:shadow-lg hover:border-secondary/30 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Avatar & Rating */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <img
                      src={story.image}
                      alt={story.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-secondary/30"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full gradient-secondary flex items-center justify-center">
                      <Star className="w-3 h-3 text-secondary-foreground" fill="currentColor" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {story.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Age {story.age} • {story.school}
                    </p>
                  </div>
                </div>

                {/* Achievement Badge */}
                <div className="mb-4">
                  <span className="inline-block px-3 py-1.5 rounded-lg bg-accent text-accent-foreground text-xs font-semibold">
                    🏆 {story.achievement}
                  </span>
                </div>

                {/* Story */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  "{story.story}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 pt-12 border-t border-border">
          <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-foreground">4.9/5</div>
              <div className="text-sm">Average Rating</div>
            </div>
            <div className="w-px h-12 bg-border hidden sm:block" />
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-foreground">50,000+</div>
              <div className="text-sm">Course Completions</div>
            </div>
            <div className="w-px h-12 bg-border hidden sm:block" />
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-foreground">98%</div>
              <div className="text-sm">Satisfaction Rate</div>
            </div>
            <div className="w-px h-12 bg-border hidden sm:block" />
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-foreground">₦2.5B+</div>
              <div className="text-sm">Paid to Educators</div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={!!activeVideo}
        onClose={() => setActiveVideo(null)}
        videoUrl={activeVideo?.videoUrl || ""}
        title={activeVideo?.name || ""}
      />
    </section>
  );
};

export default Testimonials;
