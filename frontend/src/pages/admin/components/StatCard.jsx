import React from "react";

export default function StatCard({ title, value, icon, color }) {
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
      {/* Glow background */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${color} opacity-10 blur-2xl group-hover:opacity-20 transition`}
      ></div>

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <h3 className="text-xs uppercase tracking-widest text-blue-400 font-semibold">
            {title}
          </h3>

          <p className="text-4xl font-extrabold mt-2 text-white">
            {value}
          </p>
        </div>

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

      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-cyan-400 opacity-40" />
    </div>
  );
}
