import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

export default function EditNotes() {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [filePreview, setFilePreview] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fileBase = "http://localhost:4000";

  const categoryOptions = [
    "Lesson Notes",
    "Summary",
    "Question Bank",
    "One Word",
    "Important",
    "Others",
  ];

  /* ✅ Fetch existing note details */
  useEffect(() => {
    const fetchNote = async () => {
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

        // ✅ Use backend-provided URLs if available
        if (note.thumbnailUrl) {
          setThumbnailPreview(note.thumbnailUrl);
        } else if (note.thumbnail) {
          const cleaned = note.thumbnail.replace(/^.*uploads[\\/]/, "uploads/").replace(/\\/g, "/");
          setThumbnailPreview(`${fileBase}/${cleaned}`);
        }

        if (note.fileUrl) {
          setFilePreview(note.fileUrl);
        } else if (note.file) {
          const cleaned = note.file.replace(/^.*uploads[\\/]/, "uploads/").replace(/\\/g, "/");
          setFilePreview(`${fileBase}/${cleaned}`);
        }
      } catch (err) {
        console.error("❌ Failed to fetch note:", err);
        setMessage("❌ Failed to load note data.");
      }
    };

    fetchNote();
  }, [id]);

  /* 🧠 Handle input changes */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* 🧠 Handle file selection */
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (e.target.name === "thumbnail") {
      setThumbnail(selectedFile);
      setThumbnailPreview(URL.createObjectURL(selectedFile));
    } else {
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
    }
  };

  /* 🚀 Update note */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => form.append(key, value));
      if (thumbnail) form.append("thumbnail", thumbnail);
      if (file) form.append("file", file);

      const token = localStorage.getItem("token");

      await api.put(`/notes/${id}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("✅ Note updated successfully!");
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      console.error("❌ Update error:", err.response?.data || err);
      setMessage("❌ Failed to update note.");
    } finally {
      setLoading(false);
    }
  };

  /* 🎨 UI */
  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
      >
        ⬅ Back
      </button>

      <h1 className="text-3xl font-bold mb-6 text-center">✏️ Edit Note</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700"
      >
        {/* 🔹 Dropdowns */}
        <Dropdown label="Group" name="group" value={formData.group} options={groupOptions} onChange={handleChange} required />
        <Dropdown label="Standard" name="standard" value={formData.standard} options={standardOptions[formData.group] || []} onChange={handleChange} required />
        <Dropdown label="Board" name="board" value={formData.board} options={boardOptions} onChange={handleChange} required />
        <Dropdown label="Language" name="language" value={formData.language} options={languageOptions} onChange={handleChange} required />
        <Dropdown label="Subject" name="subject" value={formData.subject} options={subjectMap[formData.group] || []} onChange={handleChange} required />
        <Dropdown label="Lesson" name="lesson" value={formData.lesson} options={lessonOptions} onChange={handleChange} required />
        <Dropdown label="Category" name="category" value={formData.category} options={categoryOptions} onChange={handleChange} required />

        {/* 🔹 Text Inputs */}
        <input
          type="text"
          name="noteNumber"
          placeholder="Note Number (Optional)"
          value={formData.noteNumber}
          onChange={handleChange}
          className="p-2 rounded bg-gray-700 border border-gray-600"
        />

        <input
          type="text"
          name="title"
          placeholder="Note Title"
          value={formData.title}
          onChange={handleChange}
          className="p-2 rounded bg-gray-700 border border-gray-600 col-span-2"
          required
        />

        <textarea
          name="description"
          placeholder="Short Description (Optional)"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="p-2 rounded bg-gray-700 border border-gray-600 col-span-2"
        ></textarea>

        {/* 🔹 File Uploads */}
        <div>
          <label className="block mb-2 text-gray-300">Change Thumbnail</label>
          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={handleFileChange}
            className="p-2 rounded bg-gray-700 w-full"
          />
          {thumbnailPreview && (
            <img
              src={thumbnailPreview}
              alt="Thumbnail Preview"
              className="mt-3 rounded-lg w-40 border border-gray-600"
            />
          )}
        </div>

        <div>
          <label className="block mb-2 text-gray-300">Change Notes File</label>
          <input
            type="file"
            name="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="p-2 rounded bg-gray-700 w-full"
          />
          {filePreview && (
            <iframe
              src={filePreview}
              title="Notes Preview"
              className="mt-3 rounded-lg w-full h-60 border border-gray-600"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="col-span-2 bg-green-600 hover:bg-green-700 p-3 rounded font-semibold transition-all"
        >
          {loading ? "Updating..." : "Update Note"}
        </button>

        {message && (
          <p className="col-span-2 text-center mt-4 text-lg text-green-400 font-medium">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
