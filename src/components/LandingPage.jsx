import React from "react";
import { useState, useEffect } from "react";
import HeroSection from "@/components/landingPage/HeroSection";
import FeaturesSection from "@/components/landingPage/FeaturesSection";
import HowItWorks from "@/components/landingPage/HowItWorks";
import Testimonials from "@/components/landingPage/Testimonials";
import CallToAction from "@/components/landingPage/CallToAction";

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // small delay to ensure smooth initial animations
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 font-sans text-white transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}
    >
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
    </div>
  );
}
