import React, { useEffect, useRef } from "react";
import heroImage from "../../assets/hero-image.png";
import { Link } from "react-router-dom";

export default function HeroSection() {
  const heroRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY;
        const heroElement = heroRef.current;

        // Parallax effect for hero section
        heroElement.style.transform = `translateY(${scrollY * 0.1}px)`;

        // Removed image rotation animation as requested
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative overflow-hidden py-0 md:pb-16">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 h-full w-full">
        <div className="animate-pulse-subtle absolute top-20 left-10 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl filter"></div>
        <div className="animate-pulse-subtle animation-delay-500 absolute right-10 bottom-10 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl filter"></div>

        {/* Animated shapes */}
        <div className="animate-spin-slow absolute top-1/4 right-1/3 h-16 w-16 rounded-full border border-teal-500/20"></div>
        <div
          className="animate-spin-slow absolute bottom-1/3 left-1/4 h-24 w-24 rounded-full border border-purple-500/20"
          style={{ animationDirection: "reverse" }}
        ></div>

        {/* Gradient lines */}
        <div className="absolute top-1/2 left-0 h-px w-full bg-gradient-to-r from-transparent via-teal-500/20 to-transparent"></div>
        <div className="absolute top-0 left-1/2 h-full w-px bg-gradient-to-b from-transparent via-purple-500/20 to-transparent"></div>
      </div>

      <div ref={heroRef} className="relative mx-auto max-w-4xl text-center">
        <div className="animate-fade-in mb-3 inline-block rounded-full bg-gradient-to-r from-teal-500/20 to-cyan-500/20 px-3 py-1 text-sm font-medium text-teal-300 backdrop-blur-sm">
          Expense Splitting Reimagined
        </div>

        <h1 className="animate-fade-in mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
          <span className="gradient-text glow-text">Split Smarter</span> with
          Fairshare
        </h1>

        <p className="animate-fade-in animation-delay-200 mx-auto mb-8 max-w-2xl text-lg text-gray-300 md:text-xl">
          Effortless group expense sharing, made simple. No more awkward money
          conversations or complicated calculations.
        </p>

        <div className="animate-fade-in animation-delay-400 flex flex-wrap justify-center gap-4">
          <Link to="/login">
            <button className="animate-ripple rounded-md bg-gradient-to-r from-teal-500 to-teal-400 px-8 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:from-teal-400 hover:to-teal-500 hover:shadow-teal-500/25">
              Start Splitting
            </button>
          </Link>
        </div>

        <div className="relative mx-auto mt-16 max-w-lg">
          {/* Decorative elements around the image */}
          <div className="absolute -top-4 -left-4 h-8 w-8 border-t-2 border-l-2 border-teal-500/50"></div>
          <div className="absolute -right-4 -bottom-4 h-8 w-8 border-r-2 border-b-2 border-teal-500/50"></div>

          <div className="relative overflow-hidden rounded-lg shadow-2xl">
            {/* Animated gradient border */}
            <div className="absolute inset-0 p-0.5">
              <div className="animate-gradient h-full w-full rounded-lg bg-gradient-to-r from-teal-500 via-cyan-400 to-purple-500 opacity-70"></div>
            </div>

            <div ref={imageRef} className="relative overflow-hidden rounded-lg">
              <img
                src={heroImage || "/placeholder.svg"}
                alt="Expense splitting illustration showing people collaborating on finances"
                className="w-full rounded-lg shadow-2xl"
              />

              {/* Overlay with shimmer effect */}
              <div className="animate-shimmer absolute inset-0 bg-gradient-to-tr from-teal-500/10 to-purple-500/10"></div>
            </div>
          </div>

          {/* Floating badges */}
          <div className="animate-float animation-delay-300 absolute top-1/4 -right-10 rounded-lg border border-gray-700/50 bg-gray-800/80 px-3 py-2 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-teal-400"></div>
              <span className="text-sm font-medium">Debt Tracking</span>
            </div>
          </div>

          <div className="animate-float animation-delay-600 absolute bottom-1/4 -left-12 rounded-lg border border-gray-700/50 bg-gray-800/80 px-3 py-2 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-400"></div>
              <span className="text-sm font-medium">Smart Splits</span>
            </div>
          </div>
        </div>

        {/* Stats - Reduced bottom margin */}
        <div className="animate-fade-in animation-delay-700 mx-auto mt-16 mb-6 grid max-w-2xl grid-cols-2 gap-4 md:grid-cols-3">
          <div className="glass hover-lift rounded-lg p-4">
            <div className="gradient-text text-2xl font-bold">10+</div>
            <div className="text-sm text-gray-400">Active Users</div>
          </div>
          <div className="glass hover-lift rounded-lg p-4">
            <div className="gradient-text text-2xl font-bold">₹200+</div>
            <div className="text-sm text-gray-400">Expenses Tracked</div>
          </div>
          <div className="glass hover-lift col-span-2 rounded-lg p-4 md:col-span-1">
            <div className="gradient-text text-2xl font-bold">4.9/5</div>
            <div className="text-sm text-gray-400">User Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}
