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

  // ✅ Use Vite env variable
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    fetchStudents();
  }, []);

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

  async function handleDelete(id) {
    if (!window.confirm("Delete this student?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/admin/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(students.filter((s) => s._id !== id));
    } catch (err) {
      console.error("❌ Delete error:", err.response?.data || err.message);
    }
  }

  // Dummy visitor data (replace with real analytics if available)
  const visitorData = [
    { month: "Jan", visitors: 120 },
    { month: "Feb", visitors: 180 },
    { month: "Mar", visitors: 150 },
    { month: "Apr", visitors: 200 },
    { month: "May", visitors: 170 },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-accent">🎓 Student Management</h1>
        <Link
          to="/admin/students/new"
          className="flex items-center gap-2 px-5 py-2 bg-accent text-darkBg rounded-lg font-semibold shadow hover:scale-105 transition"
        >
          <FaUserPlus /> Add New
        </Link>
      </div>

      {/* Visitor Insights */}
      <div className="bg-darkCard rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-accent mb-4">📊 Visitor Insights</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={visitorData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="month" stroke="#bbb" />
            <YAxis stroke="#bbb" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #555",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="visitors"
              stroke="#38bdf8"
              strokeWidth={3}
              dot={{ fill: "#38bdf8", r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Total Students */}
      <div className="flex justify-end">
        <div className="bg-darkCard rounded-lg shadow-lg px-6 py-4 flex items-center gap-3">
          <span className="text-3xl">👨‍🎓</span>
          <div>
            <p className="text-sm text-gray-400">Total Students</p>
            <p className="text-2xl font-bold text-accent">{students.length}</p>
          </div>
        </div>
      </div>

      {/* Student Details Table */}
      <div className="overflow-x-auto bg-darkCard rounded-xl shadow-lg border border-gray-700">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-gray-300">
              <th className="p-4">S. No</th>
              <th className="p-4">Photo</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Standard</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, index) => (
              <tr
                key={s._id}
                className={`${
                  index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                } hover:bg-gray-700 transition`}
              >
                <td className="p-4 text-gray-300">{index + 1}</td>
                <td className="p-4">
                  {s.photo ? (
                    <img
                      src={`${API_URL}${s.photo}`}
                      alt="student"
                      className="w-12 h-12 rounded-full object-cover border-2 border-accent shadow"
                    />
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </td>
                <td className="p-4 font-semibold text-white">
                  {s.firstName} {s.lastName}
                </td>
                <td className="p-4 text-gray-300">{s.email}</td>
                <td className="p-4 text-gray-300">{s.phone}</td>
                <td className="p-4 text-gray-300">{s.standard || "—"}</td>
                <td className="p-4 flex gap-3">
                  <Link
                    to={`/admin/students/details/${s._id}`}
                    className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 shadow"
                  >
                    <FaInfoCircle /> About
                  </Link>
                  <Link
                    to={`/admin/students/edit/${s._id}`}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow"
                  >
                    <FaEdit /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow"
                  >
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-gray-400 py-8">
                  🚫 No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
