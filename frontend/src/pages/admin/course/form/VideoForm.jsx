import React, { useState, useEffect } from "react";
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
import {
  FaArrowLeft,
  FaVideo,
  FaUpload,
  FaInfoCircle,
} from "react-icons/fa";

export default function VideoForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ if exists = edit

  const isEdit = Boolean(id);

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
  const [thumbnailPreview, setThumbnailPreview] = useState("");
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

  /* ✅ FETCH DATA IF EDIT */
  useEffect(() => {
    if (!id) return;

    async function fetchVideo() {
      try {
        const res = await api.get(`/videos/${id}`);
        setFormData(res.data);

        if (res.data.thumbnail) {
          setThumbnailPreview(`http://localhost:4000/${res.data.thumbnail}`);
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchVideo();
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
    if (e.target.name === "thumbnail") {
      const file = e.target.files[0];
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    } else {
      setFile(e.target.files[0]);
    }
  };

  /* ✅ HANDLE SUBMIT */
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

      if (isEdit) {
        // ✅ UPDATE
        await api.put(`/videos/${id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("✅ Video updated successfully!");
      } else {
        // ✅ ADD
        await api.post(`/videos/upload`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("✅ Video uploaded successfully!");
      }

      setTimeout(() => navigate(-1), 1200);
    } catch (err) {
      console.error("Upload Error:", err.response?.data || err);
      setMessage("❌ Failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-b from-[#0b1120] via-[#0f172a] to-[#1e293b] text-white min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-800 px-4 py-2 rounded-lg"
        >
          <FaArrowLeft /> Back
        </button>

        <h1 className="text-3xl font-bold text-blue-400 flex items-center gap-2">
          <FaVideo /> {isEdit ? "Edit Video" : "Add Video"}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900/90 p-10 rounded-2xl max-w-6xl mx-auto space-y-8"
      >
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <Dropdown label="Group" name="group" value={formData.group}
            options={groupOptions} onChange={handleChange} required />

          <Dropdown label="Standard" name="standard"
            value={formData.standard}
            options={standardOptions[formData.group] || []}
            onChange={handleChange}
            required />

          <Dropdown label="Board" name="board"
            value={formData.board}
            options={boardOptions}
            onChange={handleChange}
            required />

          <Dropdown label="Language" name="language"
            value={formData.language}
            options={languageOptions}
            onChange={handleChange}
            required />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <Dropdown label="Subject" name="subject"
            value={formData.subject}
            options={subjectMap[formData.group] || []}
            onChange={handleChange}
            required />

          <Dropdown label="Lesson" name="lesson"
            value={formData.lesson}
            options={lessonOptions}
            onChange={handleChange}
            required />

          <Dropdown
            label="Category"
            name="category"
            value={formData.category}
            options={categoryOptions}
            onChange={handleChange}
            required
          />

          <input
            name="videoNumber"
            type="number"
            value={formData.videoNumber}
            onChange={handleChange}
            placeholder="Video No"
            className="p-3 bg-gray-800 border border-gray-700 rounded"
          />
        </div>

        <input
          name="title"
          placeholder="Video Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-3 bg-gray-800 rounded"
        />

        <textarea
          name="aboutCourse"
          placeholder="About Video"
          value={formData.aboutCourse}
          onChange={handleChange}
          className="w-full p-3 bg-gray-800 rounded"
        />

        {/* UPLOADS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label>Thumbnail</label>
            <input type="file" name="thumbnail" onChange={handleFileChange} />
            {thumbnailPreview && (
              <img src={thumbnailPreview} className="mt-3 w-40 rounded" />
            )}
          </div>

          <div>
            <label>Video File</label>
            <input type="file" name="file" onChange={handleFileChange} />
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 py-3 rounded">
          {loading ? "Saving..." : isEdit ? "Update Video" : "Upload Video"}
        </button>

        {message && <p className="text-center mt-4">{message}</p>}
      </form>
    </div>
  );
}
