import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../../utils/api";

import SubjectTabs from "../components/SubjectTabs";

export default function Videos() {
  const { subject } = useParams(); // subject from URL

  const [videos, setVideos] = useState([]);
  const [activeSubject, setActiveSubject] = useState(
    subject || localStorage.getItem("activeSubject") || ""
  );

  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const activeCourse = localStorage.getItem("activeCourse");
  const activeGroup = localStorage.getItem("activeGroup");
  const activeStandard = localStorage.getItem("activeStandard");
  const activeBoard = localStorage.getItem("activeBoard");
  const activeLanguage = localStorage.getItem("activeLanguage");

  /* ===========================
        LOAD VIDEOS
  =========================== */
  const loadVideos = async (selectedSubject) => {
    try {
      const params = {
        group: activeGroup?.toUpperCase(),
        standard: activeStandard,
        board: activeBoard,
        language: activeLanguage,
      };

      // ✅ only attach subject if it exists
      if (selectedSubject) {
        params.subject = selectedSubject;
      }

      const res = await api.get("/videos", {
        headers,
        params,
      });

      setVideos(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading videos:", err);
      setVideos([]);
    }
  };

  /* ===========================
        FIRST LOAD
  =========================== */
  useEffect(() => {
    const initialSubject =
      subject || localStorage.getItem("activeSubject") || null;

    setActiveSubject(initialSubject);
    loadVideos(initialSubject);

  }, [subject]); // ✅ Reload when URL subject changes

  /* ===========================
      WHEN SUBJECT CHANGES (tabs)
  =========================== */
  const handleSubjectChange = (sub) => {
    setActiveSubject(sub);
    loadVideos(sub);
  };

  return (
    <div className="min-h-screen p-6 text-gray-100 bg-[#0b0f1a]">

      {/* ================= HEADER ================= */}
      {activeCourse && (
        <p className="mb-6 text-sm text-gray-400">
          Showing content for:
          <span className="text-purple-400 font-bold ml-1">
            {activeCourse}
            {activeSubject && ` • ${activeSubject}`}
          </span>
        </p>
      )}

      {/* ================= SUBJECT TABS ================= */}
      <SubjectTabs onChange={handleSubjectChange} />

      {/* ================= VIDEOS GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {videos.map((v) => (
          <Link
            key={v._id}
            to={`/student/video/${v._id}`}
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

              <span
                className="
                  absolute top-3 right-3
                  bg-purple-600 text-xs font-semibold
                  px-3 py-1 rounded-full shadow
                "
              >
                {v.category || "Lesson"}
              </span>
            </div>

            {/* Body */}
            <div className="p-4">
              <h3 className="text-lg font-bold text-purple-300 leading-tight">
                {v.title}
              </h3>

              <p className="text-xs text-gray-400 mt-2">
                {(v.subject || activeSubject || activeGroup)} • {v.lesson}
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

      {/* ================= EMPTY STATE ================= */}
      {videos.length === 0 && (
        <p className="text-center text-gray-500 mt-10 text-lg">
          No videos found for {activeCourse}
          {activeSubject && ` (${activeSubject})`}
        </p>
      )}

    </div>
  );
}
