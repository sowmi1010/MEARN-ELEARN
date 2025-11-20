import React from "react";
import {
  AcademicCapIcon,
  LightBulbIcon,
  BookOpenIcon,
  UserGroupIcon,
  SparklesIcon,
  PuzzlePieceIcon,
} from "@heroicons/react/24/outline";

export default function AboutSection() {
  const offerBlocks = [
    {
      title: "For School Students (1st–12th)",
      icon: AcademicCapIcon,
      items: [
        "Academic classes & concept clarity",
        "Soft skills & personality development",
        "Motivational coaching & assessments",
        "Creative projects & practical exercises",
      ],
    },
    {
      title: "For Career-Oriented Students",
      icon: LightBulbIcon,
      items: [
        "Competitive exam preparation (NEET/JEE/TNPSC/UPSC)",
        "Interview readiness & mock interviews",
        "Resume building & career counselling",
        "Financial literacy & life skills",
      ],
    },
    {
      title: "For Parents",
      icon: UserGroupIcon,
      items: [
        "Child education counselling",
        "Parent-child communication workshops",
        "Progress reports & regular mentorship calls",
      ],
    },
  ];

  return (
    <section className="relative px-6 md:px-20 py-20 bg-gradient-to-b from-white to-[#F4F9FF] dark:from-[#071022] dark:to-[#071623] font-[Poppins] overflow-hidden">
      {/* Decorative large image (uploaded screenshot used as decorative asset) */}
      {/* <img
        src={"/mnt/data/Screenshot 2025-11-20 063800.png"}
        alt="decor"
        className="hidden lg:block absolute right-8 top-6 w-56 opacity-20 pointer-events-none select-none"
      /> */}

      {/* Subtle gradient glows */}
      <div className="absolute -left-20 -top-10 w-72 h-72 rounded-full bg-cyan-300/20 dark:bg-cyan-500/10 blur-3xl pointer-events-none"></div>
      <div className="absolute -right-20 -bottom-10 w-72 h-72 rounded-full bg-yellow-300/20 dark:bg-yellow-400/6 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between mb-10">
          <div className="space-y-3">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 dark:text-cyan-300 uppercase tracking-wider">
              <SparklesIcon className="w-5 h-5" />
              About Last Try Academy
            </p>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0b1220] dark:text-white leading-tight">
              Your Last Stop to Success — <span className="text-cyan-600 dark:text-cyan-300">From School Bench to Office Desk</span>
            </h2>

            <p className="mt-2 text-gray-700 dark:text-gray-300 max-w-2xl">
              We combine mentoring, academic excellence and career guidance — built to take students from learning basics to confident professionals.
            </p>
          </div>

          {/* Quick stats card */}
          <div className="mt-4 lg:mt-0">
            <div className="bg-white/70 dark:bg-[#091625]/70 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 shadow-lg flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md">
                <BookOpenIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-300">Active Students</p>
                <p className="text-lg font-extrabold text-gray-900 dark:text-white">1K+</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Left column - About / Mission / Vision */}
          <div className="space-y-6">
            <div className="bg-white/70 dark:bg-[#071428]/70 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Who we are</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                <span className="font-semibold text-gray-900 dark:text-white">Last Try Academy</span> is India’s first mentorship academy with one mission: mentor students at every step so they can confidently reach professional life.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-white to-cyan-50 dark:from-[#072031] dark:to-[#071827] border border-gray-100 dark:border-gray-700 shadow-sm">
                <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Our Vision</h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm">Nurture confident learners who are ready for life and career challenges.</p>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-white to-yellow-50 dark:from-[#141213] dark:to-[#201810] border border-gray-100 dark:border-gray-700 shadow-sm">
                <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Our Mission</h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm">Provide mentorship, skills and lifelong guidance so each student succeeds academically and professionally.</p>
              </div>
            </div>
          </div>

          {/* Middle column - Offer cards (icon + bullets) */}
          <div className="space-y-6">
            {offerBlocks.map((block, idx) => {
              const Icon = block.icon;
              return (
                <article
                  key={idx}
                  className="group relative overflow-hidden rounded-2xl bg-white/70 dark:bg-[#071428]/70 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:scale-[1.02] transition-transform"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{block.title}</h4>
                      <ul className="mt-3 space-y-2 text-gray-700 dark:text-gray-300 text-[15px]">
                        {block.items.map((it, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-1 text-cyan-600 dark:text-cyan-300">•</span>
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* subtle floating accent */}
                  <div className="pointer-events-none absolute -right-8 top-6 w-32 h-32 bg-cyan-200/10 dark:bg-cyan-400/6 rounded-full blur-2xl"></div>
                </article>
              );
            })}
          </div>

          {/* Right column - CTA cards + testimonial */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white/80 dark:bg-[#071428]/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-lg">
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Why choose us</h4>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-cyan-600 dark:text-cyan-300 mt-1">✓</span>
                  <span>Mentor-led learning with real-world projects</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-600 dark:text-cyan-300 mt-1">✓</span>
                  <span>Small groups & personal attention</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-600 dark:text-cyan-300 mt-1">✓</span>
                  <span>Lifetime guidance for enrolled students</span>
                </li>
              </ul>

              <button className="mt-6 w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-semibold shadow hover:brightness-105 transition">
                Enroll / Contact Us
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-white/70 dark:bg-[#071428]/70 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-lg">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Quick Stats</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-300">1K+</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">Students</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-300">50+</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">Courses</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-300">100%</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">Satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-12 text-center text-sm text-gray-600 dark:text-gray-400">
          <span className="italic">“Planting knowledge — harvesting success.”</span>
        </div>
      </div>

      {/* small animations */}
      <style>{`
        /* subtle card entry */
        .about-card {
          transform: translateY(6px);
          opacity: 0;
          animation: cardIn 0.7s forwards ease;
        }
        @keyframes cardIn {
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
