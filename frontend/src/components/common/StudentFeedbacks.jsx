import React, { useEffect, useState } from "react";
import axios from "axios";

// 👉 Swiper for Carousel
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";

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
        console.error("❌ Fetch feedbacks error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeedbacks();
  }, [apiBase]);

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        Loading feedbacks...
      </div>
    );
  }

  if (!feedbacks.length) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No feedbacks yet.
      </div>
    );
  }

  return (
    <section
      className="
        relative py-16 
        bg-gray-100 dark:bg-gradient-to-b dark:from-darkBg dark:via-darkCard dark:to-darkBg 
        text-gray-800 dark:text-gray-200 
        overflow-hidden transition-colors duration-300
      "
    >
      {/* Decorative background circles */}
      <div className="absolute top-10 -left-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-blue-400/20 dark:bg-green-400/20 rounded-full blur-3xl"></div>

      <div className="relative max-w-5xl mx-auto px-6 z-10">
        <h2
          className="
            text-4xl font-extrabold text-center 
            text-accent mb-14 tracking-wide drop-shadow-lg
          "
        >
          What Our Students Say
        </h2>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          pagination={{ clickable: true }}
          className="rounded-2xl"
        >
          {feedbacks.map((fb) => (
            <SwiperSlide key={fb._id}>
              <div
                className="
                  flex flex-col items-center 
                  bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 
                  p-8 rounded-2xl shadow-md dark:shadow-lg
                  hover:shadow-2xl hover:scale-[1.02]
                  transition-all duration-500
                "
              >
                {/* Student Photo */}
                <div className="relative group mb-6">
                  <img
                    src={
                      fb.photo
                        ? `${apiBase}${
                            fb.photo.startsWith("/") ? fb.photo : "/" + fb.photo
                          }`
                        : "https://via.placeholder.com/150?text=Student"
                    }
                    alt={fb.name}
                    className="
                      w-28 h-28 rounded-full border-4 border-accent
                      shadow-lg object-cover
                      transition-transform duration-500 group-hover:scale-105
                    "
                  />
                  <div className="absolute inset-0 rounded-full border-2 border-accent/30 animate-pulse"></div>
                </div>

                {/* Comment */}
                <p
                  className="
                    text-lg italic text-center leading-relaxed max-w-lg 
                    text-gray-700 dark:text-gray-300
                  "
                >
                  “{fb.comment}”
                </p>

                {/* Student Info */}
                <h3 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
                  {fb.name}
                </h3>
                <p className="text-accent text-lg font-medium">{fb.course}</p>

                {/* Accent line */}
                <div className="mt-4 w-20 h-1 bg-accent rounded-full"></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
