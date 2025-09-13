import React from "react";

export default function CourseCard({ course, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-darkCard rounded-xl p-5 shadow-lg cursor-pointer hover:scale-105 transition-transform"
    >
      <h2 className="text-xl font-semibold text-accent">{course.title}</h2>
      <p className="text-gray-400 mt-2">{course.description}</p>
      <p className="mt-4 text-sm text-gray-300">₹{course.price}</p>
    </div>
  );
}
