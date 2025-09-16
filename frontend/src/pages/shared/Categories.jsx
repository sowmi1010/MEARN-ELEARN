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

  // Icon mapping per category
  const categoryIcons = {
    "FullStack": <Layers size={32} />,
    "AWS": <Cloud size={32} />,
    "AI-ML": <Brain size={32} />,
    "1-6": <BookOpen size={32} />,
    "7-10": <BookOpen size={32} />,
    "11-12": <BookOpen size={32} />,
  };

  // Gradient colors for variety
  const gradients = [
    "from-purple-500 to-indigo-600",
    "from-pink-500 to-rose-500",
    "from-green-500 to-emerald-600",
    "from-yellow-500 to-orange-500",
    "from-cyan-500 to-blue-600",
  ];

  return (
    <div className="p-8">
      <h1 className="text-4xl font-extrabold text-accent mb-8 text-center">
        Top Categories
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {categories.map((cat, i) => (
          <Link
            key={cat}
            to={`/courses?category=${cat}`}
            className={`rounded-xl shadow-lg p-6 flex flex-col items-center justify-center text-white bg-gradient-to-br ${gradients[i % gradients.length]} hover:scale-105 transform transition`}
          >
            <div className="mb-3">{categoryIcons[cat] || <BookOpen size={32} />}</div>
            <h2 className="text-xl font-bold">{cat}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
