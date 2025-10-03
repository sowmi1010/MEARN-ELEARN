import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import api from "../../utils/api";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", "1-6", "7-10", "11-12", "FullStack", "AWS", "AI-ML"];

  // Fetch courses
  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await api.get("/courses");
        setCourses(res.data);
        setFilteredCourses(res.data);
      } catch (err) {
        console.error("❌ Fetch courses error:", err);
      }
    }
    fetchCourses();
  }, []);

  // Filter by search & category
  useEffect(() => {
    let filtered = courses;

    if (category !== "All") {
      filtered = filtered.filter((c) => c.category === category);
    }
    if (search.trim() !== "") {
      filtered = filtered.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
  }, [search, category, courses]);

  return (
    <div className="pt-24 px-6 min-h-screen bg-gray-100 dark:bg-darkBg transition-colors duration-300">
      {/* ========== Hero Section ========== */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          <span className="bg-gradient-to-r from-accent to-blue-500 bg-clip-text text-transparent">
            Explore Our Courses
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          Learn industry-ready skills with our carefully designed courses.  
          Use the search bar or filter by category to find your perfect path.
        </p>
      </div>

      {/* ========== Search Bar ========== */}
      <div
        className="
          flex items-center gap-3 max-w-xl mx-auto mb-10
          bg-white dark:bg-darkCard
          rounded-full px-4 py-2
          shadow-md dark:shadow-lg
          border border-gray-300 dark:border-gray-700
          transition-colors
        "
      >
        <Search className="text-accent" size={22} />
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            flex-1 bg-transparent outline-none
            text-gray-800 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
          "
        />
      </div>

      {/* ========== Category Filter Buttons ========== */}
      <div className="flex gap-3 mb-12 flex-wrap justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`
              px-5 py-2 rounded-full font-medium
              transition-all duration-300
              shadow-sm hover:shadow-md
              ${category === cat
                ? "bg-gradient-to-r from-accent to-blue-500 text-darkBg shadow-lg"
                : "bg-white dark:bg-darkCard text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-accent hover:text-darkBg"}
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ========== Courses Grid ========== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((c) => (
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
              <h2 className="text-xl font-semibold text-accent mb-2 group-hover:underline">
                {c.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 line-clamp-3 text-sm leading-relaxed">
                {c.description}
              </p>
              <div className="mt-5 flex justify-between items-center text-sm">
                <span
                  className="
                    px-3 py-1 rounded-full text-xs font-semibold
                    bg-gradient-to-r from-accent to-blue-500 text-darkBg
                  "
                >
                  {c.category}
                </span>
                <span className="font-bold text-gray-800 dark:text-gray-100">
                  ₹{c.price}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-600 dark:text-gray-400 text-lg">
            No courses found 🔍
          </p>
        )}
      </div>
    </div>
  );
}
