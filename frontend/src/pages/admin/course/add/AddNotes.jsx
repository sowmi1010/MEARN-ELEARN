import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function AddNotes() {
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

  const [thumbnail, setThumbnail] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* 🧩 Category Options */
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

  /* 🧠 Handle Input Changes */
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

  /* 🧠 Handle File Uploads */
  const handleFileChange = (e) => {
    if (e.target.name === "thumbnail") setThumbnail(e.target.files[0]);
    else setFile(e.target.files[0]);
  };

  /* 🚀 Submit Notes Upload */
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

      await api.post("/notes/upload", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("✅ Notes uploaded successfully!");

      // Redirect to courses page after short success delay
      setTimeout(() => navigate("/admin/courses"), 1200);
    } catch (err) {
      console.error("❌ Upload Error:", err);
      setMessage("❌ Upload failed. Try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  /* 🎨 UI */
  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
      >
        ⬅ Back
      </button>

      <h1 className="text-3xl font-bold mb-6 text-center">📝 Add New Notes</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700"
      >
        {/* 🔹 Dropdowns */}
        <Dropdown
          label="Group"
          name="group"
          value={formData.group}
          options={groupOptions}
          onChange={handleChange}
          required
        />
        <Dropdown
          label="Standard"
          name="standard"
          value={formData.standard}
          options={standardOptions[formData.group] || []}
          onChange={handleChange}
          required
        />
        <Dropdown
          label="Board"
          name="board"
          value={formData.board}
          options={boardOptions}
          onChange={handleChange}
          required
        />
        <Dropdown
          label="Language"
          name="language"
          value={formData.language}
          options={languageOptions}
          onChange={handleChange}
          required
        />
        <Dropdown
          label="Subject"
          name="subject"
          value={formData.subject}
          options={subjectMap[formData.group] || []}
          onChange={handleChange}
          required
        />
        <Dropdown
          label="Lesson"
          name="lesson"
          value={formData.lesson}
          options={lessonOptions}
          onChange={handleChange}
          required
        />
        <Dropdown
          label="Category"
          name="category"
          value={formData.category}
          options={categoryOptions}
          onChange={handleChange}
          required
        />

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
          required
          className="p-2 rounded bg-gray-700 border border-gray-600 col-span-2"
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
          <label className="block mb-2 text-gray-300">Upload Thumbnail</label>
          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="p-2 rounded bg-gray-700 w-full"
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-300">Upload Notes File</label>
          <input
            type="file"
            name="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            required
            className="p-2 rounded bg-gray-700 w-full"
          />
        </div>

        {/* 🔹 Submit */}
        <button
          type="submit"
          disabled={loading}
          className="col-span-2 bg-blue-600 hover:bg-blue-700 p-3 rounded font-semibold transition-all"
        >
          {loading ? "Uploading..." : "Upload Notes"}
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
