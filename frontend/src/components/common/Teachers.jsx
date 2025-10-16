import React, { useEffect, useState } from "react";
import axios from "axios";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";

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

  if (loading) {
    return (
      <div className="text-center py-16 text-gray-500 dark:text-gray-400 text-xl animate-pulse font-light tracking-wide">
        Loading Teachers...
      </div>
    );
  }

  if (!teachers.length) {
    return (
      <div className="text-center py-16 text-gray-500 dark:text-gray-400 text-lg italic">
        No teachers added yet.
      </div>
    );
  }

  return (
    <section
      className="
        relative py-20 
        bg-gray-100 dark:bg-gradient-to-b dark:from-darkBg dark:via-darkCard dark:to-darkBg 
        text-gray-800 dark:text-gray-200 
        overflow-hidden transition-colors duration-300 font-[Poppins]
      "
    >
      {/* Decorative Background Blurs */}
      <div className="absolute top-16 -left-32 w-[22rem] h-[22rem] bg-pink-400/20 dark:bg-pink-400/10 rounded-full blur-[150px] animate-pulse"></div>
      <div className="absolute bottom-20 -right-32 w-[28rem] h-[28rem] bg-cyan-400/20 dark:bg-cyan-400/10 rounded-full blur-[150px] animate-pulse"></div>

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        {/* Heading */}
        <h2
          className="
            text-center text-4xl md:text-5xl font-extrabold 
            bg-clip-text text-transparent 
            bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-500
            drop-shadow-lg tracking-wide leading-snug mb-10
          "
        >
          Meet Our Star Teachers
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 text-lg max-w-3xl mx-auto mb-14 font-light">
          Our expert educators inspire students with 
          <span className="text-cyan-500 font-medium"> knowledge</span>, 
          <span className="text-pink-500 font-medium"> passion</span> and 
          <span className="text-purple-500 font-medium"> dedication</span> to help them achieve their dreams.
        </p>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={40}
          centeredSlides={true}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 2800, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {teachers.map((teacher) => (
            <SwiperSlide key={teacher._id}>
              <div
                className="
                  group relative overflow-hidden 
                  bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 
                  rounded-3xl p-6 shadow-md dark:shadow-lg
                  hover:shadow-2xl hover:-translate-y-3
                  transition-all duration-500
                "
              >
                {/* 🖼️ Teacher Photo */}
                <div className="relative w-44 h-44 mx-auto rounded-full overflow-hidden border-4 border-cyan-400 shadow-lg group-hover:scale-105 transition-transform duration-500">
                  <img
                    src={
                      teacher.photo
                        ? `${apiBase}${
                            teacher.photo.startsWith("/")
                              ? teacher.photo
                              : "/" + teacher.photo
                          }`
                        : "https://via.placeholder.com/300x300?text=No+Image"
                    }
                    alt={teacher.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* 📄 Info Section */}
                <div className="mt-6 text-center">
                  <h3
                    className="
                      text-2xl font-bold tracking-wide 
                      text-gray-900 dark:text-white 
                      group-hover:text-cyan-400 transition-colors duration-300
                    "
                  >
                    {teacher.name}
                  </h3>
                  <p className="text-lg font-semibold text-cyan-500 italic mt-1">
                    {teacher.subject}
                  </p>
                  <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed font-light px-3">
                    {teacher.description}
                  </p>
                </div>

                {/* Accent Underline */}
                <div className="mt-6 mx-auto w-24 h-1 bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-500 rounded-full"></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
