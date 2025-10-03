// src/pages/admin/AdminList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";

export default function AdminList() {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    fetchAdmins();
  }, []);

  // 🔹 Fetch all admins
  async function fetchAdmins() {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/admin/detailed-admins", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(res.data);
    } catch (err) {
      console.error("❌ Error fetching admins:", err.response?.data || err.message);
    }
  }

  // 🔹 Delete admin
  async function handleDelete(id) {
    if (!window.confirm("⚠️ Are you sure you want to delete this admin?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/admin/detailed-admins/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error("❌ Delete error:", err.response?.data || err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-darkBg p-6 transition-colors duration-300">
      {/* ===== Header Bar ===== */}
      <div className="flex justify-between items-center bg-white dark:bg-darkCard p-5 rounded-xl shadow-lg mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-accent">Admin Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Total Admins:{" "}
            <span className="font-semibold text-gray-900 dark:text-gray-200">
              {admins.length}
            </span>
          </p>
        </div>

        <Link
          to="/admin/admins/new"
          className="px-5 py-2 bg-gradient-to-r from-accent to-blue-500 text-darkBg font-semibold rounded-lg shadow hover:scale-105 transition-transform duration-300 flex items-center gap-2"
        >
          <span className="text-xl">➕</span> Add New
        </Link>
      </div>

      {/* ===== Table Wrapper ===== */}
      <div className="overflow-x-auto bg-white dark:bg-darkCard rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-left">
              <th className="p-4">S. No</th>
              <th className="p-4">Photo</th>
              <th className="p-4">Name</th>
              <th className="p-4">Branch No</th>
              <th className="p-4">Department</th>
              <th className="p-4">Type</th>
              <th className="p-4">Language</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {admins.map((a, idx) => (
              <tr
                key={a._id}
                className={`hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 ${
                  idx % 2 === 0
                    ? "bg-gray-50 dark:bg-gray-900/40"
                    : "bg-gray-100 dark:bg-gray-800/50"
                }`}
              >
                {/* Serial Number */}
                <td className="p-4 text-gray-600 dark:text-gray-400 text-center font-medium">
                  {idx + 1}
                </td>

                {/* Photo */}
                <td className="p-4 text-center">
                  {a.photo ? (
                    <img
                      src={`http://localhost:4000${a.photo}`}
                      alt="admin"
                      className="w-12 h-12 rounded-full object-cover border-2 border-accent shadow-md mx-auto"
                    />
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>

                {/* Full Name */}
                <td className="p-4 font-semibold text-gray-900 dark:text-gray-200">
                  {a.firstName} {a.lastName || ""}
                </td>

                <td className="p-4 text-gray-700 dark:text-gray-300">{a.branchNo || "—"}</td>
                <td className="p-4 text-gray-700 dark:text-gray-300">{a.department || "—"}</td>
                <td>
                  <span className="ml-4 px-3 py-1 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 text-white text-sm shadow">
                    {a.type || "—"}
                  </span>
                </td>
                <td className="p-4 text-gray-700 dark:text-gray-300">{a.language || "—"}</td>
                <td className="p-4 text-gray-700 dark:text-gray-300">{a.phone || "—"}</td>

                {/* Actions */}
                <td className="p-4 flex gap-3">
                  <Link
                    to={`/admin/admins/edit/${a._id}`}
                    className="px-4 py-1.5 rounded-lg bg-blue-500 text-white font-medium shadow hover:bg-blue-600 hover:scale-105 transition-transform duration-300"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(a._id)}
                    className="px-4 py-1.5 rounded-lg bg-red-500 text-white font-medium shadow hover:bg-red-600 hover:scale-105 transition-transform duration-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {/* Empty State */}
            {admins.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center py-8 text-gray-500 dark:text-gray-400">
                  🚫 No admins found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
