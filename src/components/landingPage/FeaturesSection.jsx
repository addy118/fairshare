import React, { useEffect, useRef } from "react";
import {
  CreditCard,
  FileText,
  LineChart,
  Mail,
  SplitSquareVertical,
  Users,
} from "lucide-react";
import smartSplit from "../../assets/smartSplit.png";

export default function FeaturesSection() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

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

    cardsRef.current.forEach((card) => {
      if (card) {
        observer.observe(card);
      }
    });

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      cardsRef.current.forEach((card) => {
        if (card) {
          observer.unobserve(card);
        }
      });
    };
  }, []);

  const features = [
    {
      icon: <CreditCard className="h-8 w-8 text-purple-400" />,
      title: "Secure Two-Way Payments",
      description:
        "Facilitate transactions with mutual agreement for added security.",
      color: "from-purple-500/20 to-pink-500/20",
      textColor: "text-purple-300",
    },
    {
      icon: <Users className="h-8 w-8 text-cyan-400" />,
      title: "Social connections",
      description:
        "Add friends, create groups, and make transactions with your social network.",
      color: "from-cyan-500/20 to-blue-500/20",
      textColor: "text-cyan-300",
    },
    {
      icon: <SplitSquareVertical className="h-8 w-8 text-pink-400" />,
      title: "Expense splitting options",
      description:
        "Flexible options for equal/unequal, single/multiple payers with custom rules.",
      color: "from-pink-500/20 to-rose-500/20",
      textColor: "text-pink-300",
    },
    {
      icon: <LineChart className="h-8 w-8 text-amber-400" />,
      title: "Debt tracking and recurring expenses",
      description:
        "Keep track of debts and set up recurring expenses easily with visual reports.",
      color: "from-amber-500/20 to-yellow-500/20",
      textColor: "text-amber-300",
    },
    {
      icon: <Mail className="h-8 w-8 text-emerald-400" />,
      title: "Bill email reminders",
      description:
        "Never miss a payment with timely email reminders and notifications.",
      color: "from-emerald-500/20 to-green-500/20",
      textColor: "text-emerald-300",
    },
    {
      icon: <FileText className="h-8 w-8 text-blue-400" />,
      title: "PDF export for reports",
      description:
        "Generate detailed reports and export them as PDFs for your records.",
      color: "from-blue-500/20 to-indigo-500/20",
      textColor: "text-blue-300",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gray-800/50 px-6 py-12 backdrop-blur-sm md:py-16"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-teal-500/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
      </div>

      <div className="mx-auto max-w-6xl">
        <div
          className="mb-10 text-center opacity-0"
          ref={(el) => (cardsRef.current[0] = el)}
        >
          <div className="mb-3 inline-block rounded-full bg-gradient-to-r from-teal-500/20 to-cyan-500/20 px-3 py-1 text-sm font-medium text-teal-300 backdrop-blur-sm">
            Powerful Features
          </div>
          <h2 className="gradient-text mb-4 text-3xl font-bold md:text-4xl">
            Everything You Need
          </h2>
          <p className="mx-auto max-w-2xl text-gray-300">
            Fairshare comes packed with all the tools you need to manage group
            expenses effortlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index + 1] = el)}
              className="feature-card glass-dark hover-lift group rounded-lg border border-gray-800/50 p-6 opacity-0 shadow-lg"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`mb-4 inline-block rounded-lg bg-gradient-to-r p-3 ${feature.color} transition-transform duration-300 group-hover:scale-110`}
              >
                {feature.icon}
              </div>
              <h3 className={`mb-2 text-xl font-semibold ${feature.textColor}`}>
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>

              {/* Hover effect */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-teal-500/0 to-purple-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-10"></div>
            </div>
          ))}
        </div>

        {/* Feature highlight */}
        <div
          className="glass-dark mt-16 rounded-xl border border-gray-700/50 p-6 opacity-0 shadow-2xl"
          ref={(el) => (cardsRef.current[features.length + 1] = el)}
        >
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <div className="inline-block rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-3 py-1 text-sm font-medium text-purple-300 backdrop-blur-sm">
                Featured
              </div>
              <h3 className="gradient-text-purple text-2xl font-bold">
                Smart Split Algorithm
              </h3>
              <p className="text-gray-300">
                Our proprietary algorithm calculates the optimal way to settle
                debts with the minimum number of transactions, saving you time
                and hassle.
              </p>
              <ul className="space-y-2">
                {[
                  "Minimize transaction count",
                  "Optimize for currency conversion",
                  "Handle complex group dynamics",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-400"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="animate-pulse-subtle absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
              <img
                src={smartSplit || "/placeholder.svg"}
                alt="Smart Split Algorithm visualization"
                className="w-full rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
