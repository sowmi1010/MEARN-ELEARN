import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { Link } from "react-router-dom";

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [filters, setFilters] = useState({
    subject: "",
    lesson: "",
    category: "",
    search: "",
  });

  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  // Fetch videos with filters
  const loadVideos = async () => {
    try {
      const res = await api.get("/videos", {
        headers,
        params: {
          subject: filters.subject,
          lesson: filters.lesson,
          category: filters.category,
          search: filters.search,
        },
      });
      setVideos(res.data);
    } catch (err) {
      console.error("Error fetching videos:", err);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const applyFilters = () => loadVideos();

  return (
    <div className="flex min-h-screen bg-[#0b0f1a] text-gray-100">

      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 text-purple-400">Videos</h1>

        {/* FILTERS */}
        <div className="bg-[#081024] p-4 rounded-xl mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search..."
            className="p-2 rounded bg-[#0d1325] border border-purple-600"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />

          <input
            type="text"
            placeholder="Subject"
            className="p-2 rounded bg-[#0d1325] border border-purple-600"
            value={filters.subject}
            onChange={(e) =>
              setFilters({ ...filters, subject: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Lesson"
            className="p-2 rounded bg-[#0d1325] border border-purple-600"
            value={filters.lesson}
            onChange={(e) =>
              setFilters({ ...filters, lesson: e.target.value })
            }
          />

          <select
            className="p-2 rounded bg-[#0d1325] border border-purple-600"
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
          >
            <option value="">All Categories</option>
            <option value="Lesson">Lesson</option>
            <option value="Revision">Revision</option>
            <option value="One Word">One Word</option>
          </select>

          <button
            onClick={applyFilters}
            className="md:col-span-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
          >
            Apply Filters
          </button>
        </div>

        {/* VIDEO CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((v) => (
            <Link
              to={`/student/video/${v._id}`}
              key={v._id}
              className="bg-[#081024] rounded-xl shadow-md overflow-hidden hover:scale-105 transition"
            >
              <img
                src={`http://localhost:4000/${v.thumbnail}`}
                alt={v.title}
                className="w-full h-40 object-cover"
              />

              <div className="p-4">
                <h3 className="text-lg font-bold text-purple-300">{v.title}</h3>
                <p className="text-sm text-gray-400">{v.subject} • {v.lesson}</p>
                <span className="text-xs px-2 py-1 bg-purple-700 rounded mt-2 inline-block">
                  {v.category}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {videos.length === 0 && (
          <p className="text-center text-gray-500 mt-10">No videos found.</p>
        )}
      </main>
    </div>
  );
}
