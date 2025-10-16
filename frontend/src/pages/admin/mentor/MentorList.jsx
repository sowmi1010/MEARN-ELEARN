import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiPlusCircle, HiUser, HiUserGroup, HiPencil, HiKey } from "react-icons/hi2";
import api from "../../../utils/api";

export default function MentorList() {
  const [mentors, setMentors] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const navigate = useNavigate(); 

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
      console.error("Error fetching mentors:", err.response?.data || err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this mentor?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/mentor/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMentors((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
    }
  }

  // Access Button → Navigate to Mentor Access Page
  function handleAccess(mentor) {
    navigate(`/admin/mentor-access/${mentor._id}`);
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-6 transition-all duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-wide text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
              Mentor Management
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              View, edit, and manage all mentors in one place
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/admin/mentors/new"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-400 px-5 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-105 transition"
            >
              <HiPlusCircle className="text-xl" /> Add New
            </Link>

            <div className="bg-gray-800 px-5 py-3 rounded-xl border border-gray-700 flex items-center gap-2">
              <HiUserGroup className="text-teal-400 text-2xl" />
              <div>
                <p className="text-gray-400 text-sm">
                  Total Mentor{" "}
                  <span className="ml-4 text-2xl font-bold text-white">
                    {mentors.length}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="bg-gradient-to-b from-gray-800/90 to-gray-900 rounded-2xl shadow-xl border border-gray-700 p-6">
          <h2 className="text-gray-300 font-semibold mb-3 flex items-center gap-2">
            <HiUser className="text-blue-400" /> Visitor Insights
          </h2>
          <div className="h-40 bg-gradient-to-t from-gray-900 to-gray-800 rounded-lg border border-gray-700 flex items-center justify-center text-gray-600 text-sm italic">
            (Chart Placeholder – connect analytics here)
          </div>
        </div>

        {/* Mentor Table */}
        <div className="bg-gray-900/80 border border-gray-700 rounded-2xl shadow-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800 text-gray-300 uppercase text-xs tracking-wider border-b border-gray-700">
                <th className="py-4 px-4">S. No</th>
                <th className="py-4 px-4">About</th>
                <th className="py-4 px-4">Profile</th>
                <th className="py-4 px-4">Name</th>
                <th className="py-4 px-4">Branch No</th>
                <th className="py-4 px-4">Department</th>
                <th className="py-4 px-4">Type</th>
                <th className="py-4 px-4">Phone</th>
                <th className="py-4 px-4 text-center">Access</th>
                <th className="py-4 px-4 text-center">Edit</th>
              </tr>
            </thead>

            <tbody>
              {mentors.map((m, idx) => (
                <tr
                  key={m._id}
                  className="border-b border-gray-800 hover:bg-gray-800/60 transition"
                >
                  <td className="py-3 px-4 text-gray-400 text-sm">
                    {String(idx + 1).padStart(2, "0")}
                  </td>
                  <td className="py-3 px-4">
                    <button className="px-3 py-1 border border-yellow-500 text-yellow-400 rounded-lg text-xs hover:bg-yellow-500 hover:text-black transition">
                      About
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    {m.photo ? (
                      <img
                        src={`${API_URL}${m.photo}`}
                        alt={m.firstName}
                        className="w-10 h-10 rounded-full border-2 border-blue-400 object-cover shadow hover:scale-110 transition"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                        <HiUser className="text-lg" />
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-200 font-medium">
                    {m.firstName} {m.lastName || ""}
                  </td>
                  <td className="py-3 px-4 text-gray-400">
                    {m.branchNumber || "—"}
                  </td>
                  <td className="py-3 px-4 text-gray-400">
                    {m.department || "—"}
                  </td>
                  <td className="py-3 px-4 text-gray-400">{m.type || "—"}</td>
                  <td className="py-3 px-4 text-gray-400">{m.phone || "—"}</td>

                  {/* Access Button */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleAccess(m)}
                      className="px-4 py-1.5 bg-teal-500 hover:bg-teal-600 rounded-md text-white text-sm font-medium flex items-center gap-1 justify-center transition"
                    >
                      <HiKey className="text-sm" /> Access
                    </button>
                  </td>

                  {/*  Edit Button */}
                  <td className="py-3 px-4 text-center">
                    <Link
                      to={`/admin/mentors/edit/${m._id}`}
                      className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 rounded-md text-white text-sm font-medium flex items-center gap-1 justify-center transition"
                    >
                      <HiPencil className="text-sm" /> Edit
                    </Link>
                  </td>
                </tr>
              ))}

              {mentors.length === 0 && (
                <tr>
                  <td colSpan="10" className="py-10 text-center text-gray-500 italic">
                    No mentors found
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
