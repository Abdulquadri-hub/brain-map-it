import { Helmet } from "react-helmet";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import Marketplace from "@/components/landing/Marketplace";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Teach - Launch Your Online School in Minutes | Education Platform for Africa</title>
        <meta 
          name="description" 
          content="The all-in-one platform for educators to create, manage, and grow thriving online academies. Like Shopify for education — simple, powerful, and built for African schools." 
        />
        <meta name="keywords" content="online school, LMS, learning management system, education platform, Africa, Nigeria, online academy, teaching platform" />
        <link rel="canonical" href="https://teach.com" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Teach - Launch Your Online School in Minutes" />
        <meta property="og:description" content="The all-in-one platform for African educators to create, manage, and grow thriving online academies." />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Teach - Launch Your Online School in Minutes" />
        <meta name="twitter:description" content="The all-in-one platform for African educators to create, manage, and grow thriving online academies." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Hero />
          <Features />
          <Testimonials />
          <Pricing />
          <Marketplace />
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
