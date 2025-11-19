// src/components/student/MyCoursesDropdown.jsx
import React from "react";
import { RiBookOpenLine } from "react-icons/ri";

export default function MyCoursesDropdown({ courses = [], selected, onSelect }) {
  return (
    <div className="
      bg-[#0d0d17] 
      p-4 rounded-xl 
      border border-purple-900/30 
      shadow-md 
      w-[380px]      /* ⬅️ Now smaller width */
      mx-auto        /* ⬅️ Center nicely */
      transition-all
      hover:shadow-purple-800/20
    ">

      {/* Label */}
      <label className="
        text-[13px] 
        text-purple-300 
        font-medium 
        flex items-center 
        gap-2 
        mb-1
      ">
        <RiBookOpenLine className="text-lg text-purple-400" />
        Select Course
      </label>

      {/* Select Box */}
      <div className="relative">
        <select
          value={selected?._id || ""}
          onChange={(e) => {
            const c = courses.find((x) => x._id === e.target.value);
            onSelect(c || null);
          }}
          className="
            w-full
            bg-[#11111f]
            text-gray-200
            px-3 
            py-2 
            rounded-lg 
            text-sm
            border border-purple-900/40
            focus:border-purple-500 
            outline-none 
            transition-all
          "
        >
          {courses.length === 0 && (
            <option value="">No purchased courses</option>
          )}

          {courses.map((c) => (
            <option key={c._id} value={c._id} className="bg-[#0f0f1a]">
              {c.title}
            </option>
          ))}
        </select>

        {/* Thin soft glow bottom line */}
        <div className="
          absolute 
          left-0 right-0 bottom-0 
          h-[1px] 
          bg-purple-600/30 
          rounded-full
        "></div>
      </div>
    </div>
  );
}
