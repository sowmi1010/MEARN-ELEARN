import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../utils/api";
import SubjectTabs from "../components/SubjectTabs";
import { subjectMap } from "../../../utils/courseOptions";

const activeGroup = localStorage.getItem("activeGroup");
const activeStandard = localStorage.getItem("activeStandard");
const activeBoard = localStorage.getItem("activeBoard");
const activeLanguage = localStorage.getItem("activeLanguage");
const activeCourse = localStorage.getItem("activeCourse");
const activeGroupCode = localStorage.getItem("activeGroupCode");

export default function Quiz() {
  const navigate = useNavigate();
  const { subject } = useParams();

  const [allQuizzes, setAllQuizzes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [activeSubject, setActiveSubject] = useState(subject || null);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= SUBJECT LIST ================= */
  const getSubjects = () => {
    const group = activeGroup?.toUpperCase();
    const standard = activeStandard;
    const code = (activeGroupCode || "").toUpperCase();

    if (!group) return [];

    if (group !== "LEAF") return subjectMap[group] || [];

    if (standard === "9th" || standard === "10th")
      return subjectMap.LEAF?.[standard] || [];

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

  /* ================= LOAD QUIZZES ================= */
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
          subject: activeSubject || undefined,   // ✅ MAIN FIX
        },
      });

      setAllQuizzes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load quizzes", err);
      setAllQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FIRST LOAD ================= */
  useEffect(() => {
    setSubjects(getSubjects());

    const saved = subject || localStorage.getItem("activeSubject");
    if (saved) setActiveSubject(saved);

    loadQuizzes();
  }, [subject, activeSubject]);

  /* ================= GLOBAL SEARCH ================= */
  useEffect(() => {
    const handle = (e) => {
      const text = (e?.detail || "").toString().trim();
      setFilter(text);
    };

    window.addEventListener("global-search", handle);
    return () => window.removeEventListener("global-search", handle);
  }, []);

  /* ================= CLICK TAB ================= */
  const handleSubjectChange = (sub) => {
    setActiveSubject(sub);
    localStorage.setItem("activeSubject", sub);
    setFilter("");
  };

  /* ================= FINAL FILTER ================= */
  const filtered = useMemo(() => {
    let list = [...allQuizzes];

    if (activeSubject) {
      list = list.filter(
        (q) =>
          (q.subject || "").toLowerCase().trim() ===
          activeSubject.toLowerCase().trim()
      );
    }

    if (filter) {
      const f = filter.toLowerCase();
      list = list.filter(
        (q) =>
          (q.subject || "").toLowerCase().includes(f) ||
          (q.lesson || "").toLowerCase().includes(f) ||
          (q.question || "").toLowerCase().includes(f)
      );
    }

    return list;
  }, [allQuizzes, activeSubject, filter]);

  /* ================= GROUP BY LESSON ================= */
  const grouped = useMemo(() => {
    const g = {};

    filtered.forEach((q) => {
      const key = q.lesson || "General";

      if (!g[key]) {
        g[key] = {
          subject: q.subject,
          lesson: q.lesson,
          total: 0,
          questions: [],
        };
      }

      g[key].questions.push(q);
      g[key].total++;
    });

    return Object.values(g);
  }, [filtered]);

  const handleStart = (group) => {
    navigate(
      `/student/quiz/play/${group.questions[0]._id}?count=${group.questions.length}`
    );
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#0b0f1a] p-8 text-white">

      <h1 className="text-3xl font-bold text-purple-400 mb-1">
        Quiz – {activeCourse}
      </h1>

      <p className="text-gray-400 mb-4">
        {activeGroup} • {activeStandard} • {activeBoard}
        {activeSubject && (
          <span className="text-blue-400 ml-2">/ {activeSubject}</span>
        )}
      </p>

      <SubjectTabs
        subjects={subjects}
        activeSubject={activeSubject}
        onChange={handleSubjectChange}
      />

      {activeSubject && (
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-700/20 border border-purple-500/40">
          <span className="text-purple-300 text-sm">Showing:</span>
          <span className="font-semibold text-purple-400">
            {activeSubject}
          </span>
        </div>
      )}

      {loading && (
        <p className="text-center text-gray-400 mt-10">
          Loading quizzes...
        </p>
      )}

      {!loading && grouped.length === 0 && (
        <p className="text-gray-400 mt-10 text-center">
          No quizzes found for{" "}
          <span className="text-purple-400">{activeSubject}</span>
        </p>
      )}

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {grouped.map((g, i) => (
          <div
            key={i}
            className="bg-[#111827]/80 border border-purple-800/40 rounded-xl p-6 shadow-xl hover:border-purple-600 hover:shadow-purple-500/30 transition"
          >
            <div className="flex justify-between">
              <span className="px-3 py-1 bg-purple-700/30 rounded text-xs">
                {g.subject}
              </span>
              <span className="px-3 py-1 bg-blue-700/30 rounded text-xs">
                {g.total} Q
              </span>
            </div>

            <h2 className="mt-4 text-lg font-bold text-purple-300">
              {g.lesson || "General Quiz"}
            </h2>

            <button
              onClick={() => handleStart(g)}
              className="mt-6 w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
            >
              Start Quiz →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
