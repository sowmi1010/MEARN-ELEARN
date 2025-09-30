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
    <div className="p-8 space-y-8">
      {/* ===== Top Bar ===== */}
      <div className="flex justify-between items-center bg-darkCard p-5 rounded-xl shadow-lg">
        <div>
          <h1 className="text-2xl font-bold text-accent">Admin Details</h1>
          <p className="text-gray-400 mt-1">
            Total Admins:{" "}
            <span className="font-semibold text-white">{admins.length}</span>
          </p>
        </div>

        <Link
          to="/admin/admins/new"
          className="px-5 py-2 bg-accent text-darkBg rounded-lg font-semibold shadow hover:scale-105 transition flex items-center gap-2"
        >
          <span className="text-xl">➕</span> Add New
        </Link>
      </div>

      {/* ===== Table ===== */}
      <div className="overflow-x-auto bg-darkCard rounded-xl shadow-lg border border-gray-700">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-gray-300">
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
                className={`${
                  idx % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                } hover:bg-gray-700 transition`}
              >
                {/* Serial Number */}
                <td className="p-4 text-gray-400 text-center">{idx + 1}</td>

                {/* Photo */}
                <td className="p-4 text-center">
                  {a.photo ? (
                    <img
                      src={`http://localhost:4000${a.photo}`}
                      alt="admin"
                      className="w-12 h-12 rounded-full object-cover border-2 border-accent shadow"
                    />
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </td>

                {/* ✅ Display full name */}
                <td className="p-4 font-semibold text-white">
                  {a.firstName} {a.lastName || ""}
                </td>

                <td className="p-4 text-gray-300">{a.branchNo || "—"}</td>
                <td className="p-4 text-gray-300">{a.department || "—"}</td>
                <td className="p-4 text-gray-300">{a.type || "—"}</td>
                <td className="p-4 text-gray-300">{a.language || "—"}</td>
                <td className="p-4 text-gray-300">{a.phone || "—"}</td>

                {/* Actions */}
                <td className="p-4 flex gap-3">
                  <Link
                    to={`/admin/admins/edit/${a._id}`}
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(a._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {/* Empty State */}
            {admins.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center text-gray-400 py-8">
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
