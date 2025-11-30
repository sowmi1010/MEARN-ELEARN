// src/pages/student/Videos.jsx
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../../utils/api";

import SubjectTabs from "../components/SubjectTabs";
import Pagination from "../../../components/common/Pagination";

export default function Videos() {
  const { subject } = useParams();

  const [videos, setVideos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeSubject, setActiveSubject] = useState(
    subject || localStorage.getItem("activeSubject") || ""
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 9;

  // Global search
  const [globalQuery, setGlobalQuery] = useState("");

  // Student filters stored in localStorage
  const activeCourse = localStorage.getItem("activeCourse");
  const activeGroup = localStorage.getItem("activeGroup");
  const activeStandard = localStorage.getItem("activeStandard");
  const activeBoard = localStorage.getItem("activeBoard");
  const activeLanguage = localStorage.getItem("activeLanguage");

  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  /* -------------------------------
        LOAD VIDEOS FROM API
  -------------------------------- */
  const loadVideos = async (selectedSubject) => {
    try {
      const params = {
        group: activeGroup?.toUpperCase(),
        standard: activeStandard,
        board: activeBoard,
        language: activeLanguage,
      };

      if (selectedSubject) params.subject = selectedSubject;

      const res = await api.get("/videos", { params, headers });

      const list = Array.isArray(res.data) ? res.data : [];

      setVideos(list);
      setFiltered(list);
    } catch (err) {
      console.error("Error loading videos:", err);
      setVideos([]);
      setFiltered([]);
    }
  };

  /* -------------------------------
        FIRST LOAD
  -------------------------------- */
  useEffect(() => {
    const initialSubject =
      subject || localStorage.getItem("activeSubject") || null;

    setActiveSubject(initialSubject);
    loadVideos(initialSubject);
  }, [subject]);

  /* -------------------------------
        FILTER ON GLOBAL SEARCH
  -------------------------------- */
  useEffect(() => {
    window.addEventListener("global-search", (e) => {
      setGlobalQuery(e.detail);
      setCurrentPage(1);
    });
  }, []);

  useEffect(() => {
    if (!globalQuery) {
      setFiltered(videos);
      return;
    }

    const q = globalQuery.toLowerCase();

    const results = videos.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.subject?.toLowerCase().includes(q) ||
        v.category?.toLowerCase().includes(q) ||
        v.lesson?.toLowerCase().includes(q)
    );

    setFiltered(results);
  }, [globalQuery, videos]);

  /* -------------------------------
        SUBJECT TAB CHANGE
  -------------------------------- */
  const handleSubjectChange = (sub) => {
    setActiveSubject(sub);
    setCurrentPage(1);
    loadVideos(sub);
  };

  /* -------------------------------
        APPLY PAGINATION
  -------------------------------- */
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <div className="min-h-screen p-6 text-gray-100 bg-[#0b0f1a]">

      {/* HEADER */}
      {activeCourse && (
        <p className="mb-6 text-sm text-gray-400">
          Showing content for:
          <span className="text-purple-400 font-bold ml-1">
            {activeCourse}
            {activeSubject && ` • ${activeSubject}`}
          </span>
        </p>
      )}

      {/* SUBJECT TABS */}
      <SubjectTabs onChange={handleSubjectChange} />

      {/* VIDEOS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 mt-6">
        {paginated.map((v) => (
          <Link
            key={v._id}
            to={`/student/video/${v._id}`}
            className="bg-[#0d0d17] rounded-2xl overflow-hidden border border-purple-900/20 
            shadow-lg hover:scale-[1.03] transition-transform duration-300"
          >
            {/* Thumbnail */}
            <div className="relative">
              <img
                src={`http://localhost:4000/${v.thumbnail}`}
                alt={v.title}
                className="w-full h-44 object-cover"
              />

              <span className="absolute top-3 right-3 bg-purple-600 text-xs font-semibold px-3 py-1 rounded-full shadow">
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

      {/* NO RESULTS */}
      {filtered.length === 0 && (
        <p className="text-center text-gray-500 mt-10 text-lg">
          No videos found for {activeCourse}
          {activeSubject && ` (${activeSubject})`}
        </p>
      )}

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
