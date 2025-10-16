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

export default function EditVideo() {
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
    title: "",
    aboutCourse: "",
    videoNumber: "",
  });

  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [filePreview, setFilePreview] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE_URL = "http://localhost:4000";

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

  // Clean up absolute paths
  const cleanPath = (p) => {
    if (!p) return "";
    let normalized = p.replace(/\\/g, "/");
    const idx = normalized.indexOf("uploads/");
    return idx !== -1 ? `${BASE_URL}/${normalized.substring(idx)}` : `${BASE_URL}/${normalized}`;
  };

  // Fetch existing video data
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await api.get(`/videos/${id}`);
        const video = res.data;

        setFormData({
          group: video.group || "",
          standard: video.standard || "",
          board: video.board || "",
          language: video.language || "",
          subject: video.subject || "",
          lesson: video.lesson || "",
          category: video.category || "",
          title: video.title || "",
          aboutCourse: video.aboutCourse || "",
          videoNumber: video.videoNumber || "",
        });

        setThumbnailPreview(cleanPath(video.thumbnail));
        setFilePreview(cleanPath(video.file));
      } catch (err) {
        console.error("Failed to fetch video:", err);
        setMessage("Failed to load video data.");
      }
    };

    fetchVideo();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.name === "thumbnail") setThumbnail(e.target.files[0]);
    else setFile(e.target.files[0]);
  };

  // Update video
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
      const res = await api.put(`/videos/${id}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Update Response:", res.data);
      setMessage("Video updated successfully!");

      // Redirect to admin/courses after success
      setTimeout(() => navigate("/admin/courses"), 1200);
    } catch (err) {
      console.error("Update error:", err.response?.data || err);
      setMessage("Failed to update video.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center"> Edit Video</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700"
      >
        {/* Dropdowns */}
        <Dropdown label="Group" name="group" value={formData.group} options={groupOptions} onChange={handleChange} required />
        <Dropdown label="Standard" name="standard" value={formData.standard} options={standardOptions[formData.group] || []} onChange={handleChange} required />
        <Dropdown label="Board" name="board" value={formData.board} options={boardOptions} onChange={handleChange} required />
        <Dropdown label="Language" name="language" value={formData.language} options={languageOptions} onChange={handleChange} required />
        <Dropdown label="Subject" name="subject" value={formData.subject} options={subjectMap[formData.group] || []} onChange={handleChange} required />
        <Dropdown label="Lesson" name="lesson" value={formData.lesson} options={lessonOptions} onChange={handleChange} required />
        <Dropdown label="Category" name="category" value={formData.category} options={categoryOptions} onChange={handleChange} required />

        <input
          type="number"
          name="videoNumber"
          placeholder="Video Number"
          value={formData.videoNumber}
          onChange={handleChange}
          className="p-2 rounded bg-gray-700 border border-gray-600"
        />

        <input
          type="text"
          name="title"
          placeholder="Video Title"
          value={formData.title}
          onChange={handleChange}
          className="p-2 rounded bg-gray-700 border border-gray-600 col-span-2"
        />

        <textarea
          name="aboutCourse"
          placeholder="About this Video"
          value={formData.aboutCourse}
          onChange={handleChange}
          rows="3"
          className="p-2 rounded bg-gray-700 border border-gray-600 col-span-2"
        ></textarea>

        {/* File uploads */}
        <div>
          <label className="block mb-2 text-gray-300">Change Thumbnail</label>
          <input type="file" name="thumbnail" accept="image/*" onChange={handleFileChange} className="p-2 rounded bg-gray-700 w-full" />
          {thumbnailPreview && (
            <img src={thumbnailPreview} alt="Preview" className="mt-3 rounded-lg w-40 border border-gray-600" />
          )}
        </div>

        <div>
          <label className="block mb-2 text-gray-300">Change Video File</label>
          <input type="file" name="file" accept="video/*" onChange={handleFileChange} className="p-2 rounded bg-gray-700 w-full" />
          {filePreview && (
            <video controls className="mt-3 rounded-lg w-60 border border-gray-600">
              <source src={filePreview} type="video/mp4" />
            </video>
          )}
        </div>

        <button type="submit" disabled={loading} className="col-span-2 bg-green-600 hover:bg-green-700 p-3 rounded font-semibold transition-all">
          {loading ? "Updating..." : "Update Video"}
        </button>

        {message && (
          <p className="col-span-2 text-center mt-4 text-lg text-green-400 font-medium">{message}</p>
        )}
      </form>
    </div>
  );
}
