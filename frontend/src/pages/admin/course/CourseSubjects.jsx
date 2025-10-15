// src/pages/admin/course/manage/CourseSubjects.jsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CourseSubjects() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  // 🧠 Group-wise Subjects Mapping
  const subjectsByGroup = {
    ROOT: ["Tamil", "English", "Maths", "Science", "Social Science"],
    STEM: ["Tamil", "English", "Maths", "Science", "Social Science"],
    LEAF: [
      "Tamil",
      "English",
      "Maths",
      "Science",
      "Social Science",
      "Computer Science",
      "Accountancy",
      "Economics",
      "Commerce",
    ],
    FLOWER: ["NEET", "JEE", "CLAT", "CUET"],
    FRUIT: ["TNPSC", "UPSC", "Bank Exams", "SSC", "Railway", "Police Exams"],
    SEED: [
      "C Programming",
      "C++",
      "Java",
      "Python",
      "JavaScript",
      "HTML",
      "CSS",
      "React",
      "Node.js",
      "MongoDB",
      "Flutter",
      "Dart",
      "Kotlin",
      "Machine Learning",
      "AI & Data Science",
      "Cyber Security",
      "Full Stack Development",
      "Digital Marketing",
      "UI/UX Design",
    ],
  };

  const subjects = subjectsByGroup[groupId?.toUpperCase()] || [];

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      {/* 🔹 Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 capitalize">
          {groupId} Group — Subjects
        </h1>
        <p className="text-gray-400">Select a subject to explore categories</p>
      </div>

      {/* 🔹 Subject Cards */}
      {subjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {subjects.map((subject) => (
            <div
              key={subject}
              onClick={() =>
                navigate(`/admin/courses/${groupId}/${subject}/categories`)
              }
              className="cursor-pointer bg-gray-800 hover:bg-gray-700 rounded-xl p-6 text-center shadow-lg border border-gray-700 transition-transform hover:scale-105 duration-300"
            >
              <h2 className="text-xl font-semibold mb-1">{subject}</h2>
              <p className="text-gray-400 text-sm">View categories</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 italic">
          No subjects found for this group.
        </p>
      )}
    </div>
  );
}
