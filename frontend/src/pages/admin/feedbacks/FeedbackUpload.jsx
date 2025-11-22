import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FaEdit, FaTrash, FaTimes, FaComments, FaPlusCircle } from "react-icons/fa";
import useGlobalSearch from "../../../hooks/useGlobalSearch"; // ✅ GLOBAL SEARCH HOOK

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
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const token = localStorage.getItem("token");

  // ✅ GLOBAL SEARCH VALUE
  const search = useGlobalSearch("admin-global-search");

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  async function fetchFeedbacks() {
    try {
      const res = await axios.get(`${apiBase}/api/feedbacks`);
      setFeedbacks(res.data || []);
    } catch {
      toast.error("Failed to fetch feedbacks");
    }
  }

  function handleChange(e) {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) formData.append(key, form[key]);
    });

    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`${apiBase}/api/feedbacks/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Feedback updated successfully");
      } else {
        await axios.post(`${apiBase}/api/feedbacks`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Feedback added successfully");
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
      toast.success("Feedback deleted");
      fetchFeedbacks();
    } catch {
      toast.error("Failed to delete feedback");
    }
    setShowModal(false);
  }

  /* ✅ FILTER USING GLOBAL SEARCH */
  const filtered = feedbacks.filter(
    (f) =>
      f.name.toLowerCase().includes(search) ||
      f.course.toLowerCase().includes(search) ||
      f.comment.toLowerCase().includes(search)
  );

  return (
    <div className="min-h-screen bg-[#050910] text-white p-8">
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="flex justify-center items-center gap-4 mb-10">
        <FaComments className="text-blue-500 text-3xl" />
        <h1 className="text-3xl font-bold text-blue-500">
          Student Feedback Management
        </h1>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-10">

        {/* ========= FORM ========= */}
        <div className="lg:col-span-2 bg-[#0b1225] p-6 rounded-2xl border border-blue-500/10 shadow-xl">
          <h2 className="text-xl font-semibold text-blue-400 mb-6 flex items-center gap-2">
            <FaPlusCircle />
            {editingId ? "Edit Feedback" : "Add Feedback"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              placeholder="Student Name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-black/40 border border-blue-500/30 outline-none"
            />

            <input
              name="course"
              placeholder="Course"
              value={form.course}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-black/40 border border-blue-500/30 outline-none"
            />

            <textarea
              name="comment"
              rows="3"
              placeholder="Feedback Message"
              value={form.comment}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-black/40 border border-blue-500/30 outline-none"
            />

            <div className="flex flex-col items-center">
              <input type="file" onChange={handleChange} name="photo" />
              {form.photo && (
                <img
                  src={URL.createObjectURL(form.photo)}
                  alt="preview"
                  className="w-20 h-20 mt-3 rounded-full object-cover border-2 border-blue-500"
                />
              )}
            </div>

            <button
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold"
            >
              {loading ? "Saving..." : editingId ? "Update" : "Add"}
            </button>
          </form>
        </div>

        {/* ========= LIST ========= */}
        <div className="lg:col-span-3 space-y-6">
          <h2 className="text-lg text-blue-400">
            Feedback List ({filtered.length})
          </h2>

          {filtered.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              No feedback found
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filtered.map((fb) => (
                <div
                  key={fb._id}
                  className="p-5 bg-[#0b1225] rounded-xl border border-blue-500/10 hover:border-blue-500 hover:shadow-xl transition"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <img
                      src={
                        fb.photo
                          ? `${apiBase}${fb.photo}`
                          : "https://via.placeholder.com/80"
                      }
                      alt={fb.name}
                      className="w-16 h-16 rounded-full border-2 border-blue-500 object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{fb.name}</h3>
                      <p className="text-blue-400 text-sm">{fb.course}</p>
                    </div>
                  </div>

                  <p className="text-gray-400 italic mb-4">
                    "{fb.comment}"
                  </p>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => handleEdit(fb)}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex gap-2 items-center"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(fb._id)}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg flex gap-2 items-center"
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

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#0b1225] p-6 rounded-xl w-96 border border-red-500/30">
            <h3 className="text-red-400 text-lg mb-3">Confirm Delete</h3>
            <p className="text-gray-400 mb-6">Are you sure?</p>
            <div className="flex justify-end gap-4">
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
