import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../../utils/api";
import SubjectTabs from "../components/SubjectTabs";
import { subjectMap } from "../../../utils/courseOptions";

// Active user data
const activeGroup = localStorage.getItem("activeGroup");
const activeStandard = localStorage.getItem("activeStandard");
const activeBoard = localStorage.getItem("activeBoard");
const activeLanguage = localStorage.getItem("activeLanguage");
const activeCourse = localStorage.getItem("activeCourse");
const activeGroupCode = localStorage.getItem("activeGroupCode");

export default function Tests() {
  const { subject } = useParams(); // ✅ subject from url
  const [tests, setTests] = useState([]);
  const [activeSubject, setActiveSubject] = useState(subject || null);
  const [subjects, setSubjects] = useState([]);

  const BASE_URL =
    import.meta.env.VITE_BASE_URL || "http://localhost:4000";

  /* ===============================
     GET SUBJECTS BASED ON GROUP
  =============================== */
  const getSubjects = () => {
    const group = activeGroup?.toUpperCase();
    const standard = activeStandard;
    const code = (activeGroupCode || "").toUpperCase();

    if (!group) return [];

    // ✅ ROOT / STEM / FLOWER / FRUIT / SEED
    if (group !== "LEAF") {
      return Array.isArray(subjectMap[group]) ? subjectMap[group] : [];
    }

    // ✅ LEAF - 9th & 10th
    if (standard === "9th" || standard === "10th") {
      return subjectMap.LEAF?.[standard] || [];
    }

    // ✅ LEAF - 11th & 12th
    if (standard === "11th" || standard === "12th") {
      if (code === "BIO MATHS")
        return subjectMap.LEAF?.[`${standard}-BIO MATHS`] || [];

      if (code === "COMPUTER")
        return subjectMap.LEAF?.[`${standard}-COMPUTER`] || [];

      if (code === "COMMERCE")
        return subjectMap.LEAF?.[`${standard}-COMMERCE`] || [];
    }

    return [];
  };

  /* ===============================
     LOAD TESTS
  =============================== */
  const fetchTests = async (currentSubject) => {
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
          subject: currentSubject,
        },
      });

      setTests(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading tests:", err);
      setTests([]);
    }
  };

  /* ===============================
     FIRST LOAD
  =============================== */
  useEffect(() => {
    const list = getSubjects();
    setSubjects(list);

    const saved = subject || localStorage.getItem("activeSubject");
    if (saved) {
      setActiveSubject(saved);
      fetchTests(saved);
    } else {
      fetchTests(null);
    }
  }, [subject]);

  /* ===============================
     SEARCH SUPPORT
  =============================== */
  useEffect(() => {
    const handleSearch = (e) => {
      fetchTests(activeSubject, e.detail || "");
    };

    window.addEventListener("global-search", handleSearch);
    return () => window.removeEventListener("global-search", handleSearch);
  }, [activeSubject]);

  /* ===============================
     TAB CLICK
  =============================== */
  const handleSubjectChange = (sub) => {
    setActiveSubject(sub);
    localStorage.setItem("activeSubject", sub);
    fetchTests(sub);
  };

  /* ===============================
     UI
  =============================== */
  return (
    <div className="min-h-screen p-8 bg-[#0b0f1a] text-gray-100">

      {/* ======== HEADER ======== */}
      <div className="mb-8">
        <h1 className="text-xl font-extrabold text-purple-400 tracking-wide">
          Practice Tests - {activeCourse}
        </h1>

        <p className="text-gray-400 mt-1">
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

      {/* ======== SUBJECT TABS ======== */}
      <div className="mb-10">
        <SubjectTabs
          subjects={subjects}
          activeSubject={activeSubject}
          onChange={handleSubjectChange}
        />
      </div>

      {/* ======== TEST LIST ======== */}
      <div className="space-y-6">
        {tests.map((t) => {
          const imageUrl = t.thumbnail
            ? `${BASE_URL}/${t.thumbnail.replace(/\\/g, "/")}`
            : "/no-image.png";

          return (
            <div
              key={t._id}
              className="
                group
                bg-[#111827]/60 
                backdrop-blur-xl
                border border-purple-800/30 
                hover:border-purple-500/60
                p-6 
                rounded-2xl 
                relative 
                shadow-xl 
                hover:shadow-purple-600/20 
                transition
              "
            >
              {/* Left Line */}
              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-gradient-to-b from-purple-600 to-blue-600 opacity-60" />

              <div className="flex items-start gap-6">
                {/* Thumbnail */}
                <img
                  src={imageUrl}
                  onError={(e) => (e.target.src = "/no-image.png")}
                  alt="Test"
                  className="
                    w-32 h-32 object-cover rounded-xl 
                    shadow-lg shadow-black/40 
                    group-hover:scale-105 transition
                  "
                />

                <div className="flex-1">
                  {/* TAGS */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {t.category && (
                      <span className="text-xs px-2 py-1 bg-purple-700/40 rounded-md border border-purple-500/40">
                        {t.category}
                      </span>
                    )}

                    {t.subject && (
                      <span className="text-xs px-2 py-1 bg-blue-700/40 rounded-md border border-blue-500/40">
                        {t.subject}
                      </span>
                    )}

                    {t.standard && (
                      <span className="text-xs px-2 py-1 bg-green-700/40 rounded-md border border-green-500/40">
                        {t.standard}
                      </span>
                    )}
                  </div>

                  {/* TITLE */}
                  <h2 className="text-2xl font-bold text-purple-300 group-hover:text-purple-200 transition">
                    {t.title}
                  </h2>

                  {/* META */}
                  <p className="text-sm text-gray-400 mt-1">
                    Language: {t.language || "N/A"} • Questions:{" "}
                    {t.questions?.length || 0}
                  </p>

                  {/* DESC */}
                  <p className="text-gray-300 mt-3 text-sm line-clamp-2 max-w-2xl">
                    {t.description ||
                      "This test helps evaluate your lesson understanding."}
                  </p>

                  {/* ACTION */}
                  <div className="mt-5">
                    <Link
                      to={`/student/tests/view/${t._id}`}
                      className="
                        inline-block 
                        px-5 py-2 
                        rounded-lg 
                        bg-purple-600 
                        hover:bg-purple-700 
                        text-white 
                        transition 
                        shadow-md shadow-purple-900/40
                      "
                    >
                      Start Test →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {tests.length === 0 && (
          <p className="text-gray-400 text-center mt-20">
            No tests found for{" "}
            <span className="text-purple-400 font-semibold">
              {activeSubject || "this course"}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
