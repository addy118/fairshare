import React from "react";
import { Facebook, Github, Instagram, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, name: "Facebook", href: "#" },
    { icon: <Twitter className="h-5 w-5" />, name: "Twitter", href: "#" },
    { icon: <Instagram className="h-5 w-5" />, name: "Instagram", href: "#" },
    { icon: <Github className="h-5 w-5" />, name: "Github", href: "#" },
    { icon: <Linkedin className="h-5 w-5" />, name: "LinkedIn", href: "#" },
  ];

  const navLinks = [
    {
      section: "Product",
      links: ["Features", "Pricing", "Download", "Updates"],
    },
    { section: "Company", links: ["About", "Team", "Careers", "Contact"] },
    {
      section: "Resources",
      links: ["Blog", "Help Center", "Guides", "API Docs"],
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-gray-800 bg-gray-900 px-6 pt-12 md:pt-16">
     <div className="relative mx-auto max-w-6xl">
        <div className="text-center text-sm text-gray-500">
          <p>© {currentYear} FairShare. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <a
              href="#"
              className="transition-colors duration-300 hover:text-gray-300"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="transition-colors duration-300 hover:text-gray-300"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="transition-colors duration-300 hover:text-gray-300"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
