import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import step1 from "../../assets/step1.png";
import step2 from "../../assets/step2.png";
import step3 from "../../assets/step3.png";

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const stepsRef = useRef([]);

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

    stepsRef.current.forEach((step) => {
      if (step) {
        observer.observe(step);
      }
    });

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      stepsRef.current.forEach((step) => {
        if (step) {
          observer.unobserve(step);
        }
      });
    };
  }, []);

  const steps = [
    {
      number: 1,
      title: "Create a Group & Invite Members",
      description:
        "Set up a group and easily add your friends, family, or roommates.",
      image: step1,
      alt: "Create a group and invite members",
      gradient: "from-teal-500 to-cyan-400",
      bgGradient: "from-teal-500/10 to-cyan-500/10",
    },
    {
      number: 2,
      title: "Add and Track Expenses",
      description:
        "Log expenses in real-time and keep everyone on the same page.",
      image: step2,
      alt: "Add and track expenses",
      gradient: "from-cyan-500 to-blue-400",
      bgGradient: "from-cyan-500/10 to-blue-500/10",
    },
    {
      number: 3,
      title: "Simplify Settlements with Smart Splits",
      description:
        "Use our optimized algorithm to minimize the number of transactions.",
      image: step3,
      alt: "Simplify settlements with smart splits",
      gradient: "from-purple-500 to-pink-400",
      bgGradient: "from-purple-500/10 to-pink-500/10",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-6 py-16 md:py-24"
    >
      {/* Connecting line between steps */}
      <div className="absolute top-32 bottom-32 left-1/2 hidden w-0.5 bg-gradient-to-b from-teal-500/30 via-cyan-500/30 to-purple-500/30 md:block"></div>

      {/* Background elements */}
      <div className="absolute top-0 left-0 h-full w-full">
        <div className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-teal-500/5 blur-3xl filter"></div>
        <div className="absolute bottom-1/3 left-1/3 h-64 w-64 rounded-full bg-purple-500/5 blur-3xl filter"></div>
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div
          className="mb-16 text-center opacity-0"
          ref={(el) => (stepsRef.current[0] = el)}
        >
          <div className="mb-3 inline-block rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-3 py-1 text-sm font-medium text-cyan-300 backdrop-blur-sm">
            Simple Process
          </div>
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
              How the App Works
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-gray-300">
            FairShare makes expense splitting simple with just three easy steps
          </p>
        </div>

        {steps.map((step, index) => (
          <div
            key={index}
            ref={(el) => (stepsRef.current[index + 1] = el)}
            className={`step-item mb-16 grid grid-cols-1 items-center gap-8 opacity-0 md:grid-cols-2 ${
              index % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
            style={{ animationDelay: `${index * 0.3}s` }}
          >
            <div className={`relative ${index % 2 === 1 ? "md:order-2" : ""}`}>
              {/* Step connector */}
              <div className="absolute top-1/2 right-full hidden h-0.5 w-8 bg-gradient-to-r from-teal-500/50 to-cyan-500/50 md:block"></div>

              <div className="glass-dark group hover-lift overflow-hidden rounded-lg border border-gray-700/50 shadow-xl">
                <div className="relative flex h-79 items-center justify-center overflow-hidden">
                  {/* Gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${step.bgGradient} opacity-20 transition-opacity duration-500 group-hover:opacity-30`}
                  ></div>

                  <img
                    src={step.image || "/placeholder.svg"}
                    alt={step.alt}
                    className="max-h-full transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Animated corner accents */}
                  <div className="pointer-events-none absolute top-0 left-0 h-16 w-16">
                    <div className="animate-pulse-subtle absolute top-4 left-4 h-2 w-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400"></div>
                  </div>
                  <div className="pointer-events-none absolute right-0 bottom-0 h-16 w-16">
                    <div className="animate-pulse-subtle animation-delay-500 absolute right-4 bottom-4 h-2 w-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`space-y-4 ${index % 2 === 1 ? "md:order-1 md:text-right" : ""}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r ${step.gradient} relative font-bold text-white shadow-lg`}
                >
                  {step.number}
                  <div
                    className={`absolute -inset-1 rounded-full bg-gradient-to-r ${step.gradient} animate-pulse-subtle opacity-30`}
                  ></div>
                </div>
                <h3 className="text-2xl font-bold">{step.title}</h3>
              </div>
              <p className="text-gray-300">{step.description}</p>

              {/* Step-specific features */}
              <div className="pt-2">
                <div
                  className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-3 py-1 ${step.bgGradient} text-sm backdrop-blur-sm ${index % 2 === 1 ? "md:ml-auto" : ""}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                  {index === 0
                    ? "Quick Setup"
                    : index === 1
                      ? "Real-time Updates"
                      : "Minimal Transactions"}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Final CTA */}
        <div
          className="mt-8 text-center opacity-0"
          ref={(el) => (stepsRef.current[steps.length + 1] = el)}
        >
          <Link to="/login">
            <button className="animate-bounce-subtle rounded-md bg-gradient-to-r from-teal-500 to-cyan-400 px-8 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:from-teal-400 hover:to-cyan-500 hover:shadow-teal-500/25">
              Get Started Now
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
