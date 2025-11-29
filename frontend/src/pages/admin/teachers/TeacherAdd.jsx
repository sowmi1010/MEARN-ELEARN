import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { FaChalkboardTeacher, FaCamera } from "react-icons/fa";

export default function TeacherAdd() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    subject: "",
    description: "",
    photo: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const token = localStorage.getItem("token");

  /* ----------------------------------------
     LOAD TEACHER DATA WHEN EDITING
  -----------------------------------------*/
  useEffect(() => {
    if (!id) return;

    async function fetchTeacher() {
      try {
        const res = await axios.get(`${apiBase}/api/teachers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const t = res.data;

        setForm({
          name: t.name,
          subject: t.subject,
          description: t.description,
          photo: null,
        });

        if (t.photo) {
          setPreview(`${apiBase}${t.photo}`);
        }

      } catch (err) {
        toast.error("Failed to load teacher details");
      }
    }
    fetchTeacher();
  }, [id]);

  /* ----------------------------------------
     HANDLE INPUT CHANGE
  -----------------------------------------*/
  function handleChange(e) {
    const { name, files, value } = e.target;

    if (files) {
      setForm({ ...form, [name]: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  }

  /* ----------------------------------------
     SUBMIT FORM
  -----------------------------------------*/
  async function handleSubmit(e) {
    e.preventDefault();

    const fd = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) fd.append(key, form[key]);
    });

    setLoading(true);

    try {
      if (id) {
        await axios.put(`${apiBase}/api/teachers/${id}`, fd, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Teacher updated successfully!");
      } else {
        await axios.post(`${apiBase}/api/teachers`, fd, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Teacher added successfully!");
      }

      navigate("/admin/teachers");

    } catch {
      toast.error("Failed to save teacher");
    }

    setLoading(false);
  }

  return (
    <div className="p-10 min-h-screen bg-[#040711] text-white flex flex-col items-center">
      
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
          <FaChalkboardTeacher className="text-white text-2xl" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-blue-400">
            {id ? "Edit Teacher" : "Add New Teacher"}
          </h1>
          <p className="text-gray-400 text-sm tracking-wide">
            Fill the details carefully
          </p>
        </div>
      </div>

      {/* FORM CONTAINER */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-[#0a1020]/90 backdrop-blur-xl p-8 rounded-2xl border border-blue-500/20 shadow-2xl space-y-6"
      >
        {/* PHOTO UPLOAD */}
        <div className="flex justify-center">
          <label className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500/40 shadow-xl cursor-pointer group bg-black/40">
            {preview ? (
              <img
                src={preview}
                className="w-full h-full object-cover"
                alt="Preview"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400 h-full">
                <FaCamera className="text-3xl mb-1" />
                <span className="text-xs">Upload Photo</span>
              </div>
            )}

            <input
              type="file"
              name="photo"
              accept="image/*"
              className="hidden"
              onChange={handleChange}
            />

            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-white transition">
              Change
            </div>
          </label>
        </div>

        {/* NAME */}
        <input
          type="text"
          name="name"
          value={form.name}
          placeholder="Teacher Name"
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-black/40 border border-blue-500/30 text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {/* SUBJECT */}
        <input
          type="text"
          name="subject"
          value={form.subject}
          placeholder="Subject"
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-black/40 border border-blue-500/30 text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          value={form.description}
          placeholder="Description"
          onChange={handleChange}
          rows="4"
          className="w-full p-3 rounded-lg bg-black/40 border border-blue-500/30 text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
        >
          {loading ? "Saving..." : id ? "Update Teacher" : "Add Teacher"}
        </button>
      </form>
    </div>
  );
}
