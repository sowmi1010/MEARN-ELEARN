import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import { BsStars } from "react-icons/bs";

export default function PaymentSuccess() {
  const { state } = useLocation(); // title, price, etc

  return (
    <div className="min-h-screen bg-white dark:bg-[#050b18] flex items-center justify-center px-4 py-10 relative overflow-hidden">

      {/* Floating gradient lights */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-400/20 blur-3xl rounded-full" />
      <div className="absolute bottom-16 right-10 w-72 h-72 bg-purple-500/20 blur-3xl rounded-full" />
      <div className="absolute top-1/3 right-1/2 w-60 h-60 bg-indigo-400/10 blur-3xl rounded-full" />

      <div className="relative w-full max-w-2xl bg-white/80 dark:bg-[#0d172b]/90 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_25px_70px_rgba(15,23,42,0.45)] text-center">

        {/* SUCCESS ICON */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-500/10 p-6 rounded-full animate-pulse">
            <FiCheckCircle className="text-green-500 text-7xl" />
          </div>
        </div>

        {/* TITLE */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-green-600 dark:text-green-400">
          Payment Successful!
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mt-2 flex items-center justify-center gap-2">
          <BsStars className="text-yellow-400" /> Welcome to Last Try Academy
        </p>

        {/* COURSE INFO */}
        {state?.title && (
          <div className="mt-6 bg-white/70 dark:bg-[#121b2e]/80 rounded-2xl p-5 shadow-inner border border-white/10">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              You have successfully enrolled in
            </p>

            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {state.title}
            </h2>

            {state.standard && (
              <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                {state.standard} • {state.board} • {state.language}
              </p>
            )}
          </div>
        )}

        {/* STATUS STEPS */}
        <div className="flex justify-center mt-6 gap-6 text-sm">
          <div className="flex items-center gap-1 text-green-600">
            ✅ Payment Done
          </div>
          <div className="flex items-center gap-1 text-green-600">
            ✅ Course Activated
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-center gap-5 mt-10">

          <Link
            to="/student/courses"
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-full font-bold shadow-lg hover:scale-105 transition"
          >
            Go To My Courses
          </Link>

          <Link
            to="/"
            className="w-full sm:w-auto px-8 py-3 bg-gray-500/80 text-white rounded-full font-bold shadow-lg hover:bg-gray-600 transition"
          >
            Back To Home
          </Link>

        </div>

        {/* FOOTER TEXT */}
        <p className="mt-8 text-xs text-gray-400">
          Thank you for choosing <span className="text-indigo-500">Last Try Academy</span>.  
          Your learning journey starts now
        </p>

      </div>
    </div>
  );
}
