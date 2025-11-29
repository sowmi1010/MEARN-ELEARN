import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlinePlusCircle,
  HiOutlineUserGroup,
  HiOutlineIdentification,
} from "react-icons/hi2";
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

  /* 🟦 GLOBAL SEARCH — FIXED (matches AdminLayout) */
  useEffect(() => {
    const handler = (e) => {
      setSearch(e.detail.toLowerCase());
      setCurrentPage(1);
    };
    window.addEventListener("global-search", handler);
    return () => window.removeEventListener("global-search", handler);
  }, []);

  /* 🟦 FETCH ADMINS */
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

  /* 🟥 DELETE ADMIN */
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

  /* 🟦 FILTER USING GLOBAL SEARCH */
  const filteredAdmins = admins.filter((a) => {
    const mix = `
      ${a.firstName}
      ${a.lastName}
      ${a.branchNo}
      ${a.department}
      ${a.type}
      ${a.phone}
      ${a.role}
      ${a.email}
    `.toLowerCase();

    return mix.includes(search);
  });

  /* 🟦 PAGINATION */
  const totalPages = Math.ceil(filteredAdmins.length / perPage);
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentData = filteredAdmins.slice(indexOfFirst, indexOfLast);

  return (
    <div className="min-h-screen bg-[#030712] text-white px-6 py-8">
      <div className="max-w-8xl mx-auto space-y-10">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow">
            Admin Management
          </h1>

          <Link
            to="/admin/admins/new"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 active:scale-95 transition"
          >
            <HiOutlinePlusCircle className="text-xl" />
            Add Admin
          </Link>
        </div>

        {/* ADMIN COUNT CARD */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 px-6 py-4 rounded-2xl shadow-lg flex items-center gap-4 w-fit">
          <HiOutlineUserGroup className="text-3xl text-cyan-400" />
          <p className="text-xl font-semibold">
            {filteredAdmins.length} Admins
          </p>
        </div>

        {/* TABLE */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/10 text-cyan-300 uppercase text-xs tracking-wider">
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
                <tr
                  key={a._id}
                  className="border-b border-white/5 hover:bg-white/10 transition"
                >
                  <td className="p-4 text-center text-gray-400">
                    {indexOfFirst + i + 1}
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() => setSelectedAdmin(a)}
                      className="px-3 py-1 rounded-lg border border-cyan-400 text-cyan-300 text-xs hover:bg-cyan-400 hover:text-black transition"
                    >
                      View
                    </button>
                  </td>

                  <td className="p-4 text-center">
                    {a.photo ? (
                      <img
                        src={`http://localhost:4000${a.photo}`}
                        className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400 mx-auto shadow"
                        alt="profile"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-700 mx-auto flex items-center justify-center">
                        <HiOutlineIdentification className="text-gray-400 text-xl" />
                      </div>
                    )}
                  </td>

                  <td className="p-4 font-semibold">
                    {a.firstName} {a.lastName}
                  </td>
                  <td className="p-4">{a.branchNo || "—"}</td>
                  <td className="p-4">{a.department || "—"}</td>

                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs">
                      {a.type || "—"}
                    </span>
                  </td>

                  <td className="p-4">{a.phone || "—"}</td>

                  <td className="p-4 text-center flex gap-3 justify-center">
                    <Link
                      to={`/admin/admins/edit/${a._id}`}
                      className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(a._id)}
                      className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {currentData.length === 0 && (
                <tr>
                  <td colSpan="10" className="text-center py-14 text-gray-500">
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-[#050b24] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
            {/* Close */}
            <button
              onClick={() => setSelectedAdmin(null)}
              className="absolute top-4 right-4 text-gray-300 hover:text-white"
            >
              <FaTimes />
            </button>

            <div className="flex flex-col items-center gap-4">
              {selectedAdmin.photo && (
                <img
                  src={`http://localhost:4000${selectedAdmin.photo}`}
                  className="w-28 h-28 rounded-full border-2 border-cyan-400 object-cover shadow-lg"
                />
              )}

              <h3 className="text-2xl font-bold text-cyan-300">
                {selectedAdmin.firstName} {selectedAdmin.lastName}
              </h3>

              <p className="text-gray-400">{selectedAdmin.email}</p>

              <div className="grid grid-cols-2 gap-4 w-full text-sm text-gray-300 mt-4">
                <p>
                  <b>Branch:</b> {selectedAdmin.branchNo || "-"}
                </p>
                <p>
                  <b>Dept:</b> {selectedAdmin.department || "-"}
                </p>
                <p>
                  <b>Type:</b> {selectedAdmin.type || "-"}
                </p>
                <p>
                  <b>Phone:</b> {selectedAdmin.phone || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
