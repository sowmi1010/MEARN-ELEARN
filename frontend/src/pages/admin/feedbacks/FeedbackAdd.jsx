import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { FaCamera, FaUserEdit } from "react-icons/fa";

export default function FeedbackAdd() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    course: "",
    comment: "",
    photo: null,
  });

  const [preview, setPreview] = useState(null);

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

      if (res.data.photo) setPreview(`${apiBase}${res.data.photo}`);
    } catch {
      toast.error("Failed to load feedback");
    }
  }

  useEffect(() => {
    fetchFeedback();
  }, [id]);

  function handleChange(e) {
    const { name, value, files } = e.target;

    if (files) {
      setPreview(URL.createObjectURL(files[0]));
      setForm({ ...form, photo: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
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
        toast.success("Feedback updated!");
      } else {
        await axios.post(`${apiBase}/api/feedbacks`, fd, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Feedback added!");
      }

      navigate("/admin/feedbacks");
    } catch {
      toast.error("Failed to save feedback");
    }
  }

  return (
    <div className="p-10 bg-[#040711] min-h-screen text-white flex justify-center">
      <div className="w-full max-w-2xl bg-[#0d142a]/80 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-10 shadow-2xl">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
            <FaUserEdit className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-blue-400">
              {id ? "Edit Feedback" : "Add Feedback"}
            </h1>
            <p className="text-gray-400 text-sm tracking-wide">
              Fill the student feedback details
            </p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* NAME */}
          <div>
            <label className="text-sm text-gray-300">Student Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-4 mt-1 rounded-xl bg-black/40 border border-blue-500/30
              focus:ring-2 focus:ring-blue-500 outline-none shadow-md"
              placeholder="Enter student name"
            />
          </div>

          {/* COURSE */}
          <div>
            <label className="text-sm text-gray-300">Course Name</label>
            <input
              name="course"
              value={form.course}
              onChange={handleChange}
              className="w-full p-4 mt-1 rounded-xl bg-black/40 border border-blue-500/30
              focus:ring-2 focus:ring-blue-500 outline-none shadow-md"
              placeholder="Enter course name"
            />
          </div>

          {/* COMMENT */}
          <div>
            <label className="text-sm text-gray-300">Feedback Message</label>
            <textarea
              name="comment"
              value={form.comment}
              onChange={handleChange}
              className="w-full p-4 mt-1 rounded-xl bg-black/40 border border-blue-500/30
              focus:ring-2 focus:ring-blue-500 outline-none shadow-md h-32"
              placeholder="Write feedback message"
            />
          </div>

          {/* PHOTO UPLOAD */}
          <div className="flex flex-col items-center gap-4 mt-4">
            <label className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-blue-500/40 cursor-pointer group shadow-lg">
              {preview ? (
                <img
                  src={preview}
                  className="w-full h-full object-cover group-hover:brightness-75 transition"
                />
              ) : (
                <div className="w-full h-full bg-black/40 flex flex-col items-center justify-center text-gray-400">
                  <FaCamera className="text-3xl mb-1" />
                  <span className="text-xs">Upload Photo</span>
                </div>
              )}

              <input type="file" name="photo" className="hidden" onChange={handleChange} />

              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-xs text-white">
                Change Photo
              </div>
            </label>
          </div>

          {/* BUTTON */}
          <button
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl 
            hover:scale-105 transition font-semibold shadow-xl text-lg mt-4"
          >
            {id ? "Update Feedback" : "Add Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
}
