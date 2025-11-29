import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

export default function TeacherAdd() {
  const { id } = useParams();        // <-- get teacher ID for edit
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    subject: "",
    description: "",
    photo: null,
  });

  const [loading, setLoading] = useState(false);

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const token = localStorage.getItem("token");

  /* -------------------------------------------
     🔵 LOAD TEACHER DATA WHEN EDITING
  ------------------------------------------- */
  useEffect(() => {
    if (!id) return; // Add mode, no need to fetch

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
          photo: null, // photo handled separately
        });

      } catch (err) {
        toast.error("Failed to load teacher data");
      }
    }

    fetchTeacher();
  }, [id]);

  /* -------------------------------------------
     FORM CHANGE
  ------------------------------------------- */
  function handleChange(e) {
    const { name, files, value } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  }

  /* -------------------------------------------
     SUBMIT FORM
  ------------------------------------------- */
  async function handleSubmit(e) {
    e.preventDefault();

    const fd = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) fd.append(key, form[key]);
    });

    setLoading(true);

    try {
      if (id) {
        // UPDATE
        await axios.put(`${apiBase}/api/teachers/${id}`, fd, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Teacher updated!");
      } else {
        // ADD NEW
        await axios.post(`${apiBase}/api/teachers`, fd, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Teacher added!");
      }

      navigate("/admin/teachers"); // <-- SUCCESS REDIRECT

    } catch {
      toast.error("Failed to save teacher");
    }

    setLoading(false);
  }

  return (
    <div className="p-8 text-white bg-[#050910] min-h-screen">
      <h1 className="text-3xl text-blue-400 font-bold mb-6 text-center">
        {id ? "Edit Teacher" : "Add New Teacher"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-lg bg-[#08172f] p-6 rounded-xl border border-blue-500/20 shadow-xl space-y-4 mx-auto"
      >
        <input
          type="text"
          name="name"
          value={form.name}
          placeholder="Teacher Name"
          onChange={handleChange}
          className="w-full p-3 rounded bg-black/40 border border-blue-500/30"
        />

        <input
          type="text"
          name="subject"
          value={form.subject}
          placeholder="Subject"
          onChange={handleChange}
          className="w-full p-3 rounded bg-black/40 border border-blue-500/30"
        />

        <textarea
          name="description"
          value={form.description}
          placeholder="Description"
          onChange={handleChange}
          className="w-full p-3 rounded bg-black/40 border border-blue-500/30"
        />

        <input type="file" name="photo" onChange={handleChange} />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold shadow-lg"
        >
          {loading ? "Saving..." : id ? "Update Teacher" : "Add Teacher"}
        </button>
      </form>
    </div>
  );
}
