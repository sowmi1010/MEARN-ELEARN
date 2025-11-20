import React from "react";

export default function LearningSection() {
  return (
    <section
      className="
        relative w-full 
        px-6 md:px-16 lg:px-32 xl:px-48 
        py-20 
        bg-cover bg-center bg-no-repeat
        dark:bg-darkCard
      "
      style={{ backgroundImage: "url('/union.png')" }}
    >
      {/* LEFT VERTICAL IMAGE — NOW RESPONSIVE */}
      <img
        src="/learning.png"
        alt="Learning"
        className="
          absolute hidden lg:block 
          left-6 xl:left-10 top-10 
          h-[85%] max-h-[650px] 
          object-contain opacity-90 
          dark:opacity-75
        "
      />

      {/* MAIN GRID */}
      <div className="relative grid md:grid-cols-2 gap-16 xl:gap-24 z-10">

        {/* LEFT TEXT */}
        <div className="space-y-10 max-w-xl font-mulish">

          {/* Heading 1 */}
          <h2 className="
              text-3xl md:text-4xl lg:text-5xl 
              font-luckiest 
              text-orange-600 
              leading-tight
            ">
            “YOUR LAST STOP TO SUCCESS!”
          </h2>

          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            Our academy is the final and trusted destination for students who
            are determined to achieve their goals. Once you join us, you no
            longer need to search elsewhere for guidance.
          </p>

          {/* Heading 2 */}
          <h3 className="
              text-3xl md:text-4xl lg:text-5xl 
              font-luckiest 
              text-green-600 
              leading-tight
            ">
            “PLANTING KNOWLEDGE,
            <br /> HARVESTING SUCCESS”
          </h3>

          <p className="text-gray-700 dark:text-gray-400 text-lg leading-relaxed">
            We believe that the knowledge we provide today is like planting
            seeds. With dedication, guidance, and effort, these seeds grow into
            the fruits of success in exams and life.
          </p>

          {/* STUDENTS COUNT */}
          <div className="flex items-center gap-4 mt-4">

            {/* Student images */}
            <div className="flex gap-3">
              <img src="/s1.png" className="w-14 h-14 rounded-full object-cover shadow-md" />
              <img src="/s3.png" className="w-14 h-14 rounded-full object-cover shadow-md" />
              <img src="/s4.png" className="w-14 h-14 rounded-full object-cover shadow-md" />
            </div>

            {/* Text */}
            <div className="leading-tight font-mulish">
              <p className="text-xl font-extrabold text-gray-900 dark:text-white">
                150+ STUDENTS
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Yesterday’s Students — tomorrow’s Leader’s
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT CARDS GRID — NOW FULLY RESPONSIVE */}
        <div className="grid grid-cols-2 gap-6 sm:gap-8 md:gap-10 relative">

          {/* Blue Card */}
          <div className="bg-[#2A7BFF] p-6 rounded-full shadow-xl flex items-center justify-center">
            <img src="/l1.png" className="w-full object-contain" />
          </div>

          {/* Yellow Card */}
          <div className="bg-[#FFD12A] p-6 rounded-3xl shadow-xl flex items-center justify-center">
            <img src="/l2.png" className="w-full object-contain" />
          </div>

          {/* Green Card */}
          <div
            className="bg-[#58C13B] p-6 shadow-xl flex items-center justify-center"
            style={{
              borderTopRightRadius: "10px",
              borderBottomLeftRadius: "10px",
              borderBottomRightRadius: "10px",
            }}
          >
            <img src="/l4.png" className="w-full object-contain" />
          </div>

          {/* Orange Card */}
          <div
            className="bg-[#FF6B2E] p-6 shadow-xl flex items-center justify-center"
            style={{
              borderTopRightRadius: "150px",
              borderTopLeftRadius: "10px",
              borderBottomLeftRadius: "10px",
              borderBottomRightRadius: "150px",
            }}
          >
            <img src="/l3.png" className="w-full object-contain" />
          </div>

        </div>
      </div>
    </section>
  );
}
