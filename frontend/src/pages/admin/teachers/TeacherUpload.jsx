import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FaEdit, FaTrash, FaUserTie } from "react-icons/fa";
import useGlobalSearch from "../../../hooks/useGlobalSearch";

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
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // ✅ GLOBAL SEARCH
  const search = useGlobalSearch("admin-global-search");

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const token = localStorage.getItem("token");

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
      toast.error("Failed to fetch teachers");
    }
  }

  // ✅ SAFE SEARCH (FIXED)
  const safeSearch =
    typeof search === "string" ? search.toLowerCase() : "";

  const filtered = teachers.filter(
    (t) =>
      t?.name?.toLowerCase().includes(safeSearch) ||
      t?.subject?.toLowerCase().includes(safeSearch) ||
      t?.description?.toLowerCase().includes(safeSearch)
  );

  function handleChange(e) {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    for (let key in form) {
      if (form[key]) formData.append(key, form[key]);
    }

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

      toast.success("Teacher deleted successfully");
      fetchTeachers();
    } catch {
      toast.error("Failed to delete teacher");
    }
    setShowModal(false);
  }

  return (
    <div className="min-h-screen bg-[#050910] text-white p-8">
      <Toaster position="top-right" />

      <div className="flex justify-center items-center gap-4 mb-10">
        <FaUserTie className="text-blue-500 text-3xl" />
        <h1 className="text-3xl font-bold text-blue-500">
          Teacher Management
        </h1>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-10">

        {/* FORM */}
        <div className="lg:col-span-2 bg-[#0b1225] p-6 rounded-2xl border border-blue-500/10 shadow-xl">

          <h2 className="text-xl font-semibold text-blue-400 mb-6 text-center">
            {editingId ? "Edit Teacher" : "Add Teacher"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              placeholder="Teacher name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-black/40 border border-blue-500/30"
            />

            <input
              name="subject"
              placeholder="Subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-black/40 border border-blue-500/30"
            />

            <textarea
              name="description"
              rows="3"
              placeholder="About teacher"
              value={form.description}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-black/40 border border-blue-500/30"
            />

            <input type="file" onChange={handleChange} name="photo" />

            <button
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700"
            >
              {loading
                ? "Saving..."
                : editingId
                ? "Update Teacher"
                : "Add Teacher"}
            </button>
          </form>
        </div>

        {/* LIST */}
        <div className="lg:col-span-3">
          <h2 className="text-lg text-blue-400 mb-6">
            Teacher List ({filtered.length})
          </h2>

          {filtered.length === 0 ? (
            <p className="text-gray-500 text-center py-20">
              No teachers found
            </p>
          ) : (
            <div className="space-y-4">
              {filtered.map((t) => (
                <div
                  key={t._id}
                  className="flex justify-between items-center p-5 rounded-xl bg-[#0b1225] border border-blue-500/10 hover:border-blue-500 transition"
                >
                  <div className="flex gap-4 items-center">
                    <img
                      src={
                        t.photo
                          ? `${apiBase}${t.photo}`
                          : "https://via.placeholder.com/60"
                      }
                      className="w-16 h-16 rounded-full"
                    />

                    <div>
                      <h3 className="text-lg font-semibold">{t.name}</h3>
                      <p className="text-blue-400 text-sm">{t.subject}</p>
                      <p className="text-gray-400 text-sm">
                        {t.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(t)}
                      className="px-3 py-2 bg-blue-600 rounded-lg"
                    >
                      <FaEdit /> Edit
                    </button>

                    <button
                      onClick={() => confirmDelete(t._id)}
                      className="px-3 py-2 bg-red-600 rounded-lg"
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

      {/* DELETE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-[#0b1225] p-6 rounded-xl w-96">
            <h3 className="text-red-400 text-lg mb-3">
              Confirm Delete
            </h3>
            <p className="text-gray-400 mb-6">
              Are you sure?
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
