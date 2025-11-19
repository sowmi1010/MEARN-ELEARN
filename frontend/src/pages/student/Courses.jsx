import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

export default function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    try {
      const res = await api.get("/courses"); // PUBLIC route
      setCourses(res.data || []);
    } catch (err) {
      console.error("Failed to load courses", err);
    }
  }

  return (
    <div className="p-6 text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">All Courses</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-[#081024] p-4 rounded-xl shadow-xl cursor-pointer hover:scale-105 transition"
            onClick={() => navigate(`/student/courses/${course._id}`)}
          >
            <img
              src="https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg"
              className="w-full h-40 object-cover rounded mb-3"
            />

            <h2 className="text-xl font-bold">{course.title}</h2>
            <p className="text-gray-300">{course.category}</p>
            <p className="text-gray-400 text-sm mt-1">
              {course.teacher?.name || "Unknown Teacher"}
            </p>

            <div className="mt-3 font-semibold text-purple-400">
              {course.price === 0 ? "Free" : `₹${course.price}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
