import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlinePlusCircle, HiOutlineUserGroup } from "react-icons/hi";
import api from "../../../utils/api";
import Pagination from "../../../components/common/Pagination";
import { FaTimes } from "react-icons/fa";

export default function AdminList() {
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  /* 🔎 GLOBAL SEARCH */
  useEffect(() => {
    const handler = (e) => {
      setSearch(e.detail.toLowerCase());
      setCurrentPage(1);
    };
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
      console.error("Error fetching admins:", err);
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
      console.error("Delete error:", err);
    }
  }

  /* 🔎 FILTER (SEARCH) */
  const filteredAdmins = admins.filter((a) => {
    const mix = `
      ${a.firstName}
      ${a.lastName}
      ${a.branchNo}
      ${a.department}
      ${a.type}
      ${a.phone}
      ${a.role}
    `.toLowerCase();

    return mix.includes(search);
  });

  /* 📌 PAGINATION */
  const totalPages = Math.ceil(filteredAdmins.length / perPage);
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentData = filteredAdmins.slice(indexOfFirst, indexOfLast);

  return (
    <div className="min-h-screen bg-[#030712] text-white px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-300">Admin Management</h1>

          <Link
            to="/admin/admins/new"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-3 rounded-xl shadow-lg font-semibold hover:scale-105 transition"
          >
            <HiOutlinePlusCircle className="text-xl" /> Add Admin
          </Link>
        </div>

        {/* ADMIN COUNT */}
        <div className="bg-white/5 p-4 rounded-xl border border-blue-500/20 flex items-center gap-3 w-fit">
          <HiOutlineUserGroup className="text-3xl text-blue-400" />
          <p className="text-lg font-semibold">{filteredAdmins.length} Admins</p>
        </div>

        {/* TABLE */}
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-blue-500/10 shadow-xl overflow-hidden">

          <table className="w-full text-left border-collapse">
            <thead className="bg-[#050b24] text-blue-300 text-sm uppercase tracking-wider">
              <tr>
                <th className="p-4 text-center">No</th>
                <th className="p-4 text-center">About</th>
                <th className="p-4 text-center">Profile</th>
                <th className="p-4">Name</th>
                <th className="p-4">Branch No</th>
                <th className="p-4">Department</th>
                <th className="p-4">Type</th>
                <th className="p-4">Phone</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentData.map((a, i) => (
                <tr key={a._id} className="hover:bg-blue-900/10 transition">
                  <td className="p-4 text-center text-gray-400">
                    {indexOfFirst + i + 1}
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
                        className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 mx-auto"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-slate-700 rounded-full mx-auto flex items-center justify-center text-sm">
                        N/A
                      </div>
                    )}
                  </td>

                  <td className="p-4 font-semibold">
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

              {currentData.length === 0 && (
                <tr>
                  <td colSpan="10" className="text-center py-14 text-gray-400">
                    No Admins Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* PAGINATION */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      {/* MODAL */}
      {selectedAdmin && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#050b24] p-8 rounded-2xl w-full max-w-md border border-blue-500/20">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-blue-400">Admin Profile</h2>
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
