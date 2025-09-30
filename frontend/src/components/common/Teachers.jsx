import React, { useEffect, useState } from "react";
import axios from "axios";

// 👉 Swiper imports
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
        console.error("❌ Fetch teachers error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTeachers();
  }, [apiBase]);

  if (loading) {
    return (
      <div className="text-center py-16 text-gray-400 text-xl animate-pulse font-light tracking-wide">
        Loading Teachers...
      </div>
    );
  }

  if (!teachers.length) {
    return (
      <div className="text-center py-16 text-gray-500 text-lg italic">
        No teachers added yet.
      </div>
    );
  }

  return (
    <section className="relative py-24 bg-gradient-to-b from-darkBg via-darkCard to-darkBg text-gray-200 overflow-hidden font-[Poppins]">
      {/* ✨ Decorative Background */}
      <div className="absolute top-16 -left-32 w-[28rem] h-[28rem] bg-gradient-to-r from-pink-400/20 to-cyan-400/20 rounded-full blur-[150px] animate-pulse"></div>
      <div className="absolute bottom-20 -right-32 w-[32rem] h-[32rem] bg-gradient-to-r from-purple-500/20 to-blue-400/20 rounded-full blur-[150px] animate-pulse"></div>

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        {/* 🏆 Heading */}
        <h2 className="text-center text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-500 drop-shadow-2xl tracking-wide leading-snug mb-16">
          Meet Our Star Teachers
        </h2>
        <p className="text-center text-gray-400 text-lg max-w-3xl mx-auto mb-14 font-light">
          Our highly experienced and passionate educators guide students to achieve their dreams with
          <span className="text-cyan-400 font-medium"> knowledge</span>, 
          <span className="text-pink-400 font-medium"> skills</span>, and
          <span className="text-purple-400 font-medium"> dedication</span>.
        </p>

        {/* 🔥 Swiper Carousel */}
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={40}
          centeredSlides={true}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {teachers.map((teacher) => (
            <SwiperSlide key={teacher._id}>
              <div className="group relative bg-gradient-to-br from-gray-800/70 to-gray-900/40 backdrop-blur-lg rounded-3xl p-6 shadow-[0_0_25px_rgba(0,0,0,0.5)] hover:shadow-[0_0_50px_rgba(0,200,255,0.5)] transition-all duration-500 transform hover:-translate-y-4 overflow-hidden">
                
                {/* ✨ Neon Glow Effects */}
                <div className="absolute -top-12 -left-12 w-44 h-44 bg-cyan-400/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
                <div className="absolute bottom-4 -right-8 w-20 h-20 bg-pink-400/30 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700"></div>

                {/* 🖼️ Teacher Photo */}
                <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-cyan-400 shadow-xl group-hover:scale-105 transition-transform duration-500">
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
                  <h3 className="text-2xl font-bold tracking-wide text-white group-hover:text-cyan-300 transition-colors duration-300">
                    {teacher.name}
                  </h3>
                  <p className="text-lg font-semibold text-cyan-400 italic mt-1 tracking-wide">
                    {teacher.subject}
                  </p>
                  <p className="mt-3 text-gray-300 text-sm leading-relaxed font-light px-2">
                    {teacher.description}
                  </p>
                </div>

                {/* 🌈 Accent Underline */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-500 animate-pulse"></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
