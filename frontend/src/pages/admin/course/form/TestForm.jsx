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
    groupCode: "", // ✅ NEW
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

  /* ✅ LOAD TEST IF EDIT */
  useEffect(() => {
    if (!id) return;

    const fetchTest = async () => {
      try {
        const res = await api.get(`/tests/${id}`);
        const test = res.data;

        setFormData({
          group: test.group || "",
          standard: test.standard || "",
          groupCode: test.groupCode || "",
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

          setPreview(imageUrl);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };

    fetchTest();
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
      });
    } else if (name === "standard") {
      setFormData({
        ...formData,
        standard: value,
        groupCode: "",
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

  /* =========================
       SMART SUBJECTS
  ========================= */
  const getSubjects = () => {
    const { group, standard, groupCode } = formData;

    if (!group) return [];

    // ROOT / STEM / FLOWER / FRUIT / SEED
    if (group !== "LEAF") {
      return subjectMap[group] || [];
    }

    if (!standard) return [];

    // 9th & 10th
    if (standard === "9th" || standard === "10th") {
      return subjectMap.LEAF[standard] || [];
    }

    // 11th & 12th (BIO / COMPUTER / COMMERCE)
    if ((standard === "11th" || standard === "12th") && groupCode) {
      const key = `${standard}-${groupCode.toUpperCase()}`;
      return subjectMap.LEAF[key] || [];
    }

    return [];
  };

  /* ✅ FILE CHANGE */
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

  /* ✅ SUBMIT */
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
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0a1025] to-[#111827] text-white px-6 py-10">
      {/* HEADER */}
      <div className="max-w-5xl mx-auto flex flex-col items-center mb-10">
        <div className="flex items-center gap-4">
          <FaFileAlt className="text-4xl text-orange-400 drop-shadow-lg" />

          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent tracking-wide">
            {isEdit ? "Edit Test Paper" : "Add New Test Paper"}
          </h1>
        </div>

        <p className="text-gray-400 mt-2 text-sm">
          Upload test papers with subject, category & thumbnail.
        </p>
      </div>

      {/* FORM CARD */}
      <form
        onSubmit={handleSubmit}
        className="
        max-w-5xl mx-auto
        bg-[#0f172a]/70
        backdrop-blur-xl
        rounded-3xl
        border border-white/10
        shadow-2xl shadow-orange-900/20
        p-10
        space-y-10
      "
      >
        {/* ========================== */}
        {/*        BASIC FIELDS        */}
        {/* ========================== */}
        <div className="grid md:grid-cols-5 gap-6">
          <Dropdown
            label="Group"
            name="group"
            value={formData.group}
            options={groupOptions}
            onChange={handleChange}
          />

          <Dropdown
            label="Standard"
            name="standard"
            value={formData.standard}
            options={standardOptions[formData.group] || []}
            onChange={handleChange}
          />

          {(formData.standard === "11th" || formData.standard === "12th") && (
            <Dropdown
              label="Group Code"
              name="groupCode"
              value={formData.groupCode}
              options={["BIO MATHS", "COMPUTER", "COMMERCE"]}
              onChange={handleChange}
            />
          )}

          <Dropdown
            label="Board"
            name="board"
            value={formData.board}
            options={boardOptions}
            onChange={handleChange}
          />

          <Dropdown
            label="Language"
            name="language"
            value={formData.language}
            options={languageOptions}
            onChange={handleChange}
          />
        </div>

        {/* ========================== */}
        {/*     SUBJECT & CATEGORY     */}
        {/* ========================== */}
        <div className="grid md:grid-cols-3 gap-6">
          <Dropdown
            label="Subject"
            name="subject"
            value={formData.subject}
            options={getSubjects()}
            onChange={handleChange}
          />

          <Dropdown
            label="Category"
            name="category"
            value={formData.category}
            options={categoryOptions}
            onChange={handleChange}
          />

          <input
            type="text"
            name="title"
            placeholder="Test Title"
            value={formData.title}
            onChange={handleChange}
            className="
            p-3 rounded-lg
            bg-[#111827]/70
            border border-white/10
            focus:border-orange-500
            focus:outline-none
            transition
          "
          />
        </div>

        {/* ========================== */}
        {/*           FILES            */}
        {/* ========================== */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Thumbnail Upload */}
          <div
            className="
            p-5 rounded-xl
            bg-[#111827]/70 
            border border-white/10
            hover:border-orange-500
            transition
          "
          >
            <p className="mb-2 flex items-center gap-2 text-gray-300">
              <FaUpload className="text-orange-400" /> Upload Thumbnail
            </p>

            <input type="file" name="thumbnail" onChange={handleFileChange} />

            {preview && (
              <img
                src={preview}
                className="mt-4 h-36 w-48 object-cover rounded-lg shadow-lg border border-orange-400/30"
              />
            )}
          </div>

          {/* Test File Upload */}
          <div
            className="
            p-5 rounded-xl
            bg-[#111827]/70 
            border border-white/10
            hover:border-orange-500
            transition
          "
          >
            <p className="mb-2 flex items-center gap-2 text-gray-300">
              <FaUpload className="text-orange-400" /> Upload Test File
            </p>

            <input type="file" name="file" onChange={handleFileChange} />
          </div>
        </div>

        {/* ========================== */}
        {/*           SUBMIT           */}
        {/* ========================== */}
        <button
          type="submit"
          disabled={loading}
          className="
          w-full py-4 rounded-xl
          flex items-center justify-center gap-3
          text-lg font-semibold
          bg-gradient-to-r from-orange-600 to-yellow-500
          hover:brightness-110 transition 
          shadow-lg shadow-orange-700/30
        "
        >
          <FaSave />
          {loading ? "Saving..." : isEdit ? "Update Test" : "Add Test"}
        </button>

        {message && (
          <p className="text-center text-green-400 mt-2">{message}</p>
        )}
      </form>
    </div>
  );
}
