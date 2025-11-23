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
} from "../../../../utils/courseOptions";

import { FaFileAlt, FaSave, FaUpload } from "react-icons/fa";

export default function TestForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    group: "",
    standard: "",
    board: "",
    language: "",
    subject: "",
    category: "",
    title: "",
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const categoryOptions = [
    "Unit Test",
    "Revision Test",
    "Model Paper",
    "Practice Test",
    "Exam Paper",
    "Lesson Test",
    "Weekly Test",
    "Monthly Test",
    "Quarterly Exam",
    "Half-Yearly Exam",
    "Annual Exam",
  ];

  /* ✅ Load data in EDIT */
  useEffect(() => {
    if (!id) return;

    const fetchTest = async () => {
      try {
        const res = await api.get(`/tests/${id}`);
        const test = res.data;

        setFormData({
          group: test.group || "",
          standard: test.standard || "",
          board: test.board || "",
          language: test.language || "",
          subject: test.subject || "",
          category: test.category || "",
          title: test.title || "",
        });

        if (test.thumbnail) {
          const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

          const imageUrl = test.thumbnail.startsWith("http")
            ? test.thumbnail
            : `${API}/${test.thumbnail.replace(/\\/g, "/")}`;

          console.log("IMAGE URL =>", imageUrl); // IMPORTANT

          setPreview(encodeURI(imageUrl));
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };

    fetchTest();
  }, [id]);

  /* ✅ Handle change */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "group") {
      setFormData({
        ...formData,
        group: value,
        standard: "",
        subject: "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  /* ✅ File change */
  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    if (e.target.name === "thumbnail") {
      setThumbnail(selected);
      setPreview(URL.createObjectURL(selected));
    } else {
      setFile(selected);
    }
  };

  /* ✅ Submit */
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
        await api.put(`/tests/${id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("✅ Test updated successfully");
      } else {
        await api.post("/tests/upload", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("✅ Test added successfully");
      }

      setTimeout(() => navigate("/admin/courses"), 1200);
    } catch (err) {
      console.error("Save Error:", err);
      setMessage("❌ Failed to save test");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  return (
    <div className="p-10 bg-gradient-to-b from-[#0b1120] via-[#0f172a] to-[#1e293b] text-white min-h-screen">
      {/* TITLE */}
      <h1 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent flex items-center justify-center gap-2">
        <FaFileAlt />
        {isEdit ? "Edit Test Paper" : "Add New Test Paper"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900/90 max-w-6xl mx-auto rounded-2xl p-10 space-y-6 border border-gray-800"
      >
        {/* ROW 1 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
        </div>

        {/* ROW 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Dropdown
            label="Subject"
            name="subject"
            value={formData.subject}
            options={subjectMap[formData.group] || []}
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

          <input
            type="text"
            name="title"
            placeholder="Test Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="p-3 rounded-lg bg-gray-800 border border-gray-700"
          />
        </div>

        {/* FILE UPLOADS */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
            <p className="mb-2 flex items-center gap-2 text-orange-400">
              <FaUpload /> Upload Thumbnail
            </p>

            <input
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={handleFileChange}
            />

            {preview && (
              <div className="mt-4 flex items-center gap-4">
                <img
                  src={preview}
                  alt="Thumbnail Preview"
                  onError={(e) => {
                    console.error("❌ Image failed:", preview);
                    e.target.src = "/no-image.png"; // add a local fallback image
                  }}
                  className="w-40 h-28 object-cover rounded-lg border border-gray-600 shadow-lg"
                />
                <p className="text-gray-400 text-sm">Current Thumbnail</p>
              </div>
            )}
          </div>

          <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
            <p className="mb-2 flex items-center gap-2 text-red-400">
              <FaUpload /> Upload Test File
            </p>

            <input
              type="file"
              name="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-gradient-to-r from-orange-600 to-red-600 py-3 rounded-lg font-bold flex items-center justify-center gap-2"
        >
          <FaSave />
          {loading ? "Saving..." : isEdit ? "Update Test" : "Add Test"}
        </button>

        {message && (
          <p className="text-center mt-4 text-green-400">{message}</p>
        )}
      </form>
    </div>
  );
}
