// src/pages/student/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import MyCoursesDropdown from "../../components/student/MyCoursesDropdown";
import ContinueLearning from "../../components/student/ContinueLearning";
import PerformanceChart from "../../components/student/PerformanceChart";
import UpcomingLive from "../../components/student/UpcomingLive";

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

        // 1️⃣ Get purchased courses
        const payRes = await api.get("/student/dashboard/payments", { headers });

        const paymentList = Array.isArray(payRes.data.payments)
          ? payRes.data.payments
          : [];

        const purchased = paymentList
          .map((p) => p.course)
          .filter(Boolean)
          .reduce((acc, c) => {
            if (!acc.find((x) => x._id === c._id)) acc.push(c);
            return acc;
          }, []);

        setCourses(purchased);
        if (purchased.length > 0) setSelectedCourse(purchased[0]);

        // 2️⃣ Get Progress
        if (purchased[0]?._id) {
          const progRes = await api.get("/student/dashboard/progress", {
            headers,
            params: { courseId: purchased[0]._id },
          });

          setProgress({
            hoursWatched: progRes.data?.stats?.hours || 0,
            videosCompleted: progRes.data?.stats?.videos || 0,
            testsAttempted: progRes.data?.stats?.tests || 0,
            history: progRes.data?.history || [],
          });
        }
      } catch (err) {
        console.error("Dashboard load failed:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <main className="flex-1 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-purple-400">
            Hello {user?.name || "Student"} 👋
          </h1>
          <p className="text-sm text-gray-300">
            Let’s continue your learning journey.
          </p>
        </div>

        <MyCoursesDropdown
          courses={courses}
          selected={selectedCourse}
          onSelect={(course) => setSelectedCourse(course)}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <section className="lg:col-span-2 bg-[#081024] p-4 rounded-xl shadow-lg">
          <PerformanceChart progress={progress} />
        </section>

        {/* Right Sidebar */}
        <aside className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-[#081024] p-4 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-200 mb-3">
              Quick Stats
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-[#061221] rounded">
                <div className="text-sm text-gray-400">Hours</div>
                <div className="text-xl font-bold">{progress.hoursWatched}</div>
              </div>

              <div className="text-center p-3 bg-[#061221] rounded">
                <div className="text-sm text-gray-400">Videos</div>
                <div className="text-xl font-bold">
                  {progress.videosCompleted}
                </div>
              </div>

              <div className="text-center p-3 bg-[#061221] rounded">
                <div className="text-sm text-gray-400">Tests</div>
                <div className="text-xl font-bold">
                  {progress.testsAttempted}
                </div>
              </div>
            </div>
          </div>

          {/* Continue Learning */}
          <ContinueLearning selectedCourse={selectedCourse} />

          {/* Upcoming Live */}
          <UpcomingLive />
        </aside>
      </div>

      {/* Bottom Widgets */}
      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#081024] p-4 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">To do List</h3>
          <ul className="space-y-3 text-gray-300">
            <li className="p-3 bg-[#061221] rounded">
              Finish chapter 3 — Chemistry
            </li>
            <li className="p-3 bg-[#061221] rounded">
              Attempt practice test — Maths
            </li>
            <li className="p-3 bg-[#061221] rounded">
              Upload assignment — Physics
            </li>
          </ul>
        </div>

        <div className="bg-[#081024] p-4 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Upcoming Live</h3>
          <UpcomingLive compact />
        </div>
      </div>
    </main>
  );
}
