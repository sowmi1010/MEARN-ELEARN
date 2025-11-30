// src/pages/student/Quiz.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../utils/api";
import SubjectTabs from "../components/SubjectTabs";
import Pagination from "../../../components/common/Pagination";
import { subjectMap } from "../../../utils/courseOptions";

/* --------------------------------------------
   ACTIVE USER FILTERS
-------------------------------------------- */
const activeGroup = localStorage.getItem("activeGroup");
const activeStandard = localStorage.getItem("activeStandard");
const activeBoard = localStorage.getItem("activeBoard");
const activeLanguage = localStorage.getItem("activeLanguage");
const activeCourse = localStorage.getItem("activeCourse");
const activeGroupCode = localStorage.getItem("activeGroupCode");

export default function Quiz() {
  const { subject } = useParams();
  const navigate = useNavigate();

  const [allQuizzes, setAllQuizzes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [activeSubject, setActiveSubject] = useState(subject || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  /* --------------------------------------------
     SUBJECT LIST
  -------------------------------------------- */
  const getSubjects = () => {
    const group = activeGroup?.toUpperCase();
    const standard = activeStandard;
    const code = (activeGroupCode || "").toUpperCase();

    if (!group) return [];

    if (group !== "LEAF") return subjectMap[group] || [];

    if (standard === "9th" || standard === "10th")
      return subjectMap.LEAF?.[standard] || [];

    if (standard === "11th" || standard === "12th")
      return subjectMap.LEAF?.[`${standard}-${code}`] || [];

    return [];
  };

  /* --------------------------------------------
     LOAD QUIZZES
  -------------------------------------------- */
  const loadQuizzes = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await api.get("/quizzes", {
        headers,
        params: {
          group: activeGroup?.toUpperCase(),
          standard: activeStandard,
          board: activeBoard,
          language: activeLanguage,
          groupCode: activeGroupCode,
          subject: activeSubject || undefined,
        },
      });

      setAllQuizzes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Quiz load failed:", err);
      setAllQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  /* --------------------------------------------
     FIRST LOAD
  -------------------------------------------- */
  useEffect(() => {
    setSubjects(getSubjects());

    const saved = subject || localStorage.getItem("activeSubject");
    if (saved) setActiveSubject(saved);

    loadQuizzes();
  }, [subject, activeSubject]);

  /* --------------------------------------------
     GLOBAL SEARCH
  -------------------------------------------- */
  useEffect(() => {
    const handler = (e) => {
      setSearchQuery((e.detail || "").toString().trim());
      setCurrentPage(1);
    };

    window.addEventListener("global-search", handler);
    return () => window.removeEventListener("global-search", handler);
  }, []);

  /* --------------------------------------------
     SUBJECT TAB CHANGE
  -------------------------------------------- */
  const handleSubjectChange = (sub) => {
    setActiveSubject(sub);
    setCurrentPage(1);
    localStorage.setItem("activeSubject", sub);
    setSearchQuery("");
  };

  /* --------------------------------------------
     FILTERED QUIZZES
  -------------------------------------------- */
  const filtered = useMemo(() => {
    let list = [...allQuizzes];

    if (activeSubject) {
      list = list.filter(
        (q) =>
          (q.subject || "").toLowerCase().trim() ===
          activeSubject.toLowerCase().trim()
      );
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.subject?.toLowerCase().includes(q) ||
          item.lesson?.toLowerCase().includes(q) ||
          item.question?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [allQuizzes, activeSubject, searchQuery]);

  /* --------------------------------------------
     GROUP BY LESSON
  -------------------------------------------- */
  const grouped = useMemo(() => {
    const map = {};

    filtered.forEach((q) => {
      const key = q.lesson || "General";

      if (!map[key]) {
        map[key] = {
          lesson: key,
          subject: q.subject,
          total: 0,
          items: [],
        };
      }

      map[key].items.push(q);
      map[key].total++;
    });

    return Object.values(map);
  }, [filtered]);

  /* --------------------------------------------
     PAGINATION
  -------------------------------------------- */
  const totalPages = Math.ceil(grouped.length / perPage);
  const paginated = grouped.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  /* --------------------------------------------
     START QUIZ
  -------------------------------------------- */
  const handleStart = (g) => {
    navigate(
      `/student/quiz/play/${g.items[0]._id}?count=${g.items.length}`
    );
  };

  /* --------------------------------------------
     UI
  -------------------------------------------- */
  return (
    <div className="min-h-screen bg-[#0b0f1a] text-gray-100 p-6 md:p-10">

      {/* HEADER */}
      <h1 className="text-2xl md:text-3xl font-extrabold text-purple-400 mb-2">
        Quiz – {activeCourse}
      </h1>

      <p className="text-gray-400 mb-4">
        {activeGroup} • {activeStandard} • {activeBoard} • {activeLanguage}
      </p>

      {/* SUBJECT TABS */}
      <SubjectTabs
        subjects={subjects}
        activeSubject={activeSubject}
        onChange={handleSubjectChange}
      />

      {/* SUBJECT BADGE */}
      {activeSubject && (
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 
          rounded-full bg-purple-700/20 border border-purple-500/40 text-sm">
          Showing:
          <span className="font-semibold text-purple-300">
            {activeSubject}
          </span>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <p className="text-center text-gray-400 mt-10">Loading quizzes...</p>
      )}

      {/* EMPTY */}
      {!loading && grouped.length === 0 && (
        <p className="text-center text-gray-400 mt-16 text-lg">
          No quizzes found for{" "}
          <span className="text-purple-400">{activeSubject}</span>
        </p>
      )}

      {/* QUIZ CARDS */}
      <div className="grid gap-8 mt-10 sm:grid-cols-2 lg:grid-cols-3">
        {paginated.map((g, index) => (
          <div
            key={index}
            className="
              bg-[#111827]/80 
              border border-purple-800/40 
              rounded-xl 
              p-6 
              shadow-xl 
              hover:border-purple-600 
              hover:shadow-purple-500/30 
              transition
            "
          >
            <div className="flex justify-between items-center">
              <span className="text-xs px-3 py-1 rounded bg-purple-700/30">
                {g.subject}
              </span>
              <span className="text-xs px-3 py-1 rounded bg-blue-700/30">
                {g.total} Q
              </span>
            </div>

            <h2 className="mt-4 text-lg font-bold text-purple-300">
              {g.lesson || "General Quiz"}
            </h2>

            <button
              onClick={() => handleStart(g)}
              className="w-full mt-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
            >
              Start Quiz →
            </button>
          </div>
        ))}
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
