import { CheckCircle } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function CallToAction() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const benefits = [
    "No more awkward money conversations",
    "Save time with smart splits",
    "Debt Tracking made easy",
    "Free to use",
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-6 py-16 opacity-0 md:py-24"
    >
      {/* Background elements */}
      <div className="absolute top-0 left-0 h-full w-full">
        <div className="animate-pulse-subtle absolute top-1/3 left-1/4 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl filter"></div>
        <div className="animate-pulse-subtle animation-delay-500 absolute right-1/4 bottom-1/3 h-64 w-64 rounded-full bg-[#00a2ff]]]]]]/10 blur-3xl filter"></div>
      </div>

      <div className="relative mx-auto max-w-5xl text-center">
        <div className="glass-dark relative overflow-hidden rounded-2xl border border-gray-700/50 p-10 shadow-2xl backdrop-blur-sm">
          {/* Animated corner accents */}
          <div className="absolute top-0 left-0 h-20 w-20 overflow-hidden">
            <div className="absolute top-0 left-0 h-1 w-40 bg-gradient-to-r from-purple-500 to-transparent"></div>
            <div className="absolute top-0 left-0 h-40 w-1 bg-gradient-to-b from-purple-500 to-transparent"></div>
          </div>
          <div className="absolute right-0 bottom-0 h-20 w-20 overflow-hidden">
            <div className="absolute right-0 bottom-0 h-1 w-40 bg-gradient-to-l from-[#00a2ff]]]]] to-transparent"></div>
            <div className="absolute right-0 bottom-0 h-40 w-1 bg-gradient-to-t from-[#00a2ff]]] to-transparent"></div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="mb-3 inline-block rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-3 py-1 text-sm font-medium text-purple-300 backdrop-blur-sm">
              Limited Time Offer
            </div>

            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ready to get started?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">
              Join Fairshare today to simplify your group expenses and say
              goodbye to awkward money conversations!
            </p>

            <div className="mx-auto grid max-w-4xl items-center gap-8 md:grid-cols-2">
              <div className="space-y-4 text-left">
                <h3 className="gradient-text-purple text-xl font-semibold">
                  Why choose Fairshare?
                </h3>
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-400" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass rounded-xl border border-gray-700/50 p-6">
                <h3 className="gradient-text mb-2 text-xl font-semibold">
                  Get Started Today
                </h3>
                <p className="mb-4 text-gray-400">
                  Create your account in seconds
                </p>

                <form className="space-y-3">
                  <Link to="/login">
                    <button className="glow-button w-full rounded-md bg-gradient-to-r from-purple-600 to-purple-500 px-8 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:from-purple-500 hover:to-purple-600 hover:shadow-purple-500/30">
                      Sign Up Now
                    </button>
                  </Link>
                </form>

                <p className="mt-4 text-xs text-gray-500">
                  By signing up, you agree to our Terms of Service and Privacy
                  Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
