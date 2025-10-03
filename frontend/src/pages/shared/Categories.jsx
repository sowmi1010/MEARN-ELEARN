import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import { Layers, Cloud, Brain, BookOpen } from "lucide-react";

export default function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await api.get("/courses");
        const uniqueCategories = [...new Set(res.data.map((c) => c.category))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    }
    fetchCourses();
  }, []);

  // Icon mapping for categories
  const categoryIcons = {
    FullStack: <Layers size={36} />,
    AWS: <Cloud size={36} />,
    "AI-ML": <Brain size={36} />,
    "1-6": <BookOpen size={36} />,
    "7-10": <BookOpen size={36} />,
    "11-12": <BookOpen size={36} />,
  };

  // Gradient backgrounds
  const gradients = [
    "from-purple-500 to-indigo-600",
    "from-pink-500 to-rose-500",
    "from-green-500 to-emerald-600",
    "from-yellow-500 to-orange-500",
    "from-cyan-500 to-blue-600",
  ];

  return (
    <div className="px-6 md:px-12 py-16 bg-gray-100 dark:bg-darkBg transition-colors duration-300">
      {/* Section Title */}
      <h1 className="text-4xl font-extrabold text-center mb-12">
        <span className="bg-gradient-to-r from-accent to-blue-500 bg-clip-text text-transparent">
          Top Categories
        </span>
      </h1>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {categories.map((cat, i) => (
          <Link
            key={cat}
            to={`/courses?category=${cat}`}
            className={`
              group rounded-2xl p-6 shadow-md
              bg-gradient-to-br ${gradients[i % gradients.length]}
              text-white relative overflow-hidden
              transform transition-all duration-300 hover:scale-[1.07] hover:shadow-2xl
              animate-fadeInUp
            `}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {/* Glow Overlay */}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-10 transition duration-300"></div>

            {/* Icon */}
            <div className="mb-4 group-hover:rotate-12 transition-transform duration-300">
              {categoryIcons[cat] || <BookOpen size={36} />}
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold tracking-wide">{cat}</h2>
          </Link>
        ))}
      </div>

      {/* ✨ Animations */}
      <style>{`
        @keyframes fadeInUp {
          0% {opacity: 0; transform: translateY(30px);}
          100% {opacity: 1; transform: translateY(0);}
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
