import React from "react";
import { Link } from "react-router-dom";
import CourseGroups from "../shared/CourseGroups";
import Teachers from "../../components/common/Teachers";
import StudentFeedbacks from "../../components/common/StudentFeedbacks";

export default function LandingPage() {
  return (
    <div className="bg-darkBg text-gray-200">
      {/* ================= HERO SECTION ================= */}
      <section className="flex flex-col md:flex-row items-center justify-between p-12 md:p-20 relative overflow-hidden">
        {/* Background shape */}
        <div className="absolute top-0 -left-20 w-96 h-96 bg-accent opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-green-400 opacity-10 rounded-full blur-3xl"></div>

        {/* Content */}
        <div className="max-w-xl relative z-10">
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            <span className="text-accent">India's First</span> <br />
            Mentorship Academy
          </h1>
          <p className="text-lg text-gray-300 mb-4 italic">
            From School Bench to Office Desk
          </p>
          <p className="text-gray-400 mb-8">
            Learn industry-ready skills from experts and mentors. Start your
            journey today and transform your career
          </p>
          <div className="flex gap-4">
            <Link
              to="/courses"
              className="bg-accent text-darkBg px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Explore Courses →
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="mt-10 md:mt-0 flex justify-center w-full md:w-1/2 relative z-10">
          <img
            src="/Hero.png"
            alt="Student learning online"
            className="w-full max-w-md rounded-xl shadow-2xl"
          />
        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section className="relative bg-darkCard p-12 md:p-20 overflow-hidden">
        {/* Background shape */}
        <div className="absolute top-10 left-0 w-80 h-80 bg-accent opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-0 w-96 h-96 bg-purple-500 opacity-10 rounded-full blur-3xl"></div>

        <div className="relative grid md:grid-cols-2 gap-10 items-center z-10">
          {/* Text */}
          <div>
            <h2 className="text-3xl font-bold text-accent mb-6">
              "YOUR LAST STOP TO SUCCESS!"
            </h2>
            <p className="text-gray-300 mb-6">
              Our academy is the final and trusted destination for students
              determined to achieve their goals. Once you join us, you no longer
              need to search elsewhere for guidance.
            </p>
            <h2 className="text-2xl font-bold text-green-400 mb-4">
              "PLANTING KNOWLEDGE, HARVESTING SUCCESS"
            </h2>
            <p className="text-gray-400">
              The knowledge we provide today is like planting seeds. With
              dedication, guidance, and effort, these seeds grow into the fruits
              of success in exams and life.
            </p>
            <div className="mt-8 text-accent font-bold text-lg">
              17,000+ Creators — Yesterday’s kids, tomorrow’s leaders
            </div>
          </div>

          {/* Images with colored shapes */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-blue-500 p-4 rounded-2xl shadow-lg flex justify-center items-center">
              <img src="/kids.png" alt="Kids Learning" className="rounded-lg" />
            </div>
            <div className="bg-yellow-400 p-4 rounded-2xl shadow-lg flex justify-center items-center">
              <img src="/students.png" alt="Student" className="rounded-lg" />
            </div>
            <div className="bg-green-500 p-4 rounded-2xl shadow-lg flex justify-center items-center">
              <img
                src="/online.png"
                alt="Online Class"
                className="rounded-lg"
              />
            </div>
            <div className="bg-red-500 p-4 rounded-2xl shadow-lg flex justify-center items-center">
              <img src="/mentor.png" alt="Mentor" className="rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= COURSES SECTION ================= */}
      <CourseGroups />
      {/* ================= TEACHERS SECTION ================= */}
      <div>
        <Teachers />
      </div>
      {/* ================= STUDENT FEEDBACKS SECTION ================= */}
      <StudentFeedbacks />

      {/* ================= FOOTER ================= */}
    </div>
  );
}
