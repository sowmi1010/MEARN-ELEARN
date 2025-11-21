import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { Link } from "react-router-dom";

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");
  const activeCourse = localStorage.getItem("activeCourse");

  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  /* Load videos (shows all or filtered by search) */
  const loadVideos = async (query = search) => {
    try {
      const res = await api.get("/videos", {
        headers,
        params: {
          search: query,
          course: activeCourse, // ✅ CONNECTED TO DROPDOWN
        },
      });
      setVideos(res.data);
    } catch (err) {
      console.error("Error fetching videos:", err);
    }
  };

  /* Load all videos on first mount */
  useEffect(() => {
    loadVideos();
  }, []);

  /* 🔥 Listen to GLOBAL SEARCH from StudentLayout */
  useEffect(() => {
    const handleSearch = (e) => {
      const query = e.detail;
      setSearch(query);
      loadVideos(query);
    };

    window.addEventListener("global-search", handleSearch);
    return () => window.removeEventListener("global-search", handleSearch);
  }, []);

  return (
    <div className="min-h-screen p-6 text-gray-100 bg-[#0b0f1a]">
      {/* PAGE HEADING */}
      {activeCourse && (
        <p className="mb-6 text-sm text-gray-400">
          Showing content for:
          <span className="text-purple-400 font-bold ml-1">{activeCourse}</span>
        </p>
      )}

      {/* ========================================================
             VIDEO CARD GRID — Premium Design
      ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {videos.map((v) => (
          <Link
            to={`/student/video/${v._id}`}
            key={v._id}
            className="
              bg-[#0d0d17] rounded-2xl overflow-hidden
              border border-purple-900/20 shadow-lg
              hover:scale-[1.03] transition-transform duration-300
            "
          >
            {/* Thumbnail */}
            <div className="relative">
              <img
                src={`http://localhost:4000/${v.thumbnail}`}
                alt={v.title}
                className="w-full h-44 object-cover"
              />

              {/* Category badge */}
              <span
                className="
                  absolute top-3 right-3
                  bg-purple-600 text-xs font-semibold
                  px-3 py-1 rounded-full shadow
                "
              >
                {v.category}
              </span>
            </div>

            {/* Card Body */}
            <div className="p-4">
              <h3 className="text-lg font-bold text-purple-300 leading-tight">
                {v.title}
              </h3>

              <p className="text-xs text-gray-400 mt-2">
                {v.subject} • {v.lesson}
              </p>

              {v.duration && (
                <p className="text-xs text-gray-500 mt-1">
                  ⏱ {v.duration} mins
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* NO VIDEOS FOUND */}
      {videos.length === 0 && (
        <p className="text-center text-gray-500 mt-10 text-lg">
          No videos found.
        </p>
      )}
    </div>
  );
}
