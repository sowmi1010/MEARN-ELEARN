// src/pages/admin/MentorList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaUserShield, FaPlus } from "react-icons/fa";
import api from "../../utils/api";

export default function MentorList() {
  const [mentors, setMentors] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    fetchMentors();
  }, []);

  async function fetchMentors() {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/mentor", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMentors(res.data);
    } catch (err) {
      console.error("❌ Error fetching mentors:", err.response?.data || err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("⚠️ Are you sure you want to delete this mentor?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/mentor/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMentors(mentors.filter((m) => m._id !== id));
    } catch (err) {
      console.error("❌ Delete error:", err.response?.data || err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-darkBg text-gray-800 dark:text-gray-200 transition-colors duration-300">
      {/* === Header Bar === */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-500 py-8 shadow-lg text-white">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <h1 className="text-4xl font-extrabold tracking-wide">
            👨‍🏫 Mentor Management
          </h1>
          <Link
            to="/admin/mentors/new"
            className="flex items-center gap-2 px-5 py-2 bg-white text-teal-600 font-semibold rounded-lg shadow hover:scale-105 hover:shadow-md transition"
          >
            <FaPlus /> Add Mentor
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-10 -mt-8">
        {/* === Stats Card === */}
        <div className="bg-white/90 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg p-6 flex items-center justify-between hover:shadow-xl transition">
          <div className="flex items-center gap-4">
            <span className="text-5xl">📊</span>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Mentors
              </p>
              <p className="text-3xl font-bold text-teal-500">{mentors.length}</p>
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 italic">
            Manage all mentor profiles in one place
          </p>
        </div>

        {/* === Mentor Table === */}
        <div className="bg-white/90 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden hover:shadow-xl transition">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-teal-500/90 text-white text-sm uppercase tracking-wide">
                <th className="p-4">Photo</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Department</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {mentors.map((m, idx) => (
                <tr
                  key={m._id}
                  className={`transition-all hover:scale-[1.01] hover:shadow-md ${
                    idx % 2 === 0
                      ? "bg-gray-50 dark:bg-gray-700/40"
                      : "bg-gray-100 dark:bg-gray-700/60"
                  }`}
                >
                  {/* Photo */}
                  <td className="p-4">
                    {m.photo ? (
                      <img
                        src={`${API_URL}${m.photo}`}
                        alt={m.firstName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-teal-400 shadow hover:scale-110 transition"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-300 dark:bg-gray-600 text-gray-500">
                        —
                      </div>
                    )}
                  </td>

                  {/* Info */}
                  <td className="p-4 font-semibold">{m.firstName} {m.lastName}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">{m.email}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">{m.phone}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">{m.department || "—"}</td>

                  {/* Actions */}
                  <td className="p-4 flex justify-center gap-3">
                    <Link
                      to={`/admin/mentors/edit/${m._id}`}
                      className="flex items-center gap-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow hover:scale-105 transition"
                    >
                      <FaEdit /> Edit
                    </Link>
                    <Link
                      to={`/admin/mentors/access/${m._id}`}
                      className="flex items-center gap-1 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-darkBg rounded-lg shadow hover:scale-105 transition"
                    >
                      <FaUserShield /> Access
                    </Link>
                    <button
                      onClick={() => handleDelete(m._id)}
                      className="flex items-center gap-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow hover:scale-105 transition"
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}

              {mentors.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center text-gray-500 dark:text-gray-400 py-8"
                  >
                    🚫 No mentors found
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
