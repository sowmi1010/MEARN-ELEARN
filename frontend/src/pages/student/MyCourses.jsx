import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";

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
        console.error("Fetch error:", err);
      }
    }
    fetchMyCourses();
  }, []);

  return (
    <div className="pt-24 px-6 min-h-screen bg-darkBg text-gray-200">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent mb-3">
          My Courses
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Here are the courses you’ve enrolled in.  
          Continue your learning journey
        </p>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {courses.length > 0 ? (
          courses.map((c) => (
            <Link
              key={c._id}
              to={`/course/${c._id}`}
              className="bg-darkCard p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-gray-700 group"
            >
              {/* Title */}
              <h2 className="text-xl font-semibold text-accent mb-2 group-hover:underline">
                {c.title}
              </h2>

              {/* Description */}
              <p className="text-gray-400 line-clamp-3">{c.description}</p>

              {/* Extra Info */}
              <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
                <span className="bg-accent/20 px-3 py-1 rounded-full text-accent font-medium">
                  {c.category}
                </span>
                <span className="font-semibold text-gray-200">₹{c.price}</span>
              </div>

              {/* Progress Bar (optional static example) */}
              <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
                <div
                  className="bg-accent h-2 rounded-full"
                  style={{ width: "40%" }} // TODO: Replace with real progress % if available
                ></div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-400 text-center col-span-full">
            You haven’t enrolled in any courses yet.
          </p>
        )}
      </div>
    </div>
  );
}
