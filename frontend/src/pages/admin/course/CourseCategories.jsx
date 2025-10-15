// src/pages/admin/course/manage/CourseCategories.jsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const categories = [
  // 🧩 Lesson & Notes
  { name: "Lesson", icon: "📚", color: "bg-blue-600" },
  { name: "Lesson Notes", icon: "🗒️", color: "bg-indigo-600" },
  { name: "One Word", icon: "💬", color: "bg-teal-600" },
  { name: "Short Answer", icon: "📝", color: "bg-purple-600" },
  { name: "Medium Answer", icon: "🧾", color: "bg-orange-600" },
  { name: "Long Answer", icon: "📖", color: "bg-pink-600" },
  { name: "Practical", icon: "⚗️", color: "bg-red-600" },
  { name: "Important", icon: "⭐", color: "bg-green-600" },

  // 🧪 Tests / Exams
  { name: "Lesson Test", icon: "🧠", color: "bg-cyan-600" }, // ✅ added here
  { name: "Unit Test", icon: "🧮", color: "bg-yellow-500 text-black" },
  { name: "Revision Test", icon: "♻️", color: "bg-yellow-600 text-black" },
  { name: "Model Paper", icon: "📘", color: "bg-yellow-700 text-black" },
  { name: "Practice Test", icon: "🧩", color: "bg-yellow-800 text-white" },
  { name: "Exam Paper", icon: "📄", color: "bg-yellow-600 text-black" },

  // 🗂️ Miscellaneous
  { name: "Others", icon: "📂", color: "bg-gray-600" },
];

export default function CourseCategories() {
  const { groupId, subject } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      {/* 🔹 Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold capitalize">
          {groupId} → {subject} — Categories
        </h1>
        <p className="text-gray-400 mt-2">Choose a category to view contents</p>
      </div>

      {/* 🔹 Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.name}
            onClick={() =>
              navigate(
                `/admin/courses/${groupId}/${subject}/${cat.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")}/contents`
              )
            }
            className={`cursor-pointer ${cat.color} hover:brightness-110 rounded-2xl p-6 text-center shadow-lg hover:scale-105 transition-transform`}
          >
            <div className="text-4xl mb-3">{cat.icon}</div>
            <h2 className="text-lg font-semibold">{cat.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
