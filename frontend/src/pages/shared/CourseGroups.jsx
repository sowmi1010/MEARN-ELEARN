import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

import groups from "../../data/courseGroups.json";

export default function CourseGroups() {
  return (
    <section className="px-6 md:px-12 py-16 bg-gray-100 dark:bg-darkBg transition-colors duration-300">
      {/* Section Title */}
      <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-center tracking-wide">
        <span className="bg-gradient-to-r from-accent to-blue-500 bg-clip-text text-transparent">
          Course Groups
        </span>
      </h2>

      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        spaceBetween={40}
        slidesPerView={1}
        loop
        className="pb-12 max-w-6xl mx-auto"
      >
        {groups.map((g, i) => (
          <SwiperSlide key={i}>
            <div
              className="
                grid md:grid-cols-2 gap-10 items-center
                p-10 rounded-3xl
                bg-white dark:bg-darkCard
                shadow-lg dark:shadow-xl
                transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl
              "
            >
              {/* LEFT TEXT */}
              <div className="max-w-lg">
                <h3 className="text-3xl font-bold mb-6 tracking-wide text-gray-800 dark:text-accent">
                  {g.title}
                </h3>
                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  {g.description}
                </p>
              </div>

              {/* RIGHT IMAGE */}
              <div className="flex justify-center">
                <div
                  className="
                    bg-gradient-to-br from-accent to-blue-500 
                    rounded-full w-64 h-64 flex items-center justify-center
                    shadow-lg hover:shadow-2xl transition-all duration-500
                  "
                >
                  <div
                    className="
                      bg-white dark:bg-gray-100
                      rounded-full w-56 h-56 flex items-center justify-center
                      overflow-hidden hover:scale-[1.05] transition-transform duration-300
                    "
                  >
                    <img
                      src={g.image}
                      alt={g.title}
                      className="w-44 h-44 object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Animations */}
      <style>{`
        .swiper-pagination-bullet {
          background: #38bdf8; /* accent color */
          opacity: 0.7;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          width: 14px;
          height: 14px;
          background: linear-gradient(90deg,#38bdf8,#3b82f6);
          opacity: 1;
          box-shadow: 0 0 8px #38bdf8;
        }
      `}</style>
    </section>
  );
}
