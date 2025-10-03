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
        console.error("❌ Fetch My Courses error:", err);
      }
    }
    fetchMyCourses();
  }, []);

  return (
    <div className="pt-24 px-6 min-h-screen bg-gray-100 dark:bg-darkBg transition-colors duration-300">
      {/* ===== HERO ===== */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
          <span className="bg-gradient-to-r from-accent to-blue-500 bg-clip-text text-transparent">
            My Courses
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          Here are the courses you’ve enrolled in.  
          Continue your journey and track your progress below.
        </p>
      </div>

      {/* ===== COURSES GRID ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {courses.length > 0 ? (
          courses.map((c) => {
            // Dummy progress percentage (replace with real progress later)
            const progress = Math.floor(Math.random() * 100);

            return (
              <Link
                key={c._id}
                to={`/course/${c._id}`}
                className="
                  group p-6 rounded-xl
                  bg-white dark:bg-darkCard
                  border border-gray-300 dark:border-gray-700
                  shadow-sm hover:shadow-xl hover:scale-[1.02]
                  transition-all duration-300
                "
              >
                {/* Title */}
                <h2 className="text-xl font-bold text-accent mb-2 group-hover:underline">
                  {c.title}
                </h2>

                {/* Description */}
                <p className="text-sm text-gray-700 dark:text-gray-400 line-clamp-3 leading-relaxed">
                  {c.description}
                </p>

                {/* Meta Info */}
                <div className="mt-5 flex justify-between items-center text-sm">
                  <span
                    className="
                      px-3 py-1 rounded-full text-xs font-semibold
                      bg-gradient-to-r from-accent to-blue-500 text-darkBg
                      shadow-sm
                    "
                  >
                    {c.category}
                  </span>
                  <span className="font-bold text-gray-900 dark:text-gray-200">
                    ₹{c.price}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-5">
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-gray-700 dark:text-gray-400">
                      Progress
                    </span>
                    <span className="text-accent">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-accent to-blue-500 h-2 rounded-full transition-all duration-500 ease-in-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full text-center py-16">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              You haven’t enrolled in any courses yet.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Browse our courses and start your journey today!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
