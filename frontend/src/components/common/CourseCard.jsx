import React from "react";

export default function CourseCard({ course, onClick }) {
  return (
    <div
      onClick={onClick}
      className="
        group 
        bg-white dark:bg-darkCard
        rounded-2xl overflow-hidden shadow-md 
        hover:shadow-2xl hover:scale-[1.02] 
        transition-all duration-300 
        border border-gray-200 dark:border-gray-700 
        cursor-pointer
      "
    >
      {/* Thumbnail */}
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={course.thumbnail || "/default-course.jpg"}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Category Badge */}
        <span
          className="
            absolute top-3 left-3 
            bg-accent/90 text-darkBg 
            px-3 py-1 text-xs 
            rounded-full font-semibold 
            shadow-md
          "
        >
          {course.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col justify-between h-[calc(100%-11rem)]">
        {/* Title */}
        <h2
          className="
            text-lg font-bold 
            text-gray-900 dark:text-accent
            mb-2 line-clamp-1
          "
        >
          {course.title}
        </h2>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
          {course.description}
        </p>

        {/* Footer */}
        <div className="mt-4 flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            ₹{course.price}
          </span>
          <button
            className="
              px-4 py-2 text-sm 
              bg-accent text-darkBg 
              rounded-lg font-semibold 
              hover:opacity-90 hover:scale-105
              transition-all duration-300 shadow
            "
          >
            View →
          </button>
        </div>
      </div>
    </div>
  );
}
