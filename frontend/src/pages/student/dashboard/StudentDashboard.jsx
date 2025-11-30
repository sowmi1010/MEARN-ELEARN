// src/pages/student/StudentDashboard.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import api from "../../../utils/api";

import MyCoursesDropdown from "../../../components/student/MyCoursesDropdown";
import ContinueLearning from "../../../components/student/ContinueLearning";
import PerformanceChart from "../../../components/student/PerformanceChart";

import { FaChartLine, FaListUl, FaBolt, FaClock } from "react-icons/fa";

/* ========= ALLOWED FILTERS ========= */
const ALLOWED_BOARDS = ["Tamil Nadu", "CBSE"];
const ALLOWED_LANGUAGES = ["Tamil", "English"];

function isAllowedCourse(course) {
  if (!course) return false;
  if (course.board && !ALLOWED_BOARDS.includes(course.board)) return false;
  if (course.language && !ALLOWED_LANGUAGES.includes(course.language)) return false;
  return true;
}

function getCourseName(c) {
  if (!c) return "";
  if (c.standard) {
    let name = `${c.standard}`;
    if (c.groupCode) name += ` - ${c.groupCode}`;
    if (c.board) name += ` | ${c.board}`;
    if (c.language) name += ` | ${c.language}`;
    return name;
  }
  if (c.title) return c.title;
  return c.group?.toUpperCase() || "Course";
}

/* ========================================================================= */

export default function StudentDashboard() {
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [progress, setProgress] = useState({
    hoursWatched: 0,
    videosCompleted: 0,
    testsAttempted: 0,
    history: [],
    todosCompleted: 0,
    todosRemaining: 0,
  });

  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  /* ================= OverView Loader (Payments -> Courses) ================= */
  const loadOverview = useCallback(async () => {
    setLoading(true);
    try {
      const payRes = await api.get("/student/dashboard/payments", { headers });
      const list = Array.isArray(payRes.data.payments) ? payRes.data.payments : [];

      const purchased = [];

      list.forEach((p) => {
        const meta = p.metadata || {};
        const course = {
          key: `${meta.group}-${meta.standard}-${meta.groupCode}-${meta.title}`,
          _id: p._id,
          group: meta.group,
          standard: meta.standard,
          board: meta.board,
          language: meta.language,
          groupCode: meta.groupCode,
          title: meta.title,
        };

        if (isAllowedCourse(course)) {
          if (!purchased.find((x) => x.key === course.key)) {
            purchased.push(course);
          }
        }
      });

      setCourses(purchased);

      let active = null;

      const savedName = localStorage.getItem("activeCourse");
      if (savedName) active = purchased.find((c) => getCourseName(c) === savedName);

      if (!active && purchased.length > 0) active = purchased[0];

      if (active) {
        setSelectedCourse(active);
        syncLocalStorage(active);
      } else {
        clearStorage();
        setSelectedCourse(null);
      }
    } catch (err) {
      console.error("Dashboard overview error:", err);
      setCourses([]);
      setSelectedCourse(null);
    } finally {
      setLoading(false);
    }
  }, [headers]);

  /* ================= Fetch Progress & Todos ================= */
  useEffect(() => {
    if (!selectedCourse) return;

    const loadDependent = async () => {
      try {
        // PROGRESS
        const prog = await api.get("/student/dashboard/progress", {
          headers,
          params: { courseId: selectedCourse._id },
        });

        setProgress((prev) => ({
          ...prev,
          hoursWatched: prog.data?.stats?.hours || 0,
          videosCompleted: prog.data?.stats?.videos || 0,
          testsAttempted: prog.data?.stats?.tests || 0,
          history: prog.data?.history || [],
        }));

        // TODOS
        const todoRes = await api.get("/todos", { headers });
        setTodos(todoRes.data?.todos || []);
        setProgress((prev) => ({
          ...prev,
          todosCompleted: todoRes.data?.completed || 0,
          todosRemaining: todoRes.data?.remaining || 0,
        }));
      } catch (err) {
        console.error("Dependent dashboard error:", err);
      }
    };

    loadDependent();
  }, [selectedCourse, refreshKey]);

  /* ================= First load ================= */
  useEffect(() => {
    loadOverview();
  }, []);

  /* ================= Local Storage Sync ================= */
  function syncLocalStorage(course) {
    localStorage.setItem("activeCourse", getCourseName(course));
    localStorage.setItem("activeGroup", course.group || "");
    localStorage.setItem("activeStandard", course.standard || "");
    localStorage.setItem("activeBoard", course.board || "");
    localStorage.setItem("activeLanguage", course.language || "");
    localStorage.setItem("activeSubject", course.title || "");
    localStorage.setItem("activeGroupCode", course.groupCode || "");
  }

  function clearStorage() {
    localStorage.removeItem("activeCourse");
    localStorage.removeItem("activeGroup");
    localStorage.removeItem("activeStandard");
    localStorage.removeItem("activeBoard");
    localStorage.removeItem("activeLanguage");
    localStorage.removeItem("activeSubject");
    localStorage.removeItem("activeGroupCode");
  }

  /* ================= Course Change ================= */
  const handleSelect = (course) => {
    setSelectedCourse(course);
    syncLocalStorage(course);
    setRefreshKey((k) => k + 1);
  };

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
    loadOverview();
  };

  const stats = useMemo(
    () => ({
      hours: progress.hoursWatched,
      videos: progress.videosCompleted,
      tests: progress.testsAttempted,
      todosCompleted: progress.todosCompleted,
      todosRemaining: progress.todosRemaining,
    }),
    [progress]
  );

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-purple-400 text-xl">
        Loading dashboard...
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <main className="flex-1 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-purple-400">
              Hello {user?.name || "Student"} 👋
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Continue your learning journey.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <MyCoursesDropdown
              courses={courses}
              selected={selectedCourse}
              onSelect={handleSelect}
            />

            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white shadow"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Performance Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 bg-[#0d0d17] p-5 rounded-2xl border border-purple-900/20 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <FaChartLine className="text-purple-400 text-lg" />
              <h3 className="text-purple-300 text-lg font-semibold">
                Performance Overview
              </h3>
            </div>

            <PerformanceChart progress={progress} />

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Stat label="Hours Watched" value={stats.hours} />
              <Stat label="Videos Completed" value={stats.videos} />
              <Stat label="Tests Attempted" value={stats.tests} />
              <Stat label="Todos Remaining" value={stats.todosRemaining} />
            </div>
          </section>

          {/* Quick Stats */}
          <aside className="space-y-6">
            <div className="bg-[#0d0d17] p-5 rounded-2xl border border-purple-900/20 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <FaBolt className="text-yellow-400 text-lg" />
                <h3 className="text-lg font-semibold text-purple-300">
                  Quick Stats
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <SmallCard label="Hours" value={stats.hours} />
                <SmallCard label="Videos" value={stats.videos} />
                <SmallCard label="Tests" value={stats.tests} />
                <SmallCard label="Todos" value={stats.todosCompleted} />
              </div>
            </div>

            <ContinueLearning selectedCourse={selectedCourse} />
          </aside>
        </div>

        {/* Todo Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-[#0d0d17] p-5 rounded-2xl border border-purple-900/20 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FaListUl className="text-purple-400" />
                <h3 className="text-lg font-semibold text-purple-300">To-Do</h3>
              </div>
              <div className="text-sm text-gray-400">{todos.length} tasks</div>
            </div>

            {todos.length === 0 ? (
              <p className="text-gray-400">No tasks — perfect! 🎉</p>
            ) : (
              <ul className="space-y-3">
                {todos.map((t) => (
                  <li
                    key={t._id}
                    className="p-3 rounded-lg flex items-center justify-between bg-[#081024] border border-purple-800/20"
                  >
                    <div>
                      <div
                        className={`font-semibold ${
                          t.completed
                            ? "line-through text-gray-500"
                            : "text-white"
                        }`}
                      >
                        {t.text}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {t.date} {t.month} {t.year}
                      </div>
                    </div>

                    <button
                      onClick={async () => {
                        await api.put(`/todos/toggle/${t._id}`, {}, { headers });
                        const res = await api.get("/todos", { headers });
                        setTodos(res.data.todos || []);
                        setProgress((prev) => ({
                          ...prev,
                          todosCompleted: res.data.completed,
                          todosRemaining: res.data.remaining,
                        }));
                      }}
                      className={`px-3 py-1 rounded ${
                        t.completed ? "bg-green-600" : "bg-gray-700"
                      }`}
                    >
                      {t.completed ? "Done" : "Mark"}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Activity */}
          <div className="bg-[#0d0d17] p-5 rounded-2xl border border-purple-900/20 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <FaClock className="text-purple-400" />
              <h3 className="text-lg font-semibold text-purple-300">
                Activity
              </h3>
            </div>

            <div className="space-y-3">
              {(progress.history || []).length === 0 ? (
                <p className="text-gray-400">No recent activity.</p>
              ) : (
                progress.history.slice(0, 6).map((h, i) => (
                  <div
                    key={i}
                    className="text-sm text-gray-300 bg-[#081024] p-3 rounded"
                  >
                    <div className="font-semibold">
                      {h.title || h.action || "Activity"}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(h.date || h.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <footer className="mt-6 text-center text-gray-500 text-sm">
          Keep learning — small steps every day. 🚀
        </footer>
      </div>
    </main>
  );
}

/* ================= Small UI Pieces ================= */
function Stat({ label, value }) {
  return (
    <div className="text-center p-3 rounded-xl bg-[#081024] border border-purple-800/20">
      <div className="text-xs text-gray-400">{label}</div>
      <div className="text-2xl font-bold text-white mt-1">{value}</div>
    </div>
  );
}

function SmallCard({ label, value }) {
  return (
    <div className="p-3 rounded-lg bg-[#081024] border border-purple-800/20 text-center">
      <div className="text-xs text-gray-400">{label}</div>
      <div className="text-lg font-semibold mt-1 text-white">{value}</div>
    </div>
  );
}
