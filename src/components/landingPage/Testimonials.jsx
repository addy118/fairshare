import { ChevronLeft, ChevronRight, Quote, Star, User } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef(null);
  const testimonialRef = useRef(null);

  const testimonials = [
    {
      quote:
        "FairShare has transformed the way we handle group expenses. It's easy and intuitive!",
      author: "Alex Johnson",
      role: "Frequent Traveler",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
    },
    {
      quote:
        "No more awkward money conversations with roommates. FairShare makes it simple!",
      author: "Sarah Williams",
      role: "College Student",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
    },
    {
      quote:
        "Debt tracking is no more done on calculator! I love the visual reports!",
      author: "Michael Chen",
      role: "Digital Nomad",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 4,
    },
    {
      quote: "I love how it minimizes the number of transactions. So clever!",
      author: "Emma Rodriguez",
      role: "Finance Professional",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
    },
  ];

  const next = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

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

  // Auto-advance testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gray-800/50 px-6 py-16 opacity-0 backdrop-blur-sm md:py-24"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="animate-pulse-subtle absolute -top-10 -right-10 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl filter"></div>
        <div className="animate-pulse-subtle animation-delay-500 absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-teal-500/10 blur-3xl filter"></div>

        {/* Large quote marks */}
        <div className="absolute top-10 left-10 scale-150 transform text-gray-700/20">
          <Quote size={80} />
        </div>
        <div className="absolute right-10 bottom-10 scale-150 rotate-180 transform text-gray-700/20">
          <Quote size={80} />
        </div>
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <div className="mb-3 inline-block rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-3 py-1 text-sm font-medium text-purple-300 backdrop-blur-sm">
          Testimonials
        </div>

        <h2 className="mb-12 text-3xl font-bold md:text-4xl">
          <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
            What our users say
          </span>
        </h2>

        <div className="relative">
          <div
            ref={testimonialRef}
            className={`glass-dark rounded-lg border border-gray-800 p-8 shadow-xl transition-opacity duration-500 ${isAnimating ? "opacity-0" : "opacity-100"}`}
          >
            {/* Quote icon */}
            <div className="absolute top-4 left-4 text-teal-500/30">
              <Quote size={24} />
            </div>

            <div className="mb-6">
              {/* Star rating */}
              <div className="mb-4 flex justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={`${i < testimonials[current].rating ? "fill-amber-400 text-amber-400" : "text-gray-600"} mx-0.5`}
                  />
                ))}
              </div>

              <p className="mb-6 text-lg text-gray-300 italic md:text-xl">
                "{testimonials[current].quote}"
              </p>
            </div>

            <div className="flex items-center justify-center">
              <div className="text-center">
                <p className="font-medium text-teal-400">
                  {testimonials[current].author}
                </p>
                <p className="text-sm text-gray-400">
                  {testimonials[current].role}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation dots */}
          <div className="mt-6 flex justify-center space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAnimating(true);
                  setCurrent(index);
                  setTimeout(() => setIsAnimating(false), 500);
                }}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  current === index
                    ? "w-6 bg-teal-400"
                    : "bg-gray-600 hover:bg-gray-500"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={prev}
              className="glass group rounded-full border border-gray-700 p-2 transition-colors duration-300 hover:bg-gray-700/70"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5 transition-colors group-hover:text-teal-400" />
            </button>
            <button
              onClick={next}
              className="glass group rounded-full border border-gray-700 p-2 transition-colors duration-300 hover:bg-gray-700/70"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5 transition-colors group-hover:text-teal-400" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
