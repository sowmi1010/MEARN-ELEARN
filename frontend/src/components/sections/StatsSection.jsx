import React from "react";

export default function StatsSection() {
  const stats = [
    { value: "3+", label: "State" },
    { value: "3+", label: "Branch" },
    { value: "1K+", label: "Active Students" },
    { value: "3500+", label: "Total videos" },
    { value: "50+", label: "Total courses" },
    { value: "100%", label: "Satisfaction Rate" },
    { value: "15+", label: "Mentor" },
  ];

  return (
    <section className="relative w-full py-24 bg-white dark:bg-[#050b18] overflow-x-hidden">

      {/* ===== Wave Background ===== */}
      <div className="absolute -top-1 left-0 w-full pointer-events-none">
        <img
          src="/waves.png"
          alt="wave"
          className="w-full opacity-90 dark:opacity-40"
        />
      </div>

      {/* ===== Stats Row ===== */}
      <div
        className="
          relative z-10 max-w-7xl mx-auto px-6 
          grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 
          gap-y-12 text-center
        "
      >
        {stats.map((item, i) => (
          <div
            key={i}
            className="
              flex flex-col items-center group 
              hover:scale-105 transition-transform duration-300
            "
          >
            {/* Glowing Dot */}
            <div
              className="
                w-3 h-3 rounded-full mb-3 
                bg-orange-500 dark:bg-orange-400 
                shadow-[0_0_12px_rgba(255,123,0,0.6)]
                group-hover:shadow-[0_0_18px_rgba(255,123,0,1)]
                transition-all
              "
            ></div>

            {/* Value */}
            <h3
              className="
                text-2xl md:text-3xl font-extrabold 
                text-orange-600 dark:text-orange-400 
                opacity-0 animate-fadeUpSlow
              "
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {item.value}
            </h3>

            {/* Label */}
            <p
              className="
                text-gray-700 dark:text-gray-300 
                text-sm md:text-base font-medium 
                opacity-0 animate-fadeUpSlow 
              "
              style={{ animationDelay: `${i * 0.15 + 0.1}s` }}
            >
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {/* ===== Animations ===== */}
      <style>{`
        @keyframes fadeUpSlow {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUpSlow {
          animation: fadeUpSlow 0.9s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
