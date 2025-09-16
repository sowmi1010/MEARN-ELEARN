import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react"; // optional: nice search icon
import api from "../../utils/api";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", "1-6", "7-10", "11-12", "FullStack", "AWS", "AI-ML"];

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await api.get("/courses");
        setCourses(res.data);
        setFilteredCourses(res.data);
      } catch (err) {
        console.error("Fetch courses error:", err);
      }
    }
    fetchCourses();
  }, []);

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
    <div className="pt-24 px-6 min-h-screen bg-darkBg text-gray-200">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent mb-4">
          Explore Our Courses
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Learn industry-ready skills with our carefully designed courses.  
          Search by name, or filter by category to find your perfect path 
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 max-w-xl mx-auto mb-8 bg-darkCard rounded-lg px-4 py-2 shadow-lg border border-gray-700">
        <Search className="text-accent" size={20} />
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
        />
      </div>

      {/* Category Filter */}
      <div className="flex gap-3 mb-10 flex-wrap justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
              category === cat
                ? "bg-accent text-darkBg shadow-lg"
                : "bg-darkCard text-gray-300 hover:bg-accent hover:text-darkBg"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((c) => (
            <Link
              key={c._id}
              to={`/course/${c._id}`}
              className="bg-darkCard p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-gray-700 group"
            >
              <h2 className="text-xl font-semibold text-accent mb-2 group-hover:underline">
                {c.title}
              </h2>
              <p className="text-gray-400 line-clamp-3">{c.description}</p>
              <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
                <span className="bg-accent/20 px-3 py-1 rounded-full text-accent font-medium">
                  {c.category}
                </span>
                <span className="font-semibold text-gray-200">₹{c.price}</span>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-400 text-center col-span-full">
            No courses found.
          </p>
        )}
      </div>
    </div>
  );
}
