import React from "react";

export default function CourseCard({ course, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group bg-darkCard rounded-2xl overflow-hidden shadow-lg cursor-pointer 
                 hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 border border-gray-700"
    >
      {/* Thumbnail */}
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={course.thumbnail || "/default-course.jpg"}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Category Badge */}
        <span className="absolute top-2 left-2 bg-accent/90 text-darkBg px-3 py-1 text-xs rounded-full font-semibold shadow-md">
          {course.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h2 className="text-lg font-bold text-accent mb-2 line-clamp-1">
          {course.title}
        </h2>
        <p className="text-gray-400 text-sm line-clamp-3">{course.description}</p>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-lg font-semibold text-white">
            ₹{course.price}
          </span>
          <button className="px-3 py-1 text-xs bg-accent text-darkBg rounded-lg font-semibold hover:opacity-90 transition">
            View →
          </button>
        </div>
      </div>
    </div>
  );
}
