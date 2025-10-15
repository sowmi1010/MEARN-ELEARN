import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../utils/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaUserPlus, FaComments, FaEdit } from "react-icons/fa";

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/student/detailed-students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
    } catch (err) {
      console.error("❌ Error fetching students:", err.response?.data || err.message);
    }
  }

  const visitorData = [
    { month: "Jan", visitors: 100 },
    { month: "Feb", visitors: 180 },
    { month: "Mar", visitors: 250 },
    { month: "Apr", visitors: 200 },
    { month: "May", visitors: 260 },
    { month: "Jun", visitors: 310 },
    { month: "Jul", visitors: 280 },
    { month: "Aug", visitors: 350 },
    { month: "Sep", visitors: 300 },
    { month: "Oct", visitors: 330 },
    { month: "Nov", visitors: 270 },
    { month: "Dec", visitors: 310 },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-200 p-6">
      {/* ===== Top Section ===== */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
        <div className="flex-1 bg-[#101828] border border-gray-800 rounded-2xl shadow-xl p-6 w-full">
          <h2 className="text-lg font-semibold text-gray-300 mb-4">
            Visitor Insights
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={visitorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  color: "#f8fafc",
                  borderRadius: "10px",
                }}
              />
              <Line
                type="monotone"
                dataKey="visitors"
                stroke="#22d3ee"
                strokeWidth={3}
                dot={{ fill: "#22d3ee", r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ===== Add + Total Card ===== */}
        <div className="flex flex-col items-center gap-4">
          <Link
            to="/admin/students/new"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-400 px-4 py-2 rounded-xl text-white font-semibold shadow hover:scale-105 transition"
          >
            <FaUserPlus /> Add New
          </Link>
          <div className="bg-[#101828] border border-gray-800 rounded-xl p-4 text-center w-40 shadow-lg">
            <p className="text-gray-400 text-sm mb-1">Total Student</p>
            <p className="text-3xl font-bold text-teal-400">{students.length}</p>
          </div>
        </div>
      </div>

      {/* ===== Students Table ===== */}
      <div className="bg-[#101828] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-[#1E293B] text-gray-300 uppercase text-sm tracking-wide">
              <th className="p-4">S. No</th>
              <th className="p-4">About</th>
              <th className="p-4">Profile</th>
              <th className="p-4">Name</th>
              <th className="p-4">Board</th>
              <th className="p-4">Standard</th>
              <th className="p-4">State</th>
              <th className="p-4">Phone</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s, i) => (
              <tr
                key={s._id}
                className={`text-gray-300 hover:bg-[#1E293B]/80 transition ${
                  i % 2 === 0 ? "bg-[#111827]" : "bg-[#0f172a]"
                }`}
              >
                <td className="p-4">{i + 1}</td>

                <td className="p-4">
                  <Link
                    to={`/admin/students/details/${s._id}`}
                    className="px-3 py-1 bg-transparent border border-yellow-500 text-yellow-400 rounded-md text-sm hover:bg-yellow-500 hover:text-black transition"
                  >
                    About
                  </Link>
                </td>

                <td className="p-4">
                  {s.photo ? (
                    <img
                      src={`${API_URL}${s.photo}`}
                      alt="profile"
                      className="w-10 h-10 rounded-full border-2 border-teal-400 object-cover shadow-md"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-500 text-xs">
                      N/A
                    </div>
                  )}
                </td>

                <td className="p-4 font-semibold">
                  {s.firstName} {s.lastName}
                </td>
                <td className="p-4">{s.board || "—"}</td>
                <td className="p-4">{s.standard || "—"}</td>
                <td className="p-4">{s.state || "—"}</td>
                <td className="p-4">{s.phone || "—"}</td>

                <td className="p-4 flex justify-center gap-3">
                  <Link
                    to={`/admin/students/edit/${s._id}`}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md flex items-center gap-1 transition shadow"
                  >
                    <FaEdit /> Edit
                  </Link>
                  <Link
                    to={`/admin/students/chat/${s._id}`}
                    className="px-3 py-1 bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-semibold rounded-md flex items-center gap-1 transition shadow"
                  >
                    <FaComments /> Chat
                  </Link>
                </td>
              </tr>
            ))}

            {students.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center text-gray-500 py-8">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
