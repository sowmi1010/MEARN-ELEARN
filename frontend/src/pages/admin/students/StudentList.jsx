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

import { FaUserPlus, FaComments, FaEdit, FaInfoCircle } from "react-icons/fa";

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  /* 🔎 GLOBAL SEARCH LISTENER */
  useEffect(() => {
    const handler = (e) => setSearch(e.detail);

    window.addEventListener("admin-global-search", handler);
    return () => window.removeEventListener("admin-global-search", handler);
  }, []);

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
      console.error("Error fetching students:", err.message);
    }
  }

  /* ✅ FILTERED STUDENTS */
  const filteredStudents = students.filter((s) =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    (s.standard || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.board || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.phone || "").toLowerCase().includes(search.toLowerCase())
  );

  const visitorData = [
    { month: "Jan", visitors: 120 },
    { month: "Feb", visitors: 200 },
    { month: "Mar", visitors: 300 },
    { month: "Apr", visitors: 240 },
    { month: "May", visitors: 280 },
    { month: "Jun", visitors: 330 },
    { month: "Jul", visitors: 360 },
    { month: "Aug", visitors: 410 },
    { month: "Sep", visitors: 350 },
    { month: "Oct", visitors: 380 },
    { month: "Nov", visitors: 310 },
    { month: "Dec", visitors: 450 },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-8">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col lg:flex-row justify-between gap-8 mb-10">
        {/* Chart */}
        <div className="bg-[#101828] border border-gray-700 rounded-2xl p-6 w-full shadow-xl">
          <h2 className="text-lg font-semibold mb-4 text-blue-300">
            📊 Student Registration Trend
          </h2>

          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={visitorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#050b1b",
                  border: "1px solid #334155",
                  borderRadius: "10px",
                }}
              />
              <Line
                type="monotone"
                dataKey="visitors"
                stroke="#38bdf8"
                strokeWidth={3}
                dot={{ fill: "#38bdf8", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Right Cards */}
        <div className="flex flex-col gap-4 w-full lg:w-[280px]">
          <Link
            to="/admin/students/new"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-3 rounded-xl shadow-lg font-semibold hover:scale-105 transition"
          >
            <FaUserPlus /> Add Student
          </Link>

          <div className="bg-[#101828] border border-gray-700 rounded-xl p-4 text-center shadow-lg">
            <p className="text-sm text-gray-400 mb-1">Filtered Students</p>
            <h2 className="text-4xl font-bold text-cyan-400">
              {filteredStudents.length}
            </h2>
          </div>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="bg-[#101828] border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1E293B] text-sm text-gray-300 uppercase">
              <th className="p-4 text-center">No</th>
              <th className="p-4 text-center">Profile</th>
              <th className="p-4">Name</th>
              <th className="p-4">Board</th>
              <th className="p-4">Standard</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Fees</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((s, i) => (
              <tr
                key={s._id}
                className={`border-t border-gray-700 hover:bg-[#1E293B]/60 transition ${
                  i % 2 === 0 ? "bg-[#0f172a]" : "bg-[#111827]"
                }`}
              >
                <td className="p-4 text-center text-gray-400">
                  {i + 1}
                </td>

                {/* PROFILE */}
                <td className="p-4 flex justify-center">
                  {s.photo ? (
                    <img
                      src={`${API_URL}${s.photo}`}
                      className="w-12 h-12 rounded-full border-2 border-cyan-400 object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex justify-center items-center">
                      N/A
                    </div>
                  )}
                </td>

                {/* NAME */}
                <td className="p-4 font-semibold">
                  {s.firstName} {s.lastName}
                </td>

                <td className="p-4">{s.board || "—"}</td>
                <td className="p-4">{s.standard || "—"}</td>
                <td className="p-4">{s.phone || "—"}</td>

                {/* FEES STATUS */}
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      s.fees > 0
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {s.fees > 0 ? "Paid" : "Pending"}
                  </span>
                </td>

                {/* ACTION BUTTONS */}
                <td className="p-4">
                  <div className="flex justify-center gap-3">
                    
                    {/* 🟢 ABOUT BUTTON */}
                    <Link
                      to={`/admin/students/details/${s._id}`}
                      className="bg-cyan-500 hover:bg-cyan-600 px-3 py-1 rounded-md text-white text-sm flex items-center gap-1 shadow"
                    >
                      <FaInfoCircle /> About
                    </Link>

                    <Link
                      to={`/admin/students/edit/${s._id}`}
                      className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md text-white text-sm flex items-center gap-1 shadow"
                    >
                      <FaEdit /> Edit
                    </Link>

                    <Link
                      to={`/admin/students/chat/${s._id}`}
                      className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded-md text-black text-sm flex items-center gap-1 shadow"
                    >
                      <FaComments /> Chat
                    </Link>
                  </div>
                </td>
              </tr>
            ))}

            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan="8" className="py-12 text-center text-gray-500">
                  No matching students found for "{search}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
