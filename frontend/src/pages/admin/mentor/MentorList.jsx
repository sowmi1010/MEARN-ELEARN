import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  HiPlusCircle,
  HiUser,
  HiKey,
  HiPencil,
  HiTrash,
} from "react-icons/hi2";

import api from "../../../utils/api";
import Pagination from "../../../components/common/Pagination";

export default function MentorList() {
  const [mentors, setMentors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  /* GLOBAL SEARCH (fixed) */
  useEffect(() => {
    const handler = (e) => {
      setSearch(e.detail);
      setCurrentPage(1);
    };

    window.addEventListener("global-search", handler);
    return () => window.removeEventListener("global-search", handler);
  }, []);

  /* FETCH MENTORS */
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  /* DELETE MENTOR */
  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this mentor?")) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/mentor/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMentors((prev) => prev.filter((m) => m._id !== id));
      alert("Mentor deleted successfully");
    } catch (err) {
      alert("Failed to delete mentor");
    }
  }

  /* ACCESS PERMISSION */
  function handleAccess(m) {
    navigate(`/admin/mentor-access/${m._id}`);
  }

  /* FILTER */
  const filteredMentors = mentors.filter((m) =>
    `${m.firstName} ${m.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    (m.department || "").toLowerCase().includes(search.toLowerCase()) ||
    (m.type || "").toLowerCase().includes(search.toLowerCase())
  );

  /* PAGINATION */
  const totalPages = Math.ceil(filteredMentors.length / perPage);
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentData = filteredMentors.slice(indexOfFirst, indexOfLast);

  return (
    <div className="min-h-screen bg-[#050812] text-white p-6">
      <div className="max-w-8xl mx-auto space-y-8">

        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow">
              Mentor Management
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              View, edit, delete & manage mentor access permissions.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/admin/mentors/new"
              className="
                flex items-center gap-2 px-6 py-3 rounded-xl 
                bg-gradient-to-r from-blue-500 to-cyan-500 
                shadow-lg hover:scale-105 transition
              "
            >
              <HiPlusCircle className="text-xl" />
              Add Mentor
            </Link>

            <div className="bg-white/5 px-6 py-3 rounded-xl border border-white/10 flex items-center gap-3 shadow">
              <HiUser className="text-cyan-400 text-2xl" />
              <span className="text-2xl font-bold">
                {filteredMentors.length}
              </span>
            </div>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden">

          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/10 text-cyan-300 uppercase text-xs tracking-wider">
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
                  <td colSpan="9" className="p-10 text-center text-cyan-300">
                    Loading mentors...
                  </td>
                </tr>
              )}

              {!loading &&
                currentData.map((m, i) => (
                  <tr
                    key={m._id}
                    className="border-b border-white/5 hover:bg-white/10 transition"
                  >
                    <td className="p-4 text-gray-400">
                      {indexOfFirst + i + 1}
                    </td>

                    {/* PROFILE */}
                    <td className="p-4">
                      {m.photo ? (
                        <img
                          src={`${API_URL}${m.photo}`}
                          className="w-12 h-12 rounded-full border border-cyan-400 object-cover shadow"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                          <HiUser className="text-gray-400" />
                        </div>
                      )}
                    </td>

                    {/* NAME */}
                    <td className="p-4 font-semibold">
                      {m.firstName} {m.lastName}
                    </td>

                    {/* DEPARTMENT */}
                    <td className="p-4 text-cyan-300">
                      {m.department || "—"}
                    </td>

                    {/* TYPE */}
                    <td className="p-4">
                      <span
                        className="
                          px-3 py-1 text-xs rounded-full 
                          bg-cyan-500/20 border border-cyan-500/40
                        "
                      >
                        {m.type || "—"}
                      </span>
                    </td>

                    {/* PHONE */}
                    <td className="p-4 text-gray-300">{m.phone || "—"}</td>

                    {/* ACCESS BTN */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleAccess(m)}
                        className="
                          px-3 py-1.5 rounded-lg bg-teal-500/20 
                          border border-teal-400/40 text-teal-300 
                          hover:bg-teal-500/30 transition flex items-center gap-2 justify-center
                        "
                      >
                        <HiKey /> Access
                      </button>
                    </td>

                    {/* EDIT BTN */}
                    <td className="p-4 text-center">
                      <Link
                        to={`/admin/mentors/edit/${m._id}`}
                        className="
                          px-3 py-1.5 rounded-lg bg-blue-500/20 
                          border border-blue-400/40 text-blue-300 
                          hover:bg-blue-500/30 transition flex items-center gap-2 justify-center
                        "
                      >
                        <HiPencil /> Edit
                      </Link>
                    </td>

                    {/* DELETE BTN */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDelete(m._id)}
                        className="
                          px-3 py-1.5 rounded-lg bg-red-500/20 
                          border border-red-400/40 text-red-300 
                          hover:bg-red-500/30 transition flex items-center gap-2 justify-center
                        "
                      >
                        <HiTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))}

              {!loading && filteredMentors.length === 0 && (
                <tr>
                  <td colSpan="9" className="p-10 text-center text-gray-500 text-lg">
                    No mentors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="p-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
