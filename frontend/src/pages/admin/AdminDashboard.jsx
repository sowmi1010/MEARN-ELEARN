// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import api from "../../utils/api";

import StatCard from "./components/StatCard";
import VisitorChart from "./components/VisitorChart";
import GroupOverview from "./components/GroupOverview";
import TopCoursesChart from "./components/TopCoursesChart";
import RecentPayments from "./components/RecentPayments";

import {
  FaUserGraduate,
  FaVideo,
  FaRupeeSign,
  FaBook,
  FaSyncAlt,
} from "react-icons/fa";

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [videosCount, setVideosCount] = useState(0);
  const [payments, setPayments] = useState([]);
  const [courses, setCourses] = useState([]);

  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  // Receive global-search event
  useEffect(() => {
    const handler = (e) => {
      const text = (e?.detail || "").toString();
      setFilterText(text.trim().toLowerCase());
    };
    window.addEventListener("global-search", handler);
    return () => window.removeEventListener("global-search", handler);
  }, []);

  async function fetchAll() {
    setRefreshing(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const [usersRes, videosRes, paymentsRes, coursesRes] =
        await Promise.allSettled([
          api.get("/auth/users", { headers }),
          api.get("/videos/count/total", { headers }),
          api.get("/payments/all", { headers }),
          api.get("/courses", { headers }),
        ]);

      if (usersRes.status === "fulfilled") setStudents(usersRes.value.data || []);
      if (videosRes.status === "fulfilled")
        setVideosCount(videosRes.value.data?.total ?? 0);

      if (paymentsRes.status === "fulfilled") {
        const pd = Array.isArray(paymentsRes.value.data)
          ? paymentsRes.value.data
          : paymentsRes.value.data?.payments || [];
        setPayments(pd);
      }

      if (coursesRes.status === "fulfilled")
        setCourses(coursesRes.value.data || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredStudents = useMemo(() => {
    if (!filterText) return students;
    return students.filter((s) =>
      `${s.firstName || ""} ${s.lastName || ""} ${s.email || ""}`
        .toLowerCase()
        .includes(filterText)
    );
  }, [students, filterText]);

  const filteredCourses = useMemo(() => {
    if (!filterText) return courses;
    return courses.filter((c) =>
      `${c.title || ""} ${c.standard || ""} ${c.group || ""}`
        .toLowerCase()
        .includes(filterText)
    );
  }, [courses, filterText]);

  const filteredPayments = useMemo(() => {
    if (!filterText) return payments;
    return payments.filter((p) =>
      `${p?.user?.email || ""} ${p?.provider || ""} ${p?.metadata?.title || ""}`
        .toLowerCase()
        .includes(filterText)
    );
  }, [payments, filterText]);

  const totalIncome = useMemo(
    () =>
      filteredPayments.reduce(
        (sum, p) =>
          p?.status === "successful" ? sum + Number(p.amount || 0) : sum,
        0
      ),
    [filteredPayments]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-blue-400">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-[#050810] text-white space-y-6">
      
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-blue-400">
            Admin Control Panel
          </h1>
          <p className="text-gray-400 mt-1">
            Live analytics & system overview
          </p>
        </div>

        <button
          onClick={fetchAll}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition"
        >
          <FaSyncAlt />
          <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
        </button>
      </div>

      {/* TOP STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Students"
          value={filteredStudents.length}
          icon={<FaUserGraduate />}
          color="from-blue-600 to-cyan-500"
        />
        <StatCard
          title="Videos"
          value={videosCount}
          icon={<FaVideo />}
          color="from-sky-600 to-blue-700"
        />
        <StatCard
          title="Income"
          value={`₹${totalIncome}`}
          icon={<FaRupeeSign />}
          color="from-emerald-500 to-green-600"
        />
        <StatCard
          title="Courses"
          value={filteredCourses.length}
          icon={<FaBook />}
          color="from-blue-700 to-indigo-600"
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0b1220] rounded-2xl p-4 border border-white/10">
          <VisitorChart students={filteredStudents} />
        </div>

        <div className="bg-[#0b1220] rounded-2xl p-4 border border-white/10">
          <h3 className="text-lg font-semibold text-blue-300 mb-3">
            Top Courses
          </h3>
          <TopCoursesChart courses={filteredCourses} />
        </div>
      </div>

      {/* PAYMENTS + GROUPS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-[#0b1220] rounded-2xl p-4 border border-white/10">
          <RecentPayments payments={filteredPayments} />
        </div>

        <div className="bg-[#0b1220] rounded-2xl p-4 border border-white/10">
          <h3 className="text-lg font-semibold text-blue-300 mb-3">
            Group Overview
          </h3>
          <GroupOverview students={filteredStudents} />
        </div>

      </div>

    </div>
  );
}
