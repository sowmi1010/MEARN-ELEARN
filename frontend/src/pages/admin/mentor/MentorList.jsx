import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiPlusCircle,
  HiUser,
  HiUserGroup,
  HiPencil,
  HiKey,
  HiTrash,
} from "react-icons/hi2";
import api from "../../../utils/api";

export default function MentorList() {
  const [mentors, setMentors] = useState([]);
  const [search, setSearch] = useState(""); // ✅ Global Search
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const navigate = useNavigate();

  /* ✅ LISTEN GLOBAL SEARCH FROM ADMIN LAYOUT */
  useEffect(() => {
    const handler = (e) => setSearch(e.detail);
    window.addEventListener("admin-global-search", handler);
    return () => window.removeEventListener("admin-global-search", handler);
  }, []);

  useEffect(() => {
    fetchMentors();
  }, []);

  async function fetchMentors() {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/mentor", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMentors(res.data);
    } catch (err) {
      console.error("Error fetching mentors:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this mentor?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/mentor/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMentors((prev) => prev.filter((m) => m._id !== id));
      alert("Mentor deleted ✅");
    } catch (err) {
      alert("Delete failed");
    }
  }

  function handleAccess(mentor) {
    navigate(`/admin/mentor-access/${mentor._id}`);
  }

  /* ✅ FILTER USING GLOBAL SEARCH */
  const filteredMentors = mentors.filter(
    (m) =>
      m.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      m.department?.toLowerCase().includes(search.toLowerCase()) ||
      m.type?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient">
              Mentor Management
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Search from global bar – name, department, type...
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/admin/mentors/new"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-400 px-5 py-2.5 rounded-xl font-semibold shadow-md hover:scale-105 transition"
            >
              <HiPlusCircle className="text-xl" /> Add New
            </Link>

            <div className="bg-white/5 px-5 py-3 rounded-xl border border-blue-500/10 flex items-center gap-3">
              <HiUserGroup className="text-teal-400 text-2xl" />
              <span className="text-2xl font-bold">
                {filteredMentors.length}
              </span>
            </div>
          </div>
        </div>

        {/* ===== TABLE ===== */}
        <div className="bg-white/5 backdrop-blur-xl border border-blue-500/10 rounded-2xl shadow-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#020617] text-blue-400 uppercase text-xs">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">Profile</th>
                <th className="p-4">Name</th>
                <th className="p-4">Department</th>
                <th className="p-4">Type</th>
                <th className="p-4">Phone</th>
                <th className="p-4 text-center">Access</th>
                <th className="p-4 text-center">Edit</th>
                <th className="p-4 text-center">Delete</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan="9" className="p-10 text-center text-blue-400">
                    Loading mentors...
                  </td>
                </tr>
              )}

              {!loading && filteredMentors.map((m, i) => (
                <tr
                  key={m._id}
                  className="border-b border-blue-500/5 hover:bg-blue-500/10 transition"
                >
                  <td className="p-4 text-gray-400">{i + 1}</td>

                  <td className="p-4">
                    {m.photo ? (
                      <img
                        src={`${API_URL}${m.photo}`}
                        className="w-10 h-10 rounded-full object-cover border border-blue-500"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                        <HiUser />
                      </div>
                    )}
                  </td>

                  <td className="p-4 font-semibold">
                    {m.firstName} {m.lastName}
                  </td>

                  <td className="p-4 text-blue-400">
                    {m.department || "—"}
                  </td>

                  <td className="p-4">
                    <span className="px-3 py-1 text-xs bg-indigo-500/20 border border-indigo-500/30 rounded-full">
                      {m.type || "—"}
                    </span>
                  </td>

                  <td className="p-4 text-gray-400">
                    {m.phone || "—"}
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleAccess(m)}
                      className="px-3 py-1 bg-teal-500 rounded-lg flex gap-2 items-center justify-center"
                    >
                      <HiKey /> Access
                    </button>
                  </td>

                  <td className="p-4 text-center">
                    <Link
                      to={`/admin/mentors/edit/${m._id}`}
                      className="px-3 py-1 bg-blue-600 rounded-lg flex gap-2 justify-center"
                    >
                      <HiPencil /> Edit
                    </Link>
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDelete(m._id)}
                      className="px-3 py-1 bg-red-600 rounded-lg flex gap-2 justify-center"
                    >
                      <HiTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}

              {!loading && filteredMentors.length === 0 && (
                <tr>
                  <td colSpan="9" className="p-10 text-center text-gray-500">
                    No mentors match your search 🔍
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
