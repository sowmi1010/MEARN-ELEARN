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

export default function AddBook() {
  const [formData, setFormData] = useState({
    group: "",
    standard: "",
    board: "",
    language: "",
    subject: "",
    title: "",
    about: "",
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* Handle Input Change */
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

  /* Handle File Change */
  const handleFileChange = (e) => {
    if (e.target.name === "thumbnail") setThumbnail(e.target.files[0]);
    else setFile(e.target.files[0]);
  };

  /* Submit Form */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => form.append(key, value));
      if (thumbnail) form.append("thumbnail", thumbnail);
      if (file) form.append("file", file);

      await api.post("/books/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Book uploaded successfully!");

      // Reset
      setFormData({
        group: "",
        standard: "",
        board: "",
        language: "",
        subject: "",
        title: "",
        about: "",
      });
      setThumbnail(null);
      setFile(null);
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
      <h1 className="text-3xl font-bold mb-6 text-center">📘 Add New Book</h1>

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

        {/* Inputs */}
        <input
          type="text"
          name="title"
          placeholder="Book Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="p-2 rounded bg-gray-700 border border-gray-600 col-span-2"
        />

        <textarea
          name="about"
          placeholder="About this Book"
          value={formData.about}
          onChange={handleChange}
          rows="3"
          className="p-2 rounded bg-gray-700 border border-gray-600 col-span-2"
        ></textarea>

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
        </div>

        <div>
          <label className="block mb-2 text-gray-300">Upload Book File (PDF / eBook)</label>
          <input
            type="file"
            name="file"
            accept=".pdf,.epub"
            onChange={handleFileChange}
            required
            className="p-2 rounded bg-gray-700 w-full"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="col-span-2 bg-green-600 hover:bg-green-700 p-3 rounded font-semibold transition-all">
          {loading ? "Uploading..." : "Upload Book"}
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
