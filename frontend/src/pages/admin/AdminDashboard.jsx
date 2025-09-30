// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts";

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // 🔹 Students
        if (user.role === "admin" || user.permissions?.includes("students")) {
          const res1 = await api.get("/auth/users", { headers });
          setStudents(res1.data);
        }

        // 🔹 Payments
        if (user.role === "admin" || user.permissions?.includes("payments")) {
          const res2 = await api.get("/payments/all", { headers });
          setPayments(res2.data);
        }

        // 🔹 Courses
        if (user.role === "admin") {
          const res3 = await api.get("/courses", { headers });
          setCourses(res3.data);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user.role, user.permissions]);

  if (loading) {
    return <div className="p-6 text-gray-400">Loading dashboard...</div>;
  }

  // Chart Data (dummy visitors)
  const visitorData = [
    { month: "Jan", visitors: 120 },
    { month: "Feb", visitors: 180 },
    { month: "Mar", visitors: 140 },
    { month: "Apr", visitors: 200 },
    { month: "May", visitors: 160 },
  ];

  // Top courses by enrollments
  const topCourses = courses.map(c => ({
    name: c.title,
    enrollments: c.enrolledUsers ? c.enrolledUsers.length : 0,
  }));

  return (
    <div className="flex min-h-screen bg-darkBg">
      <main className="flex-1 p-8 space-y-8">

        {/* 🔹 Branch Info (Visible only for Branch Admin) */}
        {user.role === "admin" && (user.branchName || user.branchNo || user.department) && (
          <div className="bg-darkCard p-6 rounded-xl shadow-lg border border-gray-700">
            <h1 className="text-2xl font-bold text-accent mb-4">🏢 Branch Admin Information</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-300">
              <p><span className="font-semibold text-accent">Branch Name:</span> {user.branchName || "—"}</p>
              <p><span className="font-semibold text-accent">Branch No:</span> {user.branchNo || "—"}</p>
              <p><span className="font-semibold text-accent">Department:</span> {user.department || "—"}</p>
            </div>
          </div>
        )}

        {/* 🔹 Stats Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatBox title="Total Users" value={students.length} color="from-purple-500 to-pink-500" />
          <StatBox
            title="Total Income"
            value={`₹${payments.reduce((sum, p) => sum + p.amount, 0)}`}
            color="from-green-400 to-emerald-600"
          />
          <StatBox title="Payments" value={payments.length} color="from-yellow-400 to-orange-500" />
          <StatBox title="Courses" value={courses.length} color="from-cyan-400 to-blue-500" />
        </div>

        {/* 🔹 Visitor Insights */}
        <Card title="📈 Visitor Insights">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={visitorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" stroke="#bbb" />
              <YAxis stroke="#bbb" />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #555", borderRadius: "8px" }} />
              <Line type="monotone" dataKey="visitors" stroke="#38bdf8" strokeWidth={3} dot={{ fill: "#38bdf8", r: 6 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* 🔹 Payments Overview */}
        {(user.role === "admin" || user.permissions?.includes("payments")) && (
          <Card title="💳 Payments Overview">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={payments.map((p, i) => ({ id: i + 1, amount: p.amount }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="id" stroke="#bbb" />
                <YAxis stroke="#bbb" />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #555", borderRadius: "8px" }} />
                <Bar dataKey="amount" fill="#22c55e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* 🔹 Top Courses */}
        {user.role === "admin" && (
          <Card title="🔥 Top Courses">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart layout="vertical" data={topCourses}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis type="number" stroke="#bbb" />
                <YAxis dataKey="name" type="category" stroke="#bbb" />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #555", borderRadius: "8px" }} />
                <Bar dataKey="enrollments" fill="#3b82f6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* 🔹 Recent Payments */}
        {(user.role === "admin" || user.permissions?.includes("payments")) && (
          <Card title="💰 Recent Payments">
            {payments.length === 0 ? (
              <p className="text-gray-400">No payments yet</p>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-gray-300 text-left">
                    <th className="border-b border-gray-700 p-3">User</th>
                    <th className="border-b border-gray-700 p-3">Course</th>
                    <th className="border-b border-gray-700 p-3">Amount</th>
                    <th className="border-b border-gray-700 p-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.slice(-5).reverse().map((p, i) => (
                    <tr key={i} className="hover:bg-gray-800/50 transition border-b border-gray-700">
                      <td className="p-3">{p.user?.name || "Unknown"}</td>
                      <td className="p-3">{p.course?.title || "N/A"}</td>
                      <td className="p-3 text-green-400">₹{p.amount}</td>
                      <td className="p-3 text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        )}
      </main>
    </div>
  );
}

// 🔹 Components
function StatBox({ title, value, color }) {
  return (
    <div className={`p-6 rounded-xl shadow-lg bg-gradient-to-r ${color} text-darkBg text-center transform hover:scale-105 transition`}>
      <h3 className="text-sm uppercase font-bold opacity-80">{title}</h3>
      <p className="text-3xl font-extrabold mt-2">{value}</p>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-darkCard p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-accent mb-4">{title}</h2>
      {children}
    </div>
  );
}
