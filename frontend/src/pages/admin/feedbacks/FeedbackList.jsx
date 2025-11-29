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

  const search = useGlobalSearch("admin-global-search");
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
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <FaComments className="text-blue-400 text-4xl" />
          <h1 className="text-3xl font-bold text-blue-400">
            Student Feedback
          </h1>
        </div>

        <Link
          to="/admin/feedbacks/new"
          className="px-5 py-2 bg-blue-600 rounded-xl hover:bg-blue-700 shadow-md"
        >
          + Add Feedback
        </Link>
      </div>

      {/* GRID LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentFeedbacks.map((fb) => (
          <div
            key={fb._id}
            className="bg-[#0a1020] rounded-2xl p-5 border border-blue-500/20 shadow-xl hover:shadow-blue-500/30 transition hover:-translate-y-1"
          >
            <div className="flex items-center gap-3">
              <img
                src={
                  fb.photo
                    ? `${apiBase}${fb.photo}`
                    : "https://via.placeholder.com/80"
                }
                className="w-16 h-16 rounded-full border-2 border-blue-400 object-cover"
              />
              <div>
                <h2 className="text-xl">{fb.name}</h2>
                <p className="text-blue-300 text-sm">{fb.course}</p>
              </div>
            </div>

            <p className="text-gray-400 mt-3 italic">"{fb.comment}"</p>

            <div className="flex justify-center gap-3 mt-5">
              <Link
                to={`/admin/feedbacks/edit/${fb._id}`}
                className="px-3 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 flex gap-1 items-center"
              >
                <FaEdit /> Edit
              </Link>
              <button
                onClick={() => {
                  setDeleteId(fb._id);
                  setShowModal(true);
                }}
                className="px-3 py-2 bg-red-600 rounded-lg hover:bg-red-700 flex gap-1 items-center"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}

        {currentFeedbacks.length === 0 && (
          <p className="text-center col-span-full text-gray-400 py-20">
            No feedback found
          </p>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>

      {/* Delete Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-[#0b1225] p-6 rounded-xl w-96 border border-red-500/30">
            <h3 className="text-red-400 text-lg mb-3">Confirm Delete</h3>
            <p className="text-gray-400 mb-6">Are you sure?</p>

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
