import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FaEdit, FaTrash, FaSearch, FaTimes } from "react-icons/fa";

export default function FeedbackUpload() {
  const [form, setForm] = useState({
    name: "",
    course: "",
    comment: "",
    photo: null,
  });
  const [feedbacks, setFeedbacks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  async function fetchFeedbacks() {
    try {
      const res = await axios.get(`${apiBase}/api/feedbacks`);
      setFeedbacks(res.data);
    } catch {
      toast.error("Failed to fetch feedbacks");
    }
  }

  function handleChange(e) {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("course", form.course);
    formData.append("comment", form.comment);
    if (form.photo) formData.append("photo", form.photo);

    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`${apiBase}/api/feedbacks/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Feedback updated!");
      } else {
        await axios.post(`${apiBase}/api/feedbacks`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Feedback added!");
      }
      setForm({ name: "", course: "", comment: "", photo: null });
      setEditingId(null);
      fetchFeedbacks();
    } catch {
      toast.error("Failed to save feedback");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(fb) {
    setEditingId(fb._id);
    setForm({
      name: fb.name,
      course: fb.course,
      comment: fb.comment,
      photo: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast("Edit mode enabled", { icon: "📝" });
  }

  function confirmDelete(id) {
    setDeleteId(id);
    setShowModal(true);
  }

  async function handleDelete() {
    try {
      await axios.delete(`${apiBase}/api/feedbacks/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Feedback deleted!");
      fetchFeedbacks();
    } catch {
      toast.error("Failed to delete feedback");
    }
    setShowModal(false);
  }

  const filtered = feedbacks.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.course.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-darkBg text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-500 text-white py-8 shadow-md">
        <h1 className="text-center text-4xl font-extrabold tracking-wide">
           Student Feedbacks
        </h1>
      </div>

      <div className="max-w-5xl mx-auto p-6 -mt-8 space-y-10">
        {/* Feedback Form */}
        <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent mb-5">
            {editingId ? "✏️ Edit Feedback" : "➕ Add Feedback"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Student Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-teal-400 outline-none"
            />
            <input
              type="text"
              name="course"
              placeholder="Course"
              value={form.course}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-teal-400 outline-none"
            />
            <textarea
              name="comment"
              placeholder="Feedback / Comment"
              value={form.comment}
              onChange={handleChange}
              rows="3"
              required
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-teal-400 outline-none"
            ></textarea>
            <div>
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
                className="w-full text-gray-600 dark:text-gray-300"
              />
              {form.photo && (
                <div className="mt-3 flex justify-center">
                  <img
                    src={URL.createObjectURL(form.photo)}
                    alt="Preview"
                    className="w-24 h-24 rounded-full border-2 border-teal-400 shadow hover:scale-105 transition"
                  />
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : editingId
                ? "Update Feedback"
                : "Add Feedback"}
            </button>
          </form>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-xl shadow border border-gray-200 dark:border-gray-700">
          <FaSearch className="text-teal-500" />
          <input
            type="text"
            placeholder="Search by name or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-700 dark:text-gray-200"
          />
        </div>

        {/* Feedback List */}
        <div className="bg-white/90 dark:bg-gray-800/50 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-teal-500 mb-4">
            🎓 Student Feedback List
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              ({filtered.length})
            </span>
          </h2>
          {filtered.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-6">
              No feedback available.
            </p>
          ) : (
            <div className="space-y-4">
              {filtered.map((fb) => (
                <div
                  key={fb._id}
                  className="flex items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl shadow hover:shadow-teal-500/20 transition hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        fb.photo
                          ? `${apiBase}${
                              fb.photo.startsWith("/") ? fb.photo : "/" + fb.photo
                            }`
                          : "https://via.placeholder.com/60"
                      }
                      alt={fb.name}
                      className="w-16 h-16 object-cover rounded-full border-2 border-teal-400 shadow hover:scale-110 transition"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{fb.name}</h3>
                      <p className="text-sm text-teal-500">{fb.course}</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {fb.comment}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(fb)}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow flex items-center gap-2 hover:scale-105 transition"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(fb._id)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow flex items-center gap-2 hover:scale-105 transition"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-red-500">Confirm Delete</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-800 dark:hover:text-white"
              >
                <FaTimes />
              </button>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete this feedback?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white shadow"
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
