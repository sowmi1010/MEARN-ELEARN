// src/pages/admin/StudentList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaUserPlus, FaEdit, FaTrash, FaInfoCircle } from "react-icons/fa";

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    fetchStudents();
  }, []);

  // ✅ Fetch students
  async function fetchStudents() {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/admin/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
    } catch (err) {
      console.error("❌ Error fetching students:", err.response?.data || err.message);
    }
  }

  // ✅ Delete student
  async function handleDelete(id) {
    if (!window.confirm("⚠️ Are you sure you want to delete this student?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/admin/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("❌ Delete error:", err.response?.data || err.message);
    }
  }

  // ✅ Dummy visitor data for chart
  const visitorData = [
    { month: "Jan", visitors: 120 },
    { month: "Feb", visitors: 180 },
    { month: "Mar", visitors: 150 },
    { month: "Apr", visitors: 200 },
    { month: "May", visitors: 170 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-darkBg text-gray-800 dark:text-gray-200 transition-colors duration-300">
      {/* ===== Page Header ===== */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-500 py-8 shadow-lg text-white">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide">
            🎓 Student Management
          </h1>
          <Link
            to="/admin/students/new"
            className="flex items-center gap-2 px-5 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold shadow-md transition"
          >
            <FaUserPlus /> Add New
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 -mt-8 space-y-10">
        {/* ===== Visitor Insights ===== */}
        <div className="bg-white/90 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-teal-500 mb-4">📈 Visitor Insights</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={visitorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#f9f9f9",
                  color: "#333",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="visitors"
                stroke="#14b8a6"
                strokeWidth={3}
                dot={{ fill: "#14b8a6", r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ===== Stats Widget ===== */}
        <div className="flex justify-end">
          <div className="bg-white/90 dark:bg-gray-800/70 rounded-xl shadow-lg px-6 py-4 flex items-center gap-3 border border-gray-200 dark:border-gray-700">
            <span className="text-4xl">👨‍🎓</span>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Students</p>
              <p className="text-2xl font-bold text-teal-500">{students.length}</p>
            </div>
          </div>
        </div>

        {/* ===== Students Table ===== */}
        <div className="overflow-x-auto bg-white/90 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-left">
                <th className="p-4">S. No</th>
                <th className="p-4">Photo</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Standard</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, index) => (
                <tr
                  key={s._id}
                  className={`transition hover:scale-[1.01] ${
                    index % 2 === 0
                      ? "bg-gray-50 dark:bg-gray-800"
                      : "bg-gray-100 dark:bg-gray-700/50"
                  } hover:shadow-md`}
                >
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">
                    {s.photo ? (
                      <img
                        src={`${API_URL}${s.photo}`}
                        alt="student"
                        className="w-12 h-12 rounded-full object-cover border-2 border-teal-400 shadow hover:scale-110 transition"
                      />
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="p-4 font-semibold">{s.firstName} {s.lastName}</td>
                  <td className="p-4">{s.email}</td>
                  <td className="p-4">{s.phone}</td>
                  <td className="p-4">{s.standard || "—"}</td>
                  <td className="p-4 flex justify-center gap-3">
                    <Link
                      to={`/admin/students/details/${s._id}`}
                      className="flex items-center gap-1 px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-darkBg rounded-lg shadow hover:scale-105 transition"
                    >
                      <FaInfoCircle /> About
                    </Link>
                    <Link
                      to={`/admin/students/edit/${s._id}`}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow hover:scale-105 transition"
                    >
                      <FaEdit /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="flex items-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow hover:scale-105 transition"
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}

              {students.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500 dark:text-gray-400 py-8">
                    🚫 No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
