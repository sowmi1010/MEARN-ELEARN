import React from "react";
import { FaStar } from "react-icons/fa";

export default function ReviewStats() {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center justify-center text-center">
      <h2 className="text-xl font-bold mb-4">Overall Reviews</h2>
      <p className="text-5xl font-bold text-green-400 mb-2">80%</p>
      <div className="flex justify-center gap-2 mb-2">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} className="text-yellow-400 text-2xl" />
        ))}
      </div>
      <p className="text-sm text-gray-400">4% better than last month</p>
    </div>
  );
}
