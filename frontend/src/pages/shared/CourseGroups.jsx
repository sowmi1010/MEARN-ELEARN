import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

import groups from "../../data/courseGroups.json";

// Helper: Choose light or dark text for contrast
const getTextColor = (bg) => {
  if (
    bg.includes("yellow") ||
    bg.includes("orange") ||
    bg.includes("#f") ||
    bg.includes("fc7") ||
    bg.includes("e6a")
  ) {
    return "text-gray-800"; // dark text for light bg
  }
  return "text-white"; // white text for dark bg
};

export default function CourseGroups() {
  // Track expanded cards
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="relative px-6 md:px-12 py-20 bg-gray-50 dark:bg-darkBg transition-colors duration-300 overflow-hidden font-[Inter]">
      {/* Decorative Blurred Shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-400/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-400/15 rounded-full blur-3xl animate-pulse"></div>

      {/* Section Heading */}
      <h2 className="relative text-4xl md:text-5xl font-extrabold text-center mb-4 tracking-tight">
        <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent drop-shadow">
          Our Methodology
        </span>
      </h2>

      <p className="text-center max-w-3xl mx-auto text-gray-600 dark:text-gray-300 text-lg md:text-xl font-light leading-relaxed mb-2">
        We believe growth is like a plant’s journey — from strong roots to
        fruitful success.
      </p>
      <p className="text-center text-sm md:text-base text-gray-500 dark:text-gray-400 mb-14">
        Each course group at{" "}
        <span className="font-semibold text-cyan-600 dark:text-cyan-400">
          Last Try Academy
        </span>{" "}
        represents a vital stage of learning.
      </p>

      {/* Swiper Carousel */}
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        spaceBetween={50}
        slidesPerView={1}
        loop
        className="pb-14 max-w-6xl mx-auto"
      >
        {groups.map((g, i) => {
          const textColor = getTextColor(g.bgColor);
          const isExpanded = expandedIndex === i;

          return (
            <SwiperSlide key={i}>
              <div
                className={`
                  grid md:grid-cols-2 items-center
                  py-10 pl-8 rounded-3xl shadow-xl hover:shadow-2xl
                  transition-all duration-500 hover:scale-[1.01]
                  animate-slideUp
                `}
                style={{ background: g.bgColor }}
              >
                {/* LEFT CONTENT */}
                <div
                  className={`max-w-xl space-y-5 ${textColor} animate-fadeInLeft`}
                >
                  <h3 className="text-3xl md:text-4xl font-bold tracking-wide leading-snug">
                    {g.title}
                  </h3>

                  {g.subtitle && (
                    <h4
                      className={`text-lg font-medium italic ${
                        textColor === "text-white"
                          ? "text-white/80"
                          : "text-gray-700"
                      }`}
                    >
                      {g.subtitle}
                    </h4>
                  )}

                  {/* Description with max height */}
                  <p
                    className={`text-base md:text-lg leading-relaxed relative ${
                      textColor === "text-white"
                        ? "text-white/90"
                        : "text-gray-800"
                    } ${!isExpanded ? "line-clamp-6 overflow-hidden" : ""}`}
                    style={{
                      maxHeight: isExpanded ? "none" : "9.5rem", // ~6 lines
                      transition: "max-height 0.3s ease",
                    }}
                  >
                    {g.description}
                  </p>

                  {/* Toggle Button */}
                  {g.description.length > 180 && (
                    <button
                      onClick={() => toggleExpand(i)}
                      className={`mt-2 text-sm font-semibold underline hover:opacity-80 ${
                        textColor === "text-white"
                          ? "text-white/90"
                          : "text-gray-700"
                      }`}
                    >
                      {isExpanded ? "Show Less ↑" : "Read More ↓"}
                    </button>
                  )}
                </div>

                {/* RIGHT IMAGE */}
                <div className="flex justify-center animate-fadeInRight">
                  <div
                    className="
                      relative
                      bg-white/30 backdrop-blur-md
                      rounded-full w-72 h-72 flex items-center justify-center
                      shadow-md hover:shadow-lg transition-all duration-500
                    "
                  >
                    <div
                      className="
                        bg-white dark:bg-gray-100
                        rounded-full w-64 h-64 flex items-center justify-center
                        overflow-hidden
                        transition-transform duration-500
                        hover:scale-[1.05]
                      "
                    >
                      <img
                        src={g.image}
                        alt={g.title}
                        className="rounded-full w-64 h-64 object-cover drop-shadow"
                      />
                    </div>

                    {/* Glow Ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-white/30 opacity-40 animate-ping"></div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Custom Styles */}
      <style>{`
        /* Import Professional Font */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        /* Swiper Pagination */
        .swiper-pagination-bullet {
          background: rgba(6,182,212,0.5);
          opacity: 0.7;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          width: 16px;
          height: 16px;
          background: linear-gradient(90deg,#06b6d4,#3b82f6);
          opacity: 1;
          box-shadow: 0 0 8px rgba(6,182,212,0.8);
          border-radius: 50%;
        }

        /* Animations */
        @keyframes slideUp {
          0% {opacity:0; transform: translateY(30px);}
          100% {opacity:1; transform: translateY(0);}
        }
        @keyframes fadeInLeft {
          0% {opacity:0; transform: translateX(-30px);}
          100% {opacity:1; transform: translateX(0);}
        }
        @keyframes fadeInRight {
          0% {opacity:0; transform: translateX(30px);}
          100% {opacity:1; transform: translateX(0);}
        }

        .animate-slideUp {animation: slideUp 1s ease-out;}
        .animate-fadeInLeft {animation: fadeInLeft 1s ease-out;}
        .animate-fadeInRight {animation: fadeInRight 1s ease-out;}
      `}</style>
    </section>
  );
}
