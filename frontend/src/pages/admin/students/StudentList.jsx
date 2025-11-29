import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../utils/api";
import Pagination from "../../../components/common/Pagination";

import { FaUserPlus, FaComments, FaEdit, FaInfoCircle } from "react-icons/fa";

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  /* GLOBAL SEARCH (fixed event name) */
  useEffect(() => {
    const handler = (e) => {
      setSearch(e.detail || "");
      setCurrentPage(1);
    };

    window.addEventListener("global-search", handler);
    return () => window.removeEventListener("global-search", handler);
  }, []);

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/student/detailed-students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data || []);
    } catch (err) {
      console.error("Error fetching students:", err.message);
    }
  }

  /* FILTER */
  const filteredStudents = students.filter((s) =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    (s.standard || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.board || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.phone || "").toLowerCase().includes(search.toLowerCase())
  );

  /* PAGINATION */
  const totalPages = Math.ceil(filteredStudents.length / perPage);
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentData = filteredStudents.slice(indexOfFirst, indexOfLast);

  return (
    <div className="min-h-screen p-6 text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent drop-shadow-sm">
          Student List
        </h1>

        <Link
          to="/admin/students/new"
          className="
            flex items-center gap-2 px-5 py-3 
            rounded-xl font-semibold text-white shadow-lg
            bg-gradient-to-r from-blue-500 to-cyan-500
            hover:scale-105 active:scale-95 transition
          "
        >
          <FaUserPlus /> Add Student
        </Link>
      </div>

      {/* TABLE CARD */}
      <div
        className="
          rounded-2xl border border-white/10 
          bg-white/5 backdrop-blur-xl shadow-xl
          overflow-hidden
        "
      >
        <table className="w-full border-collapse">
          {/* HEADER */}
          <thead>
            <tr className="bg-white/10 text-gray-300 text-xs uppercase tracking-wider">
              {["No", "Profile", "Name", "Board", "Standard", "Phone", "Fees", "Actions"].map((h) => (
                <th key={h} className="p-4 text-center">{h}</th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {currentData.map((s, i) => (
              <tr
                key={s._id}
                className="
                  border-t border-white/10 
                  hover:bg-white/10 transition-all
                "
              >
                <td className="p-4 text-center text-gray-400">
                  {indexOfFirst + i + 1}
                </td>

                {/* PROFILE */}
                <td className="p-4 text-center">
                  {s.photo ? (
                    <img
                      src={`${API_URL}${s.photo}`}
                      className="w-12 h-12 rounded-full object-cover mx-auto shadow-lg border-2 border-blue-500/50"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                      N/A
                    </div>
                  )}
                </td>

                {/* NAME */}
                <td className="p-4 font-semibold text-gray-200">
                  {s.firstName} {s.lastName}
                </td>

                <td className="p-4 text-gray-300">{s.board || "—"}</td>
                <td className="p-4 text-gray-300">{s.standard || "—"}</td>
                <td className="p-4 text-gray-300">{s.phone || "—"}</td>

                {/* FEES BADGE */}
                <td className="p-4 text-center">
                  <span
                    className={`
                      px-3 py-1 rounded-full text-xs font-semibold
                      ${s.fees > 0 ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                                  : "bg-red-500/20 text-red-400 border border-red-500/30"}
                    `}
                  >
                    {s.fees > 0 ? "Paid" : "Pending"}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="p-4">
                  <div className="flex justify-center gap-3">

                    <Link
                      to={`/admin/students/details/${s._id}`}
                      className="px-3 py-1 text-sm flex items-center gap-1 
                                 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 
                                 hover:bg-cyan-500/30 transition"
                    >
                      <FaInfoCircle size={14} /> About
                    </Link>

                    <Link
                      to={`/admin/students/edit/${s._id}`}
                      className="px-3 py-1 text-sm flex items-center gap-1 
                                 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 
                                 hover:bg-blue-500/30 transition"
                    >
                      <FaEdit size={14} /> Edit
                    </Link>

                    <Link
                      to={`/admin/students/chat/${s._id}`}
                      className="px-3 py-1 text-sm flex items-center gap-1 
                                 rounded-lg bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 
                                 hover:bg-yellow-500/30 transition"
                    >
                      <FaComments size={14} /> Chat
                    </Link>

                  </div>
                </td>
              </tr>
            ))}

            {currentData.length === 0 && (
              <tr>
                <td colSpan="8" className="py-12 text-center text-gray-500 text-lg">
                  No students found.
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
  );
}
