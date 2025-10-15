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

export default function AdminList() {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    fetchAdmins();
  }, []);

  async function fetchAdmins() {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/admin/detailed-admins", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(res.data);
    } catch (err) {
      console.error("❌ Error fetching admins:", err);
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
      console.error("❌ Delete error:", err);
    }
  }

  const visitorData = [
    { month: "Jan", visitors: 120 },
    { month: "Feb", visitors: 210 },
    { month: "Mar", visitors: 320 },
    { month: "Apr", visitors: 500 },
    { month: "May", visitors: 450 },
    { month: "Jun", visitors: 390 },
    { month: "Jul", visitors: 420 },
    { month: "Aug", visitors: 460 },
    { month: "Sep", visitors: 380 },
    { month: "Oct", visitors: 340 },
    { month: "Nov", visitors: 370 },
    { month: "Dec", visitors: 400 },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chart */}
          <div className="lg:col-span-3 bg-gray-800/70 p-6 rounded-xl border border-gray-700 shadow-xl">
            <h2 className="text-lg font-semibold mb-3">Visitor Insights</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={visitorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                <XAxis dataKey="month" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
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
                  dot={{ fill: "#3b82f6", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Right Sidebar Stats */}
          <div className="flex flex-col gap-6">
            <Link
              to="/admin/admins/new"
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all"
            >
              <HiOutlinePlusCircle className="text-2xl" />
              Add New
            </Link>

            <div className="bg-gray-800/70 rounded-xl p-5 border border-gray-700 flex flex-col items-center justify-center shadow-lg">
              <HiOutlineUserGroup className="text-4xl text-blue-400 mb-3" />
              <p className="text-lg font-medium">Total Admin</p>
              <h2 className="text-4xl font-bold text-blue-400 mt-1">
                {admins.length}
              </h2>
            </div>
          </div>
        </div>

        {/* Admin Table */}
        <div className="bg-gray-800/80 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
          <div className="overflow-x-auto overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-gray-900 text-gray-300 text-sm uppercase tracking-wider">
                <tr>
                  <th className="p-4 text-center">S. No</th>
                  <th className="p-4 text-center">About</th>
                  <th className="p-4 text-center">Profile</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Branch No</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Phone Number</th>
                  <th className="p-4 text-center">Edit</th>
                </tr>
              </thead>

              <tbody>
                {admins.map((a, idx) => (
                  <tr
                    key={a._id}
                    className={`hover:bg-gray-700/50 transition-colors duration-200 ${
                      idx % 2 === 0
                        ? "bg-gray-800/60"
                        : "bg-gray-900/50"
                    }`}
                  >
                    <td className="p-4 text-center text-gray-400">{idx + 1}</td>

                    {/* About */}
                    <td className="p-4 text-center">
                      <button className="px-3 py-1 rounded-md border border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black text-sm font-medium transition">
                        About
                      </button>
                    </td>

                    {/* Profile */}
                    <td className="p-4 text-center">
                      {a.photo ? (
                        <img
                          src={`http://localhost:4000${a.photo}`}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover border border-blue-500 mx-auto"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-600 mx-auto flex items-center justify-center text-gray-300">
                          N/A
                        </div>
                      )}
                    </td>

                    {/* Name */}
                    <td className="p-4 font-medium text-gray-100">
                      {a.firstName} {a.lastName}
                    </td>

                    {/* Branch No */}
                    <td className="p-4 text-gray-300">{a.branchNo || "—"}</td>

                    {/* Department */}
                    <td className="p-4 text-gray-300">{a.department || "—"}</td>

                    {/* Type */}
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 text-white text-xs shadow">
                        {a.type || "—"}
                      </span>
                    </td>

                    {/* Phone */}
                    <td className="p-4 text-gray-300">{a.phone || "—"}</td>

                    {/* Edit */}
                    <td className="p-4 text-center">
                      <Link
                        to={`/admin/admins/edit/${a._id}`}
                        className="px-4 py-1 rounded-md bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 hover:scale-105 transition-transform shadow"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}

                {/* Empty State */}
                {admins.length === 0 && (
                  <tr>
                    <td
                      colSpan="9"
                      className="text-center py-10 text-gray-400 text-sm"
                    >
                      No Admins Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
