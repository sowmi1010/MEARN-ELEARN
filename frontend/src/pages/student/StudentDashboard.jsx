// src/pages/student/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../../utils/api";

import MyCoursesDropdown from "../../components/student/MyCoursesDropdown";
import ContinueLearning from "../../components/student/ContinueLearning";
import PerformanceChart from "../../components/student/PerformanceChart";
import UpcomingLive from "../../components/student/UpcomingLive";

import { FaChartLine, FaListUl, FaBolt, FaClock } from "react-icons/fa";

/* ================== FIXED FUNCTION ================== */
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
/* ==================================================== */

export default function StudentDashboard() {
  const [user, setUser] = useState(() => {
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
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        /* GET USER PAYMENTS */
        const payRes = await api.get("/student/dashboard/payments", {
          headers,
        });

        const list = Array.isArray(payRes.data.payments)
          ? payRes.data.payments
          : [];

        /* 2️⃣ CREATE COURSES FROM PAYMENTS */
        const purchased = [];

        list.forEach((p) => {
          const meta = p.metadata;

          const uniqueKey = `${meta?.group}-${meta?.standard}-${meta?.groupCode}-${meta?.title}`;

          if (!purchased.find((x) => x.key === uniqueKey)) {
            purchased.push({
              key: uniqueKey,
              _id: p._id,

              group: meta?.group,
              standard: meta?.standard,
              board: meta?.board,
              language: meta?.language,
              groupCode: meta?.groupCode,

              title: meta?.title,
            });
          }
        });

        setCourses(purchased);

        /* 3️⃣ RESTORE LAST SELECTED COURSE */
        const savedName = localStorage.getItem("activeCourse");

        if (savedName) {
          const found = purchased.find((c) => getCourseName(c) === savedName);
          setSelectedCourse(found || purchased[0] || null);
        } else if (purchased.length > 0) {
          setSelectedCourse(purchased[0]);
        }

        /* 4️⃣ LOAD PROGRESS */
        if (purchased[0]?._id) {
          const prog = await api.get("/student/dashboard/progress", {
            headers,
            params: { courseId: purchased[0]._id },
          });

          setProgress({
            hoursWatched: prog.data?.stats?.hours || 0,
            videosCompleted: prog.data?.stats?.videos || 0,
            testsAttempted: prog.data?.stats?.tests || 0,
            history: prog.data?.history || [],
          });
        }
      } catch (err) {
        console.log("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <main className="flex-1 p-6 overflow-auto">
      {/* HEADER */}
      <div className="w-full mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-purple-400">
              Hello {user?.name || "Student"} 👋
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Let’s continue your learning journey.
            </p>
          </div>

          {/* DROPDOWN */}
          <MyCoursesDropdown
            courses={courses}
            selected={selectedCourse}
            onSelect={(course) => {
              setSelectedCourse(course);

              localStorage.setItem("activeCourse", getCourseName(course));

              localStorage.setItem("activeGroup", course.group || "");
              localStorage.setItem("activeStandard", course.standard || "");
              localStorage.setItem("activeBoard", course.board || "");
              localStorage.setItem("activeLanguage", course.language || "");
              localStorage.setItem("activeSubject", course.title || "");
            }}
          />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* PERFORMANCE */}
          <section className="lg:col-span-2 bg-[#0d0d17] p-5 rounded-2xl border border-purple-900/20 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <FaChartLine className="text-purple-400 text-lg" />
              <h3 className="text-purple-300 text-lg font-semibold">
                Performance Overview
              </h3>
            </div>

            <PerformanceChart progress={progress} />
          </section>

          {/* SIDEBAR */}
          <aside className="space-y-6">
            {/* QUICK STATS */}
            <div className="bg-[#0d0d17] p-5 rounded-2xl border border-purple-900/20 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <FaBolt className="text-yellow-400 text-lg" />
                <h3 className="text-lg font-semibold text-purple-300">
                  Quick Stats
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-xl bg-[#11111f] border border-purple-900/20">
                  <div className="text-xs text-gray-400">Hours</div>
                  <div className="text-xl font-bold text-gray-100 mt-1">
                    {progress.hoursWatched}
                  </div>
                </div>

                <div className="text-center p-3 rounded-xl bg-[#11111f] border border-purple-900/20">
                  <div className="text-xs text-gray-400">Videos</div>
                  <div className="text-xl font-bold text-gray-100 mt-1">
                    {progress.videosCompleted}
                  </div>
                </div>

                <div className="text-center p-3 rounded-xl bg-[#11111f] border border-purple-900/20">
                  <div className="text-xs text-gray-400">Tests</div>
                  <div className="text-xl font-bold text-gray-100 mt-1">
                    {progress.testsAttempted}
                  </div>
                </div>
              </div>
            </div>

            {/* CONTINUE LEARNING */}
            <ContinueLearning selectedCourse={selectedCourse} />

            {/* UPCOMING LIVE */}
            <UpcomingLive />
          </aside>
        </div>

        {/* TO-DO + LIVE */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-[#0d0d17] p-5 rounded-2xl border border-purple-900/20 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <FaListUl className="text-purple-400" />
              <h3 className="text-lg font-semibold text-purple-300">
                To-Do List
              </h3>
            </div>

            <ul className="space-y-3 text-gray-300">
              <li className="p-3 rounded-lg bg-[#11111f] border border-purple-900/20">
                Finish chapter 3 — Chemistry
              </li>
              <li className="p-3 rounded-lg bg-[#11111f] border border-purple-900/20">
                Attempt practice test — Maths
              </li>
              <li className="p-3 rounded-lg bg-[#11111f] border border-purple-900/20">
                Upload assignment — Physics
              </li>
            </ul>
          </div>

          <div className="bg-[#0d0d17] p-5 rounded-2xl border border-purple-900/20 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <FaClock className="text-purple-400" />
              <h3 className="text-lg font-semibold text-purple-300">
                Upcoming Live (Today)
              </h3>
            </div>

            <UpcomingLive compact />
          </div>
        </div>
      </div>
    </main>
  );
}
