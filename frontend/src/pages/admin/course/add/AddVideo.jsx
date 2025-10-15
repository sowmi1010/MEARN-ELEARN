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
import {
  FaArrowLeft,
  FaVideo,
  FaUpload,
  FaInfoCircle,
} from "react-icons/fa";

export default function AddVideo() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    group: "",
    standard: "",
    board: "",
    language: "",
    subject: "",
    lesson: "",
    category: "",
    title: "",
    aboutCourse: "",
    videoNumber: "",
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const categoryOptions = [
    "Lesson",
    "One Word",
    "Short Answer",
    "Medium Answer",
    "Long Answer",
    "Practical",
    "Important",
    "Exam Paper",
    "Others",
  ];

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
    if (e.target.name === "thumbnail") setThumbnail(e.target.files[0]);
    else setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const form = new FormData();
      const normalizedCategory =
        formData.category.charAt(0).toUpperCase() +
        formData.category.slice(1).toLowerCase();

      Object.entries({ ...formData, category: normalizedCategory }).forEach(
        ([key, value]) => form.append(key, value)
      );

      if (thumbnail) form.append("thumbnail", thumbnail);
      if (file) form.append("file", file);

      const token = localStorage.getItem("token");

      const res = await api.post("/videos/upload", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("✅ Video uploaded successfully!");
      setTimeout(() => navigate("/admin/courses"), 1200);

      setFormData({
        group: "",
        standard: "",
        board: "",
        language: "",
        subject: "",
        lesson: "",
        category: "",
        title: "",
        aboutCourse: "",
        videoNumber: "",
      });
      setThumbnail(null);
      setFile(null);
    } catch (err) {
      console.error("❌ Upload Error:", err.response?.data || err);
      setMessage("❌ Upload failed. Try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-b from-[#0b1120] via-[#0f172a] to-[#1e293b] text-white min-h-screen font-inter">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg shadow-md transition-all duration-200"
        >
          <FaArrowLeft className="text-blue-400" /> Back
        </button>

        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text tracking-wide flex items-center gap-2">
          <FaVideo className="text-blue-400" />
          Add New Video
        </h1>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900/90 rounded-2xl border border-gray-800 p-10 shadow-2xl backdrop-blur-md max-w-6xl mx-auto transition-all space-y-8"
      >
        {/* Row 1 */}
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

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
            options={[
              "Lesson",
              "One Word",
              "Short Answer",
              "Medium Answer",
              "Long Answer",
              "Practical",
              "Important",
              "Exam Paper",
              "Others",
            ]}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="videoNumber"
            placeholder="Video Number"
            value={formData.videoNumber}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
            required
          />
        </div>

        {/* Row 3 — Title */}
        <div className="relative">
          <FaVideo className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            name="title"
            placeholder="Enter Video Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 pl-10 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
            required
          />
        </div>

        {/* Row 4 — About */}
        <div className="relative">
          <FaInfoCircle className="absolute left-3 top-3 text-gray-400" />
          <textarea
            name="aboutCourse"
            placeholder="Enter About Course"
            value={formData.aboutCourse}
            onChange={handleChange}
            rows="3"
            className="w-full p-3 pl-10 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
          ></textarea>
        </div>

        {/* Row 5 — Upload Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Thumbnail */}
          <div className="bg-gray-800/70 p-6 rounded-xl border border-gray-700 text-center hover:bg-gray-800 hover:shadow-lg hover:shadow-blue-700/30 transition-all">
            <label className="block text-gray-300 font-medium mb-3 flex justify-center items-center gap-2">
              <FaUpload className="text-blue-400" /> Upload Thumbnail
            </label>
            <input
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="block w-full text-sm text-gray-300 bg-gray-900 rounded-lg cursor-pointer border border-gray-600 focus:outline-none"
            />
          </div>

          {/* Video File */}
          <div className="bg-gray-800/70 p-6 rounded-xl border border-gray-700 text-center hover:bg-gray-800 hover:shadow-lg hover:shadow-purple-700/30 transition-all">
            <label className="block text-gray-300 font-medium mb-3 flex justify-center items-center gap-2">
              <FaUpload className="text-purple-400" /> Upload Video File
            </label>
            <input
              type="file"
              name="file"
              accept="video/*"
              onChange={handleFileChange}
              required
              className="block w-full text-sm text-gray-300 bg-gray-900 rounded-lg cursor-pointer border border-gray-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-blue-700/40 transition-all flex items-center justify-center gap-2"
        >
          <FaVideo />
          {loading ? "Uploading..." : "Complete"}
        </button>

        {message && (
          <p className="text-center mt-4 text-green-400 font-medium">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
