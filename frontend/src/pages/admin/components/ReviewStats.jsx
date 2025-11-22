import React from "react";
import { FaStar, FaChartLine } from "react-icons/fa";

export default function ReviewStats() {
  const rating = 4.6;
  const percentage = Math.round((rating / 5) * 100);

  return (
    <div className="
      bg-[#0e162b]
      p-6
      rounded-2xl
      shadow-xl
      border border-blue-900/40
      flex flex-col
      items-center
      justify-center
      text-center
    ">
      <h2 className="text-lg font-bold mb-1 text-blue-400 flex items-center gap-2">
        <FaChartLine className="text-blue-500" />
        Review Performance
      </h2>

      {/* % Circle */}
      <div className="relative mt-4 mb-4 w-24 h-24 flex items-center justify-center">
        <svg className="absolute w-full h-full -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="#1e293b"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="#3b82f6"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 40}
            strokeDashoffset={
              2 * Math.PI * 40 - (percentage / 100) * (2 * Math.PI * 40)
            }
            className="transition-all duration-700"
          />
        </svg>

        <span className="text-xl font-bold text-blue-300">
          {percentage}%
        </span>
      </div>

      {/* Rating */}
      <div className="text-4xl font-extrabold text-white mb-2">
        {rating}/5
      </div>

      {/* Stars */}
      <div className="flex justify-center gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`text-xl ${
              i < Math.floor(rating)
                ? "text-blue-400"
                : "text-gray-600"
            }`}
          />
        ))}
      </div>

      <p className="text-sm text-gray-400">
        +4% better than last month
      </p>
    </div>
  );
}
