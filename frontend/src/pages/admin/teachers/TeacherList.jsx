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

  const search = useGlobalSearch("admin-global-search");
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

  const safeSearch = typeof search === "string" ? search.toLowerCase() : "";

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
    <div className="p-8 text-white bg-[#040711] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <FaChalkboardTeacher className="text-blue-400 text-4xl" />
          <h1 className="text-3xl font-bold text-blue-400">Teachers</h1>
        </div>

        <Link
          to="/admin/teachers/new"
          className="px-5 py-2 bg-blue-600 rounded-xl hover:bg-blue-700 shadow-md"
        >
          + Add Teacher
        </Link>
      </div>

      {/* ===== GRID CARD LIST ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentTeachers.map((t) => (
          <div
            key={t._id}
            className="bg-[#0a1020] rounded-2xl p-5 border border-blue-500/20 shadow-xl hover:shadow-blue-500/30 transition hover:-translate-y-1"
          >
            {/* IMAGE */}
            <div className="flex justify-center">
              <img
                src={
                  t.photo ? `${apiBase}${t.photo}` : "https://via.placeholder.com/80"
                }
                className="w-24 h-24 rounded-full border-2 border-blue-400 object-cover shadow-md"
              />
            </div>

            {/* INFO */}
            <div className="mt-4 text-center">
              <h2 className="text-xl font-semibold">{t.name}</h2>
              <p className="text-blue-300 font-medium">{t.subject}</p>

              <p className="text-gray-400 text-sm mt-2 h-12 overflow-hidden">
                {t.description}
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-center gap-4 mt-5">
              <Link
                to={`/admin/teachers/edit/${t._id}`}
                className="flex items-center gap-1 px-3 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <FaEdit /> Edit
              </Link>

              <button
                onClick={() => {
                  setDeleteId(t._id);
                  setShowModal(true);
                }}
                className="flex items-center gap-1 px-3 py-2 bg-red-600 rounded-lg hover:bg-red-700"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}

        {currentTeachers.length === 0 && (
          <p className="col-span-full text-center text-gray-500 py-20">
            No teachers found
          </p>
        )}
      </div>

      {/* ===== PAGINATION ===== */}
      <div className="mt-8 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>

      {/* ===== DELETE MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
          <div className="bg-[#0b1225] p-6 rounded-xl text-white w-96">
            <h3 className="text-red-400 text-lg font-bold">Confirm Delete</h3>
            <p className="my-4 text-gray-300">
              Are you sure you want to delete this teacher?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-600 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 rounded"
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
