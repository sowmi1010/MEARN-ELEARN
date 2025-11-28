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
import { FaVideo } from "react-icons/fa";

export default function VideoForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    group: "",
    standard: "",
    groupCode: "", // ✅ VERY IMPORTANT for 11th / 12th
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

  /* =========================
      HANDLE CHANGE
  ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "group") {
      setFormData({
        ...formData,
        group: value,
        standard: "",
        groupCode: "",
        subject: "",
        lesson: "",
      });
    }

    else if (name === "standard") {
      setFormData({
        ...formData,
        standard: value,
        subject: "",
      });
    }

    else if (name === "groupCode") {
      setFormData({
        ...formData,
        groupCode: value,
        subject: "",
      });
    }

    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  /* =========================
      GET SUBJECTS (SMART WAY)
  ========================= */
  const getSubjects = () => {
    const { group, standard, groupCode } = formData;

    if (!group) return [];

    // ROOT / STEM / FLOWER / FRUIT / SEED
    if (group !== "LEAF") {
      return subjectMap[group] || [];
    }

    // LEAF = 9,10,11,12
    if (!standard) return [];

    // 9th / 10th
    if (standard === "9th" || standard === "10th") {
      return subjectMap.LEAF[standard] || [];
    }

    // 11th / 12th
    if (standard === "11th" || standard === "12th") {
      if (!groupCode) return [];

      const key = `${standard}-${groupCode.toUpperCase()}`;
      return subjectMap.LEAF[key] || [];
    }

    return [];
  };

  /* =========================
      FILE HANDLING
  ========================= */
  const handleFileChange = (e) => {
    if (e.target.name === "thumbnail") {
      const file = e.target.files[0];
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    } else {
      setFile(e.target.files[0]);
    }
  };

  /* =========================
      SUBMIT
  ========================= */
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

      setTimeout(() => navigate(-1), 1200);

    } catch (err) {
      console.error("Upload Error:", err.response?.data || err);
      setMessage("❌ Failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-[#0b1120] text-white min-h-screen">
      <h1 className="text-3xl font-bold text-blue-400 mb-8 flex items-center gap-2">
        <FaVideo /> {isEdit ? "Edit Video" : "Add Video"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-10 rounded-2xl max-w-6xl mx-auto space-y-8"
      >

        {/* ================= ROW 1 ================= */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">

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

          {/* ✅ GROUP CODE ONLY FOR 11 & 12 */}
          {(formData.standard === "11th" || formData.standard === "12th") && (
            <Dropdown
              label="Group Code"
              name="groupCode"
              value={formData.groupCode}
              options={["BIO MATHS", "COMPUTER", "COMMERCE"]}
              onChange={handleChange}
              required
            />
          )}

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

        {/* ================= ROW 2 ================= */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <Dropdown
            label="Subject"
            name="subject"
            value={formData.subject}
            options={getSubjects()}
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
