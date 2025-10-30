import React from "react";
import { Link } from "react-router-dom";
import CourseGroups from "../shared/CourseGroups";
import Teachers from "../../components/common/Teachers";
import StudentFeedbacks from "../../components/common/StudentFeedbacks";

export default function LandingPage() {
  return (
    <div className="bg-gray-50 dark:bg-darkBg text-gray-800 dark:text-gray-200 transition-colors duration-300 font-sans">
      {/* ================= HERO SECTION ================= */}
      <section className="relative flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-20 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-800 dark:to-gray-900">
        {/* Floating Background Shapes */}
        <div className="absolute top-16 -left-32 w-96 h-96 bg-gradient-to-br from-cyan-400 to-blue-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 -right-32 w-96 h-96 bg-gradient-to-br from-pink-400 to-purple-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>

        {/* Hero Text */}
        <div className="max-w-xl relative z-10 space-y-6 animate-fadeInUp">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              India&apos;s First
            </span>{" "}
            <br /> Mentorship Academy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 italic">
            Bridging the gap <strong>"From School Bench to Office Desk"</strong>
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed">
            Learn industry-ready skills from top mentors and transform your
            future with confidence and clarity.
          </p>
          <div className="flex gap-4 mt-6">
            <Link
              to="/courses"
              className="px-8 py-3 rounded-xl font-semibold text-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg hover:scale-[1.05] hover:shadow-2xl transition-all duration-300"
            >
              Explore Courses
            </Link>
            <Link
              to="/register"
              className="px-8 py-3 rounded-xl font-semibold text-lg border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-white transition-all duration-300"
            >
              Join Now
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="mt-10 md:mt-0 flex justify-center w-full md:w-1/2 relative z-10 animate-fadeInRight">
          <img
            src="/MEARN-ELEARN/Hero.png"
            alt="Student learning online"
            className="w-full max-w-md rounded-3xl shadow-2xl hover:scale-[1.03] transition-transform duration-500"
          />
        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section className="relative px-8 md:px-20 py-20 overflow-hidden bg-white dark:bg-darkCard">
        {/* Decorative Shapes */}
        <div className="absolute top-16 left-0 w-72 h-72 bg-gradient-to-tr from-purple-400 to-pink-400 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-0 w-80 h-80 bg-gradient-to-tr from-green-400 to-yellow-300 opacity-20 rounded-full blur-3xl animate-pulse"></div>

        <div className="relative grid md:grid-cols-2 gap-14 items-center z-10">
          {/* Text Block */}
          <div className="space-y-8 animate-fadeInLeft">
            <h2 className="text-4xl font-extrabold text-cyan-600">
              “YOUR LAST STOP TO SUCCESS!”
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              Our academy is the trusted destination for determined students.
              With us, you’ll find the mentorship, guidance, and skills you
              need—no more searching elsewhere.
            </p>
            <h3 className="text-2xl font-bold text-green-600">
              “PLANTING KNOWLEDGE, HARVESTING SUCCESS”
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              The knowledge we plant today grows into tomorrow’s achievements.
              Through expert guidance and hard work, you’ll harvest success in
              exams, careers, and beyond.
            </p>
            <div className="mt-6 text-lg font-semibold text-cyan-600">
               17,000+ Creators — Yesterday’s kids, tomorrow’s leaders
            </div>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 gap-6 animate-fadeInRight">
            {[
              { src: "/MEARN-ELEARN/kids.png", from: "from-blue-400 to-blue-600" },
              { src: "/MEARN-ELEARN/students.png", from: "from-yellow-400 to-yellow-500" },
              { src: "/MEARN-ELEARN/online.png", from: "from-green-400 to-green-600" },
              { src: "/MEARN-ELEARN/mentor.png", from: "from-pink-400 to-red-500" },
            ].map((img, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br ${img.from} p-3 rounded-2xl shadow-lg hover:scale-[1.05] transition-transform`}
              >
                <img src={img.src} alt="" className="rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= COURSES SECTION ================= */}
      <CourseGroups />

      {/* ================= TEACHERS SECTION ================= */}
      <Teachers />

      {/* ================= STUDENT FEEDBACKS ================= */}
      <StudentFeedbacks />

      {/* ================= ABOUT US / VISION ================= */}
      <section className="px-8 md:px-20 py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="grid md:grid-cols-2 gap-14 items-start">
          {/* Left Text */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-cyan-600 mb-4">
                About Us:
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                <span className="font-semibold">Last Try Academy</span> is
                India&apos;s first mentorship academy that aims to bridge the
                gap{" "}
                <span className="font-semibold text-blue-500">
                  "From School Bench To Office Desk"
                </span>{" "}
                — we are committed to being{" "}
                <span className="font-semibold text-green-600">
                  "Your Last Stop to Success!"
                </span>
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">
                Our Vision
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                To nurture, guide, and mentor every child from their school
                bench to their office desk, ensuring they develop skills and
                confidence to succeed in life.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">
                Our Mission
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Provide high-quality mentorship and education</li>
                <li>Support students at every stage of their journey</li>
                <li>Offer lifetime guidance for every enrolled student</li>
                <li>Cultivate life skills and moral values</li>
              </ul>
            </div>
          </div>

          {/* Right Offers */}
          <div className="bg-yellow-50 dark:bg-yellow-200/20 rounded-3xl p-8 shadow-lg">
            <h3 className="text-2xl font-extrabold text-yellow-700 dark:text-yellow-400 mb-6">
              What We Offer
            </h3>
            {[
              {
                title: "For School Students (1st–12th)",
                items: [
                  "Academic classes and concept clarity",
                  "Soft skills development",
                  "Motivational and life skills coaching",
                  "Creative activities and assessments",
                ],
              },
              {
                title: "For Career-Oriented Students",
                items: [
                  "Competitive exam preparation",
                  "Interview readiness training",
                  "Resume building and career counselling",
                  "Financial literacy basics",
                ],
              },
              {
                title: "For Parents",
                items: [
                  "Child education counselling",
                  "Parent-child communication workshops",
                ],
              },
            ].map((block, idx) => (
              <div key={idx} className="mb-6">
                <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">
                  {block.title}
                </h4>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                  {block.items.map((it, i) => (
                    <li key={i}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FOUNDER & CEO ================= */}
      <section className="relative px-6 md:px-20 py-20 bg-gradient-to-b from-green-50 via-emerald-50 to-green-100 dark:from-green-950 dark:via-green-900/80 dark:to-emerald-800/50 overflow-hidden">
        {/* Decorative Glow Shapes */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-green-300/20 dark:bg-green-700/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-300/20 dark:bg-emerald-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>

        <div className="max-w-5xl mx-auto relative bg-gradient-to-br from-green-100/80 via-emerald-50/90 to-green-200/70 dark:from-green-800/40 dark:via-green-700/40 dark:to-emerald-800/40 rounded-3xl p-10 md:p-14 shadow-2xl hover:shadow-green-300/40 dark:hover:shadow-green-700/40 transition-shadow duration-500 backdrop-blur-lg">
          {/* Profile Section */}
          <div className="flex flex-col items-center text-center">
            <div className="relative w-44 h-44 rounded-full overflow-hidden shadow-xl border-4 border-green-500/70 dark:border-green-400/50 group hover:scale-[1.05] transition-transform duration-300">
              <img
                src="/MEARN-ELEARN/founder.jpg"
                alt="Founder & CEO"
                className="w-full h-full object-cover group-hover:grayscale-0 grayscale transition-all duration-500"
              />
              {/* Glow Ring */}
              <div className="absolute inset-0 rounded-full border-4 border-green-400/20 animate-ping"></div>
            </div>

            <h3 className="mt-6 text-lg md:text-xl font-semibold text-green-700 dark:text-green-300 tracking-wide">
              Founder & CEO – Last Try Academy
            </h3>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-2 bg-gradient-to-r from-green-700 to-emerald-500 dark:from-green-300 dark:to-emerald-200 bg-clip-text text-transparent drop-shadow">
              Dhanush M
            </h2>
          </div>

          {/* Bio Section */}
          <div className="mt-10 text-left space-y-6 text-lg md:text-xl leading-relaxed text-gray-700 dark:text-gray-300">
            <p className="relative pl-6 border-l-4 border-green-400/70 dark:border-green-500/60 hover:translate-x-1 transition-transform duration-300">
              <span className="text-green-600 dark:text-green-400 font-bold">
                •
              </span>{" "}
              I am a confident and dedicated individual with a passion for
              teaching, leadership, and skill development. With a strong
              background in Criminology and Police Administration from Madras
              University, and hands-on experience as an NCC Cadet (Best Cadet in
              IGC/RDC), I bring discipline, creativity, and management skills
              into the educational sector.
            </p>

            <p className="relative pl-6 border-l-4 border-green-400/70 dark:border-green-500/60 hover:translate-x-1 transition-transform duration-300">
              <span className="text-green-600 dark:text-green-400 font-bold">
                •
              </span>{" "}
              My journey includes teaching DRILL and life skills to students in
              various reputed institutions, conducting adventure training in
              obstacle courses, rappelling, rock climbing, and more. I believe
              in nurturing young minds from their roots to their professional
              careers, helping them succeed with proper guidance, motivation,
              and mentorship.
            </p>
          </div>
        </div>

        {/* Floating Quote */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center text-green-700/60 dark:text-green-300/40 text-sm md:text-base italic animate-bounce">
          “Planting Knowledge, Harvesting Success”
        </div>

        {/* Animations */}
        <style>{`
    @keyframes bounce {
      0%, 100% {transform: translateY(0);}
      50% {transform: translateY(-5px);}
    }
  `}</style>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-gray-300 pt-14 pb-6">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <img
                src="/MEARN-ELEARN/logo.png"
                alt="Last Try Academy Logo"
                className="w-12 h-12 rounded-full bg-white"
              />
              <h2 className="text-xl font-bold text-white tracking-wide">
                LAST TRY ACADEMY
              </h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering students with mentorship, guidance, and career-ready
              skills for a brighter tomorrow.
            </p>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4 uppercase">
              Get Help
            </h3>
            <ul className="space-y-2 text-sm">
              {["Contact Us", "Latest Articles", "FAQ"].map((link, i) => (
                <li key={i}>
                  <a href="#" className="hover:text-cyan-400 transition">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4 uppercase">
              Programs
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                "Art & Design",
                "Business",
                "IT & Software",
                "Languages",
                "Programming",
              ].map((prog, i) => (
                <li key={i}>
                  <a href="#" className="hover:text-cyan-400 transition">
                    {prog}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4 uppercase">
              Contact Us
            </h3>
            <p className="text-gray-400 text-sm">Chennai, India</p>
            <p className="text-gray-400 text-sm">Tel: +91-7603983212</p>
            <p className="text-gray-400 text-sm">
              Mail:{" "}
              <a
                href="mailto:lasttryacademy@gmail.com"
                className="hover:text-cyan-400 transition"
              >
                lasttryacademy@gmail.com
              </a>
            </p>
            <div className="flex gap-5 mt-4 text-xl">
              <a href="#" className="hover:text-red-500 transition">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="hover:text-pink-500 transition">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="hover:text-blue-500 transition">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="hover:text-gray-300 transition">
                <i className="fab fa-x-twitter"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} | Powered by{" "}
          <span className="text-cyan-400 font-semibold">
            One Last Try EduTech Pvt. Ltd.
          </span>
        </div>
      </footer>

      {/* ===== Animations ===== */}
      <style>{`
        @keyframes fadeInUp {0%{opacity:0;transform:translateY(20px);}100%{opacity:1;transform:translateY(0);}}
        @keyframes fadeInRight {0%{opacity:0;transform:translateX(40px);}100%{opacity:1;transform:translateX(0);}}
        @keyframes fadeInLeft {0%{opacity:0;transform:translateX(-40px);}100%{opacity:1;transform:translateX(0);}}
        .animate-fadeInUp {animation: fadeInUp 1s ease-out;}
        .animate-fadeInRight {animation: fadeInRight 1s ease-out;}
        .animate-fadeInLeft {animation: fadeInLeft 1s ease-out;}
      `}</style>
    </div>
  );
}
