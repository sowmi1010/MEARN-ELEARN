import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // ✅ Correct categories
  const categories = ["All", "1-6", "7-10", "11-12", "FullStack", "AWS", "AI-ML"];

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

  // ✅ Apply filters
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
    <div className="p-6">
      <h1 className="text-3xl font-bold text-accent mb-6">Available Courses</h1>

      {/* 🔎 Search Bar */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-2 rounded bg-gray-800 text-white"
        />
      </div>

      {/* 🏷️ Category Filter */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-lg transition ${
              category === cat
                ? "bg-accent text-darkBg"
                : "bg-darkCard text-gray-300 hover:bg-accent hover:text-darkBg"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 📚 Course List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((c) => (
            <Link
              key={c._id}
              to={`/course/${c._id}`}
              className="bg-darkCard p-4 rounded-lg shadow hover:shadow-xl transition"
            >
              <h2 className="text-xl font-semibold text-accent">{c.title}</h2>
              <p className="text-gray-400">{c.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                Category: {c.category}
              </p>
              <p className="text-sm text-gray-500">₹{c.price}</p>
            </Link>
          ))
        ) : (
          <p className="text-gray-400">No courses found.</p>
        )}
      </div>
    </div>
  );
}
