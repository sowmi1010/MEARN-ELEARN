import React, { useEffect, useState } from "react";
import axios from "axios";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import StatsSection from "./StatsSection";

export default function StudentFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    async function fetchFeedbacks() {
      try {
        const res = await axios.get(`${apiBase}/api/feedbacks`);
        setFeedbacks(res.data || []);
      } catch (err) {
        console.error("Fetch feedbacks error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeedbacks();
  }, [apiBase]);

  if (loading)
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-300">
        Loading feedbacks...
      </div>
    );

  if (!feedbacks.length)
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-300">
        No feedbacks yet.
      </div>
    );

  return (
    <section className="relative w-full py-20 px-6 md:px-16 lg:px-24 bg-white dark:bg-[#050b18] overflow-hidden">
      {/* ===== Decorative Students Images ===== */}
      <img
        src="/st2.png"
        className="hidden md:block absolute left-6 lg:left-12 top-24 w-24 md:w-48 lg:w-56 rotate-[-10deg] opacity-90 pointer-events-none"
      />
      <img
        src="/st3.png"
        className="hidden md:block absolute right-6 lg:right-12 top-24 w-24 md:w-48 lg:w-56 rotate-[10deg] opacity-90 pointer-events-none"
      />

      {/* ===== Heading ===== */}
      <div className="flex flex-col items-center gap-3 mb-16 relative z-10">
        <div className="px-8 py-2 border border-gray-400 rounded-full bg-white dark:bg-gray-900 text-lg font-semibold shadow-md font-[Mulish]">
          Student Feedbacks
        </div>

        <p className="text-center text-gray-600 dark:text-gray-300 text-lg md:text-xl font-[Mulish]">
          What Students Say About Last Try Academy
        </p>
      </div>

      {/* ===== Slider ===== */}
      <Swiper
        modules={[Autoplay]}
        slidesPerView={1}
        spaceBetween={40}
        loop
        autoplay={{ delay: 2600, disableOnInteraction: false }}
        breakpoints={{
          768: { slidesPerView: 2 },
        }}
        className="relative z-10"
      >
        {feedbacks.map((fb) => (
          <SwiperSlide key={fb._id}>
            <div
              className="
      relative 
      rounded-3xl 
      bg-white/70 dark:bg-[#0f1828]/80 
      backdrop-blur-xl 
      border border-gray-200 dark:border-gray-700 
      shadow-xl
      p-8 
      flex flex-col 
      md:flex-col lg:flex-row              /* ← tablet fix */
      items-center lg:items-start
      gap-10
      transition-all duration-500
      hover:scale-[1.02] hover:shadow-2xl
      animate-slideUp
      max-w-[95%] mx-auto
    "
            >
              {/* QUOTE + COMMENT */}
              <div
                className="
        w-full 
        text-center lg:text-left            /* ← better alignment */
        font-[Mulish] 
        text-gray-700 dark:text-gray-300 
        leading-relaxed text-[15px] 
        relative
      "
              >
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 text-4xl opacity-40">
                  ❝
                </span>

                {fb.comment}

                <span className="absolute -bottom-4 right-1/2 translate-x-1/2 lg:right-0 lg:translate-x-0 text-4xl opacity-40">
                  ❞
                </span>
              </div>

              {/* IMAGE BLOCK */}
              <div className="relative mt-6 lg:mt-0">
                <div
                  className="
          w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 
          rounded-full overflow-hidden 
          bg-white 
          shadow-xl 
          ring-4 ring-cyan-400/30 
          hover:ring-cyan-500/60 
          transition-all duration-500 
          mx-auto
        "
                >
                  <img
                    src={
                      fb.photo
                        ? `${apiBase}${
                            fb.photo.startsWith("/") ? fb.photo : "/" + fb.photo
                          }`
                        : "https://via.placeholder.com/200?text=Student"
                    }
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Name Tag */}
                <div
                  className="
          absolute 
          -bottom-4 left-1/2 -translate-x-1/2 
          bg-white dark:bg-[#1c2436] 
          px-4 py-1 rounded-full 
          shadow-lg 
          text-center w-max 
        "
                >
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                    {fb.name}
                  </h3>
                  <p className="text-cyan-700 dark:text-cyan-400 text-xs">
                    {fb.course}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Stats Section Below */}
      <StatsSection />

      {/* ===== Animations ===== */}
      <style>{`
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.9s ease-out;
        }
      `}</style>
    </section>
  );
}
