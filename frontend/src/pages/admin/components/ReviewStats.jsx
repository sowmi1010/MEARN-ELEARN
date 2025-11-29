import React, { useEffect, useState } from "react";
import { FaStar, FaChartLine } from "react-icons/fa";

export default function ReviewStats() {
  const [ratingData, setRatingData] = useState({
    average: 4.6,
    count: 120,
    lastMonth: 4.3,
    breakdown: [2, 3, 10, 25, 80]
  });

  const percentage = Math.round((ratingData.average / 5) * 100);

  // REMOVE API CALL (Avoid 404)
  // NO BACKEND NEEDED

  const improvement = (
    ((ratingData.average - ratingData.lastMonth) / 5) * 100
  ).toFixed(1);

  return (
    <div className="bg-[#0e162b] p-6 rounded-2xl shadow-xl border border-blue-900/40 text-center">
      <h2 className="text-lg font-bold mb-1 text-blue-400 flex items-center gap-2 justify-center">
        <FaChartLine className="text-blue-500" />
        Review Performance
      </h2>

      <div className="relative mt-4 mb-4 w-24 h-24 flex items-center justify-center mx-auto">
        <svg className="absolute w-full h-full -rotate-90">
          <circle cx="48" cy="48" r="40" stroke="#1e293b" strokeWidth="8" fill="none" />
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
          />
        </svg>
        <span className="text-xl font-bold text-blue-300">{percentage}%</span>
      </div>

      <div className="text-4xl font-extrabold text-white mb-2">
        {ratingData.average.toFixed(1)}/5
      </div>

      <div className="flex justify-center gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`text-xl ${
              i < Math.round(ratingData.average)
                ? "text-blue-400"
                : "text-gray-700"
            }`}
          />
        ))}
      </div>

      <p className="text-sm text-gray-400 mb-3">{ratingData.count} total reviews</p>

      <p
        className={`text-sm font-semibold ${
          improvement >= 0 ? "text-green-400" : "text-red-400"
        }`}
      >
        {improvement >= 0 ? "+" : ""}
        {improvement}% from last month
      </p>

      <div className="w-full mt-5 space-y-2">
        {[5, 4, 3, 2, 1].map((star, index) => {
          const count = ratingData.breakdown[5 - star];
          const pct =
            ratingData.count === 0 ? 0 : Math.round((count / ratingData.count) * 100);

          return (
            <div key={star} className="flex items-center gap-2">
              <span className="text-xs text-gray-300 w-6">{star}★</span>
              <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: `${pct}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-400 w-10 text-right">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
