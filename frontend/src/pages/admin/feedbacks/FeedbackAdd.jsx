import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

export default function FeedbackAdd() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    course: "",
    comment: "",
    photo: null,
  });

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const token = localStorage.getItem("token");

  async function fetchFeedback() {
    if (!id) return;

    try {
      const res = await axios.get(`${apiBase}/api/feedbacks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setForm({
        name: res.data.name,
        course: res.data.course,
        comment: res.data.comment,
        photo: null,
      });
    } catch {
      toast.error("Failed to load data");
    }
  }

  useEffect(() => {
    fetchFeedback();
  }, [id]);

  function handleChange(e) {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const fd = new FormData();
    Object.keys(form).forEach((k) => form[k] && fd.append(k, form[k]));

    try {
      if (id) {
        await axios.put(`${apiBase}/api/feedbacks/${id}`, fd, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Feedback updated");
      } else {
        await axios.post(`${apiBase}/api/feedbacks`, fd, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Feedback added");
      }

      navigate("/admin/feedbacks");
    } catch {
      toast.error("Failed to save");
    }
  }

  return (
    <div className="p-8 bg-[#040711] min-h-screen text-white">
      <h1 className="text-3xl text-blue-400 font-bold mb-6 text-center">
        {id ? "Edit Feedback" : "Add Feedback"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-[#08172f] p-6 rounded-xl border border-blue-500/20 shadow-xl space-y-4"
      >
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 rounded bg-black/40 border border-blue-500/30"
          placeholder="Student Name"
        />

        <input
          name="course"
          value={form.course}
          onChange={handleChange}
          className="w-full p-3 rounded bg-black/40 border border-blue-500/30"
          placeholder="Course"
        />

        <textarea
          name="comment"
          value={form.comment}
          onChange={handleChange}
          className="w-full p-3 rounded bg-black/40 border border-blue-500/30"
          placeholder="Feedback message"
        />

        <input type="file" name="photo" onChange={handleChange} />

        <button className="w-full py-3 bg-blue-600 rounded-lg hover:bg-blue-700">
          {id ? "Update Feedback" : "Add Feedback"}
        </button>
      </form>
    </div>
  );
}
