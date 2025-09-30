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
    if (!window.confirm("⚠️ Delete this mentor?")) return;
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
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-accent">👨‍🏫 Mentor Management</h1>
        <Link
          to="/admin/mentors/new"
          className="flex items-center gap-2 px-5 py-2 bg-accent text-darkBg rounded-lg font-semibold shadow hover:scale-105 transition"
        >
          <FaPlus /> Add Mentor
        </Link>
      </div>

      {/* Total Mentors */}
      <div className="flex justify-end">
        <div className="bg-darkCard rounded-lg shadow-lg px-6 py-4 flex items-center gap-3">
          <span className="text-3xl">📊</span>
          <div>
            <p className="text-sm text-gray-400">Total Mentors</p>
            <p className="text-2xl font-bold text-accent">{mentors.length}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-darkCard rounded-xl shadow-lg border border-gray-700">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-gray-300">
              <th className="p-4 text-left">Photo</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Department</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mentors.map((m, idx) => (
              <tr
                key={m._id}
                className={`${
                  idx % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                } hover:bg-gray-700 transition`}
              >
                {/* Photo */}
                <td className="p-4">
                  {m.photo ? (
                    <img
                      src={`${API_URL}${m.photo}`}
                      alt="mentor"
                      className="w-12 h-12 rounded-full object-cover border-2 border-accent shadow"
                    />
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </td>

                {/* Info */}
                <td className="p-4 font-semibold text-white">
                  {m.firstName} {m.lastName}
                </td>
                <td className="p-4 text-gray-300">{m.email}</td>
                <td className="p-4 text-gray-300">{m.phone}</td>
                <td className="p-4 text-gray-300">{m.department || "—"}</td>

                {/* Actions */}
                <td className="p-4 flex gap-3">
                  <Link
                    to={`/admin/mentors/edit/${m._id}`}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 shadow"
                  >
                    <FaEdit /> Edit
                  </Link>
                  <Link
                    to={`/admin/mentors/access/${m._id}`}
                    className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-darkBg rounded-full hover:bg-yellow-600 shadow"
                  >
                    <FaUserShield /> Access
                  </Link>
                  <button
                    onClick={() => handleDelete(m._id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow"
                  >
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}

            {mentors.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-gray-400 py-8">
                  🚫 No mentors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
