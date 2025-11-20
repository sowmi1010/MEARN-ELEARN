import React, { useEffect, useState } from "react";
import axios from "axios";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    async function fetchTeachers() {
      try {
        const res = await axios.get(`${apiBase}/api/teachers`);
        setTeachers(res.data);
      } catch (err) {
        console.error("Fetch teachers error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTeachers();
  }, [apiBase]);

  if (loading)
    return (
      <div className="text-center py-16 text-gray-500 dark:text-gray-300 text-xl animate-pulse">
        Loading Teachers...
      </div>
    );

  if (!teachers.length)
    return (
      <div className="text-center py-16 text-gray-500 dark:text-gray-300 text-lg italic">
        No teachers added yet.
      </div>
    );

  return (
    <section className="
      relative mx-auto py-20 px-6 md:px-16 
      bg-[#eaf4ff] dark:bg-[#050b18] 
      overflow-hidden
    ">

      {/* MASSIVE PREMIUM BACKGROUND */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-cyan-400/25 dark:bg-cyan-400/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-pink-400/25 dark:bg-pink-400/10 rounded-full blur-3xl"></div>

      {/* Section Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-10 max-w-4xl mx-auto">
        Teachers:
      </h2>

      {/* ====== AUTO MOVING SLIDER ====== */}
      <Swiper
        modules={[Autoplay]}
        slidesPerView={1}
        loop={true}
        spaceBetween={40}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        className="pb-6"
      >
        {teachers.map((t) => (
          <SwiperSlide key={t._id}>
            
            {/* ==== TEACHER CARD ==== */}
            <div
              className="
                bg-white/90 dark:bg-[#0e1625]/80 
                max-w-4xl mx-auto   
                rounded-3xl p-10 md:p-14 
                flex flex-col md:flex-row 
                items-center md:items-start 
                gap-12 shadow-xl 
                backdrop-blur-md 
                border border-gray-200 dark:border-gray-700
                transition-all duration-300
                hover:shadow-2xl
              "
            >

              {/* ==== LEFT IMAGE BLOCK ==== */}
              <div className="relative w-64 h-64 flex-shrink-0">

                {/* UNIFIED COLOR CIRCLES */}
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-cyan-300/40 dark:bg-cyan-300/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-cyan-300/40 dark:bg-cyan-300/20 rounded-full blur-xl"></div>
                <div className="absolute top-10 -right-6 w-20 h-20 bg-cyan-300/30 dark:bg-cyan-300/10 rounded-full blur-xl"></div>

                {/* IMAGE */}
                <div className="relative w-full h-full rounded-full overflow-hidden shadow-lg border-4 border-white dark:border-[#1a2336]">
                  <img
                    src={
                      t.photo
                        ? `${apiBase}${t.photo.startsWith("/") ? t.photo : "/" + t.photo}`
                        : "/no-image.png"
                    }
                    alt={t.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>

              {/* ==== RIGHT TEXT BLOCK ==== */}
              <div className="flex-1 text-gray-700 dark:text-gray-300 text-center md:text-left">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {t.name}
                </h3>

                <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-4">
                  {t.subject}
                </p>

                <p className="leading-relaxed text-gray-600 dark:text-gray-300 text-[15px]">
                  {t.description}
                </p>
              </div>

            </div>

          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
