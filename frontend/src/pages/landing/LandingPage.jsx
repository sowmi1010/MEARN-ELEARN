import React from "react";
import { Link } from "react-router-dom";
import CourseGroups from "../shared/CourseGroups";
import Teachers from "../../components/common/Teachers";
import StudentFeedbacks from "../../components/common/StudentFeedbacks";

export default function LandingPage() {
  return (
    <div className="bg-gray-100 dark:bg-darkBg text-gray-800 dark:text-gray-200 transition-colors duration-300">
      {/* ================= HERO SECTION ================= */}
      <section className="relative flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-16 md:py-24 overflow-hidden">
        {/* Floating Background Shapes */}
        <div className="absolute top-10 -left-32 w-96 h-96 bg-gradient-to-br from-cyan-400 to-blue-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 -right-32 w-96 h-96 bg-gradient-to-br from-pink-400 to-purple-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>

        {/* Hero Text */}
        <div className="max-w-xl relative z-10 animate-fadeInUp">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            <span className="bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent">
              India’s First
            </span>
            <br />
            <span className="text-gray-900 dark:text-gray-100">
              Mentorship Academy
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 italic mb-4">
            From School Bench to Office Desk
          </p>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Learn industry-ready skills from top mentors and transform your
            career journey today.
          </p>
          <div className="flex gap-4">
            <Link
              to="/courses"
              className="
                px-8 py-3 rounded-lg font-semibold text-lg
                bg-gradient-to-r from-accent to-blue-500 text-darkBg
                hover:scale-[1.05] hover:shadow-lg
                transition-all duration-300
              "
            >
              🚀 Explore Courses
            </Link>
            <Link
              to="/register"
              className="
                px-8 py-3 rounded-lg font-semibold text-lg
                border border-accent text-accent
                hover:bg-accent hover:text-darkBg
                transition-all duration-300
              "
            >
              Join Now
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="mt-10 md:mt-0 flex justify-center w-full md:w-1/2 relative z-10 animate-fadeInRight">
          <img
            src="/Hero.png"
            alt="Student learning online"
            className="w-full max-w-md rounded-2xl shadow-2xl hover:scale-[1.03] transition-transform duration-500"
          />
        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section className="relative px-8 md:px-20 py-16 overflow-hidden bg-white dark:bg-darkCard transition-colors duration-300">
        {/* Background Shapes */}
        <div className="absolute top-10 left-0 w-72 h-72 bg-gradient-to-tr from-purple-400 to-pink-400 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-0 w-80 h-80 bg-gradient-to-tr from-green-400 to-yellow-300 opacity-20 rounded-full blur-3xl animate-pulse"></div>

        <div className="relative grid md:grid-cols-2 gap-12 items-center z-10">
          {/* Text Block */}
          <div className="space-y-6 animate-fadeInLeft">
            <h2 className="text-3xl font-extrabold text-accent">
              “YOUR LAST STOP TO SUCCESS!”
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Our academy is the trusted destination for determined students.
              With us, you’ll find the mentorship, guidance, and skills you
              need—no more searching elsewhere.
            </p>
            <h3 className="text-2xl font-bold text-green-500">
              “PLANTING KNOWLEDGE, HARVESTING SUCCESS”
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              The knowledge we plant today grows into tomorrow’s achievements.
              Through expert guidance and hard work, you’ll harvest success in
              exams, careers, and beyond.
            </p>
            <div className="mt-6 text-lg font-semibold text-accent">
              🌟 17,000+ Creators — Yesterday’s kids, tomorrow’s leaders
            </div>
          </div>

          {/* Images with Colored Frames */}
          <div className="grid grid-cols-2 gap-6 animate-fadeInRight">
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-3 rounded-2xl shadow-lg hover:scale-[1.05] transition-transform">
              <img src="/kids.png" alt="Kids Learning" className="rounded-lg" />
            </div>
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-3 rounded-2xl shadow-lg hover:scale-[1.05] transition-transform">
              <img src="/students.png" alt="Students" className="rounded-lg" />
            </div>
            <div className="bg-gradient-to-br from-green-400 to-green-600 p-3 rounded-2xl shadow-lg hover:scale-[1.05] transition-transform">
              <img src="/online.png" alt="Online Class" className="rounded-lg" />
            </div>
            <div className="bg-gradient-to-br from-pink-400 to-red-500 p-3 rounded-2xl shadow-lg hover:scale-[1.05] transition-transform">
              <img src="/mentor.png" alt="Mentor" className="rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= COURSES SECTION ================= */}
      <CourseGroups />

      {/* ================= TEACHERS SECTION ================= */}
      <Teachers />

      {/* ================= STUDENT FEEDBACKS SECTION ================= */}
      <StudentFeedbacks />

      {/* ================= FOOTER ================= */}
      <footer className="py-8 text-center bg-gray-200 dark:bg-darkCard text-gray-700 dark:text-gray-300 mt-8">
        © {new Date().getFullYear()} E-Learn Academy • Empowering Futures 🚀
      </footer>

      {/* ====== Animations ====== */}
      <style>{`
        @keyframes fadeInUp {
          0% {opacity: 0; transform: translateY(20px);}
          100% {opacity: 1; transform: translateY(0);}
        }
        @keyframes fadeInRight {
          0% {opacity: 0; transform: translateX(40px);}
          100% {opacity: 1; transform: translateX(0);}
        }
        @keyframes fadeInLeft {
          0% {opacity: 0; transform: translateX(-40px);}
          100% {opacity: 1; transform: translateX(0);}
        }
        .animate-fadeInUp {animation: fadeInUp 1s ease-out;}
        .animate-fadeInRight {animation: fadeInRight 1s ease-out;}
        .animate-fadeInLeft {animation: fadeInLeft 1s ease-out;}
      `}</style>
    </div>
  );
}
