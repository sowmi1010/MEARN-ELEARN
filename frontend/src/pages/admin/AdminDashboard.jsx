import React, { useEffect, useState, useMemo } from "react";
import api from "../../utils/api";

import StatCard from "./components/StatCard";
import VisitorChart from "./components/VisitorChart";
import GroupOverview from "./components/GroupOverview";
import TopCoursesChart from "./components/TopCoursesChart";
import ReviewStats from "./components/ReviewStats";
import RecentPayments from "./components/RecentPayments";

import {
  FaUserGraduate,
  FaVideo,
  FaRupeeSign,
  FaBook,
} from "react-icons/fa";

export default function AdminDashboard() {

  const [students, setStudents] = useState([]);
  const [videos, setVideos] = useState(0);
  const [payments, setPayments] = useState([]);
  const [courses, setCourses] = useState([]);

  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");


  // ======================================================
  // ✅ GLOBAL SEARCH
  // ======================================================
  useEffect(() => {
    const handler = (e) => {
      const text = (e?.detail || "").toString().toLowerCase();
      setFilter(text);
    };

    window.addEventListener("global-search", handler);
    return () => window.removeEventListener("global-search", handler);
  }, []);


  // ======================================================
  // ✅ FETCH + AUTO LIVE REFRESH
  // ======================================================
  useEffect(() => {

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        if (user?.role === "admin" || user?.isSuperAdmin) {

          const [usersRes, videosRes, paymentsRes, coursesRes] =
            await Promise.all([
              api.get("/auth/users", { headers }),
              api.get("/videos/count/total", { headers }),
              api.get("/payments/all", { headers }),
              api.get("/courses", { headers }),
            ]);

          /* ✅ Students */
          setStudents(usersRes.data || []);

          /* ✅ Videos */
          setVideos(videosRes.data?.total || 0);

          /* ✅ Payments (Handle all possible structures) */
          const paymentData = Array.isArray(paymentsRes.data)
            ? paymentsRes.data
            : paymentsRes.data?.payments || [];

          setPayments(paymentData);

          /* ✅ Courses */
          setCourses(coursesRes.data || []);
        }

        // ================== MENTOR ===================
        else if (user?.role === "mentor") {

          const permissions = user?.permissions || [];

          if (permissions.includes("students")) {
            const usersRes = await api.get("/auth/users", { headers });
            setStudents(usersRes.data || []);
          }

          if (permissions.includes("courses")) {
            const coursesRes = await api.get("/courses", { headers });
            setCourses(coursesRes.data || []);
          }

          if (permissions.includes("payments")) {
            const paymentsRes = await api.get("/payments/all", { headers });
            const paymentData = Array.isArray(paymentsRes.data)
              ? paymentsRes.data
              : paymentsRes.data?.payments || [];

            setPayments(paymentData);
          }

          if (permissions.includes("videos")) {
            const videosRes = await api.get("/videos/count/total", {
              headers,
            });
            setVideos(videosRes.data?.total || 0);
          }
        }

      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // ✅ AUTO LIVE REFRESH - every 5 seconds
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);

  }, []);


  // ======================================================
  // ✅ FILTERED DATA
  // ======================================================
  const filteredStudents = useMemo(() => {
    if (!filter) return students;

    return students.filter((s) =>
      `${s.firstName || ""} ${s.lastName || ""} ${s.email || ""} ${s.role || ""}`
        .toLowerCase()
        .includes(filter)
    );
  }, [filter, students]);


  const filteredCourses = useMemo(() => {
    if (!filter) return courses;

    return courses.filter((c) =>
      `${c.title || ""} ${c.standard || ""} ${c.group || ""}`
        .toLowerCase()
        .includes(filter)
    );
  }, [filter, courses]);


  const filteredPayments = useMemo(() => {
    if (!filter) return payments;

    return payments.filter((p) =>
      `${p?.user?.email || ""} ${p?.provider || ""} ${p?.metadata?.title || ""}`
        .toLowerCase()
        .includes(filter)
    );
  }, [filter, payments]);


  // ======================================================
  // ✅ INCOME (FIXED — NO MORE 0 ISSUE)
  // ======================================================
  const totalIncome = useMemo(() => {
    return filteredPayments.reduce((sum, p) => {

      // successful payments only
      if (p.status === "successful") {
        return sum + Number(p.amount || 0);
      }

      return sum;
    }, 0);
  }, [filteredPayments]);


  // ======================================================
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-blue-400 text-lg">
        Loading Dashboard...
      </div>
    );
  }

  if (
    user?.role === "mentor" &&
    (!user.permissions || user.permissions.length === 0)
  ) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-gray-400 text-lg">
        🔒 You don&apos;t have access to dashboard modules.
      </div>
    );
  }


  return (
    <div className="min-h-screen p-6 bg-[#050810] text-white space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-extrabold text-blue-400">
          {user?.role === "mentor"
            ? "Mentor Control Panel"
            : "Admin Control Panel"}
        </h1>

        <p className="text-gray-400 mt-1 text-sm">
          Live system analytics and platform monitoring
        </p>
      </div>

      {/* ===================================== */}
      {/* STAT CARDS */}
      {/* ===================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard
          title="Students"
          value={filteredStudents.length}
          icon={<FaUserGraduate />}
          color="from-blue-600 to-cyan-500"
        />

        <StatCard
          title="Videos"
          value={videos}
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


      {/* ===================================== */}
      {/* CHARTS */}
      {/* ===================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VisitorChart students={filteredStudents} />
        <TopCoursesChart courses={filteredCourses} />
      </div>


      {/* ===================================== */}
      {/* GROUP + REVIEW */}
      {/* ===================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GroupOverview students={filteredStudents} />
        <ReviewStats />
      </div>


      {/* ===================================== */}
      {/* PAYMENTS TABLE */}
      {/* ===================================== */}
      <RecentPayments payments={filteredPayments} />

    </div>
  );
}
