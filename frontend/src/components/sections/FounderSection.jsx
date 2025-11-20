import React from "react";

export default function FounderSection() {
  return (
    <section className="relative w-full py-20 px-6 md:px-16 bg-gradient-to-b from-white to-[#e8fff5] dark:from-[#03120b] dark:to-[#022015] overflow-hidden">

      {/* === Decorative Glows === */}
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-green-300/20 dark:bg-green-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-yellow-300/20 dark:bg-yellow-600/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* === Section Title === */}
        <h2 className="text-center text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-10 tracking-wide">
          Founder & CEO
          <span className="mx-3 text-green-500 dark:text-green-300">•</span>
          Last Try Academy
        </h2>

        {/* === Founder Card === */}
        <div className="
          bg-white/70 dark:bg-[#062012]/60 
          backdrop-blur-xl 
          border border-green-200 dark:border-green-900/40 
          rounded-3xl p-10 md:p-16 
          shadow-2xl
          transition-all
          duration-500
        ">

          {/* === Profile Image + Name === */}
          <div className="flex flex-col items-center text-center">
            
            <div className="relative w-56 h-56 md:w-64 md:h-64">
              {/* Colored Floating Blobs */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-green-200/60 dark:bg-green-900/40 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-6 -right-4 w-20 h-20 bg-amber-200/60 dark:bg-amber-900/40 rounded-full animate-ping"></div>

              {/* Circle Image */}
              <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-white dark:border-green-800">
                <img
                  src="./founder.jpg"
                  alt="Founder"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Name */}
            <h2 className="
              mt-6 
              text-3xl md:text-4xl 
              font-extrabold 
              text-gray-900 dark:text-white
              tracking-wide
            ">
              Dhanush M
            </h2>

            {/* Role */}
            <p className="text-lg font-semibold text-green-700 dark:text-green-300 mt-1">
              Founder • Mentor • Trainer
            </p>
          </div>

          {/* === BIO TEXT === */}
          <div className="mt-12 space-y-6 text-center text-gray-800 dark:text-gray-200 text-[16px] md:text-[17px] leading-relaxed font-[Poppins]">

            <p className="animate-fadeIn">
              I am a confident and dedicated individual with a passion for teaching,
              leadership, and student development. With a strong foundation in
              Criminology & Police Administration from Madras University and a proud
              background as an NCC Cadet (Best Cadet – IGC/RDC), I bring discipline,
              motivation, and structured learning methodologies into education.
            </p>

            <p className="animate-fadeIn">
              My journey includes teaching DRILL & life skills, training students in
              adventure activities such as obstacle courses, rappelling & rock climbing,
              and mentoring young minds across respected institutions. My mission is to
              guide students from their early academic stages to their professional
              careers with confidence and clarity.
            </p>

          </div>

          {/* === QUOTE === */}
          <div className="
            text-center 
            mt-10 
            text-xl md:text-2xl 
            font-semibold 
            italic 
            text-green-700 dark:text-green-300
          ">
            “Planting Knowledge, Harvesting Success”
          </div>

        </div>
      </div>

      {/* === Smooth Fade Animation === */}
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
