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
        toast.success("Teacher updated successfully!");
      } else {
        await axios.post(`${apiBase}/api/teachers`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Teacher added successfully!");
      }
      setForm({ name: "", subject: "", description: "", photo: null });
      setEditingId(null);
      fetchTeachers();
    } catch {
      toast.error("Something went wrong");
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
    toast("Edit mode enabled ✏️");
  }

  function confirmDelete(id) {
    setDeleteId(id);
    setShowModal(true);
  }

  async function handleDelete() {
    try {
      await axios.delete(`${apiBase}/api/teachers/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Teacher deleted successfully!");
      fetchTeachers();
    } catch {
      toast.error("Failed to delete teacher");
    }
    setShowModal(false);
  }

  const filtered = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkBg text-gray-800 dark:text-gray-200">
      <Toaster position="top-right" />

      {/* Header */}
      <h1 className="text-center text-3xl font-bold py-8">
        Teacher Management
      </h1>

      <div className="max-w-5xl mx-auto p-6 space-y-10">
        {/* Form Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4 text-center">
            {editingId ? "Edit Teacher" : "Add Teacher"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Teacher Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={form.subject}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              required
              className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
            ></textarea>

            <div className="flex flex-col items-center justify-center">
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
                className="text-gray-600 dark:text-gray-300"
              />
              {form.photo && (
                <div className="mt-3">
                  <img
                    src={URL.createObjectURL(form.photo)}
                    alt="Preview"
                    className="w-24 h-24 rounded-full border-2 border-blue-400 shadow-md object-cover"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : editingId
                ? "Update Teacher"
                : "Add Teacher"}
            </button>
          </form>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <FaSearch className="text-blue-500" />
          <input
            type="text"
            placeholder="Search teacher by name or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-700 dark:text-gray-200"
          />
        </div>

        {/* Teacher List */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
            Teacher List ({filtered.length})
          </h2>

          {filtered.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-6">
              No teachers found.
            </p>
          ) : (
            <div className="space-y-4">
              {filtered.map((t) => (
                <div
                  key={t._id}
                  className="flex items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        t.photo
                          ? `${apiBase}${
                              t.photo.startsWith("/") ? t.photo : "/" + t.photo
                            }`
                          : "https://via.placeholder.com/60"
                      }
                      alt={t.name}
                      className="w-14 h-14 object-cover rounded-full border border-blue-400"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{t.name}</h3>
                      <p className="text-sm text-blue-500">{t.subject}</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {t.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(t)}
                      className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md flex items-center gap-2"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(t._id)}
                      className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md flex items-center gap-2"
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-red-500">
                Confirm Delete
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-800 dark:hover:text-white"
              >
                <FaTimes />
              </button>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete this teacher?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white"
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
