import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import StatCard from "./components/StatCard";
import VisitorChart from "./components/VisitorChart";
import GroupOverview from "./components/GroupOverview";
import TopCoursesChart from "./components/TopCoursesChart";
import ReviewStats from "./components/ReviewStats";
import RecentPayments from "./components/RecentPayments";
import { FaUserGraduate, FaVideo, FaRupeeSign, FaBook } from "react-icons/fa";

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [videos, setVideos] = useState(0);
  const [payments, setPayments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [usersRes, videosRes, paymentsRes, coursesRes] = await Promise.all([
          api.get("/auth/users", { headers }),
          api.get("/videos/count/total", { headers }),
          api.get("/payments/all", { headers }),
          api.get("/courses", { headers }),
        ]);

        setStudents(usersRes.data);
        setVideos(videosRes.data.total || 0);
        setPayments(paymentsRes.data);
        setCourses(coursesRes.data);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalIncome = payments.reduce((sum, p) => sum + p.amount, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-400 text-lg">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Users" value={students.length} icon={<FaUserGraduate />} color="from-purple-500 to-pink-500" />
        <StatCard title="Total Videos" value={videos} icon={<FaVideo />} color="from-blue-500 to-indigo-500" />
        <StatCard title="Total Income" value={`₹${totalIncome}`} icon={<FaRupeeSign />} color="from-green-500 to-emerald-600" />
        <StatCard title="Total Courses" value={courses.length} icon={<FaBook />} color="from-yellow-500 to-orange-500" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <VisitorChart />
        <TopCoursesChart courses={courses} />
      </div>

      {/* Groups and Reviews Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <GroupOverview />
        <ReviewStats />
      </div>

      {/* Recent Payments */}
      <RecentPayments payments={payments} />
    </div>
  );
}
