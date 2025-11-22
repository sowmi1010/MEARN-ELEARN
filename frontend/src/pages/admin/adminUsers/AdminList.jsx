import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlinePlusCircle, HiOutlineUserGroup } from "react-icons/hi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import api from "../../../utils/api";
import { FaTimes } from "react-icons/fa";

export default function AdminList() {
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  /* 🌍 GLOBAL SEARCH LISTENER */
  useEffect(() => {
    const handler = (e) => setSearch(e.detail.toLowerCase());
    window.addEventListener("admin-global-search", handler);
    return () => window.removeEventListener("admin-global-search", handler);
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, []);

  async function fetchAdmins() {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/admin/detailed-admins", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(res.data || []);
    } catch (err) {
      console.error(" Error fetching admins:", err);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/admin/detailed-admins/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error(" Delete error:", err);
    }
  }

  /* ✅ Global Search Filtering */
  const filteredAdmins = admins.filter((a) => {
    const fullText = `
      ${a.firstName}
      ${a.lastName}
      ${a.branchNo}
      ${a.department}
      ${a.type}
      ${a.phone}
      ${a.role}
    `.toLowerCase();

    return fullText.includes(search);
  });

  /* ✅ Dynamic Chart Data (based on admins) */
  const visitorData = [
    { month: "Jan", visitors: admins.length * 2 },
    { month: "Feb", visitors: admins.length * 3 },
    { month: "Mar", visitors: admins.length * 4 },
    { month: "Apr", visitors: admins.length * 5 },
    { month: "May", visitors: admins.length * 6 },
    { month: "Jun", visitors: admins.length * 7 },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-white px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ========== TOP PART ========== */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Chart */}
          <div className="lg:col-span-3 bg-white/5 backdrop-blur-2xl p-6 rounded-xl border border-blue-500/10 shadow-xl">
            <h2 className="text-lg font-semibold mb-3 text-blue-400">
              Admin Activity Insight
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={visitorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    border: "1px solid #3b82f6",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke="#3b82f6"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Right Stats */}
          <div className="flex flex-col gap-6">

            <Link
              to="/admin/admins/new"
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105 text-white font-semibold py-3 rounded-lg shadow-lg transition"
            >
              <HiOutlinePlusCircle className="text-2xl" />
              Add Admin
            </Link>

            <div className="bg-white/5 backdrop-blur-2xl rounded-xl p-5 border border-blue-500/10 flex flex-col items-center justify-center shadow-lg">
              <HiOutlineUserGroup className="text-4xl text-blue-400 mb-3" />
              <p className="text-sm uppercase tracking-wider">Total Admins</p>
              <h2 className="text-4xl font-bold text-blue-400 mt-1">
                {filteredAdmins.length}
              </h2>
            </div>

          </div>
        </div>

        {/* ========== TABLE ========== */}
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-blue-500/10 shadow-xl overflow-hidden">
          <div className="overflow-x-auto max-h-[65vh]">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[#050b24] text-blue-300 text-sm uppercase tracking-wider">
                <tr>
                  <th className="p-4 text-center">S. No</th>
                  <th className="p-4 text-center">About</th>
                  <th className="p-4 text-center">Profile</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Branch No</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4 text-center">Edit</th>
                </tr>
              </thead>

              <tbody>
                {filteredAdmins.map((a, idx) => (
                  <tr
                    key={a._id}
                    className="hover:bg-blue-900/10 transition"
                  >
                    <td className="p-4 text-center text-gray-400">
                      {idx + 1}
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedAdmin(a)}
                        className="px-3 py-1 rounded-md border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white text-xs transition"
                      >
                        View
                      </button>
                    </td>

                    <td className="p-4 text-center">
                      {a.photo ? (
                        <img
                          src={`http://localhost:4000${a.photo}`}
                          className="w-10 h-10 rounded-full mx-auto object-cover border-2 border-blue-500"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-700 mx-auto flex items-center justify-center text-xs">
                          N/A
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      {a.firstName} {a.lastName}
                    </td>

                    <td className="p-4">{a.branchNo || "—"}</td>
                    <td className="p-4">{a.department || "—"}</td>

                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs">
                        {a.type || "—"}
                      </span>
                    </td>

                    <td className="p-4">{a.phone || "—"}</td>

                    <td className="p-4 text-center flex gap-2 justify-center">
                      <Link
                        to={`/admin/admins/edit/${a._id}`}
                        className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(a._id)}
                        className="px-3 py-1 rounded-md bg-red-600 text-white text-sm hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredAdmins.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center py-16 text-gray-400">
                      No Admins Found
                    </td>
                  </tr>
                )}

              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ========== ABOUT MODAL ========== */}
      {selectedAdmin && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#050b24] p-8 rounded-2xl w-full max-w-md border border-blue-500/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-blue-400">
                Admin Profile
              </h2>
              <button onClick={() => setSelectedAdmin(null)}>
                <FaTimes />
              </button>
            </div>

            <div className="flex flex-col items-center gap-4">

              {selectedAdmin.photo && (
                <img
                  src={`http://localhost:4000${selectedAdmin.photo}`}
                  className="w-28 h-28 rounded-full border-2 border-blue-500 object-cover"
                />
              )}

              <h3 className="text-lg font-semibold">
                {selectedAdmin.firstName} {selectedAdmin.lastName}
              </h3>

              <p className="text-gray-400">{selectedAdmin.email}</p>

              <div className="grid grid-cols-2 gap-4 w-full text-sm text-gray-300 mt-4">
                <p><b>Branch:</b> {selectedAdmin.branchNo || "-"}</p>
                <p><b>Dept:</b> {selectedAdmin.department || "-"}</p>
                <p><b>Type:</b> {selectedAdmin.type || "-"}</p>
                <p><b>Phone:</b> {selectedAdmin.phone || "-"}</p>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
