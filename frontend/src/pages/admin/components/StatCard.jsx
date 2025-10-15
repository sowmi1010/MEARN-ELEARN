import React from "react";

export default function StatCard({ title, value, icon, color }) {
  return (
    <div
      className={`bg-gradient-to-r ${color} p-6 rounded-xl shadow-lg flex items-center justify-between transform hover:scale-105 transition duration-300`}
    >
      <div>
        <h3 className="text-sm uppercase font-semibold opacity-80">{title}</h3>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
      <div className="text-4xl opacity-70">{icon}</div>
    </div>
  );
}
