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

  // ✅ Fetch feedbacks
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  async function fetchFeedbacks() {
    try {
      const res = await axios.get(`${apiBase}/api/feedbacks`);
      setFeedbacks(res.data);
    } catch {
      toast.error("❌ Failed to fetch feedbacks");
    }
  }

  // ✅ Handle input
  function handleChange(e) {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  }

  // ✅ Submit form
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
        toast.success("✅ Feedback updated");
      } else {
        await axios.post(`${apiBase}/api/feedbacks`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("🎉 Feedback added");
      }

      setForm({ name: "", course: "", comment: "", photo: null });
      setEditingId(null);
      fetchFeedbacks();
    } catch {
      toast.error("⚠️ Failed to save feedback");
    } finally {
      setLoading(false);
    }
  }

  // ✅ Edit feedback
  function handleEdit(fb) {
    setEditingId(fb._id);
    setForm({
      name: fb.name,
      course: fb.course,
      comment: fb.comment,
      photo: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast("✏️ Edit mode enabled", { icon: "📝" });
  }

  // ✅ Delete feedback
  function confirmDelete(id) {
    setDeleteId(id);
    setShowModal(true);
  }

  async function handleDelete() {
    try {
      await axios.delete(`${apiBase}/api/feedbacks/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("🗑️ Feedback deleted");
      fetchFeedbacks();
    } catch {
      toast.error("⚠️ Failed to delete feedback");
    }
    setShowModal(false);
  }

  // ✅ Filter feedback
  const filtered = feedbacks.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.course.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-24 px-4 sm:px-6 min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-200">
      <Toaster position="top-right" />

      {/* === Feedback Form === */}
      <div className="bg-gray-800/40 backdrop-blur-lg border border-gray-700 p-6 rounded-2xl shadow-xl max-w-2xl mx-auto mb-10 hover:shadow-2xl transition-all">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent mb-5">
          {editingId ? "✏️ Edit Feedback" : "➕ Add Feedback"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="👩‍🎓 Student Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-gray-900/70 text-gray-100 border border-gray-700 focus:ring-2 focus:ring-teal-400 outline-none"
          />

          <input
            type="text"
            name="course"
            placeholder="📘 Course"
            value={form.course}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-gray-900/70 text-gray-100 border border-gray-700 focus:ring-2 focus:ring-teal-400 outline-none"
          />

          <textarea
            name="comment"
            placeholder="💬 Feedback / Comment"
            value={form.comment}
            onChange={handleChange}
            rows="3"
            required
            className="w-full p-3 rounded-lg bg-gray-900/70 text-gray-100 border border-gray-700 focus:ring-2 focus:ring-teal-400 outline-none"
          ></textarea>

          <div>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
              className="w-full text-gray-300 cursor-pointer"
            />
            {form.photo && (
              <div className="mt-3 flex justify-center">
                <img
                  src={URL.createObjectURL(form.photo)}
                  alt="Preview"
                  className="w-24 h-24 rounded-full border-2 border-teal-400 shadow-md hover:scale-105 transition-all"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-darkBg rounded-lg font-semibold hover:scale-105 hover:opacity-90 shadow-lg transition disabled:opacity-50"
          >
            {loading
              ? "⏳ Saving..."
              : editingId
              ? "✅ Update Feedback"
              : "➕ Add Feedback"}
          </button>
        </form>
      </div>

      {/* === Search Bar === */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center gap-3 bg-gray-800/50 p-3 rounded-xl border border-gray-700">
        <FaSearch className="text-teal-400 ml-2" />
        <input
          type="text"
          placeholder="Search by name or course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-gray-200 outline-none px-2"
        />
      </div>

      {/* === Feedback List === */}
      <div className="bg-gray-800/30 backdrop-blur-lg border border-gray-700 p-6 rounded-2xl shadow-xl max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-teal-400 mb-5">
          🎓 Student Feedback List{" "}
          <span className="text-sm text-gray-400">({filtered.length})</span>
        </h2>

        {filtered.length === 0 ? (
          <p className="text-gray-400 text-center py-6">
            No feedback available.
          </p>
        ) : (
          <div className="space-y-4">
            {filtered.map((fb) => (
              <div
                key={fb._id}
                className="flex items-center justify-between gap-4 p-4 bg-gray-900/60 hover:bg-gray-800/80 transition-all rounded-xl shadow hover:shadow-teal-500/20"
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
                    className="w-16 h-16 object-cover rounded-full border-2 border-teal-400 hover:scale-110 transition"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{fb.name}</h3>
                    <p className="text-sm text-teal-300">{fb.course}</p>
                    <p className="text-gray-400 text-sm">{fb.comment}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(fb)}
                    className="flex items-center gap-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg shadow hover:scale-105 transition"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(fb._id)}
                    className="flex items-center gap-1 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg shadow hover:scale-105 transition"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* === Delete Modal === */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-red-400">
                Confirm Delete
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>
            <p className="text-gray-300 mb-4">
              Are you sure you want to delete this feedback?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
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
