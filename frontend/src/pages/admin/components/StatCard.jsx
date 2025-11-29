import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

export default function StatCard({
  title,
  value,
  icon,
  color,
  loading = false,
  trend = 0,          // + or - percentage
  currency = false,   // ₹ toggle
}) {
  const isPositive = trend >= 0;

  return (
    <div
      className="
        relative overflow-hidden
        bg-[#0e162b]
        border border-blue-900/30
        p-6 rounded-2xl
        shadow-xl
        hover:shadow-blue-600/20
        transition-all duration-300
        group
      "
    >
      {/* Glow Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${color} opacity-10 blur-2xl group-hover:opacity-20 transition`}
      />

      <div className="relative z-10">
        {/* CARD HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-blue-400 font-semibold">
              {title}
            </h3>

            {/* VALUE */}
            <p className="text-4xl font-extrabold mt-2 text-white">
              {loading ? (
                <span className="animate-pulse text-gray-500">...</span>
              ) : currency ? (
                `₹${value}`
              ) : (
                value
              )}
            </p>
          </div>

          {/* ICON */}
          <div
            className="
              w-16 h-16 
              rounded-full 
              bg-blue-600/10 
              flex items-center justify-center
              text-blue-400 text-3xl
              group-hover:scale-110
              transition
            "
          >
            {icon}
          </div>
        </div>

        {/* TREND LINE */}
        {!loading && (
          <div className="flex items-center gap-2 mt-4">
            <span
              className={`
                flex items-center gap-1 text-sm font-semibold
                ${isPositive ? "text-green-400" : "text-red-400"}
              `}
            >
              {isPositive ? (
                <FaArrowUp className="text-xs" />
              ) : (
                <FaArrowDown className="text-xs" />
              )}
              {Math.abs(trend)}%
            </span>

            <span className="text-gray-500 text-xs">
              {isPositive ? "Growth" : "Drop"} this month
            </span>
          </div>
        )}
      </div>

      {/* Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-cyan-400 opacity-40" />
    </div>
  );
}
