import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function fetchMyCourses() {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const myCourses = res.data.filter((c) =>
          user.enrolledCourses?.includes(c._id)
        );

        setCourses(myCourses);
      } catch (err) {
        console.error("❌ Fetch error:", err);
      }
    }
    fetchMyCourses();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-accent mb-6">My Courses</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.length > 0 ? (
          courses.map((c) => (
            <Link
              key={c._id}
              to={`/course/${c._id}`}
              className="bg-darkCard p-4 rounded-lg shadow hover:shadow-xl transition"
            >
              <h2 className="text-xl font-semibold text-accent">{c.title}</h2>
              <p className="text-gray-400">{c.description}</p>
            </Link>
          ))
        ) : (
          <p className="text-gray-400">No enrolled courses yet.</p>
        )}
      </div>
    </div>
  );
}
