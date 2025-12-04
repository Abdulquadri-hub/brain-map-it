import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Users, BookOpen, Globe } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 gradient-surface" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse-soft" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-accent-foreground/20 text-accent-foreground text-sm font-medium mb-8 animate-slide-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            The #1 Education Platform for Africa
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-slide-up">
            Launch Your Online School{" "}
            <span className="text-gradient-primary">in Minutes</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up-delayed">
            The all-in-one platform for educators to create, manage, and grow thriving online academies. 
            Like Shopify for education — simple, powerful, and built for African schools.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up-delayed">
            <Button variant="hero" size="xl" className="w-full sm:w-auto">
              Start Your School Free
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="xl" className="w-full sm:w-auto">
              <Play className="w-5 h-5" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto animate-scale-in">
            <div className="text-center p-4 rounded-2xl bg-card shadow-sm border border-border">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="font-display text-2xl md:text-3xl font-bold text-foreground">
                10K+
              </div>
              <div className="text-sm text-muted-foreground">
                Active Schools
              </div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-card shadow-sm border border-border">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-xl bg-secondary/10">
                <BookOpen className="w-6 h-6 text-secondary" />
              </div>
              <div className="font-display text-2xl md:text-3xl font-bold text-foreground">
                500K+
              </div>
              <div className="text-sm text-muted-foreground">
                Students Learning
              </div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-card shadow-sm border border-border">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <div className="font-display text-2xl md:text-3xl font-bold text-foreground">
                15+
              </div>
              <div className="text-sm text-muted-foreground">
                African Countries
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
