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
    groupCode: "",     // ✅ NEW
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
    }

    else if (name === "standard") {
      setFormData({
        ...formData,
        standard: value,
        groupCode: "",
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
    if (
      (standard === "11th" || standard === "12th") &&
      groupCode
    ) {
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
    <div className="p-10 bg-[#0b1120] text-white min-h-screen">

      <h1 className="text-3xl font-bold text-center mb-10 text-orange-400 flex items-center justify-center gap-2">
        <FaFileAlt />
        {isEdit ? "Edit Test Paper" : "Add New Test Paper"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900/90 max-w-6xl mx-auto rounded-2xl p-10 space-y-6 border border-gray-800"
      >

        {/* ROW 1 */}
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

          {(formData.standard === "11th" ||
            formData.standard === "12th") && (
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

        {/* ROW 2 */}
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
            className="p-3 rounded-lg bg-gray-800 border border-gray-700"
          />
        </div>

        {/* FILES */}
        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-gray-800 p-5 rounded-xl">
            <p className="mb-2 flex items-center gap-2">
              <FaUpload /> Thumbnail
            </p>
            <input type="file" name="thumbnail" onChange={handleFileChange} />

            {preview && (
              <img
                src={preview}
                className="mt-4 w-40 h-28 object-cover rounded-lg"
              />
            )}
          </div>

          <div className="bg-gray-800 p-5 rounded-xl">
            <p className="mb-2 flex items-center gap-2">
              <FaUpload /> Test File
            </p>
            <input type="file" name="file" onChange={handleFileChange} />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 py-3 rounded-lg font-bold flex items-center justify-center gap-2"
        >
          {loading ? "Saving..." : isEdit ? "Update Test" : "Add Test"}
        </button>

        {message && (
          <p className="text-center mt-4 text-green-400">{message}</p>
        )}
      </form>
    </div>
  );
}
