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

        // 👩‍🎓 Students
        if (user.role === "admin" || user.permissions?.includes("students")) {
          const res1 = await api.get("/auth/users", { headers });
          setStudents(res1.data);
        }

        // 💰 Payments
        if (user.role === "admin" || user.permissions?.includes("payments")) {
          const res2 = await api.get("/payments/all", { headers });
          setPayments(res2.data);
        }

        // 📚 Courses
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
    return (
      <div className="p-8 text-gray-500 dark:text-gray-300 text-lg">
        ⏳ Loading dashboard...
      </div>
    );
  }

  // Dummy visitor analytics
  const visitorData = [
    { month: "Jan", visitors: 120 },
    { month: "Feb", visitors: 180 },
    { month: "Mar", visitors: 140 },
    { month: "Apr", visitors: 200 },
    { month: "May", visitors: 160 },
  ];

  // Top courses by enrollment
  const topCourses = courses.map(c => ({
    name: c.title,
    enrollments: c.enrolledUsers ? c.enrolledUsers.length : 0,
  }));

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-darkBg transition-colors duration-300">
      <main className="p-8 space-y-8 max-w-7xl mx-auto">

        {/* 🏢 Branch Info */}
        {user.role === "admin" && (user.branchName || user.branchNo || user.department) && (
          <div className="bg-white dark:bg-darkCard p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-accent mb-4">
              🏢 Branch Admin Information
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-700 dark:text-gray-300">
              <p><span className="font-semibold text-accent">Branch Name:</span> {user.branchName || "—"}</p>
              <p><span className="font-semibold text-accent">Branch No:</span> {user.branchNo || "—"}</p>
              <p><span className="font-semibold text-accent">Department:</span> {user.department || "—"}</p>
            </div>
          </div>
        )}

        {/* 📊 Stats Widgets */}
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

        {/* 📈 Visitor Insights */}
        <Card title="📈 Visitor Insights">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={visitorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#f9fafb",
                  color: "#111",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
                labelStyle={{ color: "#111" }}
              />
              <Line type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5, fill: "#3b82f6" }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* 💳 Payments Overview */}
        {(user.role === "admin" || user.permissions?.includes("payments")) && (
          <Card title="💳 Payments Overview">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={payments.map((p, i) => ({ id: i + 1, amount: p.amount }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                <XAxis dataKey="id" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f9fafb",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                  labelStyle={{ color: "#111" }}
                />
                <Bar dataKey="amount" fill="#22c55e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* 🔥 Top Courses */}
        {user.role === "admin" && (
          <Card title="🔥 Top Courses">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart layout="vertical" data={topCourses}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                <XAxis type="number" stroke="#666" />
                <YAxis dataKey="name" type="category" stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f9fafb",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                  labelStyle={{ color: "#111" }}
                />
                <Bar dataKey="enrollments" fill="#3b82f6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* 💰 Recent Payments */}
        {(user.role === "admin" || user.permissions?.includes("payments")) && (
          <Card title="💰 Recent Payments">
            {payments.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No payments yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800">
                      <th className="p-3 text-left">User</th>
                      <th className="p-3 text-left">Course</th>
                      <th className="p-3 text-left">Amount</th>
                      <th className="p-3 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.slice(-5).reverse().map((p, i) => (
                      <tr
                        key={i}
                        className={`hover:bg-accent/10 dark:hover:bg-accent/20 transition-colors ${i % 2 === 0 ? "bg-white dark:bg-darkBg" : "bg-gray-50 dark:bg-darkCard"}`}
                      >
                        <td className="p-3">{p.user?.name || "Unknown"}</td>
                        <td className="p-3">{p.course?.title || "N/A"}</td>
                        <td className="p-3 text-green-600 dark:text-green-400">₹{p.amount}</td>
                        <td className="p-3 text-gray-500 dark:text-gray-400">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}
      </main>
    </div>
  );
}

/* 🔹 StatBox */
function StatBox({ title, value, color }) {
  return (
    <div
      className={`p-6 rounded-xl shadow-lg bg-gradient-to-r ${color} text-darkBg text-center transform hover:scale-105 transition`}
    >
      <h3 className="text-sm uppercase font-bold opacity-80">{title}</h3>
      <p className="text-3xl font-extrabold mt-2">{value}</p>
    </div>
  );
}

/* 🔹 Card Wrapper */
function Card({ title, children }) {
  return (
    <div
      className="
        bg-white dark:bg-darkCard
        p-6 rounded-xl shadow-lg
        border border-gray-200 dark:border-gray-700
        transition-colors duration-300
      "
    >
      <h2 className="text-xl font-bold text-accent mb-4">{title}</h2>
      {children}
    </div>
  );
}
