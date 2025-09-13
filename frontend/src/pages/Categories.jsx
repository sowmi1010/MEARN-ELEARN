import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

export default function Categories() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await api.get("/courses");
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    }
    fetchCourses();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-accent mb-6">Top Categories</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {courses.map((course) => (
          <Link
            to={`/course/${course._id}`}
            key={course._id}
            className="bg-darkCard p-6 rounded-lg text-center shadow hover:scale-105 transition"
          >
            <h2 className="text-xl font-semibold">{course.title}</h2>
            <p className="text-gray-400 mt-2">{course.category}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
