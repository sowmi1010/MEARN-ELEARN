import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Pagination from "../../../components/common/Pagination";
import { FaComments, FaEdit, FaTrash } from "react-icons/fa";
import useGlobalSearch from "../../../hooks/useGlobalSearch";

export default function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ✅ Correct global search event name
  const { search } = useGlobalSearch("global-search");

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const token = localStorage.getItem("token");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  async function fetchFeedbacks() {
    try {
      const res = await axios.get(`${apiBase}/api/feedbacks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedbacks(res.data || []);
    } catch {
      toast.error("Failed to load feedback");
    }
  }

  // 🔎 Safe search input
  const safeSearch = typeof search === "string" ? search.toLowerCase() : "";

  const filtered = feedbacks.filter(
    (f) =>
      f?.name?.toLowerCase().includes(safeSearch) ||
      f?.course?.toLowerCase().includes(safeSearch) ||
      f?.comment?.toLowerCase().includes(safeSearch)
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentFeedbacks = filtered.slice(indexOfFirst, indexOfLast);

  async function handleDelete() {
    try {
      await axios.delete(`${apiBase}/api/feedbacks/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Feedback deleted");
      fetchFeedbacks();
    } catch {
      toast.error("Failed to delete");
    }
    setShowModal(false);
  }

  return (
    <div className="p-8 text-white bg-[#040711] min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
            <FaComments className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-wide text-blue-400">
              Student Feedback
            </h1>
            <p className="text-sm text-gray-400">
              Manage student thoughts & course insights
            </p>
          </div>
        </div>

        <Link
          to="/admin/feedbacks/new"
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg hover:scale-105 transition font-semibold"
        >
          + Add Feedback
        </Link>
      </div>

      {/* GRID LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {currentFeedbacks.map((fb) => (
          <div
            key={fb._id}
            className="bg-[#0d142a]/80 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/20 shadow-xl hover:shadow-blue-500/40 
            transition-all hover:-translate-y-1"
          >
            {/* TOP SECTION */}
            <div className="flex items-center gap-4">
              <img
                src={
                  fb.photo ? `${apiBase}${fb.photo}` : "https://via.placeholder.com/80"
                }
                className="w-16 h-16 rounded-full border-2 border-blue-500 shadow-lg object-cover"
              />

              <div>
                <h2 className="text-xl font-semibold">{fb.name}</h2>
                <p className="text-blue-300 text-sm tracking-wide">
                  {fb.course}
                </p>
              </div>
            </div>

            {/* COMMENT */}
            <p className="text-gray-300 mt-5 text-sm italic leading-relaxed border-l-4 border-blue-500 pl-4">
              “{fb.comment}”
            </p>

            {/* ACTIONS */}
            <div className="flex justify-center gap-4 mt-6">
              <Link
                to={`/admin/feedbacks/edit/${fb._id}`}
                className="px-4 py-2 bg-blue-600/80 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition shadow-md"
              >
                <FaEdit /> Edit
              </Link>

              <button
                onClick={() => {
                  setDeleteId(fb._id);
                  setShowModal(true);
                }}
                className="px-4 py-2 bg-red-600/80 rounded-lg hover:bg-red-700 flex items-center gap-2 transition shadow-md"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}

        {currentFeedbacks.length === 0 && (
          <p className="text-center col-span-full text-gray-400 py-20 text-lg">
            No feedback found
          </p>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>

      {/* Delete Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-[#0f1735] p-7 rounded-2xl w-96 border border-red-500/30 shadow-2xl">
            <h3 className="text-red-400 text-xl mb-3 font-semibold">
              Confirm Delete
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this feedback?
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-600/70 rounded-lg hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition shadow-md"
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
