import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

import groups from "../../data/courseGroups.json";

// Smart text color based on background
const getTextColor = (bg) => {
  const lightBG =
    bg.includes("yellow") ||
    bg.includes("orange") ||
    bg.includes("#f") ||
    bg.includes("ffe") ||
    bg.includes("ffd");

  return lightBG ? "text-gray-900" : "text-white";
};

export default function CourseGroups() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="relative px-6 md:px-12 py-20 bg-gray-50 dark:bg-[#050b18] transition-colors duration-300 overflow-hidden font-[Inter]">
      {/* Blurred Decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl animate-pulse"></div>

      {/* Section Heading */}
      <div className="relative w-full flex flex-col items-center justify-center mb-12">
        {/* LEFT STUDENT IMAGE */}
        <img
          src="/girl.png"
          alt="Student girl"
          className="
      hidden md:block 
      absolute -left-12 top-1/2 -translate-y-1/2 
      w-32 md:w-40 lg:w-80 
      object-contain
    "
        />

        {/* RIGHT STUDENT IMAGE */}
        <img
          src="/boy.png"
          alt="Student boy"
          className="
      hidden md:block 
      absolute right-24 top-1/2 -translate-y-1/2 
      w-32 md:w-40 lg:w-80 
      object-contain
    "
        />

        {/* CAPSULE TAG */}
        <div className="px-6 py-2 border border-gray-400 rounded-full text-lg font-semibold bg-white dark:bg-gray-900 shadow-sm tracking-wide font-[Mulish]">
          Our Methodology
        </div>

        {/* MAIN HEADING */}
        <h2 className="text-center mt-6 text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#93C01F] tracking-wide font-luckiest leading-tight">
          GROWTH STAGES AT LAST TRY ACADEMY
        </h2>

        {/* SUB TEXT */}
        <p className="mt-4 text-center text-lg md:text-xl lg:text-2xl text-gray-800 dark:text-gray-200 font-luckiest leading-relaxed px-4 md:px-0">
          Just like a plant grows through different stages, we nurture <br />
          students through every phase of their educational journey.
        </p>
      </div>

      {/* Swiper Carousel */}
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4200, disableOnInteraction: false }}
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
                className="
                  grid md:grid-cols-2 items-center 
                  p-8 sm:p-10 md:p-14 
                  rounded-3xl shadow-xl 
                  transition-all duration-500 
                  animate-slideUp
                "
                style={{ background: g.bgColor }}
              >
                {/* LEFT CONTENT */}
                <div className="space-y-5 animate-fadeInLeft">
                  <h3
                    className={`
                      text-3xl md:text-4xl font-luckiest tracking-wide 
                      leading-snug drop-shadow-lg ${textColor}
                    `}
                  >
                    {g.title}
                  </h3>

                  {g.subtitle && (
                    <h4
                      className={`text-lg font-semibold italic opacity-90 ${textColor}`}
                    >
                      {g.subtitle}
                    </h4>
                  )}

                  <p
                    className={`
                      font-mulish text-base md:text-lg leading-relaxed 
                      ${
                        textColor === "text-white"
                          ? "text-white/95"
                          : "text-gray-900/90"
                      }
                      ${!isExpanded ? "line-clamp-6 overflow-hidden" : ""}
                    `}
                    style={{
                      maxHeight: isExpanded ? "none" : "9.5rem",
                      transition: "max-height 0.3s ease",
                    }}
                  >
                    {g.description}
                  </p>

                  {g.description.length > 180 && (
                    <button
                      onClick={() => toggleExpand(i)}
                      className={`${textColor} underline text-sm font-semibold hover:opacity-80`}
                    >
                      {isExpanded ? "Show Less ↑" : "Read More ↓"}
                    </button>
                  )}
                </div>

                {/* RIGHT – IMAGE BLOCK */}
                <div className="flex justify-center mt-10 md:mt-0 animate-fadeInRight">
                  <div
                    className="
                      relative bg-white/40 dark:bg-white/20 
                      backdrop-blur-md rounded-full 
                      w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 
                      flex items-center justify-center 
                      shadow-xl hover:shadow-2xl 
                      transition-all
                    "
                  >
                    <div
                      className="
                        bg-white dark:bg-gray-100 
                        rounded-full 
                        w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 
                        overflow-hidden 
                        flex items-center justify-center 
                        transition-transform duration-500 hover:scale-[1.05]
                      "
                    >
                      <img
                        src={g.image}
                        alt={g.title}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Glow Ring */}
                    <div className="absolute inset-0 rounded-full border-[6px] border-white/40 opacity-60 animate-ping"></div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Embedded Styles */}
      <style>{`
        /* Swiper Pagination */
        .swiper-pagination-bullet {
          background: rgba(6,182,212,0.4);
          opacity: 0.7;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          width: 14px;
          height: 14px;
          background: linear-gradient(90deg,#06b6d4,#3b82f6);
          opacity: 1;
          box-shadow: 0 0 8px rgba(6,182,212,0.8);
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

        .animate-slideUp { animation: slideUp 1s ease-out; }
        .animate-fadeInLeft { animation: fadeInLeft 1s ease-out; }
        .animate-fadeInRight { animation: fadeInRight 1s ease-out; }
      `}</style>
    </section>
  );
}
