import React from "react";

export default function HeroSection() {
  return (
    <section
      className="relative w-full min-h-[100vh] flex flex-col px-6 md:px-16 lg:px-24 bg-cover bg-center bg-no-repeat dark:bg-gray-900 "
      style={{ backgroundImage: "url('/bg-hero.png')" }}
    >
      {/* Decorative Logo Circle */}
      <img
        src="/biglogo.png"
        className=" hidden md:block absolute top-6 right-60 w-90 h-48 object-cover"
      />
      <img
        src="/online.png"
        className=" hidden md:block absolute top-56 right-60 h-64 object-cover"
      />
      {/* LEFT TEXT BLOCK */}
      <div className="max-w-6xl space-y-6 mt-6">
        <h1 className=" text-3xl md:text-4xl lg:text-5xl font-surfer text-gray-900 dark:text-white leading-tight">
          India&apos;s First Mentorship Academy
        </h1>
        <p className=" text-3xl font-risque text-gray-800 text-center  dark:text-gray-300 tracking-wide gap-2">
          {" "}
          From School Bench <span className="text-3xl">to</span> Office Desk
        </p>
      </div>

      {/* RIGHT SIDE — BOY IMAGE */}
      <div className="absolute md:static right-6 bottom-0 md:w-1/2 flex justify-center z-10">
        <img
          src="/boy-hero.png"
          alt="Student boy"
          className="w-full drop-shadow-2xl select-none hover:scale-[1.03] transition-transform duration-500"
        />
      </div>
    </section>
  );
}
