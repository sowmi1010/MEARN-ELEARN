// src/components/student/MyCoursesDropdown.jsx
import React from "react";

export default function MyCoursesDropdown({ courses = [], selected, onSelect }) {
  return (
    <div className="bg-[#081228] p-3 rounded-md shadow">
      <label className="text-sm text-gray-300 block mb-1">Courses</label>
      <select
        value={selected?._id || ""}
        onChange={(e) => {
          const c = courses.find((x) => x._id === e.target.value);
          onSelect(c || null);
        }}
        className="bg-transparent text-gray-200 px-3 py-2 rounded outline-none border border-transparent focus:border-purple-500"
      >
        {courses.length === 0 && <option value="">No purchased courses</option>}
        {courses.map((c) => (
          <option key={c._id} value={c._id}>
            {c.title}
          </option>
        ))}
      </select>
    </div>
  );
}
