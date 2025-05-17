import { Menu, X } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <nav
        className={`sticky top-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 md:px-12 ${
          scrolled
            ? "bg-gray-900/90 shadow-lg backdrop-blur-md"
            : "bg-gray-900/80 backdrop-blur-sm"
        }`}
      >
        <div className="flex items-center">
          <div className="flex items-center text-xl font-bold">
            <svg
              className="mr-2 h-6 w-6 text-teal-400"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="gradient-text">FairShare</span>
          </div>
        </div>

        <div className="hidden space-x-8 md:flex">
          {["Home", "Features", "How it Works", "Get Started"].map((item) => (
            <a
              href="#"
              key={item}
              className="group relative transition-colors duration-300 hover:text-teal-400"
            >
              {item}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* moible design */}
        <button
          className="text-white focus:outline-none md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900/95 px-6 pt-20 backdrop-blur-md md:hidden">
          <div className="flex flex-col space-y-6 text-center text-lg">
            {["Home", "Features", "How it Works", "Get Started"].map((item) => (
              <a
                href="#"
                key={item}
                className="py-2 transition-colors duration-300 hover:text-teal-400"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
