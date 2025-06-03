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

        // parallax effect for hero section
        heroElement.style.transform = `translateY(${scrollY * 0.1}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative overflow-hidden px-12 py-0 md:px-0 md:pb-16">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 h-full w-full">
        <div className="animate-pulse-subtle absolute top-20 left-10 h-72 w-72 rounded-full bg-[#00a2ff]/10 blur-3xl filter"></div>
        <div className="animate-pulse-subtle animation-delay-500 absolute right-10 bottom-10 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl filter"></div>

        {/* Gradient lines */}
        <div className="absolute top-1/2 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#00a2ff]/20 to-transparent"></div>
        <div className="absolute top-0 left-1/2 h-full w-px bg-gradient-to-b from-transparent via-purple-500/20 to-transparent"></div>
      </div>

      <div ref={heroRef} className="relative mx-auto max-w-4xl text-center">
        <div className="animate-fade-in mb-3 inline-block rounded-full bg-gradient-to-r from-[#00a2ff]/20 to-cyan-500/20 px-3 py-1 text-sm font-medium text-teal-300 backdrop-blur-sm">
          Expense Splitting Simplified
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
            <button className="animate-ripple rounded-md bg-gradient-to-r from-[#00a2ff] to-[#00bcff] px-8 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:from-[#00bcff] hover:to-[#00a2ff] hover:shadow-[#00a2ff]/25">
              Start Splitting
            </button>
          </Link>
        </div>

        {/* Stats - Reduced bottom margin */}
        <div className="animate-fade-in animation-delay-700 mx-8 mt-16 mb-16 grid max-w-2xl grid-cols-2 gap-4 md:mx-auto md:mb-6 md:grid-cols-3">
          <div className="glass hover-lift rounded-lg p-4">
            <div className="gradient-text text-2xl font-bold">10+</div>
            <div className="text-sm text-gray-400">Active Users</div>
          </div>
          <div className="glass hover-lift rounded-lg p-4">
            <div className="gradient-text text-2xl font-bold">₹200+</div>
            <div className="text-sm text-gray-400">Expenses Tracked</div>
          </div>
          <div className="glass hover-lift col-span-2 rounded-lg p-4 md:col-span-1">
            <div className="gradient-text text-2xl font-bold">4.6/5</div>
            <div className="text-sm text-gray-400">User Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}
