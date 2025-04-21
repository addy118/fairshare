import React from "react";

import { useState, useEffect, useRef } from "react";
import {
  CreditCard,
  Users,
  SplitSquareVertical,
  LineChart,
  Mail,
  FileText,
  Facebook,
  Twitter,
  Instagram,
  ChevronLeft,
  ChevronRight,
  Star,
  Quote,
  CheckCircle,
  Github,
  Linkedin,
} from "lucide-react";
import BackgroundAnimation from "@/components/landingPage/BgAnimation";
import Navbar from "@/components/landingPage/Navbar";
import HeroSection from "@/components/landingPage/HeroSection";
import FeaturesSection from "@/components/landingPage/FeaturesSection";
import HowItWorks from "@/components/landingPage/HowItWorks";
import Testimonials from "@/components/landingPage/Testimonials";
import CallToAction from "@/components/landingPage/CallToAction";
import Footer from "@/components/landingPage/Footer";

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Add a small delay to ensure smooth initial animations
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
      <Footer />
    </div>
  );
}
