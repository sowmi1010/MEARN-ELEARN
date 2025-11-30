// src/pages/student/Tests.jsx
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../../utils/api";
import SubjectTabs from "../components/SubjectTabs";
import Pagination from "../../../components/common/Pagination";
import { subjectMap } from "../../../utils/courseOptions";

// Active user data
const activeGroup = localStorage.getItem("activeGroup");
const activeStandard = localStorage.getItem("activeStandard");
const activeBoard = localStorage.getItem("activeBoard");
const activeLanguage = localStorage.getItem("activeLanguage");
const activeCourse = localStorage.getItem("activeCourse");
const activeGroupCode = localStorage.getItem("activeGroupCode");

export default function Tests() {
  const { subject } = useParams();

  const [tests, setTests] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [activeSubject, setActiveSubject] = useState(
    subject || localStorage.getItem("activeSubject") || ""
  );
  const [subjects, setSubjects] = useState([]);

  const [globalQuery, setGlobalQuery] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  const BASE_URL =
    import.meta.env.VITE_BASE_URL || "http://localhost:4000";

  /* -----------------------------------------
        SUBJECT RESOLVER
  ----------------------------------------- */
  const getSubjects = () => {
    const group = activeGroup?.toUpperCase();
    const standard = activeStandard;
    const code = (activeGroupCode || "").toUpperCase();

    if (!group) return [];

    if (group !== "LEAF") return subjectMap[group] || [];

    // LEAF: standard dependent
    if (standard === "9th" || standard === "10th") {
      return subjectMap.LEAF?.[standard] || [];
    }

    if (standard === "11th" || standard === "12th") {
      return subjectMap.LEAF?.[`${standard}-${code}`] || [];
    }

    return [];
  };

  /* -----------------------------------------
        LOAD TESTS FROM SERVER
  ----------------------------------------- */
  const fetchTests = async (sub) => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await api.get("/tests", {
        headers,
        params: {
          group: activeGroup?.toUpperCase(),
          standard: activeStandard,
          board: activeBoard,
          language: activeLanguage,
          groupCode: activeGroupCode,
          subject: sub,
        },
      });

      const list = Array.isArray(res.data) ? res.data : [];
      setTests(list);
      setFiltered(list);
    } catch (err) {
      console.error("Error loading tests:", err);
      setTests([]);
      setFiltered([]);
    }
  };

  /* -----------------------------------------
        FIRST LOAD
  ----------------------------------------- */
  useEffect(() => {
    const list = getSubjects();
    setSubjects(list);

    const initial = subject || localStorage.getItem("activeSubject");
    setActiveSubject(initial);

    fetchTests(initial);
  }, [subject]);

  /* -----------------------------------------
        GLOBAL SEARCH LISTENER
  ----------------------------------------- */
  useEffect(() => {
    const handler = (e) => {
      setGlobalQuery(e.detail || "");
      setCurrentPage(1);
    };

    window.addEventListener("global-search", handler);
    return () => window.removeEventListener("global-search", handler);
  }, []);

  /* -----------------------------------------
        FILTER TESTS BASED ON SEARCH QUERY
  ----------------------------------------- */
  useEffect(() => {
    if (!globalQuery) {
      setFiltered(tests);
      return;
    }

    const q = globalQuery.toLowerCase();

    const result = tests.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.subject?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q)
    );

    setFiltered(result);
  }, [globalQuery, tests]);

  /* -----------------------------------------
        SUBJECT TAB CLICK
  ----------------------------------------- */
  const handleSubjectChange = (sub) => {
    setActiveSubject(sub);
    localStorage.setItem("activeSubject", sub);
    setCurrentPage(1);
    fetchTests(sub);
  };

  /* -----------------------------------------
        PAGINATION
  ----------------------------------------- */
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  /* -----------------------------------------
        UI
  ----------------------------------------- */
  return (
    <div className="min-h-screen p-6 md:p-10 bg-[#0b0f1a] text-gray-100">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-purple-400 tracking-wide">
          Practice Tests – {activeCourse}
        </h1>

        <p className="text-gray-400 mt-1 hidden sm:block">
          {activeGroup} • {activeStandard} • {activeBoard} • {activeLanguage}
        </p>

        {activeSubject && (
          <p className="text-gray-400 mt-1">
            Subject:
            <span className="text-blue-400 font-semibold ml-2">
              {activeSubject}
            </span>
          </p>
        )}
      </div>

      {/* SUBJECT TABS */}
      <div className="mb-10">
        <SubjectTabs
          subjects={subjects}
          activeSubject={activeSubject}
          onChange={handleSubjectChange}
        />
      </div>

      {/* TEST LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {paginated.map((t) => {
          const imageUrl = t.thumbnail
            ? `${BASE_URL}/${t.thumbnail.replace(/\\/g, "/")}`
            : "/no-image.png";

          return (
            <div
              key={t._id}
              className="
                group
                p-6 
                bg-[#111827]/60 
                backdrop-blur-xl
                border border-purple-800/30 
                rounded-2xl 
                shadow-xl 
                relative 
                hover:shadow-purple-600/20 
                transition-all
                hover:scale-[1.01]
              "
            >
              {/* Left Accent Line */}
              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-gradient-to-b from-purple-600 to-blue-600 opacity-60" />

              <div className="flex gap-6">
                {/* Thumbnail */}
                <img
                  src={imageUrl}
                  onError={(e) => (e.target.src = "/no-image.png")}
                  className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-xl shadow-md 
                  group-hover:scale-105 transition"
                />

                {/* Info */}
                <div className="flex-1">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {t.category && (
                      <span className="tag">{t.category}</span>
                    )}
                    {t.subject && (
                      <span className="tag bg-blue-600/40 border-blue-400/40">
                        {t.subject}
                      </span>
                    )}
                    {t.standard && (
                      <span className="tag bg-green-600/40 border-green-400/40">
                        {t.standard}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-purple-300 group-hover:text-purple-200 transition line-clamp-2">
                    {t.title}
                  </h2>

                  {/* Meta */}
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">
                    Language: {t.language} • Questions:{" "}
                    {t.questions?.length || 0}
                  </p>

                  {/* Description */}
                  <p className="text-gray-300 text-xs sm:text-sm mt-2 line-clamp-2">
                    {t.description ||
                      "Evaluate your understanding with this test."}
                  </p>

                  {/* Button */}
                  <Link
                    to={`/student/tests/view/${t._id}`}
                    className="
                      inline-block mt-4 px-4 py-2
                      rounded-lg bg-purple-600 hover:bg-purple-700
                      text-white text-sm
                      shadow-md shadow-purple-900/40 transition
                    "
                  >
                    Start Test →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="text-gray-400 text-center col-span-full mt-20 text-xl">
            No tests found for{" "}
            <span className="text-purple-400">{activeSubject}</span>
          </p>
        )}
      </div>

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

/* Small reusable tag css */
function tag(className) {
  return `text-xs px-2 py-1 rounded-md border ${className}`;
}
