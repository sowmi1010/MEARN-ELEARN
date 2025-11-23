import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../../utils/api";
import Dropdown from "../../../../components/common/Dropdown";

import {
  groupOptions,
  standardOptions,
  boardOptions,
  languageOptions,
  subjectMap,
  lessonOptions,
} from "../../../../utils/courseOptions";

import { FaStickyNote, FaUpload, FaSave, FaEdit } from "react-icons/fa";

export default function NotesForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    group: "",
    standard: "",
    board: "",
    language: "",
    subject: "",
    lesson: "",
    category: "",
    noteNumber: "",
    title: "",
    description: "",
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const categoryOptions = [
    "Lesson",
    "Lesson Notes",
    "One Word",
    "Short Answer",
    "Medium Answer",
    "Long Answer",
    "Practical",
    "Important",
    "Exam Paper",
    "Others",
  ];

  // ✅ LOAD FOR EDIT
  useEffect(() => {
    if (!id) return;

    const fetchNotes = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        const note = res.data;

        setFormData({
          group: note.group || "",
          standard: note.standard || "",
          board: note.board || "",
          language: note.language || "",
          subject: note.subject || "",
          lesson: note.lesson || "",
          category: note.category || "",
          noteNumber: note.noteNumber || "",
          title: note.title || "",
          description: note.description || "",
        });

        if (note.thumbnail) {
          const fixed = note.thumbnail.replace(/\\/g, "/");

          setPreview(
            fixed.startsWith("http") ? fixed : `http://localhost:4000/${fixed}`
          );
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };

    fetchNotes();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "group") {
      setFormData({
        ...formData,
        group: value,
        standard: "",
        subject: "",
        lesson: "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (e.target.name === "thumbnail") {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const form = new FormData();

      Object.entries(formData).forEach(([k, v]) => form.append(k, v));

      if (thumbnail) form.append("thumbnail", thumbnail);
      if (file) form.append("file", file);

      const token = localStorage.getItem("token");

      if (isEdit) {
        await api.put(`/notes/${id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMessage("✅ Notes Updated Successfully");
      } else {
        await api.post("/notes/upload", form, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMessage("✅ Notes Added Successfully");
      }

      setTimeout(() => navigate("/admin/courses"), 1200);
    } catch (err) {
      console.error("Save Error:", err);
      setMessage("❌ Failed to save notes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] text-white px-6 py-10">
      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold flex justify-center items-center gap-3 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          {isEdit ? <FaEdit /> : <FaStickyNote />}
          {isEdit ? "Edit Notes" : "Create New Notes"}
        </h1>
        <p className="text-gray-400 mt-2">
          Fill the details and upload notes materials
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-auto bg-[#0f172a]/90 rounded-3xl p-10 border border-gray-800 shadow-2xl space-y-8 backdrop-blur-lg"
      >
        {/* ========== ROW 1 ========== */}
        <div className="grid md:grid-cols-4 gap-6">
          <Dropdown
            label="Group"
            name="group"
            value={formData.group}
            options={groupOptions}
            onChange={handleChange}
          />
          <Dropdown
            label="Standard"
            name="standard"
            value={formData.standard}
            options={standardOptions[formData.group] || []}
            onChange={handleChange}
          />
          <Dropdown
            label="Board"
            name="board"
            value={formData.board}
            options={boardOptions}
            onChange={handleChange}
          />
          <Dropdown
            label="Language"
            name="language"
            value={formData.language}
            options={languageOptions}
            onChange={handleChange}
          />
        </div>

        {/* ========== ROW 2 ========== */}
        <div className="grid md:grid-cols-3 gap-6">
          <Dropdown
            label="Subject"
            name="subject"
            value={formData.subject}
            options={subjectMap[formData.group] || []}
            onChange={handleChange}
          />
          <Dropdown
            label="Lesson"
            name="lesson"
            value={formData.lesson}
            options={lessonOptions}
            onChange={handleChange}
          />
          <Dropdown
            label="Category"
            name="category"
            value={formData.category}
            options={categoryOptions}
            onChange={handleChange}
          />
        </div>

        {/* ========== TEXT INPUTS ========== */}
        <input
          type="text"
          name="noteNumber"
          placeholder="Note Number (optional)"
          value={formData.noteNumber}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl bg-[#1e293b] border border-gray-700 focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="title"
          placeholder="Note Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl bg-[#1e293b] border border-gray-700 focus:ring-2 focus:ring-cyan-500"
        />

        <textarea
          rows="3"
          name="description"
          placeholder="Short description..."
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl bg-[#1e293b] border border-gray-700 focus:ring-2 focus:ring-violet-500"
        ></textarea>

        {/* ========== FILE UPLOAD ========== */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Thumbnail */}
          <div className="border border-dashed border-gray-600 p-6 rounded-2xl bg-[#1e293b]/60 text-center hover:bg-[#1e293b] transition">
            <FaUpload className="mx-auto text-blue-400 text-xl mb-2" />
            <p className="mb-2 text-sm">Upload Thumbnail</p>
            <input type="file" name="thumbnail" onChange={handleFileChange} />

            {preview && (
              <div className="mt-5 flex justify-center">
                <div className="bg-[#0f172a] p-3 rounded-xl shadow-xl border border-white/10">
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-40 w-52 object-cover rounded-lg"
                  />
                  <p className="text-xs text-center text-gray-400 mt-2">
                    Thumbnail Preview
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Notes File */}
          <div className="border border-dashed border-gray-600 p-6 rounded-2xl bg-[#1e293b]/60 text-center hover:bg-[#1e293b] transition">
            <FaUpload className="mx-auto text-purple-400 text-xl mb-2" />
            <p className="mb-2 text-sm">Upload Notes File</p>
            <input type="file" name="file" onChange={handleFileChange} />
          </div>
        </div>

        {/* ========== SUBMIT BUTTON ========== */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 font-bold tracking-wide flex items-center justify-center gap-2 transition-all"
        >
          <FaSave />
          {loading ? "Saving..." : isEdit ? "Update Notes" : "Publish Notes"}
        </button>

        {message && (
          <p className="text-center text-green-400 font-semibold text-lg">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
