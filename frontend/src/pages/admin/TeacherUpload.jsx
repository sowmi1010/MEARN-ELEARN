import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FaEdit, FaTrash, FaSearch, FaTimes } from "react-icons/fa";

export default function TeacherUpload() {
  const [form, setForm] = useState({
    name: "",
    subject: "",
    description: "",
    photo: null,
  });
  const [teachers, setTeachers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTeachers();
  }, []);

  async function fetchTeachers() {
    try {
      const res = await axios.get(`${apiBase}/api/teachers`);
      setTeachers(res.data);
    } catch {
      toast.error("Failed to fetch teachers");
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
    formData.append("subject", form.subject);
    formData.append("description", form.description);
    if (form.photo) formData.append("photo", form.photo);

    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`${apiBase}/api/teachers/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("✅ Teacher updated");
      } else {
        await axios.post(`${apiBase}/api/teachers`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("🎉 Teacher added");
      }
      setForm({ name: "", subject: "", description: "", photo: null });
      setEditingId(null);
      fetchTeachers();
    } catch {
      toast.error("Save failed");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(t) {
    setEditingId(t._id);
    setForm({
      name: t.name,
      subject: t.subject,
      description: t.description,
      photo: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function confirmDelete(id) {
    setShowModal(true);
    setDeleteId(id);
  }

  async function handleDelete() {
    try {
      await axios.delete(`${apiBase}/api/teachers/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("🗑️ Teacher deleted");
      fetchTeachers();
    } catch {
      toast.error("Delete failed");
    }
    setShowModal(false);
  }

  const filtered = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-24 px-4 sm:px-6 min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-200">
      <Toaster position="top-right" />

      {/* FORM */}
      <div className="max-w-2xl mx-auto bg-gray-800/40 backdrop-blur-lg border border-gray-700 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all mb-10">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent text-center mb-5">
          {editingId ? "✏️ Edit Teacher" : "➕ Add Teacher"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="👩‍🏫 Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-gray-900/70 text-gray-100 border border-gray-700 focus:ring-2 focus:ring-teal-400 outline-none"
          />
          <input
            name="subject"
            placeholder="📘 Subject"
            value={form.subject}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-gray-900/70 text-gray-100 border border-gray-700 focus:ring-2 focus:ring-teal-400 outline-none"
          />
          <textarea
            name="description"
            placeholder="📝 Description"
            rows="3"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-900/70 text-gray-100 border border-gray-700 focus:ring-2 focus:ring-teal-400 outline-none"
          />
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
                  className="w-24 h-24 rounded-full border-2 border-teal-400 shadow-md hover:scale-105 transition-all"
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg font-semibold shadow-lg hover:scale-105 hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : editingId ? "Update Teacher" : "Add Teacher"}
          </button>
        </form>
      </div>

      {/* SEARCH BAR */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center gap-3 bg-gray-800/50 p-3 rounded-xl border border-gray-700">
        <FaSearch className="text-teal-400 ml-2" />
        <input
          placeholder="Search teacher by name or subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-gray-200 outline-none px-2"
        />
      </div>

      {/* TEACHER LIST */}
      <div className="max-w-5xl mx-auto bg-gray-800/30 border border-gray-700 rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-semibold text-teal-400 mb-5">
          👩‍🏫 Teacher List <span className="text-sm text-gray-400">({filtered.length})</span>
        </h2>
        {filtered.length === 0 ? (
          <p className="text-gray-400 text-center py-6">No teachers found.</p>
        ) : (
          <div className="space-y-4">
            {filtered.map((t) => (
              <div
                key={t._id}
                className="flex items-center justify-between gap-4 p-4 bg-gray-900/60 hover:bg-gray-800/80 transition-all rounded-xl shadow hover:shadow-teal-500/20"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      t.photo
                        ? `${apiBase}${t.photo.startsWith("/") ? t.photo : "/" + t.photo}`
                        : "https://via.placeholder.com/60"
                    }
                    alt={t.name}
                    className="w-16 h-16 object-cover rounded-full border-2 border-teal-400 hover:scale-110 transition"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{t.name}</h3>
                    <p className="text-sm text-teal-300">{t.subject}</p>
                    <p className="text-gray-400 text-sm">{t.description}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(t)}
                    className="flex items-center gap-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg shadow hover:scale-105 transition"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(t._id)}
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

      {/* DELETE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-red-400">Confirm Delete</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <FaTimes />
              </button>
            </div>
            <p className="text-gray-300 mb-4">Are you sure you want to delete this teacher?</p>
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
