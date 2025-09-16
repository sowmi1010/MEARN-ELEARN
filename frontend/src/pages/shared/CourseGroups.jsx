import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

import groups from "../../data/courseGroups.json";

export default function CourseGroups() {
  return (
    <section className="p-12 bg-darkBg text-white">
      <h2 className="text-5xl font-extrabold mb-12 text-center tracking-wide font-serif text-accent">
        Course Groups
      </h2>

      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        spaceBetween={40}
        slidesPerView={1}
        loop
        className="pb-12" // space for dots
      >
        {groups.map((g, i) => (
          <SwiperSlide key={i}>
            <div className="max-w-5xl mx-auto">
              <div
                className="grid md:grid-cols-2 gap-10 items-center p-10 rounded-2xl shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
                style={{ background: g.bgColor }}
              >
                {/* Left Side - Text */}
                <div className="max-w-lg">
                  <h3 className="text-3xl font-bold mb-6 font-serif tracking-wide">
                    {g.title}
                  </h3>
                  <p className="text-base leading-relaxed text-gray-100 font-light">
                    {g.description}
                  </p>
                </div>

                {/* Right Side - Circular Image */}
                <div className="flex justify-center">
                  <div className="bg-white rounded-full w-64 h-64 flex items-center justify-center shadow-xl overflow-hidden">
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
    </section>
  );
}
