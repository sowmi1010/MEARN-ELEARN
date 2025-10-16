import React, { useState } from "react";
import api from "../../../../utils/api";
import Dropdown from "../../../../components/common/Dropdown";
import {
  groupOptions,
  standardOptions,
  boardOptions,
  languageOptions,
  subjectMap,
} from "../../../../utils/courseOptions";

export default function AddTest() {
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
  const [thumbnailPreview, setThumbnailPreview] = useState("");
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

  /* Handle Input */
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

  /* Handle File Uploads */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (e.target.name === "thumbnail") {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    } else {
      setFile(file);
    }
  };

  /*  Submit Handler */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        form.append(key, value)
      );
      if (thumbnail) form.append("thumbnail", thumbnail);
      if (file) form.append("file", file);

      const token = localStorage.getItem("token");
      await api.post("/tests/upload", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Test uploaded successfully!");

      // reset form
      setFormData({
        group: "",
        standard: "",
        board: "",
        language: "",
        subject: "",
        category: "",
        title: "",
      });
      setThumbnail(null);
      setFile(null);
      setThumbnailPreview("");
    } catch (err) {
      console.error("Upload Error:", err);
      setMessage("Upload failed. Try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  /* UI */
  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Add New Test Paper
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700"
      >
        {/* Dropdowns */}
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
          label="Category"
          name="category"
          value={formData.category}
          options={categoryOptions}
          onChange={handleChange}
          required
        />

        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Enter Test Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="p-2 rounded bg-gray-700 border border-gray-600 col-span-2"
        />

        {/* File Uploads */}
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
          {thumbnailPreview && (
            <img
              src={thumbnailPreview}
              alt="Thumbnail Preview"
              className="mt-3 w-40 rounded-lg border border-gray-600"
            />
          )}
        </div>

        <div>
          <label className="block mb-2 text-gray-300">Upload Test File</label>
          <input
            type="file"
            name="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            required
            className="p-2 rounded bg-gray-700 w-full"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="col-span-2 bg-orange-600 hover:bg-orange-700 p-3 rounded font-semibold transition-all"
        >
          {loading ? "Uploading..." : "Upload Test"}
        </button>

        {/* Status */}
        {message && (
          <p
            className={`col-span-2 text-center mt-4 text-lg font-medium ${
              message.startsWith("✅") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
