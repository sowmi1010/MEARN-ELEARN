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

import { FaVideo, FaUpload, FaSave } from "react-icons/fa";

export default function VideoForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    group: "",
    standard: "",
    groupCode: "",
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

  /* ----------------- FETCH VIDEO IF EDIT ----------------- */
  useEffect(() => {
    if (!id) return;

    async function fetchVideo() {
      try {
        const res = await api.get(`/videos/${id}`);
        setFormData(res.data);

        if (res.data.thumbnail) {
          setThumbnailPreview(
            `http://localhost:4000/${res.data.thumbnail.replace(/\\/g, "/")}`
          );
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchVideo();
  }, [id]);

  /* ----------------- SMART INPUT HANDLER ----------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Reset dependent fields when main fields change
    if (name === "group") {
      setFormData({
        ...formData,
        group: value,
        standard: "",
        groupCode: "",
        subject: "",
        lesson: "",
      });
    } else if (name === "standard") {
      setFormData({
        ...formData,
        standard: value,
        subject: "",
      });
    } else if (name === "groupCode") {
      setFormData({
        ...formData,
        groupCode: value,
        subject: "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  /* ----------------- SUBJECT LOADER (SMART) ----------------- */
  const getSubjects = () => {
    const { group, standard, groupCode } = formData;
    if (!group) return [];

    if (group !== "LEAF") return subjectMap[group] || [];

    if (!standard) return [];
    if (standard === "9th" || standard === "10th")
      return subjectMap.LEAF[standard] || [];

    if ((standard === "11th" || standard === "12th") && groupCode) {
      const key = `${standard}-${groupCode.toUpperCase()}`;
      return subjectMap.LEAF[key] || [];
    }

    return [];
  };

  /* ----------------- HANDLE FILES ----------------- */
  const handleFileChange = (e) => {
    if (e.target.name === "thumbnail") {
      const file = e.target.files[0];
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    } else {
      setFile(e.target.files[0]);
    }
  };

  /* ----------------- SUBMIT ----------------- */
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
        await api.put(`/videos/${id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("✅ Video updated successfully!");
      } else {
        await api.post(`/videos/upload`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("✅ Video uploaded successfully!");
      }

      setTimeout(() => navigate("/admin/courses"), 1200);
    } catch (err) {
      console.error("Upload Error:", err);
      setMessage("❌ Failed to save video");
    } finally {
      setLoading(false);
    }
  };

  /* ----------------- UI ----------------- */
  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-[#020617] via-[#0a1124] to-[#1e293b] text-white">

      {/* HEADER */}
      <div className="flex justify-center mb-10">
        <h1 className="flex items-center gap-3 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-sky-400 drop-shadow-xl">
          <FaVideo className="text-blue-400 drop-shadow" />
          {isEdit ? "Edit Video" : "Upload New Video"}
        </h1>
      </div>

      {/* CARD */}
      <form
        onSubmit={handleSubmit}
        className="
          max-w-6xl mx-auto 
          bg-[#0f172a]/70 
          backdrop-blur-xl 
          shadow-2xl shadow-blue-900/20 
          border border-white/10 
          rounded-3xl 
          p-10 
          space-y-10
        "
      >
        {/* ROW 1 */}
        <div className="grid md:grid-cols-5 gap-6">
          <Dropdown label="Group" name="group" value={formData.group} options={groupOptions} onChange={handleChange}/>
          <Dropdown label="Standard" name="standard" value={formData.standard} options={standardOptions[formData.group] || []} onChange={handleChange}/>

          {(formData.standard === "11th" || formData.standard === "12th") && (
            <Dropdown
              label="Group Code"
              name="groupCode"
              value={formData.groupCode}
              options={["BIO MATHS", "COMPUTER", "COMMERCE"]}
              onChange={handleChange}
            />
          )}

          <Dropdown label="Board" name="board" value={formData.board} options={boardOptions} onChange={handleChange}/>
          <Dropdown label="Language" name="language" value={formData.language} options={languageOptions} onChange={handleChange}/>
        </div>

        {/* ROW 2 */}
        <div className="grid md:grid-cols-4 gap-6">
          <Dropdown label="Subject" name="subject" value={formData.subject} options={getSubjects()} onChange={handleChange}/>
          <Dropdown label="Lesson" name="lesson" value={formData.lesson} options={lessonOptions} onChange={handleChange}/>
          <Dropdown label="Category" name="category" value={formData.category} options={categoryOptions} onChange={handleChange}/>

          <input
            name="videoNumber"
            placeholder="Video Number"
            type="number"
            value={formData.videoNumber}
            onChange={handleChange}
            className="p-3 bg-[#111827]/60 border border-white/10 rounded-lg"
          />
        </div>

        {/* TITLE + ABOUT */}
        <input
          name="title"
          placeholder="Video Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-3 bg-[#111827]/60 border border-white/10 rounded-lg"
        />

        <textarea
          name="aboutCourse"
          placeholder="About the Video..."
          value={formData.aboutCourse}
          onChange={handleChange}
          rows="3"
          className="w-full p-3 bg-[#111827]/60 border border-white/10 rounded-lg"
        />

        {/* FILE UPLOAD */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Thumbnail */}
          <div className="p-5 bg-[#111827]/60 border border-white/10 rounded-xl">
            <p className="mb-2 flex items-center gap-2 text-gray-300">
              <FaUpload className="text-blue-400" /> Thumbnail
            </p>
            <input type="file" name="thumbnail" onChange={handleFileChange} />
            {thumbnailPreview && (
              <img src={thumbnailPreview} className="mt-4 w-40 h-28 object-cover rounded-lg shadow border border-blue-400/30" />
            )}
          </div>

          {/* Video File */}
          <div className="p-5 bg-[#111827]/60 border border-white/10 rounded-xl">
            <p className="mb-2 flex items-center gap-2 text-gray-300">
              <FaUpload className="text-blue-400" /> Video File
            </p>
            <input type="file" name="file" onChange={handleFileChange} />
          </div>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full text-lg font-bold py-4 rounded-xl
            bg-gradient-to-r from-blue-600 to-cyan-500
            shadow-lg shadow-blue-700/40
            hover:brightness-110 transition
            flex items-center justify-center gap-2
          "
        >
          <FaSave />
          {loading ? "Saving..." : isEdit ? "Update Video" : "Upload Video"}
        </button>

        {message && <p className="text-center text-green-400">{message}</p>}
      </form>
    </div>
  );
}
