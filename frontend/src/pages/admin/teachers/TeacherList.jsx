import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../../../components/common/Pagination";
import { FaEdit, FaTrash, FaChalkboardTeacher } from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import useGlobalSearch from "../../../hooks/useGlobalSearch";

export default function TeacherList() {
  const [teachers, setTeachers] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // FIXED GLOBAL SEARCH
  const { search } = useGlobalSearch("global-search");

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const token = localStorage.getItem("token");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    fetchTeachers();
  }, []);

  async function fetchTeachers() {
    try {
      const res = await axios.get(`${apiBase}/api/teachers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeachers(res.data || []);
    } catch {
      toast.error("Failed to load teachers");
    }
  }

  // SAFE SEARCH
  const safeSearch =
    typeof search === "string" ? search.toLowerCase().trim() : "";

  const filtered = teachers.filter(
    (t) =>
      t?.name?.toLowerCase().includes(safeSearch) ||
      t?.subject?.toLowerCase().includes(safeSearch) ||
      t?.description?.toLowerCase().includes(safeSearch)
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentTeachers = filtered.slice(indexOfFirst, indexOfLast);

  async function handleDelete() {
    try {
      await axios.delete(`${apiBase}/api/teachers/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Teacher deleted");
      fetchTeachers();
    } catch {
      toast.error("Failed to delete");
    }
    setShowModal(false);
  }

  return (
    <div className="p-8 min-h-screen bg-[#040711] text-white">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-xl">
            <FaChalkboardTeacher className="text-white text-2xl" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-blue-400">Teachers</h1>
            <p className="text-gray-400 text-sm tracking-wide">
              Manage all subject teachers
            </p>
          </div>
        </div>

        <Link
          to="/admin/teachers/new"
          className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-semibold hover:scale-105 transition shadow-xl"
        >
          + Add Teacher
        </Link>
      </div>

      {/* TEACHER GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentTeachers.map((t) => (
          <div
            key={t._id}
            className="bg-[#0a1020]/90 border border-blue-500/20 backdrop-blur-xl rounded-2xl p-6 shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-1 transition"
          >
            <div className="flex justify-center">
              <img
                src={
                  t.photo
                    ? `${apiBase}${t.photo}`
                    : "https://via.placeholder.com/100"
                }
                className="w-24 h-24 rounded-full border-2 border-blue-400 shadow-lg object-cover"
              />
            </div>

            <div className="mt-4 text-center">
              <h2 className="text-xl font-semibold">{t.name}</h2>
              <p className="text-blue-300 font-medium">{t.subject}</p>

              <p className="text-gray-400 text-sm mt-3 h-14 overflow-hidden">
                {t.description}
              </p>
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <Link
                to={`/admin/teachers/edit/${t._id}`}
                className="px-4 py-2 bg-blue-600 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
              >
                <FaEdit /> Edit
              </Link>

              <button
                onClick={() => {
                  setDeleteId(t._id);
                  setShowModal(true);
                }}
                className="px-4 py-2 bg-red-600 rounded-lg flex items-center gap-2 hover:bg-red-700 transition"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}

        {currentTeachers.length === 0 && (
          <p className="text-center col-span-full py-20 text-gray-400">
            No teachers found
          </p>
        )}
      </div>

      {/* PAGINATION */}
      <div className="mt-10 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>

      {/* DELETE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#0b1225] p-7 rounded-2xl border border-red-500/30 w-96 shadow-xl">
            <h3 className="text-xl font-bold text-red-400">
              Confirm Delete
            </h3>

            <p className="mt-3 text-gray-300">
              Are you sure you want to delete this teacher?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
